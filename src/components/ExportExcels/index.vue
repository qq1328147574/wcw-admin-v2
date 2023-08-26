<template>
  <div class="v-excel-main">
    <el-dialog
      @close="onDialogClose"
      :append-to-body="true"
      :visible.sync="dialogFormVisible">
      <div slot="title" class="el-dialog__title">{{ $t('Common.导出') }}</div>
      <div class="v-form-box">
        <el-row>
          <el-col :span="24" v-if="dialogFormType">
            <el-form
              ref="ruleForm"
              label-width="140px"
              class="demo-ruleForm"
              label-position="top"
              :rules="rules"
              :model="formData"
            >
              <el-form-item :label="$t('Common.起始页')" prop="page" >
                <el-input type="number" v-model="formData.page" size="medium"></el-input>
              </el-form-item>
              <el-form-item :label="$t('Common.总条数')" prop="pageSize" >
                <el-input type="number" v-model="formData.pageSize" size="medium"></el-input>
                <p style="padding-top: 15px;color: #999;line-height: 1.45;"><i class="el-icon-info"></i> {{ $t('Common.您可在分页处看到总条数') }}</p>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" v-else>
            <div class="v-text">
              <span><i class="el-icon-circle-check" style="font-size: 24px; color: #67c23a"></i></span>
              <span>{{ $t('Common.获取数据成功') }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')" v-if="dialogFormType">{{ $t('Common.确定') }}</el-button>
        <el-button type="primary" 
          @click="onExportExcel"  
          icon="el-icon-download"
          class="v-btn-rd" 
          :loading="loadingType" 
          v-else >{{ $t('Common.立即导出') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Provide, Vue, Watch, Prop } from 'vue-property-decorator';
import { localData } from '@/filters/storage';
import { UserStore } from '@/store/private/user';

type IndexData = {
  page: number;
  pageSize: number
};
@Component({
  components: {},
})
export default class ExportExcels extends Vue {
  // @Prop({ default: [] }) excelsTableData: Array<object> = [];     // 表格数据
  @Prop({ default: [] }) excelsTableHeader: Array<object> = [];   // 表格头
  @Prop({ default: [] }) excelsFilterVal: Array<object> = [];     // 表格参数
  @Prop({ default: '' }) excelsName: string = '';

  excelsTableData: Array<object> = [];
  // 分页器
  formData: IndexData = {
    page: 1,
    pageSize: 40
  };
  rules = {
    
  }
  loadingType: boolean = false;
  dialogFormVisible: boolean = false;
  dialogFormType: boolean = true;

  // 获取数据
  get getExportExcelsList() {
    return UserStore.getExportExcelsList
  };

  // 监听数据列表
  @Watch('getExportExcelsList', { deep: true })
  userPageChange(newValue) {
    // console.log(newValue)
    if(newValue.length > 0) {
      if(newValue[0].ids === 0) {
        this.dialogFormVisible = true;
        this.dialogFormType = true;

      } else {  // 有数据
        this.dialogFormVisible = true;
        this.dialogFormType = false;
        this.excelsTableData = newValue;
      }
    }
  };

  // 生命周期
  mounted () {};

  onDialogClose() {
    this.excelsTableData = [];
    this.dialogFormType = true;
    UserStore.storeExportExcelsMap([])
  }

  submitForm(formName: string) {
    let ref: any = this.$refs[formName]; // 类型断言的用，定义一个变量等价ref

    ref.validate((valid) => {
      if (valid) {
        this.onDialogFormClick();
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }

  onDialogFormClick() {
    this.$emit('getExportExcelInput', this.formData.page, this.formData.pageSize);
  }

  /**
   * 对导出数据格式处理
   */
  formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => v[j]));
  }

  /**
   * 导出的列表数据
   */
  onExportExcel() {
    const _that = this;
    const text1 = window['vm'].$t('Common.导出成功');
    const text2 = window['vm'].$t('Common.当前选择的数据已成功导出');

    const text = window['vm'].$t('Common.文件导出');
    const name = text + _that.excelsName;
    this.loadingType = true;

    if (_that.excelsTableData.length === 0) return
    require.ensure([], () => {
      /* eslint-disable */
      const { export_json_to_excel } = require("../../utils/excel/Export2Excel");
      /* eslint-enable  */
      // 导出的表头
      const tableHeader = _that.excelsTableHeader;
      // 导出表头要对应的数据
      const filterVal = _that.excelsFilterVal;
      const list = _that.excelsTableData;
      const tableData = _that.formatJson(filterVal, list);

      export_json_to_excel(tableHeader, tableData, name);
      this.$notify({
        title: text1,
        message: text2,
        type: 'success',
        duration: 3000,
        showClose: false,
        onClose: () => {
          this.formData.page = 1;
          this.formData.pageSize = 40;
          this.loadingType = false;
          this.dialogFormVisible = false;
        }
      });
      // console.log(tableHeader);
      // console.log(filterVal);
      // console.log(tableData);
    })
  }
}
</script>

<style lang="scss" scoped>
.v-excel-main {
  padding: 0 15px;
}
.el-input {
  width: 100%;
}
::v-deep .el-dialog__body {
  .v-text {
    padding: 30px 30px 50px;
    span {
      display: inline-block;
      vertical-align: middle;
      padding: 0 5px;
      font-weight: bold;
    }
  }
}
::v-deep .el-dialog{
  width: 40% !important;
}
@media screen and (max-width: 768px) {
  ::v-deep .el-dialog{
    width: 85% !important;
  }
}
</style>
