/**
 * Graph/Network Types
 */
import { EChartsCoreOption, SeriesOption } from 'echarts';

export interface GraphSeries extends SeriesOption {
  type: 'graph';
  layout?: 'none' | 'force' | 'circular';
  symbol?: string;
  symbolSize?: number | [number, number] | ((val: any) => number);
  edgeSymbol?: [string, string];
  edgeSymbolSize?: number | [number, number];
  circular?: {
    rotateLabel?: boolean;
  };
  force?: {
    repulsion?: number;
    gravity?: number;
    edgeLength?: number;
    layoutAnimation?: boolean;
  };
  roam?: boolean | 'scale' | 'move';
  draggable?: boolean;
  focusNodeAdjacency?: boolean;
  data: Array<{
    name: string;
    symbol?: string;
    symbolSize?: number;
    value?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  lineStyle?: {
    color?: string;
    opacity?: number;
    width?: number;
    curveness?: number;
  };
  label?: {
    show?: boolean;
    position?: string;
    fontSize?: number;
    color?: string;
  };
}

export interface GraphOption extends EChartsCoreOption {
  series: GraphSeries[];
}