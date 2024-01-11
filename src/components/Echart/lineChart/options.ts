export function getOptions(
  data: Array<any> = [],
  chartAxis: Array<any> = [],
  echarts: any
) {
  return {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartAxis
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1
    },
    series: [
      {
        data: data,
        type: 'line',
        smooth: true,
        lineStyle: {
          color: 'rgb(73, 169, 238)'
        },
        label: {
          show: true
        },
        itemStyle: {
          color: 'rgb(73, 169, 238)'
        }
      }
    ]
  };
}
