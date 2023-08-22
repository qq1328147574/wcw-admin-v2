<template>
  <!-- 兑换配置 -->
  <div class="pages">
    <Search :formColumnData="formSearchOptions" @result="handleSearchClick" @reset="resetTableData"></Search>
    <ElTable
      ref="ElTable"
      :tableData="showTableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
      @getExportExcelDataClick="getExportExcelDataClick"
      :tableColumnExcelData="tableColumnExcelData"
    >
      <el-button size="small" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openDialog(2, null)" v-permission="'注册用户'">{{ $t("Users.注册用户") }}</el-button >
      <el-button size="small" type="warning" slot="toolbar" icon="el-icon-tickets" @click="openNewTreePage">组织树形图</el-button>
      

      <el-table-column slot="tableOperaBtn" :label="$t('Users.操作')" align="center" min-width="320">
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="text-primary" @click="openDialog(3, row)">修改用户信息</el-button>
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="text-primary" @click="openDialog(1, row)">空投资产</el-button>
          <el-button type="text" size="small" icon="el-icon-tickets" class="text-black" @click="openNewTreePage(row)">组织树形图</el-button>
          <el-button type="text" size="small" icon="el-icon-zoom-in" class="text-black" @click="$router.push('/user/report/' + row.id + '/' + row.userName)">用户报告</el-button>
        </template>
      </el-table-column>
    </ElTable>

    <!-- 表单操作 -->
    <Dialog v-model="dialogVisible" :title="dialogTitle" @close="closeDialog" @confirm="confirmEdit">
      <!-- 空投 -->
      <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="top" v-if="dialogType === 1">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type" placeholder="请选择">
            <el-radio-button label="1">增加</el-radio-button>
            <el-radio-button label="-1">减少</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input type="number" v-model="formData.amount"></el-input>
        </el-form-item>
      </el-form>
      <!-- 注册用户 -->
      <RegisterUser v-else-if="dialogType === 2" @result="onSubmitResult" ref="RegisterUser"></RegisterUser>
      <!-- 修改用户信息 -->
      <ChangeUserInfo v-else-if="dialogType === 3" :info="drawerData" :levelList="levelList" @result="onSubmitResult" ref="ChangeUserInfo"></ChangeUserInfo>

    </Dialog>
    <Drawer v-model="drawerVisible" :title="$t('Users.详细信息')">
      <!-- <el-row>
        <el-col :xs="24" :sm="24" :md="24" :lg="13" :xl="13">
          <div class="v-drawer-info">
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '用户ID' }}</div>
              <div class="weui-flex-bd">{{ drawerData.memberId }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '用户名称' }}</div>
              <div class="weui-flex-bd">{{ drawerData.userName }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '手机' }}</div>
              <div class="weui-flex-bd">{{ drawerData.showPhone }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '邮箱' }}</div>
              <div class="weui-flex-bd">{{ drawerData.email }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '国家' }}</div>
              <div class="weui-flex-bd">{{ drawerData.showCountry }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '等级' }}</div>
              <div class="weui-flex-bd">{{ drawerData.showUserLevel }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ '佣金比例' }}</div>
              <div class="weui-flex-bd">{{ drawerData.showCommissionRate }}</div>
            </div>
          </div>
        </el-col>
      </el-row> -->
    </Drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { CommonStore } from "@/store/private/common";
import { regBlank, regMakeUpPassMin } from "@/filters/splitRegex";
import { md5HexToUpper } from "@/utils/MD5";

import ElTable from "@/components/ElTable/index.vue";
import RegisterUser from './components/registerUser.vue';
import ChangeUserInfo from './components/changeUserInfo.vue';

import {
  webGetAdminQueryUserList,
  webGetAdminUpdateUser,
  webGetQueryLevelInfo,
  webGetAdminAirdropAssets,
  webGetAdminBuyVirtuallyPackage,
  webGetAdminQueryPackageConfig,
  webGetAdminCancelVirtuallyPackage
} from "@/api/index";

import { UserStore } from '@/store/private/user';

interface IndexData {
  page: number;
  pageSize: number;
  [props: string]: any;
};
let params: IndexData = {
  page: 1,
  pageSize: 20
}

@Component({
  components: {
    ElTable,
    RegisterUser,
    ChangeUserInfo
  },
  filters: {
    filterTime(val) {
      let res = '';
      let { now, unlockTime } = val;
      if(now && unlockTime) {
        let time1 = now.replace(/-/g, '/');
        let time2 = unlockTime.replace(/-/g, '/');
        let lastTime = new Date(time2).getTime()  - new Date(time1).getTime();
        // console.log());
        
        let str = (lastTime / 1000 / 60 / 60 / 24 + 1).toString();
        
        let day: string | number = str.includes('.') ? str.split('.')[0] : str;
        day = Number(day) > 0 ? day : 0;
        res = day + ' ' + '天'
      }
      return res;
    }
  }
})
export default class UsersList extends Vue {
  vm = window["vm"];
  tableData:any[] = [];
  tableColumnData = [
    { prop: "memberId", label: '用户ID', width: "160", },
    { prop: "userName", label: this.vm.$t("Users.用户名"), width: "140" },
    { prop: "invitationCode", label: '邀请码', width: "140" },
    { prop: "parentUserName", label: '推荐人', width: "140" },
    { prop: "fullName", label: "全名", width: "140" },
    { prop: "phone", label: '手机', width: "140" },
    { prop: "email", label: '邮箱', width: "140" },
    { prop: "showCountry", label: '国家', width: "160" },
    // { prop: "showUserLevel", label: '等级', width: "160" },
    { prop: 'balance', label: '余额', width: '140' },
    { prop: "createTime", label: "创建时间", width: "160" },
    { slot: "tableOperaBtn", },
  ];
  totalCount: number = 0;
  param = JSON.parse(JSON.stringify(params));

  get showTableData() {
    return this.tableData.map(item=> {
      return {
        ...item,
        showCountry: this.getCountryName[item.phoneCountryCode] || '--',
        showCommissionRate: item.commissionRate + '%',
        showUserLevel: this.levelList[item.userLevel] || '--' 
      }
    });
  }

  tableColumnExcelData = [
    { prop: 'userLevel', label: '用户等级' },
    { prop: 'lastMatching', label: '虚拟配套' },
  ]

  buttonLoading: boolean = false; //
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: number = 0;

  drawerVisible: boolean = false;
  drawerData: any = {};
  dialogTitle: string = '';

  formData:any = {
    userName: '',
    coinName: '',
    type: '1',
    amount: '',
    assetsType: 'available',
    userId: ''
  };
  rules: object = {
    coinName: [
      { required: true, message: this.vm.$t("Assets.请选择") + this.vm.$t("Assets.币种"), trigger: 'blur', }
    ],
    type: [
      { required: true, message: this.vm.$t("Assets.请选择") + this.vm.$t("Assets.类型"), trigger: 'blur', }
    ],
    userName: [
      { required: true, message: this.vm.$t("Assets.请输入") , trigger: 'blur', }
    ],
    amount: [
      { required: true, message: this.vm.$t("Users.请输入") + '数量', trigger: 'blur', }
    ],
    assetsType: [
      { required: true, message: this.vm.$t("Assets.请选择") + '资产类型', trigger: 'blur', }
    ],
    matchingId: [
      { required: true, message: this.vm.$t("Assets.请选择") + '配套', trigger: 'blur', }
    ],
  }
  
  // 搜索栏配置
  get formSearchOptions() {
    return [
      { type: 'input', key: 'userName', label: this.vm.$t('Users.用户名') },
      { key: 'startTime', type: 'time', label: '开始日期', placeholder: '请选择' },
      { key: 'endTime', type: 'time', label: '结束日期', placeholder: '请选择' },
    ]
  }

  levelList: any = {
    '-1': '--'
  };

  currentUserPackage: number = 0;

  get getCoinName() {
    return CommonStore.getCoinName;
  }

  // 国家列表
  get getCountryName() {
    let obj = {};
    if(CommonStore.getCountryList.length > 0) {
      CommonStore.getCountryList.forEach(item=> {
        obj[item.countryCode] = item.name;
      })
    }
    return obj
  }

  virtualPackageList: any = {}; // 虚拟配套
  packageForm = { // 
    matchingId: '',
    userId: '',
    userName: ''
  }



  created() {
    this.getTableData();
    // this.getLevelInfo();
    // this.queryPackageConfig();
  }

  mounted() {}

  openNewPage() {
    this.$router.push('/invite-users');
  }

  openNewTreePage(row) {
    this.$router.push(`/invite-tree/${row.id || 0}/${row.userName || 0}`);
  }

  // 获取等级
  async getLevelInfo() {
    const { data } = await webGetQueryLevelInfo({});
    if(data.code === 20000) {
      let obj = {};
      data.data.forEach(item=> {
        obj[item.level] = item.cn;
      })
      this.levelList = obj;
    }
  }
  
  // drawer
  onOpenDrawer(type, row) {
    Object.keys(row).forEach(key=> {
      this.drawerData[key] = row[key];
    })

    this.drawerVisible = true;
  }

  // 打开弹窗
  openDialog(type, row) {
    this.dialogType = type;

    if(type === 1) {
      this.dialogTitle = '空投资产';
      this.formData.userName = row.userName;
      this.formData.userId = row.id;
    } else if(type === 2) {
      this.dialogTitle = '注册用户';
    } else if(type === 3){
      this.drawerData = {...row};
      this.dialogTitle = '修改用户信息';
    } else if(type === 4){
      this.dialogTitle = '添加虚拟配套';
      this.packageForm.userId = row.id;
      this.packageForm.userName = row.userName;
    }

    this.dialogVisible = true;
  }

  // 关闭弹窗
  closeDialog() {
    Object.keys(this.formData).forEach((key) => {
      this.formData[key] = '';
    });
  }

  // 搜索
  handleSearchClick(val) {
    let { offline, userName } = val;
    if(offline && !userName) {
      this.$message.error('请输入用户名');
      return 
    }
    // 重置搜索为第一页
    let ref:any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    Object.assign(this.param, val);
    this.getTableData();
  }

  resetTableData() {
    let ref:any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    this.param = JSON.parse(JSON.stringify(params));
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
    const { data: res } = await webGetAdminQueryUserList(this.param);
    console.log('webGetAdminQueryUserList :>> ', res.data.records);
    if (res.code === 20000) {
      this.tableData = res.data.records;
      this.totalCount = res.data.total;
    }
  }

  async getExportExcelDataClick(param) {
    const { data: res } = await webGetAdminQueryUserList( {
      ...this.param,
      ...param
    } );
    if (res.code === 20000) {
      let list = res.data.records.map(item=> {
        return {
          ...item,
          userLevel: this.levelList[item.userLevel],
          lastMatching: item.lastMatching && this.virtualPackageList[item.lastMatching] ? item.lastMatching + ' - ' +  this.virtualPackageList[item.lastMatching] : '--'
        }
      });
      UserStore.storeExportExcelsMap(list);
    }
  }

  // 表单确认
  confirmEdit() {
    if(this.dialogType === 1) {
      let ref:any = this.$refs['formData'];
      ref.validate(valid=> {
        if(valid) {
          this.userAirdrop();
        }
      })
    } else if(this.dialogType === 2) {
      let ref:any = this.$refs['RegisterUser'];
      ref.confirmEdit();
    } else {
      let ref:any = this.$refs['ChangeUserInfo'];
      ref.confirmEdit();
    }
  }

  // 空投资产
  async userAirdrop() {
    this.buttonLoading = true;
    
    let param = {
      ...this.formData
    }
    console.log(param);
    
    const res = await webGetAdminAirdropAssets(param);
    MessageTips(res, true, true, '空投成功', () => {
      this.getTableData();
      this.buttonLoading = false;
      this.$nextTick(()=> {
        this.formData.amount = '';
      })
    }, (err) => {
      this.buttonLoading = false;
    });
  }

  // 注册
  onSubmitResult() {
    this.refreshTableData();
    this.dialogVisible = false;
  }

  // 查询虚拟配套
  async queryPackageConfig() {
    const { data } = await webGetAdminQueryPackageConfig({
      matchingType: '1'
    })
    if(data.code === 20000) {
      if(data.data.length > 0) {
        data.data.map(item=> {
          this.virtualPackageList[item.id] = item.amount;
        });
      }
    }
  }

  // 购买虚拟配套
  async userBuyPackage() {
    this.buttonLoading = true;
    
    const res = await webGetAdminBuyVirtuallyPackage(this.packageForm);
    MessageTips(res, true, true, '添加成功', () => {
      this.getTableData();
      this.buttonLoading = false;
      this.dialogVisible = false;
    }, (err) => {
      this.buttonLoading = false;
      this.dialogVisible = false;
    });
  }

  onClickCancelPackage(row) {
    const text = '确认取消虚拟配套吗?';
    const text1 = '提示';
    const text2 = '确定';
    const text3 = '取消';

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: 'warning'
    }).then(() => {
      this.userCancelPackage(row.id);
    })
  }
  
  // 取消虚拟配套
  async userCancelPackage(id) {
    this.buttonLoading = true;
    
    const res = await webGetAdminCancelVirtuallyPackage({
      userId: id
    });
    MessageTips(res, true, true, '取消成功', () => {
      this.getTableData();
      this.buttonLoading = false;
    }, (err) => {
      this.buttonLoading = false;
    });
  }

}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.v-btn-box {
  min-width: 205px;
  margin-top: 15px;
  text-align: center;
}

.v-tips {
  box-sizing: border-box;
  padding: 10px 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
}
.v-tips-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .v-label {
    color: #666;
  }
  .v-value {
    font-weight: bold;
  }
}

</style>
