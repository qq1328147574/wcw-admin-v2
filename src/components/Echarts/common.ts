import { EhOptionLineFoldData, EhOptionLineDoughnutData } from './optionsData';

const echarts = require('echarts');

/**
 * 图标折叠
 */
const install = (Vue: any) => {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          lineFold: (id: string, echartsName: string, xAxisData: object, seriesData: object) => {  // 折线图
            if (id === null) return
            const chartContainer: any = document.getElementById(id);
            // chartContainer.removeAttribute("_echarts_instance_");

            echarts.dispose(document.getElementById(id) as any);
            this.chartFold = echarts.init(document.getElementById(id) as any);
            this.chartFold.clear();

            // 配置项和数据
            const optionsData = EhOptionLineFoldData(echartsName, xAxisData, seriesData);

            this.chartFold.setOption(optionsData, true);
            this.chartFold.resize();
          },
          lineDoughnut: function (id: string, echartsName: string, seriesData: any) {  // 饼状图
            if (id === null) return
            
            echarts.dispose(document.getElementById(id) as any);
            this.chartDoughnut = echarts.init(document.getElementById(id) as any);
            this.chartDoughnut.clear();
            
            // 配置项和数据
            const optionsData = EhOptionLineDoughnutData(echartsName, seriesData);

            this.chartDoughnut.setOption(optionsData);
          },
        }
      }
    },
  })
}

export default {
  install
}