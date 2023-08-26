<!-- 兑换记录 -->
<template>
  <div class="pages">
    <Search
      :formColumnData="formSearchOptions"
      @result="handleSearchClick"
      @reset="resetTableData"
    >
      <template slot-scope="row" slot="recordType">
        <el-cascader
          :options="recordsOptions"
          :props="{ multiple: true }"
          collapse-tags
          clearable
          @change="onCascaderChange"
          v-model="row.default['recordType']"
        >
        </el-cascader>
      </template>
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
        :label="$t('Assets.状态')"
        align="center"
        min-width="140"
      >
        <template slot-scope="{ row }">
          <!-- <el-tag
            type="primary"
            effect="dark"
            size="small"
            v-if="row.status === 0"
          >
            已完成
          </el-tag>
          <el-tag type="info" effect="dark" size="small" v-else>未完成</el-tag> -->
          <el-tag type="primary" class="primary" v-if="row.status === 1">{{ $t('Assets.待审核') }}</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 0">{{ $t('Assets.成功') }}</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 2">{{ $t('Assets.审核通过') }}</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status === 3">{{ $t('Assets.审核拒绝') }}</el-tag>
          <el-tag type="success" class="success" v-else-if="row.status === 4">{{ $t('Assets.转账中') }}</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status === 5">{{ $t('Assets.未接收') }}</el-tag>
          <el-tag type="danger" class="danger" v-else-if="row.status == -1">{{ $t('Assets.失败') }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column slot="tableOperaBtn" :label="$t('Users.操作')" min-width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-zoom-in" class="text-success" @click="onOpenDrawer(1, scope.row)" >{{ $t("Users.详细信息") }}</el-button >
        </template>
      </el-table-column> -->
    </ElTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { CommonStore } from "@/store/private/common";
import ElTable from "@/components/ElTable/index.vue";
import { webGetAdminQueryWallet, webGetAdminQueryRecordType } from "@/api";
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
    { prop: "id", label: "ID", width: "160" },
    { prop: "userName", label: this.vm.$t("Assets.用户名"), width: "140" },
    { prop: "amount", label: this.vm.$t('Assets.数量'), width: "140" },
    { prop: "recordType", label: this.vm.$t('Assets.记录类型'), width: "140" },
    { slot: "status" },
    { prop: "createTime", label: this.vm.$t('Assets.创建时间'), width: "160" },
  ];
  totalCount: number = 0;
  param: any = { page: 1, pageSize: 14 };

  recordType: any = {};
  recordsOptions: any[] = [];
  recordsSearch: any[] = [];

  // 搜索项配置
  get formSearchOptions() {
    return [
      { key: "userName", type: "input", label: this.vm.$t('Assets.用户名') },
      {
        key: "startTime",
        type: "time",
        label: this.vm.$t('Assets.从日期'),
        placeholder: this.vm.$t('Assets.请选择'),
      },
      { key: "endTime", type: "time", label: this.vm.$t('Assets.到日期'), placeholder: this.vm.$t('Assets.请选择') },
      { slot: "recordType", label: this.vm.$t('Assets.记录类型') },
      // { key: 'coinName', type: 'select', label: '钱包类型', options: [...this.wallerTypeList] }
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
    this.getRecordType();
    this.getTableData();
  }

  onCascaderChange(val) {
    // console.log(val);

    this.recordsSearch = [];
    val.forEach((item) => {
      this.recordsSearch.push(item[0]);
    });
  }

  async getRecordType() {
    const { data } = await webGetAdminQueryRecordType({});
    if (data.code === 20000) {
      let list: any[] = [];
      data.data.forEach((item, index) => {
        this.recordType[item.val] = item.cnTitle;

        if (item.parentId !== "0") {
          list.push({
            id: item.id,
            parentId: item.parentId,
            label: item.cnTitle,
            value: item.val,
            // children: []
          });
        }
      });
      // data.data.forEach((item, index)=> {
      //   list.forEach(_item=> {
      //     if(item.parentId === _item.id) {
      //       _item.children.push({
      //         id: item.id,
      //         parentId: item.parentId,
      //         label: item.cnTitle,
      //         value: item.val
      //       })
      //     }
      //   })
      // })
      this.recordsOptions = list;
    }
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
      this.$message.error(this.vm.$t('Assets.请输入用户名'));
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
    const { data: res } = await webGetAdminQueryWallet({
      ...this.param,
      sortMap: { create_time: "desc" },
      list: this.recordsSearch,
      recordType: "",
    });
    // console.log('res.data.records :>> ', res.data.records);
    if (res.code === 20000) {
      this.tableData = res.data.records.map((item) => {
        return {
          ...item,
          showCoinName: this.getCoinName[item.coinName],
          recordType: this.vm.$t('Type.' + item.recordType),
        };
      });
      this.totalCount = res.data.total;
    }
  }

  async getExportExcelDataClick(param) {
    const { data: res } = await webGetAdminQueryWallet({
      ...this.param,
      sortMap: { create_time: "desc" },
      list: this.recordsSearch,
      ...param,
    });
    if (res.code === 20000) {
      let list = res.data.records.map((item) => {
        return {
          ...item,
          showCoinName: this.getCoinName[item.coinName],
          recordType: this.recordType[item.recordType],
        };
      });
      UserStore.storeExportExcelsMap(list);
    }
  }
}
</script>
<style lang='scss' scoped></style>