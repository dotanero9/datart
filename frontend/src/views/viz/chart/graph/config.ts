/**
 * Graph/Network Configuration
 */
import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'viz.board.data.name.source',
      key: 'source',
      required: true,
      type: 'aggregate',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.target',
      key: 'target',
      required: true,
      type: 'aggregate',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.linkValue',
      key: 'linkValue',
      type: 'aggregate',
      limit: [0, 1],
    },
    {
      label: 'viz.board.data.name.nodeSize',
      key: 'nodeSize',
      type: 'aggregate',
      limit: [0, 1],
    },
    {
      label: 'viz.board.data.name.filter',
      key: 'filter',
      type: 'filter',
    },
  ],
  styles: [
    {
      label: 'viz.palette.graph.graph.layout',
      key: 'layout',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.graph.layoutType',
          key: 'layoutType',
          default: 'force',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.graph.graph.force', value: 'force' },
              { label: 'viz.palette.graph.graph.circular', value: 'circular' },
            ],
          },
        },
        {
          label: 'viz.palette.graph.graph.gravity',
          key: 'gravity',
          default: 0.1,
          comType: 'slider',
          options: {
            min: 0.01,
            max: 1,
            step: 0.01,
          },
        },
      ],
    },
    {
      label: 'viz.palette.graph.graph.node',
      key: 'node',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.graph.nodeSize',
          key: 'nodeSize',
          default: 30,
          comType: 'inputNumber',
          options: {
            min: 10,
            max: 100,
          },
        },
        {
          label: 'viz.palette.graph.graph.nodeLabelShow',
          key: 'nodeLabelShow',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.graph.graph.symbol',
          key: 'symbol',
          default: 'circle',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.graph.graph.circle', value: 'circle' },
              { label: 'viz.palette.graph.graph.rect', value: 'rect' },
              { label: 'viz.palette.graph.graph.roundRect', value: 'roundRect' },
              { label: 'viz.palette.graph.graph.triangle', value: 'triangle' },
              { label: 'viz.palette.graph.graph.diamond', value: 'diamond' },
            ],
          },
        },
      ],
    },
    {
      label: 'viz.palette.graph.graph.lineStyle',
      key: 'lineStyle',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.graph.lineOpacity',
          key: 'opacity',
          default: 0.5,
          comType: 'slider',
          options: {
            min: 0,
            max: 1,
            step: 0.1,
          },
        },
        {
          label: 'viz.palette.graph.graph.lineWidth',
          key: 'width',
          default: 1,
          comType: 'inputNumber',
          options: {
            min: 1,
            max: 10,
          },
        },
        {
          label: 'viz.palette.graph.graph.curveness',
          key: 'curveness',
          default: 0,
          comType: 'slider',
          options: {
            min: 0,
            max: 1,
            step: 0.1,
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
        'viz.palette.graph.graph.layout': '布局设置',
        'viz.palette.graph.graph.layoutType': '布局类型',
        'viz.palette.graph.graph.gravity': '重力',
        'viz.palette.graph.graph.force': '力导向',
        'viz.palette.graph.graph.circular': '环形',
        'viz.palette.graph.graph.node': '节点设置',
        'viz.palette.graph.graph.nodeSize': '节点大小',
        'viz.palette.graph.graph.nodeLabelShow': '显示节点标签',
        'viz.palette.graph.graph.symbol': '节点形状',
        'viz.palette.graph.graph.circle': '圆形',
        'viz.palette.graph.graph.rect': '矩形',
        'viz.palette.graph.graph.roundRect': '圆角矩形',
        'viz.palette.graph.graph.triangle': '三角形',
        'viz.palette.graph.graph.diamond': '菱形',
        'viz.palette.graph.graph.lineStyle': '连线样式',
        'viz.palette.graph.graph.lineOpacity': '连线透明度',
        'viz.palette.graph.graph.lineWidth': '连线宽度',
        'viz.palette.graph.graph.curveness': '连线弯曲度',
      },
    },
    {
      lang: 'en-US',
      translation: {
        'viz.palette.graph.graph.layout': 'Layout Settings',
        'viz.palette.graph.graph.layoutType': 'Layout Type',
        'viz.palette.graph.graph.gravity': 'Gravity',
        'viz.palette.graph.graph.force': 'Force-directed',
        'viz.palette.graph.graph.circular': 'Circular',
        'viz.palette.graph.graph.node': 'Node Settings',
        'viz.palette.graph.graph.nodeSize': 'Node Size',
        'viz.palette.graph.graph.nodeLabelShow': 'Show Node Labels',
        'viz.palette.graph.graph.symbol': 'Node Shape',
        'viz.palette.graph.graph.circle': 'Circle',
        'viz.palette.graph.graph.rect': 'Rectangle',
        'viz.palette.graph.graph.roundRect': 'Round Rectangle',
        'viz.palette.graph.graph.triangle': 'Triangle',
        'viz.palette.graph.graph.diamond': 'Diamond',
        'viz.palette.graph.graph.lineStyle': 'Line Style',
        'viz.palette.graph.graph.lineOpacity': 'Line Opacity',
        'viz.palette.graph.graph.lineWidth': 'Line Width',
        'viz.palette.graph.graph.curveness': 'Line Curveness',
      },
    },
  ],
};

export default config;