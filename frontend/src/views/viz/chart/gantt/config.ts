/**
 * Gantt Chart Configuration
 */
import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'viz.board.data.name.task',
      key: 'task',
      required: true,
      type: 'group',
      limit: [1, 1],
      actions: {
        STRING: ['alias', 'colorize', 'sortable'],
      },
    },
    {
      label: 'viz.board.data.name.startDate',
      key: 'startDate',
      required: true,
      type: 'group',
      limit: [1, 1],
      actions: {
        DATE: ['alias', 'sortable'],
      },
    },
    {
      label: 'viz.board.data.name.endDate',
      key: 'endDate',
      required: true,
      type: 'group',
      limit: [1, 1],
      actions: {
        DATE: ['alias', 'sortable'],
      },
    },
    {
      label: 'viz.board.data.name.progress',
      key: 'progress',
      type: 'aggregate',
      limit: [0, 1],
    },
    {
      label: 'viz.board.data.name.resource',
      key: 'resource',
      type: 'group',
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
      label: 'viz.palette.graph.gantt.bar',
      key: 'bar',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.gantt.barHeight',
          key: 'barHeight',
          default: 20,
          comType: 'inputNumber',
          options: {
            min: 10,
            max: 100,
          },
        },
        {
          label: 'viz.palette.graph.gantt.barGap',
          key: 'barGap',
          default: 5,
          comType: 'inputNumber',
          options: {
            min: 0,
            max: 50,
          },
        },
        {
          label: 'viz.palette.graph.gantt.showProgress',
          key: 'showProgress',
          default: true,
          comType: 'checkbox',
        },
      ],
    },
    {
      label: 'viz.palette.graph.gantt.timeAxis',
      key: 'timeAxis',
      comType: 'group',
      rows: [
        {
          label: 'viz.palette.graph.gantt.axisType',
          key: 'axisType',
          default: 'time',
          comType: 'select',
          options: {
            translateItemLabel: true,
            items: [
              { label: 'viz.palette.graph.gantt.time', value: 'time' },
              { label: 'viz.palette.graph.gantt.value', value: 'value' },
            ],
          },
        },
        {
          label: 'viz.palette.graph.gantt.axisLabelFormatter',
          key: 'formatter',
          default: 'MM-DD',
          comType: 'input',
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
        'viz.palette.graph.gantt.bar': '条形设置',
        'viz.palette.graph.gantt.barHeight': '条形高度',
        'viz.palette.graph.gantt.barGap': '条形间距',
        'viz.palette.graph.gantt.showProgress': '显示进度',
        'viz.palette.graph.gantt.timeAxis': '时间轴',
        'viz.palette.graph.gantt.axisType': '轴类型',
        'viz.palette.graph.gantt.axisLabelFormatter': '标签格式',
        'viz.palette.graph.gantt.time': '时间',
        'viz.palette.graph.gantt.value': '数值',
      },
    },
    {
      lang: 'en-US',
      translation: {
        'viz.palette.graph.gantt.bar': 'Bar Settings',
        'viz.palette.graph.gantt.barHeight': 'Bar Height',
        'viz.palette.graph.gantt.barGap': 'Bar Gap',
        'viz.palette.graph.gantt.showProgress': 'Show Progress',
        'viz.palette.graph.gantt.timeAxis': 'Time Axis',
        'viz.palette.graph.gantt.axisType': 'Axis Type',
        'viz.palette.graph.gantt.axisLabelFormatter': 'Label Format',
        'viz.palette.graph.gantt.time': 'Time',
        'viz.palette.graph.gantt.value': 'Value',
      },
    },
  ],
};

export default config;