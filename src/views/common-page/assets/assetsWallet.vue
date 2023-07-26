<!-- 兑换配置 -->
<template>
  <div class="pages">
    <Search :formColumnData="formSearchOptions" @result="handleSearchClick" @reset="resetTableData"></Search>
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
      <!-- <el-button slot="toolbar" type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onOpenDialog(1, null)">空投资产</el-button> -->
      <el-table-column slot="status" label="状态" align="center" min-width="140">
        <template slot-scope="{row}">
          <el-tag type="primary" effect="dark" size="small" v-if="row.status === 1">正常</el-tag>
          <el-tag type="info" effect="dark" size="small" v-else>禁止</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Users.操作')" fixed="right" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="text-success" @click="onOpenDialog(2, row)"> 修改 </el-button >
        </template>
      </el-table-column>
    </ElTable>
    
    <Dialog v-model="dialogVisible" :title="dialogTitle" @close="onCloseDialog">
      <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="left">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" :disabled="dialogType == 2"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="formData.type" placeholder="请选择">
            <el-radio-button label="1">增加</el-radio-button>
            <el-radio-button label="-1">减少</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="币种" prop="coinName">
          <el-radio-group v-model="formData.coinName" placeholder="请选择">
            <el-radio-button v-for="(value, key) in getCoinName" :key="key" :label="key"> {{ value }} </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="资产类型" prop="assetsType">
          <el-radio-group v-model="formData.assetsType" placeholder="请选择">
            <el-radio-button label="available"> 可用 </el-radio-button>
            <el-radio-button label="frozen"> 冻结 </el-radio-button>
            <el-radio-button label="lock"> 锁仓 </el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="数量" prop="amount">
          <el-input type="number" v-model="formData.amount"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-circle-check" @click="submitForm('formData')" :loading="btnLoading"> 提交 </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { CommonStore } from "@/store/private/common";
import ElTable from "@/components/ElTable/index.vue";
import { MessageTips } from '@/filters/MessageTips';
import { 
  webGetAdminQueryUserList,
  webGetAdminAirdropAssets,
} from '@/api';
import { UserStore } from '@/store/private/user';

@Component({
  components: {
    ElTable
  }
})
export default class Name extends Vue {
  vm = window['vm'];
  tableData: any[] = []; // 
  tableColumnData = [
    { prop: "id", label: 'ID', width: "140", },
    { prop: "userName", label: '用户名', width: "140", },
    { prop: "balance", label: '余额', width: "140" },
    { slot: "tableOperaBtn" }
  ];
  totalCount: number = 0;
  param: any = { page: 1, pageSize: 14 };

  dialogVisible: boolean = false;
  dialogTitle: string = '';
  dialogType: number | any = 0;

  formData:any = {
    userName: '',
    coinName: '',
    type: '1',
    amount: '',
    assetsType: 'available'
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
      { required: true, message: this.vm.$t("Assets.请输入") + this.vm.$t("Assets.数量"), trigger: 'blur', }
    ],
    assetsType: [
      { required: true, message: this.vm.$t("Assets.请选择") + '资产类型', trigger: 'blur', }
    ]
  }
  btnLoading: boolean = false;

  // 搜索项配置
  get formSearchOptions() {
    return [
      { type: 'input', key: 'userName', label: '用户名' },
    ]
  }

  get getCoinName() {
    return CommonStore.getCoinName
  }

  created() {
    this.getTableData();
  }

  // 打开弹窗
  onOpenDialog(type, row) {
    if(type === 2) {
      Object.keys(row).forEach(key=> {
        this.formData[key] = row[key];
      })
    }

    if (type === 1) {
      this.dialogTitle = '添加配置'
    } else {
      this.dialogTitle = '修改配置'
    }
    
    this.dialogType = type;
    this.dialogVisible = true;
  }
  
  // 关闭弹窗
  onCloseDialog() {
    Object.keys(this.formData).forEach(key=> {
      this.formData[key] = '';
    })
  }

  // 重置搜索
  resetTableData() {
    let ref:any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param = { page: 1, pageSize: 14 };
    this.getTableData();
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
    if (res.code === 20000) {
      this.tableData = res.data.records.map(item=> {
        return {
          ...item,
          ShowCoinName: this.getCoinName[item.coinName],
        }
      });
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
          ShowCoinName: this.getCoinName[item.coinName],
        }
      });
      UserStore.storeExportExcelsMap(list);
    }
  }

  submitForm(formRef) {
    let ref: any = this.$refs[formRef];
    ref.validate( valid => {
      console.log(valid);
      if(valid) {
        if(this.dialogType === 1) {
          this.addConfig();
        } else {
          this.updateConfig();
        }
      }
    })
  }
  
  // 点击删除
  onClickDelete(row) {
    const text = '此操作将删除该配置';
    const text1 = '提示';
    const text2 = '确定';
    const text3 = '取消';

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: 'warning'
    }).then(() => {
      // this.deleteConfig(row);
    })
  }

  // 添加配置
  async addConfig() {
    this.btnLoading = true;
    const res = await webGetAdminAirdropAssets({
      ...this.formData,
    });
    MessageTips(res, true, true, '空投成功', () => {
      this.getTableData();
      this.btnLoading = false;
      this.dialogVisible = false;
    }, (err) => {
      this.btnLoading = false;
    });
  }
  // 修改配置
  async updateConfig() {
    this.btnLoading = true;
    const res = await webGetAdminAirdropAssets({
      ...this.formData,
    });
    MessageTips(res, true, true, '空投成功', () => {
      this.getTableData();
      this.btnLoading = false;
    }, (err) => {
      this.btnLoading = false;
    });
  }
  
}
</script>
<style lang='scss' scoped>
</style>