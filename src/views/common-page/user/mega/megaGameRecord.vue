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

    <div class="record-btn flex align-center justify-center">
      <a :href="url" target="_blank" v-if="url">
        <el-button type="primary" size="small">{{ $t('Seconds.查看记录') }}</el-button>
      </a>
      <div v-else>
        {{ $t('Seconds.选择时间查询数据') }}
      </div>
    </div>

    <Calendar :min-date="minDate" v-model="show" type="range" @confirm="onConfirm" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { getMegaUerGameRecords  } from '@/api';
import { Calendar } from 'vant';
import dayjs from 'dayjs';
@Component({
  components: {
    Calendar
  }
})
export default class Name extends Vue {
  @Prop({default: ''}) userId: string;
  params = {
    endTime: '',
    startTime: '',
  }
  // total: number = 0;
  // loading: boolean = false;
  // finished: boolean = false;

  // orderList: any[] = [];
  assetsTypeObj: any = {};

  show: boolean = false;
  minDate = new Date('2010-01-01 00:00:00');

  loadingData: boolean = false;

  url: string = '';
  
  created() {
  }

  onConfirm(val) {
    this.show = false;
    this.params.startTime = dayjs(val[0]).format('YYYY-MM-DD HH:mm:ss');
    this.params.endTime = dayjs(val[1]).format('YYYY-MM-DD HH:mm:ss');
  }

  getTimeData() {
    if(this.params.startTime && this.params.endTime) {
      this.getBetOrder();
    } else {
      this.$message.error('请选择时间');
    }
  }

  async getBetOrder() {
    this.loadingData = true;
    let winRef: any = window.open("", "_blank");
    const { data } = await getMegaUerGameRecords({...this.params, userId: this.userId});
    
    // console.log('data :>> ', data);
    this.loadingData = false;
    if(data.code === 20000) {
      this.url = data.data;
      winRef.location = data.data;
    } else {
      this.$message.error(data.message);
      winRef.close();
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