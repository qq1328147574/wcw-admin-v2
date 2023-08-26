<template>
  <div class="daily">

    <el-row>
      <el-col :xs="24" :span="12">
        <div class="v-card">
          <div class="v-card-wrap">
            <el-tabs value="1" type="border-card">
              <el-tab-pane :label="$t('Report.天')" name="1">

                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectData" type="datetimerange" unlink-panels
                    range-separator="-" :start-placeholder="$t('Report.开始时间')" :end-placeholder="$t('Report.结束时间')"
                    :value-format="'yyyy-MM-dd HH:mm:ss'" @change="selectTime">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">{{ $t('Report.搜索') }}</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">{{ $t('Report.重置') }}</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('Report.周')" name="2">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectWeek" type="week" unlink-panels range-separator="-"
                    :placeholder="$t('Report.选择周')" :format="`yyyy ${$t('Report.第')} W ${$t('Report.周')}`" @change="onSelectWeek">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">{{ $t('Report.搜索') }}</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">{{ $t('Report.重置') }}</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('Report.月')" name="3">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectMonth" type="month" unlink-panels range-separator="-"
                    :placeholder="$t('Report.选择月')" @change="onSelectMonth">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">{{ $t('Report.搜索') }}</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">{{ $t('Report.重置') }}</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('Report.年')" name="4">
                <div class="flex flex-column align-center">
                  <el-date-picker class="picker" v-model="selectYear" type="year" unlink-panels range-separator="-"
                   :placeholder="$t('Report.选择年')" @change="onSelectYear">
                  </el-date-picker>

                  <div style="margin-top: 20px;">
                    <el-button type="primary" size="medium" @click="getReport">{{ $t('Report.搜索') }}</el-button>
                    <el-button type="button" size="medium" @click="resetTableData">{{ $t('Report.重置') }}</el-button>
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
                <div class="v-title">{{ $t('Report.新会员') }}</div>
                <div class="v-primary">{{ reportData.totalNewMemberCount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">{{ $t('Report.总会员') }}</div>
                <div class="v-success">{{ reportData.totalMemberCount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">{{ $t('Report.总奖金') }}</div>
                <div class="v-warning">{{ reportData.totalRewardAmount }}</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">{{ $t('Report.总充值') }}</div>
                <div class="v-success">{{ reportData.totalDepositAmount }}({{ reportData.totalDepositCount }}{{ $t('Report.次') }})</div>
              </div>
              <div class="v-value-item">
                <div class="v-title">{{ $t('Report.总提款') }}</div>
                <div class="v-danger">{{ reportData.totalWithdrawAmount }}({{ reportData.totalWithdrawCount }}{{ $t('Report.次') }})</div>
              </div>
              <div class="v-value-item flex-1">
                <div class="v-title">{{ $t('Report.会员总赢金额') }}</div>
                <div class="v-success">{{ reportData.winAmount }}</div>
              </div>
              <div class="v-value-item flex-1">
                <div class="v-title">{{ $t('Report.会员总输金额') }}</div>
                <div class="v-danger">{{ reportData.lossAmount }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="tabs-wrap flex" style="margin-top: 20px;">
      <div class="pointer" :class="{ 'select': selectTab === 0 }" @click="changeTab(0)">
        <ticket-one theme="outline" size="20" fill="#fff" style="padding-right: 10px;" />
        {{ $t('Report.交易记录') }}
      </div>
      <div class="pointer" :class="{ 'select': selectTab === 1 }" @click="changeTab(1)">
        <gift theme="outline" size="20" fill="#fff" style="padding-right: 10px;" />
        {{ $t('Report.游戏记录') }}
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <ElTable ref="ElTable2" tableSize="small" :tableData="tableData2" :tableColumnData="tableColumnData2"
          :totalCount="totalCount2" :totalPageSize="params2.pageSize" :needTableHeight="false"
          @refreshTableChange="refreshTableData2" @handleCurrentChange="handleCurrentChange2" v-show="selectTab === 0">
          <div slot="toolbar" class="flex">
            <el-date-picker class="picker" v-model="selectData2" type="datetimerange" unlink-panels
              range-separator="-" :start-placeholder="$t('Report.开始时间')" :end-placeholder="$t('Report.结束时间')"
              :value-format="'yyyy-MM-dd HH:mm:ss'" @change="selectTime2">
            </el-date-picker>

            <el-button type="button" size="medium" @click="resetTableData2">{{ $t('Report.重置') }}</el-button>
          </div>
          <el-table-column slot="status" :label="$t('Assets.状态')" min-width="120">
            <template slot-scope="{row}">
              <el-tag type="primary" class="primary" v-if="row.status === 1">{{ $t('Report.待审核') }}</el-tag>
              <el-tag type="success" class="success" v-else-if="row.status === 0">{{ $t('Report.成功') }}</el-tag>
              <el-tag type="success" class="success" v-else-if="row.status === 2">{{ $t('Report.审核通过') }}</el-tag>
              <el-tag type="danger" class="danger" v-else-if="row.status === 3">{{ $t('Report.审核拒绝') }}</el-tag>
              <el-tag type="success" class="success" v-else-if="row.status === 4">{{ $t('Report.转账中') }}</el-tag>
              <el-tag type="danger" class="danger" v-else-if="row.status === 5">{{ $t('Report.未接收') }}</el-tag>
              <el-tag type="danger" class="danger" v-else>{{ $t('Report.失败') }}</el-tag>
            </template>
          </el-table-column>
        </ElTable>
        <ElTable ref="ElTable" tableSize="small" :tableData="tableData3" :tableColumnData="tableColumnData3"
          :totalCount="totalCount3" :totalPageSize="params3.pageSize" :tableExcelType="false" :needRefresh="true"
          @refreshTableChange="refreshTableData3" @handleCurrentChange="handleCurrentChange3" v-show="selectTab === 1">
          <el-table-column slot="gameType" :label="$t('Report.游戏类型')" min-width="160">
            <template slot-scope="{row}">
              {{ gameType[row.gameType] }}
            </template>
          </el-table-column>
          <el-table-column slot="game" :label="$t('Report.游戏')" min-width="160">
            <template slot-scope="{row}">
              <template v-if="row.gameImg">
                <el-image :src="row.gameImg.includes('http') ? row.gameImg : 'https:' + row.gameImg"
                  style="height: 80px;"></el-image>
              </template>
              <template v-else>
                <el-image :src="require(`../../../assets/img/game/${row.gameType}-${row.productId}.png`)"
                  style="height: 80px;"></el-image>
              </template>
            </template>
          </el-table-column>
        </ElTable>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { queryTotalReport, queryTotalGameRecords, queryAssetsRecords } from '@/api';

import ElTable from "@/components/ElTable/index.vue";

import dayjs from 'dayjs';

import { TicketOne, Gift } from "@icon-park/vue";

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
    ElTable,
    TicketOne,
    Gift
  }
})
export default class DailyReport extends Vue {
  vm = window['vm'];
  reportData: any = {};

  tableData3 = [];
  tableColumnData3 = [
    { prop: "id", label: 'ID' },
    { prop: "userName", label: this.vm.$t('Report.用户名') },
    { prop: "userId", label: this.vm.$t('Report.用户ID') },
    { slot: "gameType", width: "140" },
    { slot: "game", width: "140" },
    { prop: "changeType", label: this.vm.$t('Report.类型') },
    { prop: "txAmount", label: this.vm.$t('Report.金额') },
    { prop: "createTime", label: this.vm.$t('Report.创建时间') },
  ];
  totalCount3 = 0;

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

      ]
    }
  }

  pickerOptions = {
    disabledDate(time) {
      return time.getTime() > Date.now();
    }
  }

  gameType = {
    '1': this.vm.$t('Report.老虎机'),
    '2': this.vm.$t('Report.真人娱乐场'),
    '3': this.vm.$t('Report.体育博彩')
  }

  selectTab: number = 0;

  tableData2: any[] = [];
  tableColumnData2 = [
    { prop: "id", label: "ID", width: "160" },
    { prop: "amount", label: this.vm.$t('Report.金额'), width: "140" },
    { prop: "recordType", label: this.vm.$t('Report.记录类型'), width: "140" },
    { slot: "status" },
    { prop: "createTime", label: this.vm.$t('Report.创建时间'), width: "160" },
  ];
  totalCount2 = 0;

  params2 = {
    page: 1,
    pageSize: 14,
  };

  params3 = {
    page: 1,
    pageSize: 14,
  };

  mounted() {
    this.getReport();
    this.initGetDataList();
  }

  handleSearchClick(val) {
    Object.assign(this.params, val);
    this.getReport();
    this.initGetDataList();
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
    this.initGetDataList();
  }

  async getTotalData() {
    const { data } = await queryTotalReport(this.params);
    if (data.code === 20000) {
      console.log('queryTotalReport :>> ', data.data);
      this.reportData = data.data;
    }
  }


  // 分页
  handleCurrentChange3(val) {
    this.params3.page = val;
    this.getTotalList();
  }

  async getTotalList() {
    console.log('queryTotalGameRecords :>> ', {
      ...this.params,
      ...this.params3
    });
    const { data } = await queryTotalGameRecords({ ...this.params, ...this.params3 });
    if (data.code === 20000) {
      console.log('queryTotalGameRecords :>> ', data.data);
      this.tableData3 = data.data.records;
      this.totalCount3 = data.data.total;
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

    this.selectData2 = [
      startTime,
      endTime
    ]
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
    this.selectData2 = [
      startTime,
      endTime
    ]
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

    this.selectData2 = [
      startTime,
      endTime
    ]
    this.getReport();
  }


  // 刷新
  refreshTableData2() {
    this.initGetDataList();
  }
  refreshTableData3() {
    this.getTotalList();
  }

  // 分页
  handleCurrentChange2(val) {
    this.params2.page = val;
    this.initGetDataList();
  }

  // 查询
  async initGetDataList() {
    console.log('queryAssetsRecords :>> ', {
      ...this.params,
      ...this.params2
    });
    const { data: res } = await queryAssetsRecords({
      ...this.params,
      ...this.params2
    });
    if (res.code === 20000) {
      console.log("queryAssetsRecords :>> ", res.data.records);
      this.tableData2 = res.data.records.map((item) => {
        return {
          ...item,
          recordType: this.vm.$t("Type." + item.recordType),
        };
      });
      this.totalCount2 = res.data.total;
    }
  }

  changeTab(index) {
    console.log('index :>> ', index);
    this.selectTab = index;
    // console.log('this.selectTab :>> ', this.selectTab);
  }

  selectData2 = [
    startTime,
    endTime
  ]

  selectTime2(val) {
    this.params2['startTime'] = val[0];
    this.params2['endTime'] = val[1];
    
    this.initGetDataList();
  }

  resetTableData2() {
    this.params2['startTime'] = startTime;
    this.params2['endTime'] = endTime;

    this.selectData2 = [
      startTime,
      endTime
    ]
    
    this.initGetDataList();
  }

  resetTableData() {
    this.params['startTime'] = startTime;
    this.params['endTime'] = endTime;
    this.params2['startTime'] = startTime;
    this.params2['endTime'] = endTime;

    this.selectData = [
      startTime,
      endTime
    ]

    this.selectData2 = [
      startTime,
      endTime
    ]

    this.selectData = [
      startTime, endTime
    ];

    // 重置搜索为第一页
    // let ref: any = this.$refs.ElTable;
    // ref.resetCurrentPage();
    // let ref2: any = this.$refs.ElTable2;
    // ref2.resetCurrentPage();

    this.selectWeek = '';
    this.selectMonth = '';
    this.selectYear = '';

    this.getReport();
  }
}
</script>

<style lang="scss" scoped>
@import url(./style/common.scss);

.v-count {
  padding-left: 10px;
}

.tabs-wrap {
  background: #90a4ae !important;

  div {
    padding: 10px 15px;
    color: #fff;
    display: flex;
    align-items: center;

    &.select {
      background: #37474f !important;
    }
  }
}
</style>
