<!-- 组件用途 -->
<template>
  <div style="margin: 20px 0;">
    <el-row>
      <!-- <el-col :span="12">
        <div class="available">
          <div class="title">{{ $t('Home.当前余额') }} RM</div>
          <div class="amount">{{ getAssetsList }}</div>
        </div>
      </el-col> -->
      <el-col :span="12" >
        <div class="mega-amount white-bg">
          <div class="title">Mega888 {{ $t('Assets.余额') }}</div>
          <div class="amount">{{ megaBalance }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { CommonStore } from '@/store/private/common';
import { 
  megaUerBalance,
} from "@/api";

@Component
export default class Name extends Vue {
  @Prop({default: ''}) userId: string;

  megaBalance = 0;
  created() {
    this.onGetMegaBalance();
  }

  async onGetMegaBalance() {
    console.log('this.userId :>> ', this.userId);
    const { data } = await megaUerBalance({
      userId: this.userId
    });
    if(data.code === 20000) {
      // console.log('pussyGetCloudInfo :>> ', data.data);
      this.megaBalance = data.data;
    }
  }

  jumpPage(path) {
    this.$router.push(path);
  }
}
</script>
<style lang='scss' scoped>
.available {
  background: linear-gradient(180deg, #e9d195, #8c713d);
  border-radius: 10px 0 0 10px;
  padding: 15px;
  color: #fff;
  border: 1px solid transparent;
  .title {
    font-size: 14px;
  }
  .amount {
    margin-top: 10px;
    font-size: 32px;
    text-align: center;
  }
}

.mega-amount {
  border: 1px solid #b1861c;
  border-radius: 0 10px 10px 0;
  padding: 15px;
  
  .title {
    font-size: 14px;
  }
  .amount {
    margin-top: 10px;
    font-size: 32px;
    text-align: center;
  }
}
</style>