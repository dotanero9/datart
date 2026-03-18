/**
 * Gantt Chart Types
 */
import { EChartsCoreOption, SeriesOption } from 'echarts';

export interface GanttSeries extends SeriesOption {
  type: 'custom';
  renderItem?: (params: any, api: any) => any;
  encode?: {
    x?: number | string | (number | string)[];
    y?: number | string | (number | string)[];
    tooltip?: number | string | (number | string)[];
    label?: number | string | (number | string)[];
  };
  data?: any[];
}

export interface GanttOption extends EChartsCoreOption {
  xAxis: {
    type: 'time' | 'category';
    axisLabel?: {
      formatter?: string | ((value: any) => string);
    };
  };
  yAxis: {
    type: 'category';
    data: string[];
    axisLabel?: {
      interval?: number;
      rotate?: number;
    };
  };
  series: GanttSeries[];
}