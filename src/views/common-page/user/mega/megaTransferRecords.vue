<!-- 组件用途 -->
<template>
  <div>
    <div class="time flex">
      <div class="flex align-center">
        <el-date-picker class="picker" type="datetimerange" unlink-panels range-separator="-"
          :start-placeholder="$t('Report.开始时间')" :end-placeholder="$t('Report.结束时间')"
          :value-format="'yyyy-MM-dd HH:mm:ss'" @change="getTimeData">
        </el-date-picker>
      </div>
      <el-button style="margin-left: 10px;" type="primary" size="small" @click="getTimeData" :loading="loadingData">{{
        $t('Seconds.查询') }}</el-button>
    </div>
    <div
      finished-text="没有更多了"
      style="min-height: 200px"
    >
      <div v-for="(item, index) in orderList" :key="index">
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">{{ $t('Seconds.订单') }}</div>
          <div class="v-value">{{ item.bizId }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">{{ $t('Seconds.时间') }}</div>
          <div class="v-value">{{ item.operateTime }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">{{ $t('Seconds.类型') }}</div>
          <div class="v-value text-red">
            {{ item.amount > 0 ? $t('Seconds.转入') : $t('Seconds.转出') }}
          </div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">{{ $t('Seconds.金额') }}</div>
          <div class="v-value text-red">{{ item.amount }}</div>
        </div>
      </div>

      <div style="text-align: center;" v-if="total == 0">{{ $t('Common.暂无数据') }}</div>

      <div class="flex justify-center">
        <el-pagination
          style="margin: 20px auto"
          layout="prev, pager, next"
          background
          hide-on-single-page
          :page-size="params.pageSize"
          :total="total"
          :pager-count="5"
          @current-change="onPageChange"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { getMegaTransferRecords } from "@/api";
import { List, Cell, Calendar } from "vant";
import dayjs from "dayjs";
@Component({
  components: {
    List,
    Cell,
    Calendar,
  },
})
export default class Name extends Vue {
  @Prop({default: ''}) userId: string;
  params = {
    endTime: "",
    startTime: "",
    pageIndex: 1,
    pageSize: 15,
    sortHint: "desc",
    bizId: "",
  };
  total: number = 0;
  loading: boolean = false;
  finished: boolean = false;

  orderList: any[] = [];
  assetsTypeObj: any = {};

  show: boolean = false;
  minDate = new Date("2010-01-01 00:00:00");

  loadingData: boolean = false;

  created() {
    this.getBetOrder();
  }

  onConfirm(val) {
    this.show = false;
    this.params.startTime = dayjs(val[0]).format("YYYY-MM-DD HH:mm:ss");
    this.params.endTime = dayjs(val[1]).format("YYYY-MM-DD HH:mm:ss");
  }

  getTimeData() {
    this.params.pageIndex = 1;
    this.loadingData = true;
    this.loading = true;
    this.getBetOrder();
  }


  onPageChange(page) {
    this.params.pageIndex = page;
    this.getBetOrder();
  }

  async getBetOrder() {
    const { data } = await getMegaTransferRecords({...this.params, userId: this.userId});
    this.loadingData = false;
    this.loading = false;
    console.log("data.data :>> ", data.data);
    if (data.code === 20000) {
      let { items: records, total } = data.data;
      this.total = total - 0;
      this.orderList = records;
    }
  }
}
</script>
<style lang='scss' scoped>
.van-cell {
  border-radius: 12px;
  border: 1px solid #e9e9e9;
  margin-bottom: 20px;
}
.v-list-item {
  padding: 7px 15px;
  .v-value {
    color: #000;
    font-weight: bold;
  }
  .text-red {
    color: #0d2943;
  }
}

.time {
  margin-bottom: 20px;
  color: #000;
  .start,
  .end {
    margin-right: 50px;
    padding: 7px 0;
    width: 160px;
    // border: 1px solid #ced4da;
    background: linear-gradient(180deg, #e9d195, #8c713d);
    border-radius: 3px;
    text-align: center;
  }
  .to {
    margin-right: 50px;
    color: #fff;
  }
}

.record-btn {
  min-height: 200px;
}

::v-deep .van-calendar__day {
  color: #000;
}
::v-deep .van-calendar__header {
  color: #000 !important;
}

.search-input {
  width: 100%;
  padding-right: 20px;
}

@media screen and (max-width: 768px) {
  .time {
    .start,
    .end {
      margin-right: 20px;
      width: 120px;
    }
    .to {
      margin-right: 20px;
    }
  }

  .search-input {
    margin-bottom: 20px;
  }
}
</style>