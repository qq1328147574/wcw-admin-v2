/**
 * @description 折线图
 * @param {*} echartsName  -标题
 * @param {*} xAxisData    -x 轴数据
 * @param {*} seriesData   -类型 数据
 * @returns {*}
 */
const EhOptionLineFoldData = (echartsName, xAxisData, seriesData) => {
  let data = {
    title: {
      text: '',
      x: 'center',
      top: 0,
    },
    tooltip: { // 提示框
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      x: 'center',      // 可设定图例在左、右、居中
      y: 'top',        // 可设定图例在上、下、居中,
      top: 20,
    },
    toolbox: {
      orient: 'horizontal',
      show: false,      // 是否显示工具栏组件
      x: 'left',
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '15px',
      right: '15px',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          show: true,
          textStyle: {
            color: '#899daf',      // 更改X坐标轴文字颜色
            fontSize: 12          // 更改X坐标轴文字大小
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: '#899daf'       // 更改X坐标轴颜色
          }
        },
        data: xAxisData
      }
    ],
    yAxis: [
      {
        type: 'value',
        // interval: 200,           // 设置左侧网格值
        splitLine: {               // 设置网格线颜色
          show: true,              // 隐藏网格线
          lineStyle: {
            color: ['rgb(235, 235, 235)'],
            width: 1,
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#899daf',     // 更改Y坐标轴文字颜色
            fontSize: 12          // 更改Y坐标轴文字大小
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: '#899daf'       // 更改Y坐标轴颜色
          }
        }
      }
    ],
    series: [  // 类型
      {
        name: echartsName,
        type: 'line',
        smooth: 0.3,              // 线条曲线
        itemStyle: {
          normal: {
            color: '#409eff',    // 改变折线点的颜色
            lineStyle: {
              color: '#409eff'   // 改变折线颜色
            }
          }
        },
        areaStyle: {
          normal: { color: 'transparent', }  // 改变区域颜色
        },
        data: seriesData
      },
    ]
  }

  return data
}

/**
 * @description 饼状图
 * @param {*} echartsName  -标题
 * @param {*} seriesData   -类型 数据
 * @returns {*}
 */
const EhOptionLineDoughnutData = (echartsName, seriesData) => {
  let data = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    color : [ '#2d8bec', ],
    series: [ // 类型
      {
        name: echartsName,
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  };

  return data
}

export {
  EhOptionLineFoldData,
  EhOptionLineDoughnutData,
}
