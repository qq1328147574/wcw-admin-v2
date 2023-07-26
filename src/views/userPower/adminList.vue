<template>
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-button :size="currentWindow ? 'small': 'mini'" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openDialog(1, null)">{{$t('Powers.添加管理员')}}</el-button>

      <el-table-column slot="tableUserType" :label="$t('Powers.管理员类型')" :min-width="'160'">
        <template slot-scope="scope">
          <el-tag size="small" >{{scope.row.userType ? scope.row.userType : 'admin'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableRoleStatus" :label="$t('Powers.状态')" :min-width="'160'">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status === 1" :active-text="$t('System.正常')" :inactive-text="$t('System.禁用')" class="padding-right15" @change="handleSwitchChange(scope.row)" > </el-switch>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Powers.操作')" :min-width="'200'" :align="currentWindow ? 'center': 'right'">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit-outline" @click="openDialog(2, scope.row)">{{$t('Powers.修改角色')}}</el-button>
        </template>
      </el-table-column>
    </ElTable>
    <Dialog v-model="dialogVisible" :title="dialogTitle" @close="closeDialog" @confirm="confirmEdit">
      <VForm :formsModel="formData" :formOptions="formOptions" :loading="buttonLoading" v-if="dialogType === 1"></VForm>
      <VForm :formsModel="formRoleData" :formOptions="formRoleOptions" :loading="buttonLoading" v-else></VForm>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { regBlank, regEmailMin, regMakeUpPassMin } from '@/filters/splitRegex';
import { MessageTips } from "@/filters/MessageTips";
import { md5HexToUpper } from '@/utils/MD5';
import {
  webGetAdminGetAdminList,
  webGetAdminAddAdmin, 
  webGetAdminPowerUserSystemUpdate, 
  webGetAdminPowerUserSystemDelete,
  webGetAdminQueryRoleList, // 查询角色
  webGetAdminUpDateAdminStatus,
  webGetAdminUserAddRole,
  webGetAdminUserDeleterRole,
  webGetAdminUserQueryRole,
  webGetAdminUpDateAdminPwd
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
export default class PowerUserList extends Vue {
  vm = window['vm'];

  roleListData: any = []; 
  tableData = []; 
  tableColumnData: Array<object> = [
    {
      prop: "id",
      label: "ID",
      width: "160"
    },
    {
      prop: "userName",
      label: this.vm.$t('Powers.管理员名称'),
      width: "160"
    },
    {
      slot: "tableUserType",
    },
    {
      prop: "remark",
      label: '备注',
      width: "160"
    },
    {
      slot: "tableStatus"
    },
    {
      slot: "tableRoleStatus"
    },
    {
      prop: "createTime",
      label: this.vm.$t('Powers.创建时间'),
      width: "160"
    },
    {
      slot: "tableOperaBtn"
    },
  ]
  totalCount: number = 0;

  buttonLoading: boolean = false; // 加载中状态
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: string | number = 1; 
  dialogTitle: any = '';
  formData: any = {
    roleIds: [],
    userName: '',
    passWord: '',
    remark: ''
  };
  formStatus = {
    type: 'radio',
    key: "status",
    inputType: 'button', 
    label: '管理员状态',
    options: [
      { label: '停用', value: '1' },
      { label: '正常', value: '0' },
    ]
  }
  formOptions: any[] = [
    {
      key: 'userName',
      label: this.vm.$t('Powers.管理员名称'),
      type: 'input',
      inputType: 'input', // textarea password
      placeholder: this.vm.$t('Powers.请输入') + this.vm.$t('Powers.管理员名称'),
      rules: [
        { required: true, message: this.vm.$t('Powers.请输入') + this.vm.$t('Powers.管理员名称'), trigger: 'blur' },
      ]
    },
    {
      key: 'passWord',
      label: this.vm.$t('Powers.登录密码'),
      type: 'input',
      inputType: 'password', // textarea password
      placeholder: this.vm.$t('Powers.请输入') + this.vm.$t('Powers.登录密码'),
      rules: [
        { required: true, message: this.vm.$t('Powers.请输入') + this.vm.$t('Powers.登录密码'), trigger: 'blur' },
        { required: true, pattern: regBlank, message: this.vm.$t('Powers.不能含有空格'), trigger: 'blur' },
        { min: 6, max: 18, message: this.vm.$t('Users.请输入6位以上'), trigger: 'blur' },
        { required: true, pattern: regMakeUpPassMin, message: this.vm.$t('Powers.请输入') + this.vm.$t('Powers.密码组合1'), trigger: 'blur' },
      ]
    },
    {
      type: "checkbox",
      key: 'roleIds',
      label: '管理员角色',
      placeholder: '请选择管理员角色',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择管理员角色',
          trigger: 'change'
        }
      ]
    }, 
    {
      key: "remark",
      label: '备注',
      type: 'input',
      inputType: 'input', // textarea password
      placeholder: this.vm.$t('Powers.请输入') + '备注',
      rules: [
        // { required: true, message: this.vm.$t('Powers.请输入') + '备注', trigger: 'blur' },
      ]
    }
  ]
  formRoleData: any = {
    bindId: '',
    roleIds: [],
    count: 0
  }
  formRoleOptions: any[] = [
    {
      type: "checkbox",
      key: 'roleIds',
      label: '管理员角色',
      placeholder: '请选择管理员角色',
      options: [],
      rules: [
        {
          required: true,
          message: '请选择管理员角色',
          trigger: 'change'
        }
      ]
    }, 
  ]
  userRoleIds: string[] = [];
  param:IndexData = {
    page: 1,
    pageSize: 12
  }
  formPasswordData: any = {
    passWord: ''
  }
  created() {
    this.initGetDataList();

    this.getRoleList();
  }

  mounted() {}

  // 刷新数据
  refreshTableData() {
    this.initGetDataList();
  }

  handleCurrentChange(val) {
    this.param.page = val; 
    this.refreshTableData();
  }

  // 关闭弹窗
  closeDialog() {
    Object.keys(this.formData).forEach(key=> {
      if(key === 'roleIds') this.formData.roleIds = [];
      else this.formData[key] = '';
    })
    if(!this.dialogType) {
      this.formOptions.pop();
    }

    this.$nextTick(()=> {
      this.formRoleData = { bindId: '', roleIds: [], deleteRoleIds: [], addRoleIds: [], count: 0 };
    })
  }

  // 打开弹窗
  openDialog(type, row) {
    this.dialogType = type;
    if(type === 1) {
      this.dialogTitle = this.$t('Powers.添加管理员');
    } else if(type === 2) {
      this.dialogTitle = this.$t('Powers.修改角色');

    } else {
      this.dialogTitle = this.$t('Powers.修改密码');
    } 
    if(row) {
      Object.keys(this.formData).forEach(key => {
        this.formRoleData['bindId'] = row.bindId;
      });
      this.getUserRole(); 
    } 
    this.dialogVisible = true;
  }

  // 取消绑定
  handleDelRouter(row) {
    const text = this.vm.$t('Powers.此操作将取消绑定, 是否继续？');
    const text1 = this.vm.$t('Powers.提示');
    const text2 = this.vm.$t('Powers.确定');
    const text3 = this.vm.$t('Powers.取消');

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: 'warning'
    }).then(() => {
      this.handleCancelClick(row);
    })
  }

  /**
   * @description 取消绑定ID
   */
  async handleCancelClick(row) {
    const text = this.vm.$t('Powers.已取消绑定');
    const {id} = row;
    const res = await webGetAdminPowerUserSystemDelete({
      userId: id
    });
    
    MessageTips(res, true, true, text, ()=>{
      this.initGetDataList();

    }, null)
  }
  
  // 添加 修改
  confirmEdit(formName) {
    this.buttonLoading = true;
    if(this.dialogType === 1) {
      this.submitFormAddClick();
    } else if(this.dialogType === 2) {
      this.handleGetRoleList();
    }
  }

   /**
   * @description 添加管理员
   */
  async submitFormAddClick() {
    // console.log(this.formData);
    const text = this.vm.$t('Powers.添加成功');
    const res = await webGetAdminAddAdmin({...this.formData, passWord: md5HexToUpper(this.formData.passWord)});

    MessageTips(res, true, true, text, () => {
      this.initGetDataList();
      this.buttonLoading = false;
      this.dialogVisible = false;

    }, err => {
      this.buttonLoading = false;
    })
  }

  /**
   * @description 修改管理员
   */
  async submitFormUpdateClick() {
    const text = this.vm.$t('Powers.修改成功');
    const res = await webGetAdminPowerUserSystemUpdate(this.formData);

    MessageTips(res, true, true, text, () => {
      this.initGetDataList();
      this.buttonLoading = false;
      this.dialogVisible = false;

    }, err => {
      this.buttonLoading = false;
    })
  }

  // 查询管理员
  async initGetDataList() {
    const {data: res} = await webGetAdminGetAdminList({
      ...this.param
    });
    
    // console.log(res);
    if(res.code === 20000) {
      const systemList = res.data;
      this.tableData = systemList.records;
      this.totalCount = systemList.total;

    }
  }

  // 修改管理员状态
  async handleSwitchChange({id, status}) {
    const text = this.vm.$t('Powers.修改成功');
    const res = await webGetAdminUpDateAdminStatus({
      'status': status === 1 ? '0' : '1',
      adminId: id
    });

    // console.log(res);
    MessageTips(res, true, true, text, ()=>{
      this.initGetDataList();
    }, null)
  }

  // 查询角色
  async getRoleList() {
    const {data} = await webGetAdminQueryRoleList({});
    if(data.code === 20000) {
      data.data.forEach(item=> {
        this.formOptions[2].options.push({
          label: item.name,
          value: item.id
        })
        this.formRoleOptions[0].options.push({
          label: item.name,
          value: item.id
        })
      })

    }else {
      this.$message.error(data.message);
    }
  }
  // 查询用户角色
  async getUserRole() {
    const res = await webGetAdminUserQueryRole({
      bindId: this.formRoleData.bindId
    })
    if(res.data.code === 20000) {
      let data = res.data.data; 
      let list = data.map(item=> item.id);
      this.formRoleData.roleIds = list;
      this.userRoleIds = list;
      // this.userRole = data;
    }
  }
  // 处理用户角色删除和新增
  handleGetRoleList() {
    let baseList = this.userRoleIds;
    let roleIds = JSON.parse(JSON.stringify(this.formRoleData.roleIds));
    let deleteRoleIds:string[] = [];
    baseList.forEach(item=> {
      let index = roleIds.findIndex(_item=> _item === item);
      if(index !== -1) {
        roleIds.splice(index, 1);
      } else{
        deleteRoleIds.push(item); // 删除的角色
      }
    })
    let addRoleIds = roleIds; // 新增的角色
    if(addRoleIds.length > 0) {
      this.addUserRole(addRoleIds);
    }
    if(deleteRoleIds.length > 0) {
      this.deleterUserRole(deleteRoleIds);
    }
    this.buttonLoading = true;
  }
  // 新增用户角色
  async addUserRole(ids) {
    const res = await webGetAdminUserAddRole({
      bindId: this.formRoleData.bindId,
      roleIds: ids
    });
    if(this.formRoleData.count === 0) {
      MessageTips(res, true, true, '修改成功', ()=> {
        this.buttonLoading = false;
        this.dialogVisible = false;
      }, ()=> {
        this.buttonLoading = false;
      })
    }
    this.formRoleData.count++;
  }
  // 删除用户角色
  async deleterUserRole(ids) {
    const res = await webGetAdminUserDeleterRole({
      bindId: this.formRoleData.bindId,
      roleIds: ids
    });
    if(this.formRoleData.count === 0) {
      MessageTips(res, true, true, '修改成功', ()=> {
        this.buttonLoading = false;
        this.dialogVisible = false;
      }, ()=> {
        this.buttonLoading = false;
      })
    }
    this.formRoleData.count++;
  }
}
</script>

<style lang="scss" scoped>
.v-form-box {
  padding: 15px 0;
  .v-btn-box {min-width: 205px; margin-top: 30px; text-align: center;}
}
</style>
