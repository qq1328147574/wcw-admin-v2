<template>
  <div v-loading="loadingPage">
    <el-row type="flex" justify="center" style="width: 100%">
      <el-col :xs="23" :sm="22" :md="22" :lg="16" :xl="11">
        <div class="mega-logo flex justify-center">
          <img style="height: 120px; margin: 10px 0;" src="@/assets/img/pussy888.png" alt="">
        </div>
        <div class="mega-tab">
          <el-tabs tab-position="top" v-model="tabIndex" type="border-card">
            <el-tab-pane label="会员信息" name="1">
              <div class="mega-inner">
                <h3 class="mega-title">{{ $t('Seconds.您的访问信息') }}</h3>
                <div class="mega-info">
                  <el-row>
                    <el-col :xs="24" :span="20">
                      <el-row class="mega-info-item">
                        <el-col :span="6" class="label">
                          <div>{{ $t('Seconds.用户名') }}</div>
                        </el-col>
                        <el-col :span="18" class="value">
                          <div>
                            {{ megaUerInfo.userName }} 
                            <el-button class="copy-icon" size="small" type="text" icon="el-icon-document-copy" @click="copyText(megaUerInfo.userName)"></el-button>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row class="mega-info-item">
                        <el-col :span="6" class="label">
                          <div>{{ $t('Seconds.密码') }}</div>
                        </el-col>
                        <el-col :span="18" class="value">
                          <div>
                            {{ megaUerInfo.passWd }}
                            <el-button class="copy-icon" size="small" type="text" icon="el-icon-document-copy" @click="copyText(megaUerInfo.passWd)"></el-button>
                            <!-- <el-button class="copy-icon" size="small" type="text" icon="el-icon-edit" @click="openDialog"></el-button> -->
                          </div>
                        </el-col>
                      </el-row>
                    </el-col>
                    <el-col :xs="24" :span="4" style="height: 100%;">
                      <div class="download flex align-center justify-center">
                        <a :href="downLoadUrl" target="_blank">
                          <install theme="filled" size="42" fill="#4787B3" />
                          <div>{{ $t('Seconds.去下载') }}</div>
                        </a>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <h3 class="mega-title">{{ $t('Seconds.当前账号状态') }}</h3>
                <div class="account">
                  <!-- <div class="account-item flex align-center">登录状态: 
                    <div class="online" v-if="status">
                      在线 
                      (<el-button type="text" size="small">退出MEGA游戏</el-button>)
                    </div>
                    <span class="offline" v-else>离线</span>
                  </div> -->
                  <div class="account-item">
                    <div style="padding: 0;">{{ $t('Seconds.账户余额') }}:</div> 
                    <MegaAmount style="padding: 0;" :userId="userId"></MegaAmount>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane :label="$t('Seconds.额度转换')" name="2">
              <MegaAmount v-if="tabIndex === '2'"></MegaAmount>
              <el-form
                :model="formData"
                :rules="rules"
                ref="formData"
                label-position="top"
              >
                <el-form-item :label="$t('Seconds.选择')">
                  <el-radio-group v-model="formType">
                    <el-radio-button label="0">{{ $t('Seconds.上分') }}</el-radio-button>
                    <el-radio-button label="1">{{ $t('Seconds.下分') }}</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('Seconds.金额')" prop="amount">
                  <el-input
                    type="number"
                    v-model="formData.amount"
                    :placeholder="$t('Seconds.请输入金额')"
                  ></el-input>
                </el-form-item>

                <el-button class="v-submit" type="primary" @click="onSubmit" :loading="btnLoading">
                  {{ $t('Seconds.确认转换') }}
                </el-button>
              </el-form>
            </el-tab-pane> -->
            <el-tab-pane :label="$t('Seconds.游戏记录')" name="3">
              <GameRecords :userId="userId"></GameRecords>
            </el-tab-pane>
            <el-tab-pane :label="$t('Seconds.转换记录')" name="4">
              <TransferRecords :userId="userId"></TransferRecords>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <Dialog v-model="dialogVisible" :title="$t('Seconds.修改密码')" :closeOnESC="false">
      <ChangePwd :password="megaUerInfo.passWd" @success="onGetMegaUerInfo"></ChangePwd>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { 
  getMegaDownloadUrl, 
  pussyQueryUserInfo,
  getMegaUerOnlineStatus,
  getMegaUerLogout,
  megaUerBalance,
  pussyUpdateUserAmount
} from "@/api";
import { Install } from '@icon-park/vue';
import { MessageTips } from "@/filters/MessageTips";
import onCopyText from '@/utils/copyText';
import TransferRecords from './megaTransferRecords.vue';
import GameRecords from './megaGameRecord.vue';
import MegaAmount from './components/megaAmount.vue';
import { CommonStore } from '@/store/private/common';
import Dialog from "@/components/Dialog/index.vue";
import ChangePwd from './pussyChangePwd.vue';
 

@Component({
  components: {
    // Navbar,
    Install,
    TransferRecords,
    GameRecords,
    MegaAmount,
    Dialog,
    ChangePwd
  },
})
export default class Test extends Vue {
  vm = window['vm'];
  downLoadUrl: string = 'https://dr1.pussy888.com/';
  megaUerInfo: any = {};
  amount: number = 0;
  status: boolean = false;
  loadingPage: boolean = false;

  tabIndex: string = '1';

  formData = {
    amount: ''
  }

  formType: string = '0';

  rules = {
    amount: [
      { required: true, message: this.vm.$t('Seconds.请输入金额'), trigger: 'blur' },
      {
        validator: (rule,value, callback)=> {
          if(value) {
            if(value == 0) {
              callback(new Error(this.vm.$t('Seconds.请输入不为0的数字')));
            } else {
              callback();
            }
          }
        }
      }
    ]
  }
  userId: string = '';
  created() {
    this.userId = this.$route.params.userId;
    this.onGetMegaUerInfo();
    this.onGetMegaUerStatus();
  }

  mounted() {}

  onSuccess() {
    this.onGetMegaUerInfo();
    this.dialogVisible = false;
  }

  copyText(text) {
    onCopyText(text);
  }

  async onGetMegaDownloadUrl() {
    this.loadingPage = true;
    const { data } = await getMegaDownloadUrl({
      userId: this.userId
    });
    this.loadingPage = false;
    // console.log('data :>> ', data);
    if(data.code === 20000) {
      this.downLoadUrl = data.data;
    }
  }

  async onGetMegaUerInfo() {
    const { data } = await pussyQueryUserInfo({userId: this.userId});
    // console.log('pussyQueryUserInfo :>> ', data.data);
    if(data.code === 20000) {
      this.megaUerInfo = data.data;
    }
  }
  async onGetMegaUerStatus() {
    const { data } = await getMegaUerOnlineStatus({userId: this.userId});
    // console.log('data :>> ', data);
    if(data.code === 20000) {
      this.status = data.data != 0;
    }
  }

  onLogoutLoading: boolean = false;
  async logoutMega() {
    this.onLogoutLoading = true;
    const res = await getMegaUerLogout({});

    this.onLogoutLoading = false;
    MessageTips(res, true, true, this.vm.$t('Seconds.退出成功'), ()=> {
      this.onGetMegaUerStatus();
    }, ()=> {

    })
  }

  onSubmit() {
    let ref: any = this.$refs["formData"];
    ref.validate((valid) => {
      if (valid) {
        this.onTransfer();
      }
    });
  }

  btnLoading: boolean = false;
  count: number = 0;
  async onTransfer() {
    this.btnLoading = true;

    let { amount } = this.formData;
    const res = await pussyUpdateUserAmount({
      amount: this.formType === '0' ? amount : '-' + amount
    });

    this.btnLoading = false;
    MessageTips(
      res,
      true,
      true,
      "提交成功",
      () => {
        this.formData.amount = '';
        // this.formType = '0';
      },
      () => {}
    );
  }

  dialogVisible: boolean = false;
  openDialog() {
    this.dialogVisible = true;
  }
   
}
</script>

<style lang="scss" scoped>
.mega-inner {
  .mega-title {
    padding: 0 0 20px;
  }
  .mega-info {
    margin-bottom: 20px;
    border: 1px solid #b1861c;
    .mega-info-item {
      word-break: break-all;
      border-right: 1px solid #b1861c;
      &:first-child {
        border-bottom: 1px solid #b1861c;
      }
      .label {
        padding: 10px 15px;
        line-height: 30px;
        text-align: center;
      }
      .value {
        padding: 10px 15px;
        border-left: 1px solid #b1861c;
        height: 50px;
        text-align: center;
      }
    }
    .download {
      height: 100px;
      a {
        color: #b1861c !important;
      }
    }
  }

  .account {
    .account-item {
      padding: 7px 10px;
      div, span {
        padding-left: 15px;
      }
      .online {
        color: green;
      }
      .offline {
        color: red;
      }
      .amount {
        font-weight: bold;
      }
    }
  }

  .copy-icon {
    margin-left: 10px;
    font-size: 14px;
  }
}
.v-submit {
  width: 100%;
}

::v-deep .el-tabs__item {
  color: #fff;
}

@media screen and (max-width: 768px) {
  .mega-inner {
    .mega-info {
      .mega-info-item {
        border-right: 0;
      }
      .download {
        border-top: 1px solid #dee2e6;
      }
    }
  }
}
</style>
