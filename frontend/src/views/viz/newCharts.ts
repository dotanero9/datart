/**
 * 新增图表类型入口
 * 将新开发的图表类型导出，便于在ChartManager中引用
 */

export { default as SankeyChart } from './chart/sankey';
export { default as HeatmapChart } from './chart/heatmap';
export { default as GraphChart } from './chart/graph';
export { default as FunnelChart } from './chart/funnel';
export { default as GanttChart } from './chart/gantt';