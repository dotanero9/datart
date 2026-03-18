/**
 * Sankey Diagram Implementation
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
import { SankeyOption } from './types';
import config from './config';

class SankeyChart extends Chart {
  config = config;
  chart: any = null;
  selectionManager?: ChartSelectionManager;

  constructor() {
    super(
      'sankey-chart',
      'viz.palette.graph.names.sankeyChart',
      'sankey-icon'
    );
    this.meta.requirements = [
      {
        source: 1,
        target: 1,
        linkValue: 1,
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
  ): SankeyOption {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    
    const sourceConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(0, 1); // First field as source
    
    const targetConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(1, 2); // Second field as target
    
    const linkValueConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(2, 3); // Third field as link value

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs
    );

    // Extract node and link data
    const nodes = this.extractNodes(chartDataSet, sourceConfigs, targetConfigs);
    const links = this.extractLinks(chartDataSet, sourceConfigs, targetConfigs, linkValueConfigs);

    // Get style configurations
    const [nodeWidth, nodeGap, draggable] = getStyles(
      styleConfigs,
      ['node'],
      ['nodeWidth', 'nodeGap', 'draggable']
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
    
    const [lineOpacity, curveness] = getStyles(
      styleConfigs,
      ['lineStyle'],
      ['opacity', 'curveness']
    );

    return {
      series: [
        {
          type: 'sankey',
          emphasis: {
            focus: 'adjacency'
          },
          data: nodes,
          links: links,
          lineStyle: {
            color: 'source',
            opacity: lineOpacity,
            curveness: curveness
          },
          label: {
            show: showLabel,
            position: 'right',
            fontSize: parseInt(fontSize) || 12,
            color: fontColor
          },
          nodeAlign: 'left',
          nodeWidth: nodeWidth,
          nodeGap: nodeGap,
          draggable: draggable,
        }
      ]
    };
  }

  private extractNodes(
    chartDataSet: IChartDataSet<string>,
    sourceConfigs: ChartDataSectionField[],
    targetConfigs: ChartDataSectionField[]
  ): Array<{ name: string }> {
    const nodesSet = new Set<string>();
    
    // Collect all source and target nodes
    chartDataSet.forEach(row => {
      const source = row.getCell(sourceConfigs[0]);
      const target = row.getCell(targetConfigs[0]);
      
      if (source) nodesSet.add(String(source));
      if (target) nodesSet.add(String(target));
    });
    
    return Array.from(nodesSet).map(name => ({ name }));
  }

  private extractLinks(
    chartDataSet: IChartDataSet<string>,
    sourceConfigs: ChartDataSectionField[],
    targetConfigs: ChartDataSectionField[],
    linkValueConfigs: ChartDataSectionField[]
  ): Array<{ source: string; target: string; value: number }> {
    return chartDataSet.map(row => ({
      source: String(row.getCell(sourceConfigs[0])),
      target: String(row.getCell(targetConfigs[0])),
      value: Number(row.getCell(linkValueConfigs[0]))
    })).filter(link => 
      // Filter out invalid links
      link.source && link.target && !isNaN(link.value)
    );
  }
}

export default SankeyChart;