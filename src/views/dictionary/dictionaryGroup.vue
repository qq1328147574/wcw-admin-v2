<template>
  <!-- 字典分组 -->
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      @handleCurrentChange="handleCurrentChange"
      @refreshTableChange="refreshTableData"
    >
      <el-button
        :size="currentWindow ? 'small' : 'mini'"
        type="primary"
        slot="toolbar"
        icon="el-icon-circle-plus-outline"
        @click="openDialog()"
        >{{ $t("Powers.添加字典分组") }}</el-button
      >

      <el-table-column
        slot="tableStatus"
        :label="$t('Powers.状态')"
        min-width="220"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.status === 0"
            type="primary"
            size="small"
            disabled
            >{{ $t("Powers.正常") }}</el-tag
          >
          <el-tag v-else type="info" size="small" disabled>{{
            $t("Powers.停用")
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        slot="tableOperaBtn"
        :label="$t('Powers.操作')"
        :min-width="'200'"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit-outline"
            class="v-edit-btn"
            @click="openDialog(scope.row)"
            >{{ $t("Powers.编辑") }}</el-button
          >
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
            class="v-delete-btn"
            @click="handleDelRouter(scope.row)"
            >{{ $t("Powers.删除") }}</el-button
          >
        </template>
      </el-table-column>
    </ElTable>
    <Dialog
      v-model="dialogVisible"
      :title="
        dialogType ? $t('Powers.添加字典分组') : $t('Powers.修改字典分组')
      "
      @close="closeDialog"
      @confirm="confirmEdit"
    >
      <VForm
        :formsModel="formData"
        :formOptions="formOptions"
        :loading="buttonLoading"
      ></VForm>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { PermissionStore } from "@/store/private/permission";
import { MessageTips } from "@/filters/MessageTips";
import {
  webGetAdminAddDictionaryGroup,
  webGetAdminGetDictionaryGroupList,
  webGetAdminRemoveDictionaryGroup,
  webGetAdminUpdateDictionaryGroup,
} from "@/api/index";

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number;
};

@Component({
  components: {
    ElTable,
  },
})
export default class PowerPermission extends Vue {
  vm = window["vm"];

  tableData: object = [];
  tableColumnData: object = [
    {
      prop: "id",
      label: "ID",
      width: "160",
    },
    {
      prop: "groupName",
      label: this.vm.$t("Powers.字典分组名称"),
      width: "160",
    },
    // {
    //   prop: "remark",
    //   label: this.vm.$t("Powers.说明"),
    //   width: "160",
    // },
    {
      slot: "tableOperaBtn",
    },
  ];
  totalCount: number = 0;

  treeData: Array<any> = [
    {
      label: this.vm.$t("Powers.主菜单"),
      value: "0",
      children: [],
    },
  ];
  buttonLoading: boolean = false; //
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: boolean = true;
  formData: any = {
    deptName: "",
  };
  formStatus = {
    // form 状态配置项
    type: "radio",
    key: "status",
    inputType: "button",
    label: "用户状态",
    options: [
      {
        label: "停用",
        value: "1",
      },
      {
        label: "正常",
        value: "0",
      },
    ],
  };
  formOptions: any[] = [
    {
      key: "groupName",
      label: "字典分组名称",
      type: "input",
      inputType: "input", // textarea password
      placeholder: "请输入字典分组名称",
      rules: [
        {
          required: true,
          message: "请输入字典分组名称",
          trigger: "blur",
        },
      ],
    },
  ];

  param: IndexData = {
    page: 1,
    pageSize: 12,
  };
  // rules: object = [];
  created() {
    this.getMenuTreeList();
  }

  // 刷新数据
  refreshTableData() {
    this.getMenuTreeList();
  }

  handleCurrentChange(val) {
    this.param.page = val;
    this.refreshTableData();
    // console.log(this.param);
  }

  openDialog(row) {
    // console.log(row);
    if (row) {
      this.formData = { ...row };
      // this.formOptions.push(this.formStatus); // 表单添加状态配置
      this.dialogType = false;
    } else {
      this.dialogType = true;
    }
    this.dialogVisible = true;
  }

  // 当弹窗关闭时触发
  closeDialog() {
    Object.keys(this.formData).forEach((item) => {
      if (item === "menuType") this.formData[item] = "1";
      else if (item === "parentId") this.formData[item] = "0";
      else this.formData[item] = "";
    });
    // if(!this.dialogType) this.formOptions.pop(); // 删除表单状态配置
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
   * @description 删除字典分组
   */
  async removeMenuRouter(row) {
    let { id } = row;
    const res = await webGetAdminRemoveDictionaryGroup({
      id,
    });
    MessageTips(
      res,
      true,
      true,
      this.vm.$t("Powers.删除成功"),
      () => {
        this.getMenuTreeList();
        this.dialogVisible = false;
      },
      null
    );
  }

  /**
   * @description 添加字典分组
   */
  async addMenuRouter() {
    this.buttonLoading = true;
    const res = await webGetAdminAddDictionaryGroup(this.formData);
    // console.log(res);

    MessageTips(
      res,
      true,
      true,
      this.vm.$t("Powers.添加成功"),
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
   * @description 修改字典分组
   */
  async editMenuRouter() {
    const res = await webGetAdminUpdateDictionaryGroup(this.formData);
    this.buttonLoading = true;

    MessageTips(
      res,
      true,
      true,
      this.vm.$t("Powers.修改成功"),
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
   * @description 获取字典分组
   */
  async getMenuTreeList() {
    const { data } = await webGetAdminGetDictionaryGroupList(this.param);

    console.log(data);

    if (data.code === 20000) {
      let lists = data.data;
      this.tableData = lists.records;
      this.totalCount = lists.total;
    } else console.log(data);
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
