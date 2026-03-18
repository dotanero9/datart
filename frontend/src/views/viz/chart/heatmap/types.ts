/**
 * Heatmap Types
 */
import { EChartsCoreOption, SeriesOption } from 'echarts';

export interface HeatmapSeries extends Omit<SeriesOption, 'type'> {
  type: 'heatmap';
  coordinateSystem?: 'cartesian2d' | 'geo' | 'calendar';
  data?: number[][];
  label?: {
    show?: boolean;
    position?: string;
    fontSize?: number;
    color?: string;
  };
  itemStyle?: {
    borderColor?: string;
    borderWidth?: number;
    borderType?: string;
    borderRadius?: number | number[];
  };
}

export interface HeatmapOption extends EChartsCoreOption {
  visualMap?: {
    min?: number;
    max?: number;
    calculable?: boolean;
    orient?: string;
    left?: string | number;
    top?: string | number;
  };
  series: HeatmapSeries[];
}