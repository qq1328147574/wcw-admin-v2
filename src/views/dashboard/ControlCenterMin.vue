<template>
  <div class="pages flex align-center justify-center">
    <div class="v-img-box">
      <img src="@/assets/img/icon-welcome.png" alt="home.png" class="v-img reveal-top">
    </div>
  </div>
</template>

<script lang="ts">
import scrollReveal from 'scrollreveal';
import countTo from 'vue-count-to';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { scrollRevealEffect } from '@/filters/common';
import { sessionData } from '@/filters/storage';


@Component({
  components: {
    countTo,
  },
})
export default class ControlCenter extends Vue {
  // 动画
  scrollReveal = scrollReveal();
  
  userInfoStatistic: object = {
    sameDayRegistrationNums: 0,
    registerNums: 0,
    limitNums: 0,
    kycNums: 0,
    activeNums: 0
  };
  startVal:number = 0;
  activeTabsName:string = '1';
  userInfoAssets: object = {};

  formData = {
    startTime: '',
    endTime: ''
  }
  btnLoading: boolean = false;

  status: boolean = true;

  // 生命周期
  created() {
  };

  // 生命周期
  mounted () {
    let revealTop = scrollRevealEffect(400, 'top', false, false, '300px');
    this.scrollReveal.reveal('.reveal-top', revealTop);
  };
}
</script>
<style lang="scss" scoped>
.pages {
  height: 100%;
}
</style>
