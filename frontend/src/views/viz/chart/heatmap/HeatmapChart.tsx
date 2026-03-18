/**
 * Heatmap Implementation
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
import { HeatmapOption } from './types';
import config from './config';

class HeatmapChart extends Chart {
  config = config;
  chart: any = null;
  selectionManager?: ChartSelectionManager;

  constructor() {
    super(
      'heatmap-chart',
      'viz.palette.graph.names.heatmapChart',
      'heatmap-icon'
    );
    this.meta.requirements = [
      {
        xAxis: 1,
        yAxis: 1,
        metrics: 1,
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
  ): HeatmapOption {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    
    const xAxisConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(0, 1);
    
    const yAxisConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Group)
      .flatMap(config => config.rows || [])
      .slice(0, 1);
    
    const metricConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(0, 1);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs
    );

    // Extract unique x and y values to create axis
    const xAxisValues = [...new Set(chartDataSet.map(row => String(row.getCell(xAxisConfigs[0]))))];
    const yAxisValues = [...new Set(chartDataSet.map(row => String(row.getCell(yAxisConfigs[0]))))];

    // Create heatmap data in the format [xIndex, yIndex, value]
    const heatmapData = chartDataSet.map(row => {
      const xVal = String(row.getCell(xAxisConfigs[0]));
      const yVal = String(row.getCell(yAxisConfigs[0]));
      const value = Number(row.getCell(metricConfigs[0]));

      const xIndex = xAxisValues.indexOf(xVal);
      const yIndex = yAxisValues.indexOf(yVal);

      return [xIndex, yIndex, value];
    });

    // Get style configurations
    const [cornerRadius] = getStyles(
      styleConfigs,
      ['cell'],
      ['cornerRadius']
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
    
    const [colorScheme, opacity] = getStyles(
      styleConfigs,
      ['color'],
      ['colorScheme', 'opacity']
    );

    // Define color palette based on scheme
    let colorPalette = ['#E6F7FF', '#1890FF']; // Default blue
    switch (colorScheme) {
      case 'red':
        colorPalette = ['#FFF1F0', '#FF4D4F'];
        break;
      case 'green':
        colorPalette = ['#F6FFED', '#52C41A'];
        break;
      case 'purple':
        colorPalette = ['#F9F0FF', '#722ED1'];
        break;
    }

    return {
      visualMap: {
        min: Math.min(...heatmapData.map(d => d[2])),
        max: Math.max(...heatmapData.map(d => d[2])),
        calculable: true,
        orient: 'vertical',
        left: 'right',
        top: 'center'
      },
      series: [
        {
          type: 'heatmap',
          coordinateSystem: 'cartesian2d',
          data: heatmapData,
          label: {
            show: showLabel,
            position: 'inside',
            fontSize: parseInt(fontSize) || 12,
            color: fontColor
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            borderType: 'solid',
            borderRadius: cornerRadius
          }
        }
      ],
      xAxis: {
        type: 'category',
        data: xAxisValues
      },
      yAxis: {
        type: 'category',
        data: yAxisValues
      }
    };
  }
}

export default HeatmapChart;