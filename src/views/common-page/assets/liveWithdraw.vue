<template>
  <!-- Power Pay 提款 -->
  <div class="pages">
    <ElTable
      ref="ElTable"
      tableSize="small"
      :tableData="getTableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      :tableExcelType="false"
      :tableColumnExcelData="tableColumnExcelData"
      :needRefresh="false"
      :heightHalf="true"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    > 
      <template slot="toolbar">
        <div class="toolbar flex align-center justify-between">
          <div class="title-bar flex align-center">
            <div class="left">
              <i class="el-icon-message-solid"></i>{{ $t('Assets.实时交易-提款') }}
            </div>
            <div class="right" style="min-width: 120px;">
              <el-slider v-model="value" :step="0.1" :max="1" :min="0" @change="changeVolume"></el-slider>
            </div>
          </div>
          <div class="toolbar-right">
            <div class="pending flex align-center">
              <div> <i class="el-icon-time"></i> PENDING</div>
              <div class="count">{{ count }}</div>
            </div>
          </div>
        </div>
      </template>

      <el-table-column slot="status" :label="$t('Assets.状态')" align="center" min-width="140">
        <template slot-scope="{row}">
          <el-tag type="primary" effect="dark" size="small" v-if="row.status === 1">{{ $t('Assets.待审核') }}</el-tag>
          <el-tag type="success" effect="dark" size="small" v-else-if="row.status === 0">{{ $t('Assets.成功') }}</el-tag>
          <el-tag type="danger" effect="dark" size="small" v-else-if="row.status === 3">{{ $t('Assets.审核拒绝') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Users.操作')" min-width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" icon="el-icon-s-check" class="v-edit-btn" @click="onOpenDialog(1, row)">{{ $t('Assets.审核') }}</el-button >
        </template>
      </el-table-column>
    </ElTable>

    <Dialog v-model="dialogVisible" :dialogTitle="$t('Assets.审核')" @confirm="submitForm">
      <el-form :model="formData" ref="formData" :rules="rules" size="medium" label-position="top">
        <el-form-item :label="$t('Assets.用户名')" prop="userName">
          <el-input v-model="formData.userName" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('Assets.金额')" prop="amount">
          <el-input v-model="formData.amount" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('Assets.类型')" prop="status">
          <el-radio-group v-model="formData.status" :placeholder="$t('Assets.请选择')">
            <el-radio-button label="0">{{ $t('Assets.通过') }}</el-radio-button>
            <el-radio-button label="3">{{ $t('Assets.拒绝') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Assets.说明')" prop="reason" v-if="formData.status == '3'">
          <el-input v-model="formData.reason" type="textarea"></el-input>
        </el-form-item>

      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { CommonStore } from "@/store/private/common";

import ElTable from "@/components/ElTable/index.vue";

import {
  webGetAdminWithdrawOrder,
  webGetAdminCheckWithdrawOrder
} from "@/api/index";
import { UserStore } from "@/store/private/user";

interface IndexData {
  page: number;
  pageSize: number;
  [props: string]: any;
}

let params: IndexData = {
  page: 1,
  pageSize: 14,
};

@Component({
  components: {
    ElTable,
  },
})
export default class WithdrawRecords extends Vue {
  @Prop({default: 0}) drawMoneyCount: number;
  @Prop({default: 10}) count: number;
  @Prop({default: 0.5}) value: number;

  vm = window["vm"];
  tableData: any[] = [];
  tableColumnData = [
    { prop: "id", label: 'ID', width: "140", },
    { prop: "userName", label: this.vm.$t('Assets.用户名'), width: "140", },
    { prop: "fullName", label: this.vm.$t('Assets.全名'), width: "140" },
    { prop: "amount", label: this.vm.$t('Assets.金额'), width: "140" },
    { prop: "currency", label: this.vm.$t('Assets.货币'), width: "140" },
    { prop: "bankName", label: this.vm.$t('Assets.银行名称'), width: "140" },
    { prop: "bankAcctName", label: this.vm.$t('Assets.银行帐户名称'), width: "140" },
    { prop: "bankAcctNo", label: this.vm.$t('Assets.银行账号'), width: "140" },
    { slot: "status" },
    { slot: "tableOperaBtn" },
  ];
  totalCount: number = 0;
  param = JSON.parse(JSON.stringify(params));

  tableColumnExcelData = [
  ];

  buttonLoading: boolean = false; //
  dialogVisible: boolean = false; // dialog 显示隐藏
  dialogType: number = 0;

  assetType: any[] = []; // 资产类型
  wallerTypeList: any[] = []; // 钱包类型

  btnLoading: boolean = false;

  withdrawBank: any = [];
  rechargeBank: any = [];

  // 搜索配置
  get formColumnData() {
    return [
      { key: "loginId", type: "input", label: this.vm.$t('Assets.登录账户') },
      {
        key: "startTime",
        type: "time",
        label: this.vm.$t("Assets.从日期"),
        placeholder: this.vm.$t("Assets.请选择"),
      },
      {
        key: "endTime",
        type: "time",
        label: this.vm.$t("Assets.到日期"),
        placeholder: this.vm.$t("Assets.请选择"),
      },
    ];
  }

  get getTableData() {
    return this.tableData.map((item) => {
      let list = this.assetType.filter(
        (filterItem) => filterItem.value === item.recordType
      );
      return {
        ...item,
        coinName: this.getCoinName[item.coinName],
        recordType: list.length > 0 ? list[0].label : item.recordType,
      };
    });
  }

  // 币种名
  get getCoinName() {
    return CommonStore.getCoinName;
  }

  @Watch("coinName", { deep: true, immediate: true })
  onCoinChange(newVal) {
    // 获取钱包类型
    if (newVal && newVal.length > 0) {
      Object.keys(newVal).forEach((key) => {
        this.wallerTypeList.push({
          label: this.getCoinName[key],
          value: key,
        });
      });
    }
  }

  @Watch("drawMoneyCount", { deep: true, immediate: true })
  onRechargeCountChange(newVal) {
    if(newVal > 0) {
      // console.log('drawMoneyCount :>> ', newVal);
      this.resetTableData();
    }
  }

  created() {
    this.initGetDataList(false);
  }

  mounted() {}

  changeVolume(value) {
    this.$emit('change', value);
    this.$emit('input', value);
  }

  // 刷新数据
  refreshTableData() {
    this.initGetDataList(false);
  }

  // 重置搜索
  resetTableData() {
    let ref: any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    this.param = JSON.parse(JSON.stringify(params));
    this.initGetDataList(true);
  }

  // 分页
  handleCurrentChange(val) {
    this.param.page = val;
    this.initGetDataList(false);
  }

  // 搜索
  handleSearchClick(val) {
    // 重置搜索为第一页
    let ref: any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    Object.assign(this.param, val);
    this.initGetDataList(false);
  }


  // 打开弹窗
  openDialog(type, row) {
    this.dialogType = type;
    this.dialogVisible = true;
  }

  resetForm() {

  }

  // 关闭弹窗
  closeDialog() {}

  // 查询
  async initGetDataList(notLoading) {
    // console.log('notLoading :>> ', notLoading);
    const { data: res } = await webGetAdminWithdrawOrder({...this.param, notLoading, status: '1'});
    console.log('getBankNotExamineRechargeOrder :>> ', res.data.records);

    if (res.code === 20000) {
      console.log('res.data :>> ', res.data);
      this.tableData = res.data.records.map(item=> {
        return {
          ...item,
          showRecordType: this.vm.$t('Type.' + item.recordType)
        }
      });
      this.totalCount = res.data.total;
    }
  }

  formData = {
    id: '',
    reason: '',
    status: '0',
    amount: '',
    userName: ''
  }

  rules = {
    status: [
      { required: true, message: this.vm.$t("Assets.请选择") , trigger: 'blur', }
    ],
    userName: [
      { required: true, message: this.vm.$t("Assets.请输入") , trigger: 'blur', }
    ],
    amount: [
      { required: true, message: this.vm.$t("Assets.请输入") + this.vm.$t("Assets.数量"), trigger: 'blur', }
    ],
  }

  // 打开弹窗
  onOpenDialog(type, row) {
    // console.log('row.id :>> ', row);
    if(type === 1) {
      Object.keys(this.formData).forEach(key=> {
        if(key !== 'status') this.formData[key] = row[key];
      })
    }
    this.dialogVisible = true;
  }

  submitForm() {
    let ref: any = this.$refs['formData'];
    ref.validate( valid => {
      if(valid) {
        this.checkWithdraw();
      }
    })
  }

  // 审核提币
  async checkWithdraw() {
    this.btnLoading = true;
    console.log('this.formData :>> ', this.formData);
    const res = await webGetAdminCheckWithdrawOrder({
      ...this.formData,
    });
    MessageTips(res, true, true, this.vm.$t('Assets.审核成功'), () => {
      this.initGetDataList(false);
      this.btnLoading = false;
      this.dialogVisible = false;
    }, (err) => {
      this.btnLoading = false;
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

.toolbar {
  margin-left: -10px;
  box-sizing: border-box;
  padding: 0 20px 0;
  width: 100vw;
  background: #90a4ae;
  color: #fff;

  .title-bar {
    font-size: 20px;
    height: 100%;
    line-height: 50px;
    .left {
      height: 100%;
      padding-right: 20px;
      border-right: 1px solid #fff;
    }
    .right {
      padding-left: 20px;
    }
  }

  .toolbar-right {
    .pending {
      background: #546e7a !important;
      border-radius: 20px;
      div {
        padding: 10px;
      }

      .count {
        padding: 0 15px;
        border-left: 1px solid #fff;
      }
    }
  }
}

@media screen and (max-width: 600px) {
  ::v-deep.el-form {
    max-height: 420px;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
