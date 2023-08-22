<!-- 兑换记录 -->
<template>
  <div class="pages">
    <Search
      :formColumnData="formSearchOptions"
      @result="handleSearchClick"
      @reset="resetTableData"
    >
    </Search>
    <ElTable
      ref="ElTable"
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
      @getExportExcelDataClick="getExportExcelDataClick"
    >
      <el-table-column
        slot="status"
        label="状态"
        align="center"
        min-width="140"
      >
        <template slot-scope="{ row }">
          <el-tag type="primary" class="primary" v-if="row.status === 1">待审核</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 0">成功</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 2">审核通过</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status === 3">审核拒绝</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 4">转账中</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status === 5">未接收</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status == -1">失败</el-tag>
        </template>
      </el-table-column>
    </ElTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CommonStore } from "@/store/private/common";
import ElTable from "@/components/ElTable/index.vue";
import { webGetPerformanceList } from "@/api";
import { UserStore } from "@/store/private/user";
@Component({
  components: {
    ElTable,
  },
})
export default class Name extends Vue {
  vm = window["vm"];
  tableData: any[] = []; //
  tableColumnData = [
    // { prop: "userId", label: '用户ID', width: "140" },
    { prop: "userName", label: this.vm.$t("Users.用户名"), width: "140" },
    { prop: "daily", label: "今日业绩", width: "140" },
    { prop: "weekly", label: "本周业绩", width: "140" },
  ];
  totalCount: number = 0;
  param: any = { page: 1, pageSize: 14 };

  recordType: any = {};
  recordsOptions: any[] = [];
  recordsSearch: any[] = [];

  // 搜索项配置
  get formSearchOptions() {
    return [
      { key: "userName", type: "input", label: "用户名" },
      { key: "phone", type: "input", label: "电话" },
      { key: "startTime", type: "time", label: "开始日期", placeholder: "请选择", },
      { key: "endTime", type: "time", label: "结束日期", placeholder: "请选择" },
    ];
  }

  get getCoinName() {
    return CommonStore.getCoinName;
  }

  get wallerTypeList() {
    let list: any = [];

    Object.keys(this.getCoinName).forEach((key) => {
      list.push({
        label: this.getCoinName[key],
        value: key,
      });
    });

    return list;
  }

  created() {
    this.getTableData();
  }

  onCascaderChange(val) {
    // console.log(val);

    this.recordsSearch = [];
    val.forEach((item) => {
      this.recordsSearch.push(item[0]);
    });
  }

  // 重置搜索
  resetTableData() {
    let ref: any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param = { page: 1, pageSize: 14 };
    this.recordsSearch = [];
    this.getTableData();
  }

  // 搜索
  handleSearchClick(val) {
    let { offline, userName } = val;
    if (offline && !userName) {
      this.$message.error("请输入用户名");
      return;
    }

    // 重置搜索为第一页
    let ref: any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    Object.assign(this.param, val);
    this.getTableData();
  }

  // 刷新数据
  refreshTableData() {
    this.getTableData();
  }

  // 分页
  handleCurrentChange(val) {
    this.param.page = val;
    this.getTableData();
  }

  // 查询
  async getTableData() {
    const { data: res } = await webGetPerformanceList({
      ...this.param,
      sortMap: { create_time: "desc" },
      recordType: "",
    });
    console.log('webGetPerformanceList :>> ', res);
    if (res.code === 20000) {
      this.tableData = res.data.records;
      this.totalCount = res.data.total;
    }
  }

  async getExportExcelDataClick(param) {
    const { data: res } = await webGetPerformanceList({
      ...this.param,
      sortMap: { create_time: "desc" },
      list: this.recordsSearch,
      ...param,
    });
    if (res.code === 20000) {
      let list = res.data.records;
      UserStore.storeExportExcelsMap(list);
    }
  }
}
</script>
<style lang='scss' scoped></style>