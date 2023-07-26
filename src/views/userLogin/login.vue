<template>
  <div class="login flex align-center justify-center">
    <el-row type="flex" justify="center" align="middle" style="width: 100%;">
      <el-col :xs="20" :sm="14" :md="10" :lg="7" :xl="6">
        <div class="v-container">
          <h1 class="h1-title">
            <i class="el-icon-s-promotion"></i> 
            <div>Back Office</div>
          </h1>
          <el-form ref="formData" size="medium" :model="formData" :rules="rules" label-width="auto" label-position="top">
            <el-form-item prop="userName" :label="$t('Common.用户名')">
              <el-input type="text" v-model="formData.userName" :placeholder="$t('Common.用户名')"></el-input>
            </el-form-item>
            <el-form-item prop="passWord" :label="$t('Common.密码')">
              <el-input v-model="formData.passWord" :placeholder="$t('Common.密码')" show-password></el-input>
            </el-form-item>
            <!-- <el-form-item> -->
            <!-- </el-form-item> -->
            <div class="flex justify-center">
              <el-button type="primary" class="v-form-btn" @click="submitForm('formData')" :loading="btnLoading" > {{$t('Common.登录1')}} </el-button>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { md5HexToUpper } from "@/utils/MD5";
import { setChildrenRoute } from "@/router";
import { MessageTips } from "@/filters/MessageTips";
import { sessionData } from "@/filters/storage";
import { DeviceInfo } from "@/utils/getDeviceInfo";
import { regBlank } from "@/filters/splitRegex";
import { UserStore } from "@/store/private/user";
import { CommonStore } from "@/store/private/common";
import { webGetAdminLogin, webGetAdminLogMenusList } from "@/api";


type Index = {
  userName: string;
  passWord: string;
};
@Component({})
export default class Login extends Vue {
  vm = window["vm"];

  // admin 123456
  formData: Index = {
    userName: "",
    passWord: "",
  };
  rules: object = {
    userName: [
      {
        required: true,
        message: this.vm.$t('Common.请输入')+this.vm.$t('Common.用户名'),
        trigger: "blur",
      },
      {
        required: true,
        pattern: regBlank,
        message: this.vm.$t('Common.不能含有空格'),
        trigger: "blur",
      },
    ],
    passWord: [
      {
        required: true,
        message: this.vm.$t('Common.请输入')+this.vm.$t('Common.密码'),
        trigger: "blur",
      },
      {
        required: true,
        pattern: regBlank,
        message: this.vm.$t('Common.不能含有空格'),
        trigger: "blur",
      },
    ],
  };
  btnLoading: boolean = false;
  showBg: boolean = true;

  mounted() {}

  submitForm(ids) {
    this.btnLoading = true;
    // 获取设备信息
    let devicesInfo = { brand: "", model: "", system: "", platform: "" };
    DeviceInfo.getDeviceInfo(
      { info: ["OS", "OSVersion", "browserInfo", "deviceType"] },
      (info) => {
        devicesInfo.brand = info.browserInfo;
        devicesInfo.platform = info.OS + info.OSVersion;
        devicesInfo.system = info.deviceType;
      }
    );
    let ref: any = this.$refs[ids];

    ref.validate((valid) => {
      if (valid) {
        this.userLogin(devicesInfo);
      } else {
        this.btnLoading = false;
        // console.log("error submit!!");
      }
    });
  }

  // 登录
  async userLogin(devicesInfo) {
    const { userName, passWord } = this.formData;
    const res = await webGetAdminLogin({ userName, passWord: md5HexToUpper(passWord), userType: 'ADMIN'});
    sessionData("set", "userLoginType", 'Admin');
    if(res.data.code === 20000) {
      sessionData("set", "HasSessionToken", res.data.data.token);
      // 查询路由权限
      const response = await webGetAdminLogMenusList({});
      if(response.data.code === 20000) {
        let data = response.data.data;
        localStorage.setItem('allPermissions', JSON.stringify(data));

        let filterList: string[] = ['/', '/WEB']; // 需要过滤的权限菜单
        let routerList = data.filter(item=> !filterList.includes(item.code)); // 过滤权限菜单

        sessionData('set', 'adminUser', userName); // 存储用户名
        routerList.sort((a,b)=> a - b );
        this.filterUserRouterMenu(routerList);

        // CommonStore.storeActionCoinList();
        CommonStore.storeActionCountryList();
      } else {
        this.btnLoading = false;
      }
    } else {
      MessageTips(res, false, true, '', null, null);
      this.btnLoading = false;
    }
  }

   /**
   * @description: 路由比对
   * @param {Object} item  -路由数据
   * @return {*}
   */
  filterUserRouterMenu(item) {
    const text = this.vm.$t("Common.登录成功");

    UserStore.storeActionRouterMap(item);
    // 初始路由
    setChildrenRoute();

    this.$message({ message: text, type: "success",duration: 1500, onClose: () => { 
      this.$router.replace({ path: "/" }); 
      this.btnLoading = false;
    },});
  }

  /**
   * @description: 路由跳转
   * @param {*} ids 标识
   * @return {*}
   */
  handleBtnClick(ids: number) {
    if (ids === 0) this.$router.push("/");
    else if (ids === 1) this.$router.push("/control/center");
    else return false;
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  width: 100% !important;
}

.login {
  min-height: 100vh;
  background: #e6ebec;
  // &-form {
  //   height: 100%;
  //   position: relative;
  //   padding: 20px;
  //   box-sizing: border-box;
    .v-container {
      padding: 40px 30px;
      background: #fff;
      border-radius: 20px;
    }
    .h1-title {
      padding-bottom: 50px;
      font-size: 24px;
      text-align: center;
      i {
        font-size: 100px;
      }
    }

    .v-form-btn {
      margin-top: 30px;
      font-size: 14px;
      padding: 12px 50px;
    }
  // }
}

</style>
