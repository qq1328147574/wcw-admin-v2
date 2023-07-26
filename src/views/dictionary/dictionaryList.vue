<template>
  <!-- 数据字典 -->
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      @handleCurrentChange="handleCurrentChange"
      @refreshTableChange="refreshTableData"
    >
      <template slot="toolbar">
        <el-button
          :size="currentWindow ? 'small' : 'mini'"
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="openDialog"
          >{{ $t("Powers.添加字典数据") }}</el-button
        >
        <el-button
          :size="currentWindow ? 'small' : 'mini'"
          type="warning"
          icon="el-icon-sunny"
          :loading="toolbarBtnLoading"
          @click="initDictionaryCache()"
          >{{ $t("Powers.初始化数据字典") }}</el-button
        >
      </template>
      <el-table-column
        slot="tableOperaBtn"
        :label="$t('Powers.操作')"
        :min-width="'200'"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            icon="el-icon-zoom-in"
            class="v-edit-btn"
            @click="openDetailsDialog(row)"
            >{{ $t("Powers.字典数据") }}</el-button
          >
          <!-- <el-button type="text" size="small" icon="el-icon-edit-outline" @click="openDialog(scope.row)">{{$t('Powers.编辑')}}</el-button> -->
          <!-- <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(scope.row)">{{$t('Powers.删除')}}</el-button> -->
        </template>
      </el-table-column>
    </ElTable>

    <Drawer v-model="detailsDialog" :title="$t('Powers.字典数据')" width="50%">
      <ElTable
        :tableData="tableDetailsData"
        :tableColumnData="detailsColumnData"
        :needPagination="false"
        :needRefresh="false"
      >
        <el-table-column
          slot="tableOperaBtn"
          :label="$t('Powers.操作')"
          width="160"
        >
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              class="v-edit-btn"
              @click="openDialog(row)"
              >{{ $t("Powers.编辑") }}</el-button
            >
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              class="v-delete-btn"
              @click="handleDelRouter(row)"
              >{{ $t("Powers.删除") }}</el-button
            >
          </template>
        </el-table-column>
      </ElTable>
    </Drawer>
    <Dialog
      v-model="dialogVisible"
      :title="
        dialogType ? $t('Powers.添加字典数据') : $t('Powers.修改字典数据')
      "
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
  webGetAdminAddDictionary,
  webGetAdminGetDictionaryList,
  webGetAdminRemoveDictionary,
  webGetAdminUpdateDictionary,
  webGetAdminGetDictionaryGroupList,
  webGetAdminInitDictionaryCache,
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
      width: "220",
    },
    {
      prop: "groupName",
      label: this.vm.$t("Powers.字典分组名称"),
      width: "220",
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
    groupId: "",
    securityKey: "",
    securityValue: "",
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
      type: "select",
      key: "groupId",
      label: "字典分组",
      placeholder: "请选择字典分组",
      options: [],
      disabled: false,
    },
    {
      key: "securityKey",
      label: "数据字典key",
      type: "input",
      inputType: "input", // textarea password
      placeholder: "请输入数据字典key",
      disabled: false,
      rules: [
        {
          required: true,
          message: "请输入数据字典key",
          trigger: "blur",
        },
      ],
    },
    {
      key: "securityValue",
      label: "数据字典value",
      type: "input",
      inputType: "input", // textarea password
      placeholder: "请输入数据字典value",
      rules: [
        {
          required: true,
          message: "请输入数据字典value",
          trigger: "blur",
        },
      ],
    },
  ];
  param: IndexData = {
    page: 0,
    pageSize: 12,
  };

  tableDetailsData: any[] = [];
  detailsDialog: boolean = false;
  detailsColumnData: object = [
    // {
    //   prop: "groupId",
    //   label: "ID",
    //   width: "140",
    // },
    {
      prop: "securityKey",
      label: "数据字典key",
      width: "160",
    },
    {
      prop: "securityValue",
      label: "数据字典value",
      width: "160",
    },
    {
      prop: "remark",
      label: "说明",
      width: "160",
    },
    {
      slot: "tableOperaBtn",
    },
  ];
  // rules: object = [];
  toolbarBtnLoading: boolean = false;

  created() {
    this.getMenuTreeList();
    this.getDictionaryGroup();
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
      this.formOptions[0].disabled = true;
      this.formOptions[1].disabled = true;
      this.dialogType = false;
    } else {
      this.formOptions[0].disabled = false;
      this.formOptions[1].disabled = false;
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
   * @description 删除字典数据
   */
  async removeMenuRouter(row) {
    let { securityKey } = row;
    const res = await webGetAdminRemoveDictionary({
      securityKey,
    });
    MessageTips(
      res,
      true,
      true,
      this.vm.$t("Powers.删除成功"),
      () => {
        this.getMenuTreeList();
        this.dialogVisible = false;
        this.detailsDialog = false;
      },
      null
    );
  }

  /**
   * @description 添加字典数据
   */
  async addMenuRouter() {
    this.buttonLoading = true;
    const res = await webGetAdminAddDictionary(this.formData);
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
   * @description 修改字典数据
   */
  async editMenuRouter() {
    this.buttonLoading = true;
    let { securityKey, securityValue, remark } = this.formData;
    let param = { securityKey, securityValue, remark };
    const res = await webGetAdminUpdateDictionary(param);
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
   * @description 获取字典数据
   */
  async getMenuTreeList() {
    const { data } = await webGetAdminGetDictionaryList(this.param);

    console.log(data);

    if (data.code === 20000) {
      let lists = data.data;
      this.tableData = [...lists.records];

      this.totalCount = lists.total;
    } else console.log(data);
  }

  async getDictionaryGroup() {
    const { data } = await webGetAdminGetDictionaryGroupList({
      page: 1,
      pageSize: 100,
    });
    console.log(data);

    if (data.code === 20000) {
      data.data.records.forEach((item) => {
        this.formOptions[0].options.push({
          label: item.groupName,
          value: item.id,
        });
      });
    }
  }

  openDetailsDialog(row) {
    this.tableDetailsData = [...row.dictionaryList];
    this.detailsDialog = true;
  }

  async initDictionaryCache() {
    const res = await webGetAdminInitDictionaryCache();
    // if(res.)

    MessageTips(
      res,
      true,
      true,
      "已成功初始化",
      () => {
        this.toolbarBtnLoading = false;
      },
      () => {
        this.toolbarBtnLoading = false;
      }
    );
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
