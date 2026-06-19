import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

/**
 * 柱状/折线混合图配置
 */
interface BarLineChartProps {
  data: Array<Record<string, string | number>>;
  xAxisKey: string;
  barKey?: string;
  barName?: string;
  lineKey?: string;
  lineName?: string;
  height?: number;
}

/**
 * 柱状折线混合图组件
 */
export const BarLineChart: React.FC<BarLineChartProps> = ({
  data,
  xAxisKey,
  barKey,
  barName,
  lineKey,
  lineName,
  height = 300,
}) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
    },
    legend: {
      data: [barName, lineName].filter(Boolean),
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map((d) => d[xAxisKey]),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: barName ? '亿元' : '',
        splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      lineKey
        ? {
            type: 'value',
            name: lineName || '',
            splitLine: { show: false },
            axisLabel: { color: '#94a3b8', fontSize: 11 },
          }
        : undefined,
    ],
    series: ([
      barKey
        ? {
            name: barName,
            type: 'bar' as const,
            data: data.map((d) => d[barKey]),
            itemStyle: {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#0A2463' },
                  { offset: 1, color: '#2C52AB' },
                ],
              },
              borderRadius: [4, 4, 0, 0],
            },
            barWidth: '40%',
          }
        : undefined,
      lineKey
        ? {
            name: lineName,
            type: 'line' as const,
            yAxisIndex: 1,
            data: data.map((d) => d[lineKey]),
            smooth: true,
            symbol: 'circle' as const,
            symbolSize: 8,
            itemStyle: { color: '#D8B44A' },
            lineStyle: { width: 3, color: '#D8B44A' },
            areaStyle: {
              color: {
                type: 'linear' as const,
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(216,180,74,0.2)' },
                  { offset: 1, color: 'rgba(216,180,74,0)' },
                ],
              },
            },
          }
        : undefined,
    ].filter(Boolean) as EChartsOption['series']),
  };

  return <ReactECharts option={option} style={{ height }} />;
};

/**
 * 饼图组件配置
 */
interface PieChartProps {
  data: Array<{ name: string; value: number; color?: string }>;
  height?: number;
  ring?: boolean;
}

/**
 * 饼图/环形图组件
 */
export const PieChart: React.FC<PieChartProps> = ({ data, height = 280, ring = true }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    series: [
      {
        type: 'pie' as const,
        radius: ring ? ['45%', '70%'] : '60%',
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: ring ? 6 : 0,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: !ring,
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold' as const,
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.2)',
          },
        },
        labelLine: { show: !ring },
        data: data.map((item) => ({
          name: item.name,
          value: item.value,
          itemStyle: { color: item.color },
        })),
      },
    ] as EChartsOption['series'],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

/**
 * 多折线图配置
 */
interface MultiLineChartProps {
  data: Array<Record<string, string | number>>;
  xAxisKey: string;
  lines: Array<{ key: string; name: string; color: string }>;
  height?: number;
}

/**
 * 多折线趋势图组件
 */
export const MultiLineChart: React.FC<MultiLineChartProps> = ({ data, xAxisKey, lines, height = 300 }) => {
  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#334155' },
    },
    legend: {
      data: lines.map((l) => l.name),
      bottom: 0,
      textStyle: { color: '#64748b', fontSize: 12 },
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '10%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map((d) => d[xAxisKey]),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: lines.map((line) => ({
      name: line.name,
      type: 'line' as const,
      smooth: true,
      symbol: 'circle' as const,
      symbolSize: 6,
      data: data.map((d) => d[line.key]),
      itemStyle: { color: line.color },
      lineStyle: { width: 2.5, color: line.color },
    })) as EChartsOption['series'],
  };

  return <ReactECharts option={option} style={{ height }} />;
};

/**
 * 仪表盘组件配置
 */
interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  name: string;
  unit?: string;
  height?: number;
  thresholds?: { warning: number; critical: number; isBetter: boolean };
}

/**
 * 仪表盘图表组件（用于财务指标展示）
 */
export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  name,
  unit = '%',
  height = 180,
  thresholds,
}) => {
  const getStatusColor = () => {
    if (!thresholds) return '#2A9D8F';
    const { warning, critical, isBetter } = thresholds;
    if (isBetter) {
      if (value <= critical) return '#E63946';
      if (value <= warning) return '#F77F00';
      return '#2A9D8F';
    } else {
      if (value >= critical) return '#E63946';
      if (value >= warning) return '#F77F00';
      return '#2A9D8F';
    }
  };

  const option: EChartsOption = {
    series: [
      {
        type: 'gauge' as const,
        startAngle: 200,
        endAngle: -20,
        min,
        max,
        radius: '90%',
        progress: {
          show: true,
          width: 14,
          itemStyle: { color: getStatusColor() },
        },
        pointer: { show: false },
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, '#e2e8f0']],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        title: {
          show: true,
          offsetCenter: [0, '70%'],
          fontSize: 12,
          color: '#64748b',
        },
        detail: {
          valueAnimation: true,
          fontSize: 22,
          fontWeight: 'bold' as const,
          offsetCenter: [0, '30%'],
          formatter: `{value}${unit}`,
          color: getStatusColor(),
        },
        data: [{ value, name }],
      },
    ] as EChartsOption['series'],
  };

  return <ReactECharts option={option} style={{ height }} />;
};
