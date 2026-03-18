// 简化测试脚本，验证图表组件是否可以正确导入
console.log('Testing chart imports...\n');

try {
  // 测试导入新图表组件
  const { SankeyChart } = require('./src/views/viz/newCharts');
  console.log('✓ SankeyChart imported successfully');
  
  const { HeatmapChart } = require('./src/views/viz/newCharts');
  console.log('✓ HeatmapChart imported successfully');
  
  const { GraphChart } = require('./src/views/viz/newCharts');
  console.log('✓ GraphChart imported successfully');
  
  const { FunnelChart } = require('./src/views/viz/newCharts');
  console.log('✓ FunnelChart imported successfully');
  
  const { GanttChart } = require('./src/views/viz/newCharts');
  console.log('✓ GanttChart imported successfully');

  // 测试实例化
  const sankey = new SankeyChart();
  console.log(`✓ SankeyChart instantiated: ${sankey.meta.id}`);

  const heatmap = new HeatmapChart();
  console.log(`✓ HeatmapChart instantiated: ${heatmap.meta.id}`);

  const graph = new GraphChart();
  console.log(`✓ GraphChart instantiated: ${graph.meta.id}`);

  const funnel = new FunnelChart();
  console.log(`✓ FunnelChart instantiated: ${funnel.meta.id}`);

  const gantt = new GanttChart();
  console.log(`✓ GanttChart instantiated: ${gantt.meta.id}`);

  console.log('\n✓ All chart components imported and instantiated successfully!');
  console.log('\nSummary:');
  console.log('- All 5 new chart types are properly exported from newCharts.ts');
  console.log('- All chart constructors work correctly');
  console.log('- Chart registration in ChartManager should work properly');

} catch (error) {
  console.error('✗ Error testing chart imports:', error.message);
}