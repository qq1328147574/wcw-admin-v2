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
      <el-table-column slot="status" label="状态" align="center" min-width="140">
        <template slot-scope="{row}">
          <el-tag type="primary" effect="dark" size="small" v-if="row.status === 1">待审核</el-tag>
          <el-tag type="success" effect="dark" size="small" v-else-if="row.status === 0">成功</el-tag>
          <el-tag type="danger" effect="dark" size="small" v-else-if="row.status === 3">审核拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="voucher" label="凭证" align="center" min-width="140">
        <template slot-scope="{row}">
          <el-image
              style="width: 60px; height: 60px;"
              class="game-img"
              fit="cover"
              :src="imageUrl + row.voucher"
              :preview-src-list="[imageUrl + row.voucher]"
              lazy
            ></el-image>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Users.操作')" align="center" min-width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="text-success" v-if="row.status === 1" @click="onOpenDialog(2, row)"> 审核 </el-button >
        </template>
      </el-table-column>
    </ElTable>
    
    <Dialog v-model="dialogVisible" :title="dialogTitle" @close="onCloseDialog" @confirm="submitForm">
      <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="top" v-if="dialogVisible">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="formData.amount" disabled></el-input>
        </el-form-item>
        <el-form-item label="凭证" prop="voucher">
          <el-image
            style="width: 120px; height: 120px;"
            class="game-img"
            fit="cover"
            :src="imageUrl + formData.voucher"
            :preview-src-list="[imageUrl + formData.voucher]"
          ></el-image>
        </el-form-item>
        <el-form-item label="时间" prop="timeType">
          <el-radio-group v-model="formData.timeType" placeholder="请选择">
            <el-radio-button label="1">白天</el-radio-button>
            <el-radio-button label="2">夜间</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" prop="status">
          <el-radio-group v-model="formData.status" placeholder="请选择">
            <el-radio-button label="0">通过</el-radio-button>
            <el-radio-button label="3">拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="说明" prop="reason" v-if="formData.status == '3'">
          <el-input v-model="formData.reason" type="textarea"></el-input>
        </el-form-item>

        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-circle-check" @click="submitForm('formData')" :loading="btnLoading"> 提交 </el-button>
        </el-form-item> -->
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
  webGetAdminVoucherOrder,
  webGetAdminVoucherExamine,
} from '@/api';
import { UserStore } from '@/store/private/user';
import { imageUrl } from '@/common/https/baseUrl';
@Component({
  components: {
    ElTable
  }
})
export default class Name extends Vue {
  vm = window['vm'];
  imageUrl = imageUrl;
  tableData: any[] = []; // 
  tableColumnData = [
    { prop: "id", label: 'ID', width: "140", },
    { prop: "userName", label: '用户名', width: "140", },
    { prop: "amount", label: '金额', width: "140" },
    { slot: "voucher" },
    { slot: "status" },
    { prop: "reason", label: '拒绝说明', width: "160" },
    { slot: "tableOperaBtn" }
  ];
  totalCount: number = 0;
  param: any = { page: 1, pageSize: 14 };

  dialogVisible: boolean = false;
  dialogTitle: string = '审核';
  dialogType: number | any = 0;

  formData:any = {
    id: '',
    reason: '',
    status: '0',
    timeType: '1',
    voucher: ''
  };
  rules: object = {
    status: [
      { required: true, message: this.vm.$t("Assets.请选择") , trigger: 'blur', }
    ],
    userName: [
      { required: true, message: this.vm.$t("Assets.请输入") , trigger: 'blur', }
    ],
    timeType: [
      { required: true, message: this.vm.$t("Assets.请选择") , trigger: 'blur', }
    ],
    amount: [
      { required: true, message: this.vm.$t("Assets.请输入") + this.vm.$t("Assets.数量"), trigger: 'blur', }
    ],
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
        if(key !== 'status') this.formData[key] = row[key];
      })
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
    const { data: res } = await webGetAdminVoucherOrder(this.param);
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
    const { data: res } = await webGetAdminVoucherOrder( {
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

  submitForm() {
    let ref: any = this.$refs['formData'];
    ref.validate( valid => {
      console.log(valid);
      if(valid) {
        this.updateConfig();
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

  // 审核提款
  async updateConfig() {
    this.btnLoading = true;
    const res = await webGetAdminVoucherExamine({
      ...this.formData,
    });
    MessageTips(res, true, true, '操作成功', () => {
      this.getTableData();
      this.btnLoading = false;
      this.dialogVisible = false;
    }, (err) => {
      this.btnLoading = false;
    });
  }
}
</script>
<style lang='scss' scoped>
</style>