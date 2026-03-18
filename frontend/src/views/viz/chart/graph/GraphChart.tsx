/**
 * Graph/Network Implementation
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
import { GraphOption } from './types';
import config from './config';

class GraphChart extends Chart {
  config = config;
  chart: any = null;
  selectionManager?: ChartSelectionManager;

  constructor() {
    super(
      'graph-chart',
      'viz.palette.graph.names.graphChart',
      'graph-icon'
    );
    this.meta.requirements = [
      {
        group: [2, 999],
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
  ): GraphOption {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];
    
    const sourceConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(0, 1);
    
    const targetConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(1, 2);
    
    const linkValueConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(2, 3);
    
    const nodeSizeConfigs = dataConfigs
      .filter(c => c.type === ChartDataSectionType.Aggregate)
      .flatMap(config => config.rows || [])
      .slice(3, 4);

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs
    );

    // Extract nodes and links
    const { nodes, links } = this.extractNodesAndLinks(
      chartDataSet,
      sourceConfigs,
      targetConfigs,
      linkValueConfigs,
      nodeSizeConfigs
    );

    // Get style configurations
    const [layoutType, gravity] = getStyles(
      styleConfigs,
      ['layout'],
      ['layoutType', 'gravity']
    );
    
    const [nodeSize, nodeLabelShow, symbol] = getStyles(
      styleConfigs,
      ['node'],
      ['nodeSize', 'nodeLabelShow', 'symbol']
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
    
    const [lineOpacity, lineWidth, curveness] = getStyles(
      styleConfigs,
      ['lineStyle'],
      ['opacity', 'width', 'curveness']
    );

    return {
      series: [
        {
          type: 'graph',
          layout: layoutType === 'circular' ? 'circular' : 'force',
          symbol: symbol || 'circle',
          symbolSize: (val) => {
            // Allow node size to be determined by data if available
            const node = nodes.find(n => n.name === val);
            return node?.value ? node.value : (nodeSize || 30);
          },
          circular: {
            rotateLabel: true
          },
          force: {
            repulsion: 1000,
            gravity: gravity,
            edgeLength: 100,
            layoutAnimation: true
          },
          roam: true,
          draggable: true,
          focusNodeAdjacency: true,
          data: nodes,
          links: links,
          lineStyle: {
            color: 'source',
            opacity: lineOpacity,
            width: lineWidth,
            curveness: curveness
          },
          label: {
            show: showLabel && nodeLabelShow,
            position: 'right',
            fontSize: parseInt(fontSize) || 12,
            color: fontColor
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              width: lineWidth ? lineWidth + 2 : 3
            }
          }
        }
      ]
    };
  }

  private extractNodesAndLinks(
    chartDataSet: IChartDataSet<string>,
    sourceConfigs: ChartDataSectionField[],
    targetConfigs: ChartDataSectionField[],
    linkValueConfigs: ChartDataSectionField[],
    nodeSizeConfigs: ChartDataSectionField[]
  ): { nodes: any[]; links: any[] } {
    const nodesMap = new Map<string, { name: string; value?: number }>();
    const links: any[] = [];

    chartDataSet.forEach(row => {
      const source = String(row.getCell(sourceConfigs[0]));
      const target = String(row.getCell(targetConfigs[0]));
      
      // Add source node if not exists
      if (!nodesMap.has(source)) {
        const sizeValue = nodeSizeConfigs[0] ? Number(row.getCell(nodeSizeConfigs[0])) : undefined;
        nodesMap.set(source, { name: source, value: sizeValue });
      }
      
      // Add target node if not exists
      if (!nodesMap.has(target)) {
        const sizeValue = nodeSizeConfigs[0] ? Number(row.getCell(nodeSizeConfigs[0])) : undefined;
        nodesMap.set(target, { name: target, value: sizeValue });
      }
      
      // Create link
      const linkValue = linkValueConfigs[0] ? Number(row.getCell(linkValueConfigs[0])) : undefined;
      links.push({
        source: source,
        target: target,
        value: linkValue
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links: links
    };
  }
}

export default GraphChart;