<template>
  <div>
    <LiveWithdraw :drawMoneyCount="drawMoneyCount" :count="count" @change="changeAudioVolume" v-model="volume"></LiveWithdraw>
    <LiveRecharge :rechargeCount="rechargeCount" :count="count" @change="changeAudioVolume" v-model="volume"></LiveRecharge>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from "vue-property-decorator";
import LiveRecharge from './liveRecharge.vue';
import LiveWithdraw from './liveWithdraw.vue';
import { checkBankNotExamineOrder } from '@/api';


@Component({
  components: {
    LiveRecharge,
    LiveWithdraw
  }
})
export default class Test extends Vue { 
  
  timer: any = null;
  count: number = 10;

  rechargeCount: number = 0;
  drawMoneyCount: number = 0;

  noticeAudio: any = null;

  volume: number = 0.5;

  created(){    
    let volume = localStorage.getItem('volume');
    this.volume = volume ? Number(volume) : 0.5;

    // this.queryTodayReport();

  }

  mounted() {
    let volume = localStorage.getItem('volume');

    let noticeAudio = new Audio();
    let src = require("../../..//assets/wav/notice.wav");//通过require引入音频
    noticeAudio.src = src;
    noticeAudio.volume = this.volume;

    this.noticeAudio = noticeAudio;

    this.startCheckStatus();
  }

  
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  }

  changeAudioVolume(value) {
    this.noticeAudio.volume = value;
    localStorage.setItem('volume', value);
  }

  startCheckStatus() {
    this.onGetCheckStatus();
    this.timer = setInterval(()=> {
      this.count--;
      if(this.count < 0) {
        this.count = 10;
        this.onGetCheckStatus();
      }
    }, 1000)
  }
  
  lastCount:any = {
    drawMoneyCount: '',
    rechargeCount: ''
  };
  async onGetCheckStatus() {
    const { data } = await checkBankNotExamineOrder({ notLoading: true });
    if( data.code === 20000 ) {

      console.log('checkBankNotExamineOrder :>> ', data.data);
      let { drawMoneyCount, rechargeCount } = data.data;

      if(drawMoneyCount != 0) {
        this.drawMoneyCount += 1;
      }

      if(rechargeCount != 0) {
        this.rechargeCount += 1;
      }

      this.lastCount = {
        drawMoneyCount,
        rechargeCount
      }

      if(drawMoneyCount > 0 || rechargeCount > 0) {
        this.noticeAudio.play();
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
