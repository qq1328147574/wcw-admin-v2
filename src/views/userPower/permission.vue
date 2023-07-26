<template>
  <!-- 菜单管理 -->
  <div class="pages">
    <div class="v-page-header"> 
      
    </div>
    <ElTable
      :treeProps="{children: 'child'}"
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="tableData.length"
      :totalPageSize="tableData.length"
      @refreshTableChange="refreshTableData"
      tableSize="small"
      default-expand-all
    >
      <template slot="toolbar">
        <el-button :size="currentWindow ? 'small' : 'mini'" type="primary" icon="el-icon-circle-plus-outline" @click="openDialog(0, null)" >{{ $t("Powers.添加菜单") }}</el-button>
        <el-button :size="currentWindow ? 'small' : 'mini'" type="warning" icon="el-icon-sunny" :loading="toolbarBtnLoading" @click="handleInitResource()" >{{ $t("Powers.初始化资源") }}</el-button>

        <span style="padding: 0 15px;">系统开启: </span>
        <el-switch
          v-model="apiStatus"
          :active-text="$t('System.开启')"
          :inactive-text="$t('System.关闭')"
          class="padding-right15"
          :inactive-value="-1"
          :active-value="1"
          @change="handleOpenApi"
        >
        </el-switch>
      </template>
      <el-table-column slot="tableMainType" :label="$t('Powers.类型')" :min-width="'140'" >
        <template slot-scope="{row}">
          <el-tag v-if="row.type === 'MENU'" size="mini" type="success" >{{ $t("Powers.菜单") }}</el-tag >
          <el-tag v-else-if="row.type === 'BUTTON'" size="mini" type="info" >{{ $t("Powers.按钮") }}</el-tag >
          <el-tag v-else size="mini" type="info" >{{ $t("Powers.主菜单") }}</el-tag >
        </template>
      </el-table-column>

      <el-table-column slot="tableStatus" :label="$t('Powers.状态')" :min-width="'140'" >
        <template slot-scope="{row}">
          <el-tag v-if="row.status === 1" type="primary" size="small">{{ $t("Powers.正常") }}</el-tag >
          <el-tag v-else type="info" size="small">{{ $t("Powers.停用") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Powers.操作')" :min-width="'160'" >
        <template slot-scope="{row}">
          <div>
            <el-button type="text" size="small" icon="el-icon-edit-outline" class="v-edit-btn" @click="openDialog(1, row)" >{{ $t("Powers.编辑") }}</el-button >
            <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(row)" >{{ $t("Powers.删除") }}</el-button >
            <el-button type="text" icon="el-icon-circle-plus-outline" @click="openDialog(0, row)" v-if="row.type === 'MENU'">{{ $t("Powers.添加菜单") }}</el-button>
          </div>
        </template>
      </el-table-column>
    </ElTable>

    <!-- 表单操作 -->
    <Dialog v-model="dialogVisible" :title="dialogType === 0 ? $t('Powers.添加菜单') : $t('Powers.修改菜单')" @close="closeDialog" @confirm="confirmEdit">
      <el-form
        ref="formData"
        :model="formData"
        :rules="rules"
        label-width="120px"
        :size="currentWindow ? 'small' : 'mini'"
        label-position="top"
      >
        <el-form-item :label="$t('Powers.权限类型')">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="MENU">{{ $t("Powers.菜单") }}</el-radio-button>
            <el-radio-button label="BUTTON">{{ $t("Powers.按钮") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Powers.目录菜单')" v-if="dialogType === 0">
          <el-cascader
            v-model="formData.parentId"
            :options="treeData"
            @change="handleCascaderChange"
            :props="{ checkStrictly: true, emitPath: false, expandTrigger: 'hover', }"
            :show-all-levels="false"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item :label="$t('Powers.资源名称')" >
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.资源图标')" v-if="formData.type === 'MENU'" >
          <el-input v-model="formData.icon"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.路由地址')">
          <el-input v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.资源简介')">
          <el-input v-model="formData.description"></el-input>
        </el-form-item> 	
        <el-form-item :label="$t('Powers.资源URL')">
          <el-input v-model="formData.uri"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.排序')">
          <el-input v-model="formData.sort"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Powers.状态')" v-if="dialogType === 1">
          <el-radio-group v-model="formData.status">
            <el-radio-button label="-1"> {{$t('Powers.禁用')}} </el-radio-button>
            <el-radio-button label="1"> {{$t('Powers.正常')}} </el-radio-button>
          </el-radio-group>
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
  webGetAdminAddMenu,
  webGetAdminGetMenuTree,
  webGetAdminRemoveMenu,
  webGetAdminUpdateMenu,
  webGetAdminInitResource,
  webGetAdminQueryApiStatus,
  webGetAdminUpdateApiStatus
} from "@/api/index";

import ElTable from "@/components/ElTable/index.vue";

@Component({
  components: {
    ElTable,
  },
})
export default class PowersPermission extends Vue {
  vm = window["vm"];

  tableData = [];
  tableColumnData = [
    {prop: "id", label: this.vm.$t("Powers.路由ID"), width: "160" },
    {prop: "name", label: this.vm.$t("Powers.资源名称"), width: "140" },
    {slot: "tableStatus" },
    {slot: "tableMainType" },
    {prop: "icon", label: this.vm.$t("Powers.资源图标"), width: "140" },
    {prop: "code", label: this.vm.$t("Powers.路由地址"), width: "140" },
    {prop: "description", label: this.vm.$t("Powers.资源描述"), width: "140" },
    {slot: "tableOperaBtn" },
  ];

  treeData: Array<any> = [
    { label: this.vm.$t("Powers.主菜单"), value: "-1", children: [] }
  ];
  buttonLoading: boolean = false; //
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: number = 0;
  formData: any = {
    code: "",
    icon: "el-icon-link",
    name: "",
    description: '',
    type: "MENU",
    parentId: "-1",
    uri: '',
    status: '',
    sort: ''
  };

  rules: object = [];

  totalCount = 12;

  toolbarBtnLoading: boolean = false;

  apiStatus = -1;

  created() {
    this.getApiStatus();
    this.getMenuTreeList();
  }

  mounted() {}

  // 刷新数据
  refreshTableData() {
    this.getMenuTreeList();
  }

  openDialog(type, row) {
    this.dialogType = type;
    if (type === 1) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
      this.formData.id = row.id;
    } else {
      if(row) this.formData.parentId = row.id;
    }
    this.dialogVisible = true;
  }

  // 
  closeDialog() {
    Object.keys(this.formData).forEach(key=> {
      if(key === 'type') this.formData[key] = 'MENU';
      else if(key === 'parentId') this.formData[key] = '-1';
      else if(key === 'icon') this.formData[key] = 'el-icon-link';
      else this.formData[key] = ''
    })
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
    if (this.dialogType === 0) this.addMenuRouter();
    else this.editMenuRouter();
  }

  /**
   * @description 删除权限
   */
  async removeMenuRouter(row) {
    let { id } = row;
    const res = await webGetAdminRemoveMenu({ id });
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
   * @description 添加权限
   */
  async addMenuRouter() {
    this.buttonLoading = true;
    const res = await webGetAdminAddMenu(this.formData);
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
   * @description 修改权限
   */
  async editMenuRouter() {
    this.buttonLoading = true;
    const res = await webGetAdminUpdateMenu(this.formData);

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
   * @description 获取权限树列表
   */
  async getMenuTreeList() {
    const { data: res } = await webGetAdminGetMenuTree({});

    // console.log(res);
    if (res.code === 20000) {
      this.treeData[0].children = [];
      this.tableData = res.data;
      this.getTreeData(res.data, this.treeData[0].children);
    }
  }

  /**
   * @description 生成菜单树
   */
  getTreeData(data, treeData) {
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        treeData.push({
          value: item.id,
          label: item.name,
        });
        if (item.child && item.child.length > 0) {
          let nextRouteNum = item.child.filter( (_item) => _item.type != "BUTTON" );
          if (nextRouteNum.length > 0) {
            treeData[index].children = [];
            this.getTreeData(item.child, treeData[index].children);
          }
        }
      });
    }
  }
  /**
   * @description 选择父级ID/上级菜单
   */
  handleCascaderChange(e) {
    
  }
  async handleInitResource() {
    this.toolbarBtnLoading = true;
    const res = await webGetAdminInitResource();
    
    MessageTips(res, true, true, '已成功初始化', ()=> {
      this.toolbarBtnLoading = false;
    }, ()=> {
      this.toolbarBtnLoading = false;
    })
  }


  handleReset(form) {
    this.formData = {
      code: "",
      icon: "",
      name: "",
      description: '',
      type: "MENU",
      parentId: "-1",
      uri: ''
    }
    this.$forceUpdate();
  }

  // 查询是否开启API访问 
  async getApiStatus() {
    const {data: res} = await webGetAdminQueryApiStatus({});

    if(res.code === 20000) {
      this.apiStatus = res.data ? 1 : -1;
    }
  }

  // 开启关闭API
  async handleOpenApi(val) {
    let status = val;
    const res = await webGetAdminUpdateApiStatus({ status });
    let text = status ? "已开启" : "已关闭";
    MessageTips( res, true, true, text, () => {}, (err) => {} );
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
