/**
 * Funnel Configuration - Enhanced version
 */
import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'viz.board.data.name.dimension',
      key: 'dimension',
      required: true,
      type: 'group',
      limit: [1, 1],
      actions: {
        NUMERIC: ['alias', 'colorize', 'sortable'],
        STRING: ['alias', 'colorize', 'sortable'],
        DATE: ['alias', 'colorize', 'sortable'],
      },
      drillable: true,
    },
    {
      label: 'viz.board.data.name.metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
      limit: [1, 999],
    },
    {
      label: 'viz.board.data.name.filter',
      key: 'filter',
      type: 'filter',
    },
    {
      label: 'viz.board.data.name.info',
      key: 'info',
      type: 'info',
    },
  ],
  styles: [
    {
      label: 'viz.palette.graph.funnel.title',
      key: 'funnel',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.funnel.sort',
          key: 'sort',
          comType: 'select',
          default: 'descending',
          options: {
            translateItemLabel: true,
            items: [
              {
                label: 'viz.palette.graph.funnel.sortType.descending',
                value: 'descending',
              },
              {
                label: 'viz.palette.graph.funnel.sortType.ascending',
                value: 'ascending',
              },
              { label: 'viz.palette.graph.funnel.sortType.none', value: 'none' },
            ],
          },
        },
        {
          label: 'viz.palette.graph.funnel.gap',
          key: 'gap',
          default: 0,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 20,
          },
        },
        {
          label: 'viz.palette.graph.funnel.minWidth',
          key: 'minWidth',
          default: 0,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 100,
          },
        },
        {
          label: 'viz.palette.graph.funnel.maxWidth',
          key: 'maxWidth',
          default: 100,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 100,
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
          label: 'viz.palette.style.position',
          key: 'position',
          comType: 'select',
          default: 'inside',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.style.position.left', value: 'left' },
              { label: 'viz.palette.style.position.right', value: 'right' },
              { label: 'viz.palette.style.position.inside', value: 'inside' },
              { label: 'viz.palette.style.position.outside', value: 'outside' },
            ],
          },
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
        {
          label: 'viz.palette.graph.funnel.showValue',
          key: 'showValue',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.graph.funnel.showPercentage',
          key: 'showPercentage',
          default: true,
          comType: 'checkbox',
        },
      ],
    },
    {
      label: 'viz.palette.style.legend',
      key: 'legend',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.style.showLegend',
          key: 'showLegend',
          default: true,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.legendType',
          key: 'type',
          comType: 'legendType',
          default: 'scroll',
        },
        {
          label: 'viz.palette.style.legendSelectAll',
          key: 'selectAll',
          default: false,
          comType: 'checkbox',
        },
        {
          label: 'viz.palette.style.legendPosition',
          key: 'position',
          comType: 'legendPosition',
          default: 'right',
        },
        {
          label: 'viz.palette.style.legendHeight',
          key: 'height',
          default: 0,
          comType: 'inputNumber',
          options: {
            step: 40,
            min: 0,
          },
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
        'viz.palette.graph.funnel.title': '漏斗图',
        'viz.palette.graph.funnel.sort': '排序',
        'viz.palette.graph.funnel.gap': '间距',
        'viz.palette.graph.funnel.minWidth': '最小宽度',
        'viz.palette.graph.funnel.maxWidth': '最大宽度',
        'viz.palette.graph.funnel.sortType': {
          descending: '降序',
          ascending: '升序',
          none: '无',
        },
        'viz.palette.graph.funnel.showValue': '显示数值',
        'viz.palette.graph.funnel.showPercentage': '显示百分比',
      },
    },
    {
      lang: 'en-US',
      translation: {
        'viz.palette.graph.funnel.title': 'Funnel',
        'viz.palette.graph.funnel.sort': 'Sort',
        'viz.palette.graph.funnel.gap': 'Gap',
        'viz.palette.graph.funnel.minWidth': 'Min Width',
        'viz.palette.graph.funnel.maxWidth': 'Max Width',
        'viz.palette.graph.funnel.sortType': {
          descending: 'Descending',
          ascending: 'Ascending',
          none: 'None',
        },
        'viz.palette.graph.funnel.showValue': 'Show Value',
        'viz.palette.graph.funnel.showPercentage': 'Show Percentage',
      },
    },
  ],
};

export default config;