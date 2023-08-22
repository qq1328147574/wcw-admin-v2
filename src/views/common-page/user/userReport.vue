<template>
  <div class="user-info">

    <div class="flex">
      
    </div>
    <div class="v-list-card">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="v-card-item " style="padding: 10px; box-sizing: border-box;">
            <div>
              <el-button type="primary" icon="el-icon-back" size="mini" @click="$router.back()"></el-button>
            </div>
            <div class="flex flex-column align-center" style="margin-top: 20px;">
              <el-date-picker class="picker" v-model="selectData" type="datetimerange" unlink-panels
                range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
                :value-format="'yyyy-MM-dd HH:mm:ss'" @change="selectTime">
              </el-date-picker>

              <div style="margin-top: 20px;">
                <el-button type="primary" size="medium" @click="getReport">搜索</el-button>
                <el-button type="button" size="medium" @click="resetTableData">重置</el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <div class="v-card-item">
            <div class="v-card-hd">
              <div class="v-card-hd-title">{{ userName }}</div>
            </div>
            <div class="v-card-bd">
              <div class="v-card-bd-item flex align-center">
                <div class="label">总充值</div>
                <div class="value center success">
                  {{ memberReport.memberDepositAmount }}
                </div>
              </div>
              <div class="v-card-bd-item flex align-center">
                <div class="label">总提款</div>
                <div class="value center danger">
                  {{ memberReport.memberWithdrawAmount }}
                </div>
              </div>
              <div class="v-card-bd-item flex align-center">
                <div class="label">总奖励</div>
                <div class="value center warning">
                  {{ memberReport.memberRewardAmount }}
                </div>
              </div>
              <div class="v-card-bd-item flex align-center">
                <div class="label">总赢金额</div>
                <div class="value center success">
                  {{ memberReport.memberWinAmount }}
                </div>
              </div>
              <div class="v-card-bd-item flex align-center">
                <div class="label">总输金额</div>
                <div class="value center danger">
                  {{ memberReport.memberLossAmount }}
                </div>
              </div>
            </div>
            <div class="v-card-ft"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="tabs flex" style="margin-top: 20px;">
      <div class="pointer" :class="{ 'select': currentTab === 0 }" @click="currentTab = 0">
        <ticket-one theme="outline" size="20" fill="#fff" style="padding-right: 10px;" />
        交易记录
      </div>
      <div class="pointer" :class="{ 'select': currentTab === 1 }" @click="currentTab = 1">
        <gift theme="outline" size="20" fill="#fff" style="padding-right: 10px;" />
        游戏记录
      </div>
    </div>
    <div class="">
      <ElTable ref="ElTable2" tableSize="small" :tableData="tableData2" :tableColumnData="tableColumnData2"
        :totalCount="totalCount2" :totalPageSize="params2.pageSize" :needTableHeight="false"
        @refreshTableChange="refreshTableData" @handleCurrentChange="handleCurrentChange" v-show="currentTab === 0">

        <div slot="toolbar" class="flex">
          <el-date-picker class="picker" v-model="selectData2" type="datetimerange" unlink-panels
            range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"
            :value-format="'yyyy-MM-dd HH:mm:ss'" @change="selectTime2">
          </el-date-picker>

          <el-button type="button" size="medium" @click="resetTableData2">重置</el-button>
        </div>
        <el-table-column slot="status" :label="$t('Assets.状态')" min-width="120">
          <template slot-scope="{row}">
            <el-tag type="primary" class="primary" v-if="row.status === 1">待审核</el-tag>
            <el-tag type="success" class="success" v-else-if="row.status === 0">成功</el-tag>
            <el-tag type="success" class="success" v-else-if="row.status === 2">审核通过</el-tag>
            <el-tag type="danger" class="danger" v-else-if="row.status === 3">审核拒绝</el-tag>
            <el-tag type="success" class="success" v-else-if="row.status === 4">转账中</el-tag>
            <el-tag type="danger" class="danger" v-else-if="row.status === 5">未接收</el-tag>
            <el-tag type="danger" class="danger" v-else>失败</el-tag>
          </template>
        </el-table-column>
      </ElTable>

      <ElTable ref="ElTable" tableSize="small" :tableData="tableData3" :tableColumnData="tableColumnData3"
        :totalCount="totalCount3" :totalPageSize="params3.pageSize" :needTableHeight="false"
        @refreshTableChange="refreshTableData3" @handleCurrentChange="handleCurrentChange3" v-show="currentTab === 1">
      
        <el-table-column slot="gameType" label="游戏类型" min-width="160">
          <template slot-scope="{row}">
            {{ gameType[row.gameType] }}
          </template>
        </el-table-column>
        <el-table-column slot="game" label="游戏" min-width="160">
          <template slot-scope="{row}" >
            <template v-if="row.imageUrl">
              <el-image :src="row.imageUrl.includes('http') ? row.imageUrl : 'http' + row.imageUrl" style="height: 80px;"></el-image>
            </template>
            <template v-else>
              <el-image :src="require(`../../../assets/img/game/${row.gameType}-${row.productId}.png`)" style="height: 80px;"></el-image>
            </template>
          </template>
        </el-table-column>
      </ElTable>

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { UserStore } from "@/store/private/user";
import { localData } from "@/filters/storage";
import { Save } from "@icon-park/vue";
import ElTable from "@/components/ElTable/index.vue";
import { TicketOne, Gift } from "@icon-park/vue";
import dayjs from "dayjs";
import {
  webGetAdminQueryUserList,
  queryMemberReport,
  queryMemGameRecords,
  queryAssetsRecords
} from "@/api/index";
import { MessageTips } from "@/filters/MessageTips";

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();
let currentDay = new Date().getDate();

let monthFirstDay = dayjs(new Date(currentYear + '-' + (currentMonth)  + '-01')).format('YYYY-MM-DD HH:mm:ss');

let time = `${currentYear}-${currentMonth}-${currentDay}`;
let startTime = monthFirstDay;
let endTime = dayjs(time + '23:59:59').format('YYYY-MM-DD HH:mm:ss');

@Component({
  name: "CardList",
  components: {
    Save,
    ElTable,
    TicketOne,
    Gift
  },
})
export default class CardList extends Vue {
  vm = window["vm"];
  currentPage: number = 1;
  loadingType: boolean = false;

  tableHeight: string = "";
  pageCount: number = 7;


  userInfo: any = {};
  remark: string = "";

  tableData2: any[] = [];
  tableColumnData2 = [
    { prop: "id", label: "ID", width: "160" },
    { prop: "amount", label: "数量", width: "140" },
    { prop: "recordType", label: "记录类型", width: "140" },
    { slot: "status" },
    { prop: "createTime", label: "创建时间", width: "160" },
  ];
  totalCount2 = 0;
  totalCount3 = 0;

  params = {
    userId: "",
    startTime: startTime, 
    endTime: endTime 
  };

  params2 = {
    page: 1,
    pageSize: 14,
  };

  params3 = {
    page: 1, 
    pageSize: 14,
  };

  currentTab: number = 1;
  memberReport: any = {};
  tableData3: any[] = [];
  tableColumnData3 = [
    { prop: "id", label: 'ID', width: "160" },
    { slot: "gameType", width: "160" },
    { slot: "game", width: "160" },
    { prop: "changeType", label: '类型', width: "160" },
    { prop: "txAmount", label: '金额', width: "160" },
    { prop: "createTime", label: '创建时间', width: "160" },
  ];

  selectData = [
    startTime,
    endTime
  ]

  selectData2 = [
    startTime,
    endTime
  ]

  userName: string = '';

  gameType = {
    '1': '老虎机',
    '2': '真人娱乐场',
    '3': '体育博彩'
  }

  gameName = {
    '1': {
      '1002': 'Evolution Gaming',
      '1003': 'All Bet',
      '1022': 'Sexy Gaming',
      '1001': 'Asia Gaming',
      '1011': 'Play Tech',
    },
    '2': {},
    '3': {},
  }

  created() {
    this.params.userId = this.$route.params.id;
    console.log('userId :>> ', this.$route.params.id);
    // this.getTableData(this.$route.params.id);
    this.userName = this.$route.params.userName;
    this.getMemberReport();
    this.initGetDataList();
    this.getGameRecordsReport();
  }

  getReport() {
    this.getMemberReport();
    this.initGetDataList();
    this.getGameRecordsReport();
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
    
    this.getMemberReport();
    this.initGetDataList();
    this.getGameRecordsReport();
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

  selectTime(val) {
    this.params['startTime'] = val[0];
    this.params['endTime'] = val[1];
    this.params2['startTime'] = val[0];
    this.params2['endTime'] = val[1];

    

    this.getMemberReport();
    this.initGetDataList();
    this.getGameRecordsReport();
  }

  selectTime2(val) {
    this.params2['startTime'] = val[0];
    this.params2['endTime'] = val[1];
    
    this.initGetDataList();
  }

  async getMemberReport() {
    const { data } = await queryMemberReport({
      ...this.params
    });
    console.log('queryMemberReport :>> ', data.data);
    if (data.code === 20000) {
      this.memberReport = data.data;
    }
  }
  async getGameRecordsReport() {
    const { data } = await queryMemGameRecords({
      ...this.params,
      ...this.params3
    });
    console.log('queryMemGameRecords :>> ', data.data);
    if (data.code === 20000) {
      let { records, total } = data.data;
      this.tableData3 = records;
      this.totalCount3 = total;
    }
  }

  // 查询
  async getTableData(userId) {
    const { data } = await webGetAdminQueryUserList({
      userId,
      page: 1,
      pageSize: 14
    });
    if (data.code === 20000) {
      let { records } = data.data;
      console.log('records[0] :>> ', records[0]);
      this.userInfo = records[0];
    }
  }

  // 刷新数据
  refreshTableData() {
    this.initGetDataList();
  }

  refreshTableData3() {
    this.getGameRecordsReport();
  }

  // 分页
  handleCurrentChange(val) {
    this.params2.page = val;
    this.initGetDataList();
  }
  // 分页
  handleCurrentChange3(val) {
    this.params3.page = val;
    this.getGameRecordsReport();
  }

  // 查询
  async initGetDataList() {
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

  jumpApiPage(id) {
    this.$router.push({
      path: '/opera/mega',
      query: {
        code: id
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.tabs {
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

.v-list-card {
  box-sizing: border-box;
  padding: 10px 10px 0;
  overflow: hidden;
  overflow-y: auto;

  .v-card-item {
    background: #fff;
    border-radius: 3px;

    .v-card-hd {
      box-sizing: border-box;
      padding: 10px;
      text-align: center;

      .el-dropdown-link {
        div {
          padding: 10px 40px;
          border-radius: 20px;
          color: #fff;

          &.success {
            background: #67c23a;
          }

          &.primary {
            background: $defaultColor;
          }

          &.danger {
            background: #f56c6c;
          }
        }
      }

      .v-card-hd-title {
        color: #607d8b;
      }

      .amount {
        font-weight: 600;
        font-size: 18px;
        margin-top: 10px;

        &.win {
          color: #43a047;
        }

        &.lose {
          color: #e53935;
        }
      }
    }

    .v-card-bd {
      border-top: 1px solid rgb(219, 219, 219);

      .v-card-bd-item {
        line-height: 32px;

        .label {
          padding: 3px 0;
          box-sizing: border-box;
          width: 30%;
          text-align: center;
          background: rgb(241, 244, 245);
          color: #546e7a !important;
          font-weight: 600;
          border-right: 1px solid rgb(219, 219, 219);
        }

        .value {
          padding: 3px 0;
          box-sizing: border-box;
          width: 70%;
          text-align: center;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;

          &.userColor {
            color: #009688;
            font-weight: 600;
          }

          &.right {
            text-align: right;
            padding-right: 10px;
          }
          &.center {
            text-align: center;
          }

          &.success {
            color: #43a047;
            font-size: 18px;
            font-weight: bold;
          }

          &.danger {
            color: #e53935;
            font-size: 18px;
            font-weight: bold;
          }

          &.warning {
            color: #f57c00;
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }

    .v-card-ft {
      border-top: 1px solid rgb(219, 219, 219);

      .v-label {
        box-sizing: border-box;
        padding-right: 10px;
        background: rgb(241, 244, 245);
        border-bottom: 1px solid rgb(219, 219, 219);

        .label-text {
          padding: 3px 0;
          box-sizing: border-box;
          width: 30%;
          text-align: center;
          background: rgb(241, 244, 245);
          color: #546e7a !important;
          font-weight: 600;
        }
      }

      .v-input {
        padding: 10px;
      }
    }
  }
}

.v-btn {
  height: auto;
  line-height: 1;
  padding: 0;
  margin-left: 10px;
  font-size: 16px;
  font-weight: 600;
}

.v-bonus-item {
  box-sizing: border-box;
  margin-top: 10px;
  // padding: 10px;
  background: #fff;
  border: 1px solid #e53935 !important;
  border-radius: 3px;

  .v-sign {
    padding: 10px 10px;
    border-bottom: 1px solid #e6ebec;
  }

  .v-title {
    padding: 10px 10px;
    color: #546e7a !important;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #e6ebec;
  }

  .v-point {
    border-bottom: 1px solid #e6ebec;

    .v-label {
      box-sizing: border-box;
      padding: 10px 10px;
      width: 35%;
      border-right: 1px solid #e6ebec;
      color: #546e7a !important;
      // background: #90a4ae;
    }

    .v-value {
      box-sizing: border-box;
      padding: 10px 10px;
      width: 35%;
      text-align: right;
      border-right: 1px solid #e6ebec;

    }

    .v-btn {
      margin-left: 0;
      box-sizing: border-box;
      padding: 10px 10px;
      width: 30%;
      height: 100%;
      background: #90a4ae !important;
      border-radius: 0;
      border-color: #90a4ae !important;
      color: #fff;
      font-size: 14px;
      line-height: 1;
    }
  }
}
</style>
