/**
 * Sankey Diagram Types
 */
import { EChartsCoreOption, SeriesOption } from 'echarts';

export interface SankeySeries extends Omit<SeriesOption, 'type'> {
  type: 'sankey';
  data?: Array<{
    name: string;
    value?: number;
    itemStyle?: {
      color?: string;
    };
  }>;
  links?: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  emphasis?: {
    focus?: 'none' | 'self' | 'adjacency';
  };
  lineStyle?: {
    color?: string;
    opacity?: number;
    curveness?: number;
  };
  label?: {
    show?: boolean;
    position?: string;
    fontSize?: number;
    color?: string;
  };
  nodeAlign?: 'left' | 'right' | 'center';
  nodeWidth?: number;
  nodeGap?: number;
  draggable?: boolean;
}

export interface SankeyOption extends EChartsCoreOption {
  series: SankeySeries[];
}