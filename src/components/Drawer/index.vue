<template>
  <el-drawer
    class="v-drawer-wrap"
    title=""
    :visible.sync="value"
    :direction="directionType"
    :modal="modalType"
    :destroy-on-close="true"
    :show-close="false"
    :with-header="false"
    :wrapperClosable="wrapperClosableType"
    :before-close="beforeClose"
  >
    <div class="drawer-content" @click.stop>
      <div class="v-title">
        <div class="title" v-if="title">{{title}}</div>
        <div class="close-icon" @click="closeDrawer">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <!-- 自定义 -->
      <slot>
        
      </slot>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from "vue-property-decorator";
import EventBus from '@/utils/Event';

type CloseType = {
  close: boolean
};
@Component({
  name: 'DrawerIndex'
})
export default class extends Vue {
  vm = window['vm'];

  @Prop({default: false }) value!: boolean; // 打开状态
  @Prop({default: ''}) title?: string;
  @Prop({default: 'btt'}) directionType?: string;          //  打开的方向
  @Prop({default: false }) wrapperClosableType?: boolean; // 点击遮罩层是否可以关闭
  @Prop({default: false }) modalType?: boolean;           // 是否需要遮罩层

  // @Provide 传递同级组件的值 -状态
  @Provide('ComponentCloseType') ComponentCloseType: CloseType = {
    close: true
  } 
  
  contentInfo: {
    height: string;
    left: string;
    top: string;
  } = {
    height: "",
    left: "",
    top: "",
  };

  // 是否显示 Drawer
  @Watch("value")
  onWatchValueChange(newVal) {
    // this.ComponentCloseType.close = newVal;
    // console.log(`Drawer ${newVal}`);
  }
  
  created() {}

  mounted() {
    this.getEleInfo();
    // on 监听计算 windowOnResize 页面宽度, emit 触发事件
    // EventBus.$on('windowOnResize', this.getEleInfo);
    window.addEventListener('resize', ()=> {
      this.getEleInfo();
    });
  }

  destroyed() {
    // 组件关闭后取消监听 window 尺寸
    EventBus.$off('windowOnResize');
  }
  
  /**
   * @description: 获取标签元素信息，宽高适应
   * @param {*} querySelector 获取标签
   * @return
   */
  getEleInfo() {
    const _that: any = this;
    let el0: any = document.querySelector("#base-content");
    let el0s: any = document.querySelector(".v-drawer-wrap");
    let info = el0.getBoundingClientRect();

    if(_that.currentWindow) {
      el0s.style.width = info.width + "px";
      el0s.style.height = info.height + "px";
      el0s.style.top = info.top + "px";
      el0s.style.left = info.left + "px";
    }
  }

  /**
   * @description: 关闭窗口
   * @param {*} input 关闭值，v-model - visible.sync
   * @param {*} close 传值
   * @return {*}
   */
  closeDrawer() {
    this.$emit('close');
    this.$emit("input", false);
  }

  // 关闭前的回调
  beforeClose() {
    // console.log(1);
  }
}
</script>

<style lang="scss" scoped>

::v-deep .el-drawer {
  height: 100% !important;
  box-shadow: 0 0 0 0 transparent !important;
}
.content-mask {
  width: 100%;
  height: 100%;
}
.drawer-content {
  padding: 16px 20px 20px;
}
.title{
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #666;
}

.close-icon{
  z-index: 1000;
  position: absolute;
  right: 30px;
  top: 15px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 20px;
  text-align: center;
  border-radius: 100%;
  box-shadow: 0 0 10px #999;
  color: #fff;
  background-color: $defaultColor;
  cursor: pointer;
  &:hover {
    color: red;
  }
}
</style>
