/**
 * Heatmap Configuration
 */
import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'viz.board.data.name.xAxis',
      key: 'xAxis',
      required: true,
      type: 'group',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.yAxis',
      key: 'yAxis',
      required: true,
      type: 'group',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.filter',
      key: 'filter',
      type: 'filter',
    },
  ],
  styles: [
    {
      label: 'viz.palette.graph.heatmap.cell',
      key: 'cell',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.heatmap.cellSize',
          key: 'cellSize',
          default: 'auto',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.graph.heatmap.auto', value: 'auto' },
              { label: 'viz.palette.graph.heatmap.fixed', value: 'fixed' },
            ],
          },
        },
        {
          label: 'viz.palette.graph.heatmap.cornerRadius',
          key: 'cornerRadius',
          default: 4,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 20,
          },
        },
      ],
    },
    {
      label: 'viz.palette.graph.heatmap.color',
      key: 'color',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.heatmap.colorScheme',
          key: 'colorScheme',
          default: 'blue',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.graph.heatmap.blue', value: 'blue' },
              { label: 'viz.palette.graph.heatmap.red', value: 'red' },
              { label: 'viz.palette.graph.heatmap.green', value: 'green' },
              { label: 'viz.palette.graph.heatmap.purple', value: 'purple' },
            ],
          },
        },
        {
          label: 'viz.palette.graph.heatmap.opacity',
          key: 'opacity',
          default: 0.8,
          comType: 'slider',
          options: {
            min: 0,
            max: 1,
            step: 0.1,
          },
        },
      ],
    },
    {
      label: 'viz.palette.style.label',
      key: 'label',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.style.showLabel',
          key: 'showLabel',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#495057',
          },
        },
      ],
    },
  ],
  settings: [
    {
      label: 'viz.palette.setting.paging.title',
      key: 'paging',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.setting.paging.pageSize',
          key: 'pageSize',
          default: 1000,
          comType: 'inputNumber',
          options: {
            needRefresh: true,
            step: 1,
            min: 0,
          },
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        'viz.palette.graph.heatmap.cell': '单元格设置',
        'viz.palette.graph.heatmap.cellSize': '单元格大小',
        'viz.palette.graph.heatmap.cornerRadius': '圆角',
        'viz.palette.graph.heatmap.color': '颜色设置',
        'viz.palette.graph.heatmap.colorScheme': '配色方案',
        'viz.palette.graph.heatmap.opacity': '透明度',
        'viz.palette.graph.heatmap.auto': '自动',
        'viz.palette.graph.heatmap.fixed': '固定',
        'viz.palette.graph.heatmap.blue': '蓝色',
        'viz.palette.graph.heatmap.red': '红色',
        'viz.palette.graph.heatmap.green': '绿色',
        'viz.palette.graph.heatmap.purple': '紫色',
      },
    },
    {
      lang: 'en-US',
      translation: {
        'viz.palette.graph.heatmap.cell': 'Cell Settings',
        'viz.palette.graph.heatmap.cellSize': 'Cell Size',
        'viz.palette.graph.heatmap.cornerRadius': 'Corner Radius',
        'viz.palette.graph.heatmap.color': 'Color Settings',
        'viz.palette.graph.heatmap.colorScheme': 'Color Scheme',
        'viz.palette.graph.heatmap.opacity': 'Opacity',
        'viz.palette.graph.heatmap.auto': 'Auto',
        'viz.palette.graph.heatmap.fixed': 'Fixed',
        'viz.palette.graph.heatmap.blue': 'Blue',
        'viz.palette.graph.heatmap.red': 'Red',
        'viz.palette.graph.heatmap.green': 'Green',
        'viz.palette.graph.heatmap.purple': 'Purple',
      },
    },
  ],
};

export default config;