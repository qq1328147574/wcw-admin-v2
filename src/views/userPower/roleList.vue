<template>
  <!-- 角色管理 -->
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
      @getExportExcelDataClick="getExportExcelDataClick"
    >
      <el-button :size="currentWindow ? 'small': 'mini'" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openDialog(null)">{{$t('Powers.添加角色')}}</el-button>

      <el-table-column slot="tableRoleStatus" :label="$t('Powers.状态')" :min-width="'220'">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="primary" size="small" disabled>{{$t('Powers.正常')}}</el-tag>
          <el-tag v-else type="info" size="small" disabled>{{$t('Powers.停用')}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Powers.操作')" :min-width="'220'" >
        <template slot-scope="scope">
          <div class="v-btn-box">
            <el-button type="text" size="small" icon="el-icon-edit-outline" @click="openDialog(scope.row)">{{$t('Powers.编辑')}}</el-button>
            <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(scope.row)">{{$t('Powers.删除')}}</el-button>
            <el-button type="text" size="small" icon="el-icon-edit-outline" class="v-edit-btn" @click="openDrawer(scope.row)">{{$t('Powers.资源分配')}}</el-button>
          </div>
        </template>
      </el-table-column>
    </ElTable>

    <Dialog v-model="dialogVisible" :title="dialogType ? $t('Powers.添加角色') : $t('Powers.修改角色')" @close="closeDialog" @confirm="confirmEdit">
      <VForm :formsModel="formData" :formOptions="formOptions" :loading="buttonLoading" @resetFields="handleResetFields"></VForm>
    </Dialog>
    <Drawer v-model="drawerVisible" title="资源分配" @close="closeDrawer">
      <VForm :formsModel="formDrawerData" :formOptions="formDrawerOptions" :loading="buttonLoading" @submit="drawerFormSubmit" @resetFields="handleResetFields">
         <template slot="slotTreeSelect">
            <el-tree
              ref="tree"
              :data="treeData"
              show-checkbox
              node-key="value"
              highlight-current
              @check-change="handleTreeSelect"
              icon-class="el-icon-caret-right"
              :default-checked-keys="defaultTreeSelect"
            >
            </el-tree>
          </template>
      </VForm>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UserStore } from '@/store/private/user';
import { MessageTips } from "@/filters/MessageTips";
import {
  webGetAdminGetRoleList, 
  webGetAdminGetMenuInfoByRoleId, 
  webGetAdminAddRole, 
  webGetAdminUpdateRole, 
  webGetAdminDeleteRole,
  webGetAdminUpdateStatus, 
  webGetAdminGetMenuTree,
  webGetAdminRoleAddResource,
  webGetAdminRoleDeleteResource
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number
};
@Component({
  components: {
    ElTable,
  },
})
export default class PowerRoleList extends Vue {
  vm = window['vm'];
  tableData = []; 
  tableColumnData: Array<object> = [
    {
      prop: "id",
      label: this.vm.$t('Powers.角色ID'),
      width: "220"
    },
    {
      prop: "name",
      label: this.vm.$t('Powers.角色名称'),
      width: "220"
    },
    {
      prop: "description",
      label: '角色描述',
      width: "220"
    },
    {
      slot: "tableRoleStatus"
    },
    {
      prop: "createTime",
      label: this.vm.$t('Powers.创建时间'),
      width: "220"
    },
    {
      slot: "tableOperaBtn"
    },
  ]
  totalCount: number = 0;
  treeData: Array<any> = []; // 菜单树
  defaultTreeSelect: string[] = []; 
  buttonLoading: boolean = false; // 加载中状态
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: boolean = true; 
  drawerVisible: boolean = false; // drawer 显示隐藏
  drawerType: boolean = true; 
  formData: any = {
    code: '',
    description: '',
    name: '',
    status: ''
  };
  formStatus = { // form 状态配置项
    type: 'radio',
    key: "status",
    inputType: 'button', 
    label: '用户状态',
    options: [
      {
        label: '停用',
        value: '1'
      },
      {
        label: '正常',
        value: '0'
      },
    ]
  }
  formOptions: any[] = [ // 表单配置项
    {
      key: 'name',
      label: '角色名称',
      type: 'input',
      inputType: 'input',
      placeholder: '请输入角色名称',
      rules: []
    },
    {
      key: 'description',
      label: '角色简介',
      type: 'input',
      inputType: 'input',
      placeholder: '请输入角色简介',
      rules: []
    },
    {
      key: 'code',
      label: '角色Code',
      type: 'input',
      inputType: 'input',
      placeholder: '请输入角色Code',
      rules: []
    },
  ]
  formDrawerData: any = {
    roleId: '',
    resourceIds: []
  } 
  deleteList:string[] = []; // 删除的选择

  formDrawerOptions :any[] = [
    {
      key: 'resourceIds',
      label: '资源树',
      slot: 'slotTreeSelect',
      rules: []
    }, 
  ]

  rules: object = [];
  param:IndexData = {
    page: 1,
    pageSize: 20
  }
  departList: any[] = []; // 部门列表

  treeSelect: any[] = [];
  created() {
    this.getRoleList();
    this.webGetAdminGetMenuTree();
  }

  mounted() {}
  
  // 导出表格-获取数据
  async getExportExcelDataClick(page: number, pageSize: number) {
    // console.log(page);
    // console.log(pageSize);
    const {data: res} = await webGetAdminGetRoleList({
      'page': page,
      'pageSize': pageSize,
    })
    if(res.data.result.records.length > 0) UserStore.storeExportExcelsMap(res.data.result.records)
  }

  // 刷新数据
  refreshTableData() {
    this.getRoleList();
  }

  handleCurrentChange(val) {
    this.param.page = val
    this.refreshTableData();
    // console.log(this.param);
  }

  // 重置表单
  handleResetFields() {
    let tree: any = this.$refs.tree;
    tree.setCheckedKeys([]);
  }

  // 打开弹窗
  openDialog(row) {
    if(row) {
      this.formData = { ...row};
      this.formOptions.push(this.formStatus); // 表单添加状态配置
      this.dialogType = false;
    } else {
      this.dialogType = true;
    }
    this.dialogVisible = true;
  }

  // 关闭弹窗
  closeDialog() {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = '';
    });
    if(!this.dialogType) this.formOptions.pop(); // 删除表单状态配置
  }
  
  openDrawer(row) {
    if(row) {
      this.webGetAdminGetMenuInfoByRoleId(row.id);
      this.formDrawerData.roleId = row.id;
    }
    this.drawerVisible = true;
  }

  closeDrawer(){
    let tree:any = this.$refs.tree;
    this.defaultTreeSelect = [];
    tree.setCheckedKeys([]); // 设置tree节点选择为空
  }


  // 删除
  handleDelRouter(row) {
    const text = this.vm.$t('Powers.此操作将删除该条信息');
    const text1 = this.vm.$t('Powers.提示');
    const text2 = this.vm.$t('Powers.确定');
    const text3 = this.vm.$t('Powers.取消');

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: 'warning'
    }).then(() => {
      this.webGetAdminDeleteRole(row);
    })
  }

  /**
   * @description 删除角色
   */
  async webGetAdminDeleteRole(row) {
    const {id} = row;
    const res = await webGetAdminDeleteRole({
      id
    })
    MessageTips(res, true, true, this.vm.$t('Powers.删除成功'), ()=>{
      this.getRoleList();
    }, null)
  }
  
  // 添加 修改
  confirmEdit() {
    if(this.dialogType) {
      this.webGetAdminAddRole();
    }else {
      this.webGetAdminUpdateRole();
    }
  }
   /**
   * @description 添加角色
   */
  async webGetAdminAddRole() {
    this.buttonLoading = true;
    
    const res = await webGetAdminAddRole(this.formData);
    MessageTips(res, true, true, this.vm.$t('Powers.添加成功'), ()=>{
      this.getRoleList();
      this.buttonLoading = false;
      this.dialogVisible = false;

    }, err => {
      this.buttonLoading = false;
    })
  }

  /**
   * @description 修改角色
   */
  async webGetAdminUpdateRole() {
    this.buttonLoading = true;
    const res = await webGetAdminUpdateRole(this.formData);

    MessageTips(res, true, true, this.vm.$t('Powers.修改成功'), ()=>{
      this.getRoleList();
      this.buttonLoading = false;
      this.dialogVisible = false;

    }, err => {
      this.buttonLoading = false;
    })
  }

  // 查询角色
  async getRoleList() {
    try {
      const {data} = await webGetAdminGetRoleList({
        ...this.param
      });
      // console.log(data);
      if(data.code === 20000) {
        const lists = data.data;
        this.tableData = lists.records;
        this.totalCount = lists.total;
      } else console.log(data);
    } catch (error) {
      this.$message.error('Secret resource error')
    }
  }

  // 获取菜单树列表
  async webGetAdminGetMenuTree() {
    const {data} = await webGetAdminGetMenuTree({});
    // console.log(data);
    if(data.code === 20000) {
      const lists = data.data;
      this.getTreeData(lists, this.treeData);
      // console.log(this.treeData);
    }
  }

  /**
   * @description 生成菜单树
   * @param {Array} data        树数据
   * @param {Array} treeData    顶层树，0开始
   */
  getTreeData(data, treeData) {
    if(data && data.length > 0) {
      data.forEach((item,index)=>{
        treeData.push({
          value: item.id,
          label: item.name,
        })
        if(item.child && item.child.length > 0){
          treeData[index].children = [];
          this.getTreeData(item.child, treeData[index].children)
        }
      })
    }
  }

  // 根据角色ID获取权限菜单,已勾选的 获取角色菜单
  async webGetAdminGetMenuInfoByRoleId(roleId) {
    this.defaultTreeSelect = [];
    const {data: res} = await webGetAdminGetMenuInfoByRoleId({
      roleId
    });
    
    if(res.code === 20000) {
      let baseData = res.data;
      let selectData: any[] = [];
      baseData.forEach(item=> {
        this.getTreeChildrenSelect(item, (data)=>{
          selectData.push(data.id);
        });
      })
      this.formDrawerData.resourceIds = [...selectData];
      this.defaultTreeSelect = [...selectData]; // 默认选中
    }
  }

  // 选择菜单树 (选择父节点和子节点)
  handleTreeSelect() {
    let tree:any = this.$refs.tree;
    let selectList = tree.getCheckedNodes(false, true).map(item=> item.value); // 获取已选中的节点
    
    let list = this.defaultTreeSelect;
    this.deleteList = [];
    list.forEach(item=> {
      if(!selectList.includes(item) && list.includes(item)) {
        this.deleteList.push(item);
      }
    })
    this.formDrawerData.resourceIds = selectList;
  }

  /**
   * @description 获取Tree组件选择的最后一层
   * @param {Array} result 最后一层ID集合
   * @param {function} callback  回调函数
   */
  getTreeChildrenSelect(data, callback) {
    if(data.child && data.child.length > 0) {
      data.child.forEach(item => {
        this.getTreeChildrenSelect(item, callback);
      })
    } else {
      callback(data);
    }
  }

  // 修改角色状态
  async handleSwitchChange(val) {
    const {id, status, roleName} = val;
    const res = await webGetAdminUpdateStatus({
      'status': status === 1 ? '0' : '1',
      id, roleName
    });
    MessageTips(res, true, true, this.vm.$t('Powers.修改成功'), ()=>{
      this.getRoleList();
    }, null)
    
  }

  drawerFormSubmit() {
    this.buttonLoading = true;
    this.getRoleAddResource();
    this.getRoleDeleterResource();
  }

  // 角色添加资源
  async getRoleAddResource() {
    const res = await webGetAdminRoleAddResource(this.formDrawerData);
    MessageTips(res, true, true, '资源分配成功', ()=> {
      this.buttonLoading = false;
    }, ()=> {
      this.buttonLoading = false;
    })
  }
  // 角色删除资源 
  async getRoleDeleterResource() {
    if(this.deleteList.length > 0) {
      const res = await webGetAdminRoleDeleteResource({roleId: this.formDrawerData.roleId, resourceIds: this.deleteList});
      if(res.data.code!== 20000) {
        this.$message.error(res.data.message);
      }
    } 
  }

}
</script>

<style lang="scss" scoped>
.v-form-box {
  padding: 30px 0 0;
  .v-btn-box {min-width: 205px; margin-top: 15px; text-align: center;}
}
</style>
