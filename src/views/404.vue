<template>
  <div class="page">
    <div class="ivu-img-box">
      <img src="@/assets/img/icon-404_bg.png" alt="404.png">
    </div>
    <div class="ivu-ahover">
      <div class="ahover" @click="onBtnClick">{{ $t("Common.返回上一级") }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Inject, Provide, Emit, Prop, Vue, Watch } from "vue-property-decorator";
import { localData } from "@/filters/storage";

@Component({
  components: {
  },
})
export default class Index extends Vue {
  mounted () {}
  created () {
 
  }

  onBtnClick() {
    this.$router.replace('/');
  }
}
</script>


<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #1d8eb1;
  .ivu-ahover {
    padding: 35px 0;
    text-align: center;
    .ahover {
      z-index: 1;
      position: relative;
      display: inline-block;
      padding: 10px 35px;
      opacity: .8;
      overflow: hidden;
      border: 1px solid #fff;
      border-radius: 5px;
      letter-spacing: 1px;
      color: #fff !important;
      transition: all .3s ease-in-out;
      &::before {
        content: ' ';
        z-index: -1;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 0;
        background-color: #f1f1f1;
        transition: all .3s ease-in-out;
      }
      &:hover {
        opacity: 1;
        box-shadow: 0 6px 10px rgba(2, 70, 90, .8);
        color: #333 !important;
        transform: translateY(8px);
      }
      &:hover::before {
        width: 100%;
      }
    }
  }
  .ivu-img-box {
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
@media screen and (max-width: 768px) {
  .ivu-img-box {
    height: 40%;
  }
}
</style>