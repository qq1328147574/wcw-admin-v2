<template>
  <el-dialog
    :title="title"
    :visible.sync="value"
    :close-on-press-escape="closeOnESC"
    :before-close="handleClose"
    @close="closeDialog"
  >
    <div class="header-line"></div>
    <!-- 插槽 -->
    <div class="dialog-inner">
      <slot></slot>
    </div>
    <div class="edit-footer flex align-center justify-end">
      <el-button type="info" size="small" @click="closeDialog">取消</el-button>
      <el-button type="primary" size="small" @click="onConfirm">确认</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from "vue-property-decorator";

type CloseType = {
  close: boolean
};
@Component({})
export default class DialogIndex extends Vue {
  @Prop({ default: '' }) title: string;
  @Prop({ default: false }) value: boolean;
  @Prop({ default: true }) closeOnESC: boolean;

  // @Provide 传递同级组件的值 -状态
  @Provide('ComponentCloseType') ComponentCloseType: CloseType = {
    close: true
  } 

  // 是否显示 Dialog
  @Watch("value")
  onWatchValueChange(newVal) {
    this.ComponentCloseType.close = newVal;
    // console.log(`Dialog ${newVal}`);
  }

  created() {}
  
  /**
   * @description: 关闭窗口
   * @param {*} input 关闭值，v-model - visible.sync
   * @param {*} close 传值
   * @return {*}
   */
  closeDialog() {
    this.$emit('input', false);
    this.$emit('close');
  }

  onConfirm() {
    this.$emit('confirm');
  }

  handleClose(done) {
    if(this.value) {
      this.$confirm("确认关闭？")
      .then((_) => {
        done();
      })
      .catch((_) => {});
    } 
  }
}
</script>

<style lang="scss" scoped>


::v-deep .el-dialog{
  width: 40% !important;
}
::v-deep .el-dialog__body{
  padding: 20px;
}
.header-line {
  border-top: 1px solid rgba($color: #b0bec5, $alpha: .5);
  margin-bottom: 30px;
}

.dialog-inner {
  padding: 0 15px;
}

.edit-footer {
  margin-top: 45px;
  padding-top: 20px;
  border-top: 1px solid rgba($color: #b0bec5, $alpha: .5);
}

@media screen and (max-width: 768px) {
  ::v-deep .el-dialog{
    width: 85% !important;
  }
}
</style>
