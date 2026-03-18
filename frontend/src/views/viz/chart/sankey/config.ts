/**
 * Sankey Diagram Configuration
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
      required: true,
      type: 'aggregate',
      limit: [1, 1],
    },
    {
      label: 'viz.board.data.name.nodeColor',
      key: 'nodeColor',
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
      label: 'viz.palette.graph.sankey.node',
      key: 'node',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.sankey.nodeWidth',
          key: 'nodeWidth',
          default: 20,
          comType: 'inputNumber',
          options: {
            min: 5,
            max: 100,
          },
        },
        {
          label: 'viz.palette.graph.sankey.nodeGap',
          key: 'nodeGap',
          default: 8,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 50,
          },
        },
        {
          label: 'viz.palette.graph.sankey.draggable',
          key: 'draggable',
          default: true,
          comType: 'checkbox',
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
    {
      label: 'viz.palette.graph.sankey.lineStyle',
      key: 'lineStyle',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.sankey.lineOpacity',
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
          label: 'viz.palette.graph.sankey.curveness',
          key: 'curveness',
          default: 0.5,
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
        'viz.palette.graph.sankey.node': '节点设置',
        'viz.palette.graph.sankey.nodeWidth': '节点宽度',
        'viz.palette.graph.sankey.nodeGap': '节点间距',
        'viz.palette.graph.sankey.draggable': '可拖拽',
        'viz.palette.graph.sankey.lineStyle': '线条样式',
        'viz.palette.graph.sankey.lineOpacity': '线条透明度',
        'viz.palette.graph.sankey.curveness': '线条弯曲度',
      },
    },
    {
      lang: 'en-US',
      translation: {
        'viz.palette.graph.sankey.node': 'Node Settings',
        'viz.palette.graph.sankey.nodeWidth': 'Node Width',
        'viz.palette.graph.sankey.nodeGap': 'Node Gap',
        'viz.palette.graph.sankey.draggable': 'Draggable',
        'viz.palette.graph.sankey.lineStyle': 'Line Style',
        'viz.palette.graph.sankey.lineOpacity': 'Line Opacity',
        'viz.palette.graph.sankey.curveness': 'Curveness',
      },
    },
  ],
};

export default config;