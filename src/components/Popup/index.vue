<template>
  <div class="popup" :class="{ 'popup-position': popupPosition }" v-if="value">
    <i class="el-icon-close popup-close" @click="closePopup"></i>
    <div class="popup-content">
      <div class="title">
        {{title}}
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class PopupIndex extends Vue {
  private popupPosition: boolean = false; // 弹出
  @Prop({ default: '' }) title: string; 
  @Prop({ default: false }) value: boolean; // 显示隐藏
  @Watch("value")
  onValueChange(newVal) {
    if(newVal) {
      setTimeout(()=>{
        this.popupPosition = true;
      })
    }
  }
  created() {}

  mounted() {
  }

  private closePopup() {
    this.popupPosition = false;
    setTimeout(()=>{
      this.$emit("input", false);
    }, 500)
  }
}
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  bottom: -500px;
  right: 30px;
  width: 300px;
  height: 450px;
  background: #fff;
  box-shadow: 0 0 10px #eeeeee;
  border-radius: 15px;
  z-index: 2000;
  transition: 0.5s;
  &.popup-position {
    bottom: 46px;
  }
  &-close {
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
    &:hover{
      color: $defaultColor;
    }
  }
  &-content{
    padding: 15px;
    .title{
      color: #666666;
      margin-bottom: 10px;
    }
  }
}
</style>
