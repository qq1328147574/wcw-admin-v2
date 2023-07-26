<!-- 组件用途 -->
<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="top">
      <!-- <div class="v-form-title"> 注册 </div> -->
      <el-form-item :label="$t('Users.用户名')" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="全名" prop="fullName">
        <el-input v-model="formData.fullName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.邮箱')" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item :label="'手机国家码'" prop="phoneCountryCode"> 
        <el-select v-model="showCountry" filterable @change="onSelect">
          <el-option :label="item.name + '(+' + item.tel + ')'" :value="item.countryCode + '-' + item.tel" v-for="(item,index) in getCountryList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('Users.手机号')" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.密码')" prop="passWord">
        <el-input type="password" show-password v-model="formData.passWord"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="'交易密码'" prop="transactionPassword">
        <el-input type="password" show-password v-model="formData.transactionPassword"></el-input>
      </el-form-item> -->
      <el-form-item :label="'邀请码'" prop="parentUserName">
        <el-input v-model="formData.parentUserName"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="confirmEdit('formData')" :loading="buttonLoading" class="v-btn-box"> 提交 </el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { webGetAdminRegisterUser } from '@/api';
import { MessageTips } from "@/filters/MessageTips";
import { CommonStore } from "@/store/private/common";
import { regBlank, regMakeUpPassMin } from "@/filters/splitRegex";
import { md5HexToUpper } from "@/utils/MD5";

@Component
export default class Name extends Vue {
  vm = window['vm'];
  formData = {
    userName: "",
    passWord: "",
    countryCode: '',
    email: '',
    transactionPassword: '',
    phoneCode: '',
    phone: '',
    phoneCountryCode: '',
    qrCode: '',
    parentUserName: '',
    fullName: ''
  };
  rules: object = {
    email: [
      { required: true, message: '请输入邮箱' , trigger: "blur", },
      { type: 'email', message: '请输入正确的邮箱', trigger: ["change", "blur"] },
    ],
    userName: [
      { required: true, message: '请输入用户名', trigger: "blur", },
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", },
      // { min: 6, max: 18, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
      // { pattern: regMakeUpPassMin, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
    ],
    fullName: [
      { required: true, message: '请输入全名', trigger: "blur", },
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", },
      // { min: 6, max: 18, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
      // { pattern: regMakeUpPassMin, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
    ],
    passWord: [
      { required: true, message: '请设置密码', trigger: "blur", }, 
      { required: true, pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
      // { min: 6, max: 18, message: '请输入6-18位英文 + 数字的组合' }, 
      // { pattern: regMakeUpPassMin, message: '请输入6-18位英文 + 数字的组合' }
    ],
    gmtUserName: [
      { required: true, message: '请输入GMT用户名', trigger: "blur", },
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", },
      // { min: 6, max: 18, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
      // { pattern: regMakeUpPassMin, message: '请输入6-18位英文 + 数字的组合', trigger: "change" },
    ],
    gmtPassWord: [
      { required: true, message: '请设置GMT密码', trigger: "blur", }, 
      { required: true, pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
      // { min: 6, max: 18, message: '请输入6-18位英文 + 数字的组合' }, 
      // { pattern: regMakeUpPassMin, message: '请输入6-18位英文 + 数字的组合' }
    ],
    gmtTransactionPassword: [
      { required: true, message: '请设置GMT交易密码', trigger: "blur", }, 
      { required: true, pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
    ],
    transactionPassword: [
      { required: true, message: '请设置交易密码', trigger: "blur", }, 
      { required: true, pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
    ],
    cpassWord: [
      { required: true, message: '请确认密码', trigger: "blur", },
      {
        validator: (rule, value, callback)=> {
          if(value !== this.formData.passWord) {
            callback(new Error('密码输入不一致'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ],
    countryCode: [
      { required: true, message: '请选择国家', trigger: "blur", },
    ],
    phoneCountryCode: [
      { required: true, message: '请选择手机国家码', trigger: "blur", },
    ],
    phoneCountryTel: [
      { required: true, message: '请选择手机国家码', trigger: "blur", },
    ],
    phone: [
      { required: true, message: '请输入手机号', trigger: "blur", },
    ],
    inviterUserName: [
      { required: true, message: '请输入邀请人', trigger: "blur", },
    ],
    phoneCode: [
      { required: true, message: '请输入验证码', trigger: "blur", },
    ]
  };
  buttonLoading: boolean = false;

  get getCountryList() {
    return CommonStore.getCountryList
  }
  
  showCountry: string = '';

  created() {}

  onSelect(val) {
    console.log(val);
    let item = val.split('-');
    this.formData.phoneCountryCode = item[0];
    this.formData.countryCode = item[0];
  }

  confirmEdit() {
    let ref:any = this.$refs['formData'];
    ref.validate(valid=> {
      if(valid) {
        this.toSubmit();
      }
    })
  } 

  async toSubmit() {
    this.buttonLoading = true;
    let { passWord, transactionPassword } = this.formData;

    console.log(this.formData);
    
    const res = await webGetAdminRegisterUser({
      ...this.formData,
      passWord: md5HexToUpper(passWord),
      transactionPassword: md5HexToUpper(transactionPassword)
    });
    MessageTips(res, true, true, '注册成功', () => {
      this.buttonLoading = false;
      this.$emit('result');
    }, (err) => {
      this.buttonLoading = false;
    });
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