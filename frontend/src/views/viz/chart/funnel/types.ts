/**
 * Funnel Types
 */
import { EChartsCoreOption, SeriesOption } from 'echarts';

export interface FunnelSeries extends Omit<SeriesOption, 'type' | 'data'> {
  type: 'funnel';
  data: Array<{
    value: number;
    name: string;
    itemStyle?: {
      color?: string;
    };
  }>;
  sort?: 'ascending' | 'descending' | 'none';
  gap?: number;
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;
  label?: {
    show?: boolean;
    position?: 'inner' | 'outer' | 'left' | 'right';
    formatter?: (params: any) => string;
  };
}

export interface FunnelOption extends EChartsCoreOption {
  series: FunnelSeries[];
}