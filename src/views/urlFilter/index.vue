<template>
  <!-- Url 过滤 -->
  <div class="pages">
    <el-table
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-button :size="currentWindow ? 'small' : 'mini'" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openDialog(false)" >{{ $t("Powers.添加URL过滤") }}</el-button >

      <el-table-column slot="tableMainType" :label="$t('Powers.URL类型')" :min-width="'140'" >
        <template slot-scope="{row}">
          <el-tag v-if="row.urlType === 'exclude'" size="mini" type="info">{{ $t("Powers.排除") }}</el-tag>
          <el-tag v-else-if="row.urlType === 'include'" size="mini" type="success" >{{ $t("Powers.包含") }}</el-tag >
        </template>
      </el-table-column>

      <el-table-column slot="tableOperaBtn" :label="$t('Powers.操作')" :min-width="'160'" >
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="v-edit-btn" @click="openDialog(row)" >{{ $t("Powers.编辑") }}</el-button >
          <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(row)" >{{ $t("Powers.删除") }}</el-button >
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单操作 -->
    <Dialog v-model="dialogVisible" :title="dialogType ? $t('Powers.添加URL过滤') : $t('Powers.修改URL过滤')" @close="closeDialog" @confirm="confirmEdit">
      <el-form ref="formData" :model="formData" :rules="rules" label-width="120px" size="medium" label-position="top" >
        <el-form-item :label="$t('Powers.URL类型')" prop="urlType">
          <el-radio-group v-model="formData.urlType">
            <el-radio-button label="exclude">{{ $t("Powers.排除") }}</el-radio-button>
            <el-radio-button label="include">{{ $t("Powers.包含") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Powers.URL路径')" prop="uri">
          <el-input v-model="formData.uri"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.说明')" prop="remark">
          <el-input v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { PermissionStore } from "@/store/private/permission";
import { MessageTips } from "@/filters/MessageTips";
import {
  webGetAdminUserAddUrlFilter,
  webGetAdminUserQueryUrlFilter,
  webGetAdminUserDeleteUrlFilter,
  webGetAdminUserUpdateUrlFilter,
} from "@/api/index";

import ElTable from "@/components/ElTable/index.vue";

interface IndexData {
  page: number;
  pageSize: number;
  [props: string]: any;
};
@Component({
  components: {
    ElTable,
  },
})
export default class PowersPermission extends Vue {
  vm = window["vm"];

  tableData = [];
  tableColumnData = [
    { prop: "id", label: 'ID', width: "160", },
    { prop: "remark", label: this.vm.$t("Powers.说明"), width: "140", },
    { prop: "uri", label: this.vm.$t("Powers.URL"), width: "160", },
    { slot: 'tableMainType' },
    { slot: "tableOperaBtn", },
  ];
  param:IndexData = { page: 1, pageSize: 14 };
  totalCount:number = 0;

  buttonLoading: boolean = false; //
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: boolean = true;
  formData: any = {
    uri: '',
    urlType: 'exclude',
    remark: ''
  };
  rules: object = {
    urlType: [
      {
        required: true,
        message: '请选择类型',
        trigger: 'blur',
      }
    ],
    uri: [
      {
        required: true,
        message: '请输入URL链接',
        trigger: 'blur'
      }
    ]
  }

  created() {
    this.getMenuTreeList();
  }

  mounted() {}

  // 刷新数据
  refreshTableData() {
    this.getMenuTreeList();
  }

  openDialog(row) {
    // console.log(row);
    if (row) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
      this.formData.id = row.id;
      this.dialogType = false;
    } else {
      this.dialogType = true;
    }
    this.dialogVisible = true;
  }

  closeDialog() {
    this.formData = {
      uri: '',
      urlType: 'exclude',
      remark: ''
    };
  }

  handleDelRouter(row) {
    const text = this.vm.$t("Powers.此操作将删除该条信息");
    const text1 = this.vm.$t("Powers.提示");
    const text2 = this.vm.$t("Powers.确定");
    const text3 = this.vm.$t("Powers.取消");

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: "warning",
    }).then(() => {
      this.removeMenuRouter(row);
    });
  }
  
  confirmEdit() {
    if (this.dialogType) {
      this.addMenuRouter();
    } else {
      this.editMenuRouter();
    }
  }

  /**
   * @description 删除url过滤
   */
  async removeMenuRouter(row) {
    let { id } = row;
    const res = await webGetAdminUserDeleteUrlFilter({
      id,
    });
    MessageTips(
      res, true, true, this.vm.$t("Powers.删除成功"),
      () => {
        this.getMenuTreeList();
        this.dialogVisible = false;
      },
      null
    );
  }

  /**
   * @description 添加url过滤
   */
  async addMenuRouter() {
    this.buttonLoading = true;
    const res = await webGetAdminUserAddUrlFilter(this.formData);

    // console.log(res);
    MessageTips(
      res, true, true, this.vm.$t("Powers.添加成功"),
      () => {
        this.getMenuTreeList();
        this.buttonLoading = false;
        this.dialogVisible = false;
      },
      (err) => {
        this.buttonLoading = false;
      }
    );
  }

  /**
   * @description 修改url过滤
   */
  async editMenuRouter() {
    const res = await webGetAdminUserUpdateUrlFilter(this.formData);
    this.buttonLoading = true;
    MessageTips(
      res, true, true, this.vm.$t("Powers.修改成功"),
      () => {
        this.getMenuTreeList();
        this.buttonLoading = false;
        this.dialogVisible = false;
      },
      (err) => {
        this.buttonLoading = false;
      }
    );
  }

  /**
   * @description 获取url过滤列表
   */
  async getMenuTreeList() {
    const { data: res } = await webGetAdminUserQueryUrlFilter(this.param);
    // console.log(res);
    if (res.code === 20000) {
      this.tableData = res.data.records;
      this.totalCount = res.data.total;
    }
  }

  handleCurrentChange(val) {
    this.param.page = val;
    this.getMenuTreeList();
  }
}
</script>

<style lang="scss" scoped>
.router-icon {
  font-size: 20px;
}
.p-tag {
  margin-right: 10px;
}
.v-btn-box {
  min-width: 205px;
  margin-top: 15px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  ::v-deep .el-form {
    max-height: 420px;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
