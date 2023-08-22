<template>
  <div class="daily">

    <el-row>
      <el-col :xs="24" :span="12">
        <div class="v-card">
          <div class="v-card-wrap">
            <el-tabs value="1" type="border-card">
              <el-tab-pane label="天" name="1">

                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectData" type="datetimerange" unlink-panels
                    range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                    :value-format="'yyyy-MM-dd HH:mm:ss'" @change="selectTime">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">搜索</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">重置</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="周" name="2">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectWeek" type="week" unlink-panels range-separator="-"
                    start-placeholder="选择周" end-placeholder="结束时间" format="yyyy 第 W 周" @change="onSelectWeek">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">搜索</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">重置</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="月" name="3">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectMonth" type="month" unlink-panels range-separator="-"
                    placeholder="选择月" @change="onSelectMonth">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">搜索</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">重置</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="年" name="4">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectYear" type="year" unlink-panels range-separator="-"
                    placeholder="选择年" @change="onSelectYear">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">搜索</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">重置</el-button>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :span="12">
        <div class="v-card-wrap flex">
          <div class="v-card flex-1">
            <div class="v-value">
              <div class="v-value-item">
                <div class="v-title">新会员</div>
                <div class="v-primary">{{ reportData.totalNewMemberCount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">总会员</div>
                <div class="v-success">{{ reportData.totalMemberCount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">总奖金</div>
                <div class="v-warning">{{ reportData.totalRewardAmount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">总充值</div>
                <div class="v-success">{{ reportData.totalDepositAmount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">总提款</div>
                <div class="v-danger">{{ reportData.totalWithdrawAmount }}</div>
              </div>
              <div class="v-value-item flex-1">
                <div class="v-title">会员总赢金额</div>
                <div class="v-success">{{ reportData.winAmount }}</div>
              </div>
              <div class="v-value-item flex-1">
                <div class="v-title">会员总输金额</div>
                <div class="v-danger">{{ reportData.lossAmount }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <ElTable ref="ElTable" tableSize="small" :tableData="tableData" :tableColumnData="tableColumnData"
          :totalCount="totalCount" :totalPageSize="page.pageSize" :tableExcelType="false" :needRefresh="true"
          @handleCurrentChange="handleCurrentChange">
        </ElTable>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { queryTotalReport, queryTotalGameRecords } from '@/api';

import ElTable from "@/components/ElTable/index.vue";

import dayjs from 'dayjs';

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let currentDay = new Date().getDate();

// let monthFirstDay = dayjs(new Date(currentYear + '-' + (currentMonth)  + '-01')).format('YYYY-MM-DD HH:mm:ss');
// let lastDate = new Date(currentYear, currentMonth, 0).getDate();
// let monthLastDay = dayjs(new Date(currentYear + '-' + (currentMonth) + '-' + lastDate + ' 23:59:59')).format('YYYY-MM-DD HH:mm:ss');

let time = `${currentYear}-${currentMonth}-${currentDay}`;
let startTime = dayjs(time).format('YYYY-MM-DD HH:mm:ss');
let endTime = dayjs(time + '23:59:59').format('YYYY-MM-DD HH:mm:ss');

// console.log('startTime :>> ', startTime);
// console.log('endTime :>> ', endTime);

@Component({
  components: {
    ElTable
  }
})
export default class DailyReport extends Vue {
  reportData: any = {};

  classList = [
    // 'v-primary',
    // 'v-success',
    // 'v-warning',
    // 'v-danger',
    '', '', '', '',
    '',
  ]

  tableData = [];
  tableColumnData = [
    { prop: "id", label: 'ID' },
    { prop: "userName", label: '用户名' },
    { prop: "userId", label: '用户ID' },
    { prop: "changeType", label: '类型' },
    { prop: "txAmount", label: '金额' },
    { prop: "createTime", label: '创建时间' },
  ];
  totalCount = 0;
  params = {
    startTime: startTime,
    endTime: endTime,
  };

  selectData: any = [
    startTime, endTime
  ];
  selectWeek = '';
  selectMonth = '';
  selectYear = '';

  page = {
    page: 1,
    pageSize: 20
  }

  // 搜索配置
  get formColumnData() {
    return {
      column: [
        // { slot: 'dateSelect', label: '选择时间' }
      ]
    }
  }

  pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    }
  }

  mounted() {
    this.getReport();
  }

  handleSearchClick(val) {
    Object.assign(this.params, val);
    this.getReport();
  }

  // 重置搜索
  resetTableData() {
    console.log('reset :>> ');
    this.params = {
      startTime: startTime,
      endTime: endTime,
    };

    this.selectData = [
      startTime, endTime
    ];

    // 重置搜索为第一页
    let ref: any = this.$refs.ElTable;
    ref.resetCurrentPage();

    this.selectWeek = '';
    this.selectMonth = '';
    this.selectYear = '';

    this.getReport();
  }

  selectTime(val) {
    this.params['startTime'] = val[0];
    this.params['endTime'] = val[1];

    this.getReport();
  }

  getReport() {
    console.log('params :>> ', this.params);
    this.getTotalData();
    this.getTotalList();
  }

  async getTotalData() {
    const { data } = await queryTotalReport(this.params);
    if (data.code === 20000) {
      console.log('queryTotalReport :>> ', data.data);
      this.reportData = data.data;
    }
  }


  // 分页
  handleCurrentChange(val) {
    this.page.page = val;
    this.getTotalList();
  }

  async getTotalList() {
    const { data } = await queryTotalGameRecords({ ...this.params, ...this.page });
    if (data.code === 20000) {
      console.log('queryTotalGameRecords :>> ', data.data);
      this.tableData = data.data.records;
      this.totalCount = data.data.total;
    }
  }

  toFix(val) {
    if (val) {
      return Number(val);
    } else {
      return 0
    }
  }

  numberFixed(val) {
    let str = val.toString();
    if (str.includes('.')) {
      let len = str.split('.')[1].length;
      if (len > 2) {
        return val.toFixed(2);
      } else {
        return val;
      }
    } else {
      return val
    }
  }

  onSelectWeek(value) {

    let time = value.getTime();
    let week0 = new Date(time - 1 * 24 * 60 * 60 * 1000);
    let week7 = new Date(time + 6 * 24 * 60 * 60 * 1000 + (24 * 60 * 60 * 1000 - 1000));

    let startTime = dayjs(week0).format('YYYY-MM-DD HH:mm:ss');
    let endTime = dayjs(week7).format('YYYY-MM-DD HH:mm:ss');

    // console.log('startTime :>> ', startTime);
    // console.log('endTime :>> ', endTime);

    this.params.startTime = startTime;
    this.params.endTime = endTime;
    this.getReport();
  }
  onSelectMonth(value) {
    console.log('onSelectMonth :>> ', value);

    let currentMonth = value.getMonth() + 1;
    let currentYear = value.getFullYear();

    let monthFirstDay = new Date(currentYear + '-' + (currentMonth) + '-01');
    let lastDate = new Date(currentYear, currentMonth, 0).getDate();
    let monthLastDay = new Date(currentYear + '-' + (currentMonth) + '-' + lastDate + ' 23:59:59');

    let startTime = dayjs(monthFirstDay).format('YYYY-MM-DD HH:mm:ss');
    let endTime = dayjs(monthLastDay).format('YYYY-MM-DD HH:mm:ss');

    console.log('startTime :>> ', startTime);
    console.log('endTime :>> ', endTime);

    this.params.startTime = startTime;
    this.params.endTime = endTime;
    this.getReport();
  }
  onSelectYear(value) {

    console.log('onSelectYear :>> ', value);

    let currentYear = value.getFullYear();


    let startTime = dayjs(currentYear + '-01-01').format('YYYY-MM-DD HH:mm:ss');
    let endTime = dayjs(currentYear + '-12-31').format('YYYY-MM-DD HH:mm:ss');

    console.log('startTime :>> ', startTime);
    console.log('endTime :>> ', endTime);

    this.params.startTime = startTime;
    this.params.endTime = endTime;
    this.getReport();
  }
}
</script>

<style lang="scss" scoped>
@import url(./style/common.scss);

.v-count {
  padding-left: 10px;
}
</style>
