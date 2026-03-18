/**
 * Gantt Chart Implementation
 */
import { ChartDataSectionType } from 'app/constants';
import Chart from 'app/models/Chart';
import { ChartSelectionManager } from 'app/models/ChartSelectionManager';
import {
  ChartConfig,
  ChartDataSectionField,
  ChartStyleConfig,
  SelectedItem,
} from 'app/types/ChartConfig';
import ChartDataSetDTO, { IChartDataSet } from 'app/types/ChartDataSet';
import { BrokerContext, BrokerOption } from 'app/types/ChartLifecycleBroker';
import {
  getExtraSeriesRowData,
  getSelectedItemStyles,
  getStyles,
  transformToDataSet,
} from 'app/utils/chartHelper';
import { init } from 'echarts';
import { GanttOption } from './types';
import config from './config';

class GanttChart extends Chart {
  config = config;
  chart: any = null;
  selectionManager?: ChartSelectionManager;

  constructor() {
    super(
      'gantt-chart',
      'viz.palette.graph.names.ganttChart',
      'gantt-icon'
    );
    this.meta.requirements = [
      {
        task: 1,
        startDate: 1,
        endDate: 1,
      },
    ];
  }

  onMount(options: BrokerOption, context: BrokerContext) {
    if (
      options.containerId === undefined ||
      !context.document ||
      !context.window
    ) {
      return;
    }

    this.chart = init(
      context.document.getElementById(options.containerId)!,
      'default'
    );
    this.selectionManager = new ChartSelectionManager(this.mouseEvents);
    this.selectionManager.attachWindowListeners(context.window);
    this.selectionManager.attachZRenderListeners(this.chart);
    this.selectionManager.attachEChartsListeners(this.chart);
  }

  onUpdated(options: BrokerOption, context: BrokerContext) {
    if (!options.dataset || !options.dataset.columns || !options.config) {
      return;
    }

    this.chart?.clear();
    if (!this.isMatchRequirement(options.config)) {
      return;
    }
    this.selectionManager?.updateSelectedItems(options?.selectedItems);
    const newOptions = this.getOptions(
      options.dataset,
      options.config,
      options.selectedItems
    );
    this.chart?.setOption(Object.assign({}, newOptions), true);
  }

  onUnMount(options: BrokerOption, context: BrokerContext) {
    this.selectionManager?.removeWindowListeners(context.window);
    this.selectionManager?.removeZRenderListeners(this.chart);
    this.chart?.dispose();
  }

  onResize(options: BrokerOption, context: BrokerContext): void {
    this.chart?.resize({ width: context?.width, height: context?.height });
  }

  private getOptions(
    dataset: ChartDataSetDTO,
    config: ChartConfig,
    selectedItems?: SelectedItem[]
  ): GanttOption {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    
    const taskConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(0, 1);
    
    const startDateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(1, 2);
    
    const endDateConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(2, 3);
    
    const progressConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(0, 1);
    
    const resourceConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(0, 1);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs
    );

    // Get style configurations
    const [barHeight, barGap, showProgress] = getStyles(
      styleConfigs,
      ['bar'],
      ['barHeight', 'barGap', 'showProgress']
    );
    
    const [axisType, formatter] = getStyles(
      styleConfigs,
      ['timeAxis'],
      ['axisType', 'formatter']
    );
    
    const [showLabel] = getStyles(
      styleConfigs,
      ['label'],
      ['showLabel']
    );
    
    const [fontFamily, fontSize, fontWeight, fontColor] = getStyles(
      styleConfigs,
      ['label', 'font'],
      ['fontFamily', 'fontSize', 'fontWeight', 'color']
    );

    // Extract gantt data
    const tasks = this.extractTasks(
      chartDataSet,
      taskConfigs,
      startDateConfigs,
      endDateConfigs,
      progressConfigs,
      resourceConfigs
    );

    // Create y-axis data (tasks)
    const yAxisData = tasks.map(task => task.taskName);

    // Create series data for gantt bars
    const seriesData = tasks.map((task, index) => {
      return [
        task.startDate,
        task.endDate,
        task.taskName,
        task.progress,
        index // for positioning
      ];
    });

    return {
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: formatter || 'MM-dd'
        }
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLabel: {
          interval: 0,
          rotate: 0
        }
      },
      series: [{
        type: 'custom',
        renderItem: (params, api) => {
          // Calculate position and size for each bar
          const categoryIndex = api.value(4); // task index
          const startDate = api.value(0); // start time
          const endDate = api.value(1); // end time
          
          // Convert dates to screen coordinates
          const xStart = api.coord([startDate, categoryIndex])[0];
          const xEnd = api.coord([endDate, categoryIndex])[0];
          const y = api.coord([startDate, categoryIndex])[1];
          
          const width = xEnd - xStart;
          const height = barHeight || 20;
          
          // Calculate progress bar width if available
          const progress = api.value(3); // progress value
          const progressWidth = progress !== undefined && showProgress 
            ? width * (progress / 100) 
            : 0;
          
          const rectShape = api.graphic.util.clipPointsByRect([
            [xStart, y - height / 2],
            [xStart + width, y + height / 2]
          ], {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height
          });
          
          if (rectShape.length < 2) {
            return; // Outside the view
          }
          
          const ganttBar = {
            type: 'group',
            children: [
              // Background bar
              {
                type: 'rect',
                shape: {
                  x: xStart,
                  y: y - height / 2,
                  width: width,
                  height: height
                },
                style: {
                  fill: '#e0e0e0',
                  stroke: '#ccc',
                  lineWidth: 1
                }
              },
              // Progress bar
              ...(showProgress && progress !== undefined ? [{
                type: 'rect',
                shape: {
                  x: xStart,
                  y: y - height / 2,
                  width: progressWidth,
                  height: height
                },
                style: {
                  fill: '#66b3ff',
                  stroke: '#4a90e2',
                  lineWidth: 1
                }
              }] : []),
              // Task label
              ...(showLabel ? [{
                type: 'text',
                style: {
                  text: api.value(2), // task name
                  x: xStart + 5,
                  y: y,
                  fill: fontColor || '#000',
                  fontSize: parseInt(fontSize) || 12,
                  fontWeight: fontWeight || 'normal',
                  fontFamily: fontFamily || 'Arial',
                  verticalAlign: 'middle',
                  textAlign: 'left'
                }
              }] : [])
            ]
          };
          
          return ganttBar;
        },
        encode: {
          x: [0, 1], // startDate and endDate
          y: 4,      // category index
          tooltip: [2, 0, 1] // task name, start date, end date
        },
        data: seriesData
      }]
    };
  }

  private extractTasks(
    chartDataSet: IChartDataSet<string>,
    taskConfigs: ChartDataSectionField[],
    startDateConfigs: ChartDataSectionField[],
    endDateConfigs: ChartDataSectionField[],
    progressConfigs: ChartDataSectionField[],
    resourceConfigs: ChartDataSectionField[]
  ): Array<{
    taskName: string;
    startDate: number;
    endDate: number;
    progress?: number;
    resource?: string;
  }> {
    return chartDataSet.map(row => {
      const taskName = String(row.getCell(taskConfigs[0]));
      const startDateStr = String(row.getCell(startDateConfigs[0]));
      const endDateStr = String(row.getCell(endDateConfigs[0]));
      const progress = progressConfigs[0] ? Number(row.getCell(progressConfigs[0])) : undefined;
      const resource = resourceConfigs[0] ? String(row.getCell(resourceConfigs[0])) : undefined;

      // Convert dates to timestamps
      const startDate = new Date(startDateStr).getTime();
      const endDate = new Date(endDateStr).getTime();

      return {
        taskName,
        startDate,
        endDate,
        progress,
        resource
      };
    }).filter(task => 
      // Filter out invalid tasks
      !isNaN(task.startDate) && !isNaN(task.endDate) && task.startDate <= task.endDate
    );
  }
}

export default GanttChart;