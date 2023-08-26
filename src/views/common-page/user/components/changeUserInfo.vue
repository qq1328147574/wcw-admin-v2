<!-- 修改用户信息 -->
<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      size="medium"
      label-width="auto"
      label-position="top"
    >
      <el-form-item :label="$t('Users.用户名')" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.全名')" prop="passWord">
        <el-input v-model="formData.fullName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.邮箱')" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.手机')" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.生日')" prop="birthdayTime">
        <el-date-picker
          v-model="formData.birthdayTime"
          type="date"
          :placeholder="$t('Users.出生日期')"
          value-format="yyyy-MM-dd hh:mm:ss"
          format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('Users.银行')" prop="bankName">
        <el-input v-model="formData.bankName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.银行帐户名')" prop="bankAcctName">
        <el-input v-model="formData.bankAcctName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.银行帐户号码')" prop="bankAcctNo">
        <el-input v-model="formData.bankAcctNo"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.登录密码')" prop="passWord">
        <el-input
          type="password"
          show-password
          v-model="formData.passWord"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { webGetAdminUpdateUser } from "@/api";
import { MessageTips } from "@/filters/MessageTips";
import { CommonStore } from "@/store/private/common";
import { regBlank, regMakeUpPassMin } from "@/filters/splitRegex";
import { md5HexToUpper } from "@/utils/MD5";

@Component
export default class Name extends Vue {
  @Prop({ default: {} }) info: any;
  @Prop({ default: [] }) levelList: any[];
  vm = window["vm"];
  formData: any = {
    countryCode: "",
    email: "",
    emailCode: "",
    parentMemberId: "",
    transactionPassword: "",
    userId: "",
    userName: "",
    userLevel: "",
    withdrawStatus: "",
    phoneCountryTel: "",
    phoneCountryCode: "",
    phone: "",
    bankAcctName: "",
    bankAcctNo: "",
    bankName: "",
    birthdayTime: "",
    fullName: "",
  };
  rules: object = {
    email: [
      { required: true, message: this.vm.$t('Users.请输入邮箱'), trigger: "blur" },
      {
        type: "email",
        message: this.vm.$t('Users.请输入正确的邮箱'),
        trigger: ["change", "blur"],
      },
    ],
    userName: [
      { required: true, message: this.vm.$t('Users.请输入用户名'), trigger: "blur" },
      { pattern: regBlank, message: this.vm.$t('Users.不能含有空格'), trigger: "blur" },
    ],
    passWord: [
      { pattern: regBlank, message: this.vm.$t('Users.不能含有空格'), trigger: "blur" },
    ],
    transactionPassword: [
      { pattern: regBlank, message: this.vm.$t('Users.不能含有空格'), trigger: "blur" },
    ],
    countryCode: [{ required: true, message: this.vm.$t('Users.请选择国家'), trigger: "blur" }],
    phone: [{ required: true, message: this.vm.$t('Users.请输入手机'), trigger: "blur" }],
  };
  buttonLoading: boolean = false;

  get getCountryList() {
    return CommonStore.getCountryList;
  }

  @Watch("info", { deep: true, immediate: true })
  onInfoChange(newVal) {
    Object.keys(this.formData).forEach((key) => {
      if (key === "passWord") {
        this.formData[key] = newVal[key].toString();
      } else if (key === "userId") {
        this.formData[key] = newVal["id"];
      } else {
        this.formData[key] = newVal[key];
      }
    });

    this.showCountry = newVal.phoneCountryCode + "-" + newVal.phoneCountryTel;
    // console.log(newVal);
  }

  showCountry: string = "";

  created() {}

  onSelect(val) {
    console.log(val);
    let item = val.split("-");
    this.formData.phoneCountryCode = item[0];
    this.formData.phoneCountryTel = item[1];
  }

  confirmEdit() {
    let ref: any = this.$refs["formData"];
    ref.validate((valid) => {
      if (valid) {
        this.toSubmit();
      }
    });
  }

  async toSubmit() {
    this.buttonLoading = true;
    let params: any = {};
    Object.keys(this.formData).forEach((key) => {
      if (this.formData[key] && this.formData[key] != "") {
        if (key === "passWord" || key === "transactionPassword") {
          params[key] = md5HexToUpper(this.formData[key]);
        } else {
          params[key] = this.formData[key];
        }
      }
    });
    const res = await webGetAdminUpdateUser({
      ...params,
    });
    MessageTips(
      res,
      true,
      true,
      this.vm.$t('Users.修改成功'),
      () => {
        this.buttonLoading = false;
        this.$emit("result");
      },
      (err) => {
        this.buttonLoading = false;
      }
    );
  }
}
</script>
<style lang='scss' scoped>
.v-form-title {
  padding-bottom: 20px;
  font-weight: bold;
}
.el-select {
  width: 100%;
}
</style>