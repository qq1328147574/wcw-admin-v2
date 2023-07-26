<template>
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-table-column slot="tableSlotSuccess" :label="$t('System.状态')" min-width="140">
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" size="mini" type="success">{{ $t("System.成功") }}</el-tag>
          <el-tag v-else size="mini" type="info" >{{ $t("System.失败") }}</el-tag >
        </template>
      </el-table-column>
      <el-table-column slot="tableSlotUserType" :label="$t('System.操作人类型')" min-width="140">
        <template slot-scope="{row}">
          {{operatorType[row.operatorType]}}
        </template>
      </el-table-column>
      <el-table-column slot="tableSlotType" :label="$t('System.操作类型')" min-width="140">
        <template slot-scope="{row}">
          {{typeList[row.businessType]}}
        </template>
      </el-table-column>
    </ElTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { FormatCurrentTime } from '@/filters/common';
import {
  webGetAdminSystemLogList,
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
  logType: number
};
@Component({
  components: {
    ElTable,
  },
})
export default class SystemLogList extends Vue {
  private vm = window['vm'];
  
  private tableData = []; 
  private tableColumnData: Array<object> = [
    { prop: "createBy", label: this.vm.$t('System.操作人'), width: "140" },
    { slot: "tableSlotUserType",  },
    { slot: "tableSlotType" },
    { prop: "title", label: this.vm.$t('System.操作模块'), width: "140" },
    { slot: "tableSlotSuccess" },
    { prop: "operationUrl", label: 'URL', width: "220" },
    { prop: "method", label: this.vm.$t('System.请求方法'), width: "220" },
    { prop: "createTime", label: this.vm.$t('System.访问时间'), width: "160" },
  ];
  private totalCount: number = 0;
  private param:IndexData = {
    page: 1,
    pageSize: 12,
    logType: 2
  };
  typeList = {
    1: '查询',
    2: '新增',
    3: '修改',
    4: '删除',
    5: '导出',
    6: '导入',
    7: '生成',
    8: '清空数据',
  }
  operatorType = {
    1: '其他',
    2: '后台用户',
    3: '前台用户'
  }

  created() {
    this.initGetDataList();
  }

  mounted() {}

  // 重置
  resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 刷新数据
  refreshTableData() {
    this.initGetDataList();
  }

  handleCurrentChange(val) {
    this.param.page = val
    this.refreshTableData();
    // console.log(this.param);
  }

   /**
   * @description 查询列表
   */
  private async initGetDataList(searchData: object = {}) {
    const {data: res} = await webGetAdminSystemLogList({
      ...this.param,
      ...searchData
    });

    // console.log(res);
    if(res.code === 20000 ) {
      let lists = res.data;
      if(lists.records) {
        this.tableData = lists.records;
        this.totalCount = lists.total;
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.v-form-box {
  padding: 15px 0;
  .v-btn-box {min-width: 205px; margin-top: 30px;text-align: center;}
}
</style>
