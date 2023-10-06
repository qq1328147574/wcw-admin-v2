<!-- 组件用途 -->
<template>
  <div>
    <div class="time flex">
      <div class="flex align-center"> 
        <el-date-picker class="picker" type="datetimerange" unlink-panels
            range-separator="-" :start-placeholder="$t('Report.开始时间')" :end-placeholder="$t('Report.结束时间')"
            :value-format="'yyyy-MM-dd HH:mm:ss'" @change="getTimeData">
          </el-date-picker>
      </div>
      <el-button style="margin-left: 10px;" type="primary" size="small" @click="getTimeData" :loading="loadingData">{{ $t('Seconds.查询') }}</el-button>
    </div>

    <div 
      finished-text="没有更多了"
      style="min-height: 400px;"
    >
      <div v-for="(item, index) in orderList" :key="index">
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">{{ $t('Seconds.订单') }}</div>
          <div class="v-value">{{ item.id }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">TableID</div>
          <div class="v-value">{{ item.TableID }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">ClassID</div>
          <div class="v-value">{{ item.ClassID }}</div>
        </div>
        
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">Bet</div>
          <div class="v-value">{{ item.bet }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">Win</div>
          <div class="v-value">{{ item.Win }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">EndBlance</div>
          <div class="v-value">{{ item.EndBlance }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">GameName</div>
          <div class="v-value">{{ item.GameName }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">EndBlance</div>
          <div class="v-value">{{ item.EndBlance }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">LineNum</div>
          <div class="v-value">{{ item.LineNum }}</div>
        </div>
        <div class="v-list-item flex align-center justify-between">
          <div class="v-label">CreateTime</div>
          <div class="v-value">{{ item.CreateTime }}</div>
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { pussyQueryUserGameLog  } from '@/api';
import dayjs from 'dayjs';
import { List, Cell, Calendar } from 'vant';
@Component({
  components: {
    Calendar,
    List,
    Cell
  }
})
export default class Name extends Vue {
  
  @Prop({default: ''}) userId: string;
  params = {
    eDate: '',
    sDate: '',
    pageIndex: 0,
    pageSize: 15,
  }
  total: number = 0;
  loading: boolean = false;
  finished: boolean = false;

  orderList: any[] = [];

  show: boolean = false;
  minDate = new Date('2010-01-01 00:00:00');

  loadingData: boolean = false;

  url: string = '';
  
  created() {
    this.onLoad();
  }

  onLoad() {
    this.params.pageIndex += 1;
    this.loadingData = true;
    this.loading = true;
    this.getBetOrder();
  }

  onConfirm(val) {
    this.show = false;
    this.params.sDate = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss');
    this.params.eDate = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss');
  }

  getTimeData() {
    if(this.params.sDate && this.params.eDate) {
      this.getBetOrder();
    } else {
      this.$message.error('请选择时间');
    }
  }

  onPageChange(page) {
    this.params.pageIndex = page;
    this.getBetOrder();
  }

  async getBetOrder() {
    this.loadingData = true;
    const { data } = await pussyQueryUserGameLog({...this.params, userId: this.userId});
    this.loadingData = false;
    this.loading = false;

    console.log('data.data :>> ', data.data);
    if(data.code === 20000) {
      let { items: records, total } = data.data;
      // console.log(records);
      if(this.params.pageIndex === 1) {
        this.orderList = records;
      } else {
        this.orderList.push(...records);
      }
      // console.log('this.orderList.length :>> ', this.orderList.length);
      if(this.orderList.length >= total) {
        this.finished = true;
      }
    } else {
      this.finished = true;
    }
  }
}
</script>
<style lang='scss' scoped>
.van-cell {
  border-radius: 12px;
  box-shadow: 0 5px 10px rgba($color: #000000, $alpha: 0.1);
  margin-bottom: 20px;
}
.v-list-item {
  padding: 7px 15px;
  .v-value {
    color: #000;
    font-weight: bold;

  }
  .text-red {
    color: #0D2943;
  }
}

.time {
  margin-bottom: 20px;
  color: #000;
  .start, .end {
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


@media screen and (max-width: 768px) {
  .time {
    .start,.end {
      margin-right: 20px;
      width: 120px;
    }
    .to {
      margin-right: 20px;
    }
  }
}
</style>