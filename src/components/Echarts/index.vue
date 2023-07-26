<template>
  <div class="v-echarts-wrap" id="echarts">
    <!-- 饼状 -->
    <div class="v-echarts-doughnut" id="myChartDoughnut" v-if="eChartCountId === 0" ></div>
    <!-- 折线 -->
    <div class="v-echarts-fold" id="myChartFold1" v-else ></div>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { deepCloneData } from '@/filters/common';

type inits = {
  id?: number;
  createTime: string;
  registerNum: number;
}
@Component({
  name: 'ECharts',
  components: {
  },
})
export default class ECharts extends Vue {
  [x: string]: any; // ts报错
  private vm = window['vm'];

  @Prop({ default: '' }) value!: any;  // 图表数据
  @Prop({ default: 0 }) eChartCountId!: number;  // 图表类型

  private xAxisDoughnutData: any = [];
  private initDatas: Array<inits> = [
    {createTime: "11/23", registerNum: 5},
    {createTime: "11/24", registerNum: 8},
    {createTime: "11/25", registerNum: 4},
    {createTime: "11/26", registerNum: 6},
    {createTime: "11/27", registerNum: 5},
    {createTime: "11/28", registerNum: 9},
    {createTime: "11/29", registerNum: 8},
  ];
  private screenWidth:number | string = '';  // 页面宽度

  /**
   * @description: 监听数据列表
   * @param {Number} ids -ID类型
   * @return
   * 
   */
  @Watch('value', { deep: true, immediate: true })
  getWatchValueChang(newValue: any, oldValue: any) {
    const ids = Number(this.eChartCountId);

    // console.log(ids);
    // console.log(newValue);
    if(typeof newValue === 'object') {
      if(ids === 0) {
        const list = newValue;
        const text1 = this.vm.$t('Common.总注册');
        const text2 = this.vm.$t('Common.总认证');
        const text3 = this.vm.$t('Common.日注册');
        const doughnutData = [
          { value: list.registerNums, name: text1 },
          { value: list.kycNums, name: text2 },
          { value: list.sameDayRegistrationNums, name: text3 },
        ]
        this.xAxisDoughnutData = doughnutData;
        this.initDoughnutChart();

      } else if(ids === 1) {
        const data = deepCloneData(newValue);
        this.initChart1(data);

      } else if(ids === 2) {
        const data = deepCloneData(newValue);
        this.initChart2(data);

      } else {
        const text = this.vm.$t('Common.月');
        const data = deepCloneData(newValue);
        let seriesFoldData: any = [];
        let seriesFoldTimeData: any = [];
        data.forEach( el => {
          seriesFoldData.push(el.registerNum);
          seriesFoldTimeData.push(el.dateTime + text);
        });
        this.initChart3(seriesFoldTimeData, seriesFoldData);

      }
    }
  };

  // 生命周期
  created() {};

  // 生命周期
  mounted () {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    }
  };

  /**
   * @description: 拆分数据
   * @param {*} data      
   * @return {*}
   */
  private initData(data) {
    let seriesFoldData: any = [];
    let seriesFoldTimeData: any = [];
    
    data.forEach( (el, i, arr) => {
      seriesFoldData.push(el.registerNum);
      seriesFoldTimeData.push(el.dateTime);
    });

    return {
      seriesFoldData,
      seriesFoldTimeData
    };
  }
  
  /**
   * @description: 挂载图表 -折线
   * @param {string} xAxisName           标题
   * @param {array} seriesFoldTimeData   X轴时间线
   * @param {array} seriesFoldData       数据线
   * @return {*}
   */
  private initChart1(data) {
    const chartContainer: any = document.getElementById('myChartFold1');
    const xAxisName = this.vm.$t('Common.近七天注册人数');
    const {seriesFoldTimeData, seriesFoldData} = this.initData(data);

    this.$nextTick(() => {
      chartContainer.style.width = '55vw';
      this.$chart.lineFold('myChartFold1', xAxisName, seriesFoldTimeData, seriesFoldData);
    });
  }

  private initChart2(data) {
    const chartContainer: any = document.getElementById('myChartFold1');
    const xAxisName = this.vm.$t('Common.近一个月注册人数');
    const {seriesFoldTimeData, seriesFoldData} = this.initData(data);

    this.$nextTick(() => {
      chartContainer.style.width = '75vw';
      this.$chart.lineFold('myChartFold1', xAxisName, seriesFoldTimeData, seriesFoldData);
    });
  }

  private initChart3(seriesFoldTimeData, seriesFoldData) {
    const chartContainer: any = document.getElementById('myChartFold1');
    const xAxisName = this.vm.$t('Common.今年注册人数');

    this.$nextTick(() => {
      chartContainer.style.width = '55vw';
      this.$chart.lineFold('myChartFold1', xAxisName, seriesFoldTimeData, seriesFoldData);
    });
  }
  
  /**
   * @description: 挂载图表 -饼状
   * @param {array} xAxisDoughnutData     数据线
   * @return {*}
   */
  private initDoughnutChart() {
    const xAxisName = this.vm.$t('Common.平台数据');
    this.$chart.lineDoughnut('myChartDoughnut', xAxisName, this.xAxisDoughnutData);
  }

}
</script>

<style lang='scss' scoped>
.v-echarts-wrap {
  // min-height: 700px;
  .v-echarts-doughnut {
    display: block;
    width: 60%;
    height: 400px;
    margin: auto;
  }
  .v-echarts-fold {
    display: block;
    width: 100%;
    height: 500px;
    margin: auto;
  }
}
</style>