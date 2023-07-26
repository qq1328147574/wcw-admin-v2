<!-- 修改用户信息 -->
<template>
  <div>
    <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="top">
      <!-- <div class="v-form-title"> 注册 </div> -->
      <el-form-item :label="$t('Users.用户名')" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Users.邮箱')" prop="email">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item :label="'手机国家码'" prop="phoneCountryCode"> 
        <el-select v-model="showCountry" filterable @change="onSelect">
          <el-option :label="item.name + '(+' + item.tel + ')'" :value="item.countryCode + '-' + item.tel" v-for="(item,index) in getCountryList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item :label="'手机国家码'" prop="phoneCountryTel">
        <el-select v-model="formData.phoneCountryTel" filterable>
          <el-option :label=" '+' + item.tel" :value="item.tel" v-for="(item,index) in getCountryList" :key="index"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="手机" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item> -->
      <el-form-item label="用户等级" prop="userLevel">
        <el-select v-model="formData.userLevel" filterable>
          <el-option v-for="(value, key) in levelList" :key="key" :label="value" :value="key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="PIN码" prop="passWord">
        <el-input type="password" show-password v-model="formData.passWord"></el-input>
      </el-form-item>
      <el-form-item :label="'安全密码'" prop="transactionPassword">
        <el-input type="password" show-password v-model="formData.transactionPassword"></el-input> 
      </el-form-item>
      <!-- <el-form-item :label="'提现状态'" prop="transactionPassword">
        <el-radio-group v-model="formData.withdrawStatus">
          <el-radio-button label="1">正常</el-radio-button>
          <el-radio-button label="-1">禁止</el-radio-button>
        </el-radio-group>
      </el-form-item> -->
      <!--  -->
      <el-form-item :label="'登录状态'" prop="">
        <el-radio-group v-model="formData.status">
          <el-radio-button label="1">正常</el-radio-button>
          <el-radio-button label="0">禁止</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="confirmEdit('formData')" :loading="buttonLoading" class="v-btn-box"> 提交 </el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { webGetAdminUpdateUser } from '@/api'; 
import { MessageTips } from "@/filters/MessageTips";
import { CommonStore } from "@/store/private/common";
import { regBlank, regMakeUpPassMin } from "@/filters/splitRegex";
import { md5HexToUpper } from "@/utils/MD5";

@Component
export default class Name extends Vue {
  @Prop({ default: {} }) info: any;
  @Prop({ default: [] }) levelList: any[];
  vm = window['vm'];
  formData:any = {
    countryCode: "",
    email: "",
    emailCode: '',
    parentMemberId: '',
    transactionPassword: '',
    userId: '',
    userName: '',
    userLevel: '',
    withdrawStatus: '',
    phoneCountryTel: '',
    phoneCountryCode: '',
    phone: ''
  };
  rules: object = {
    email: [
      { required: true, message: '请输入邮箱' , trigger: "blur", },
      { type: 'email', message: '请输入正确的邮箱', trigger: ["change", "blur"] },
    ],
    userName: [
      { required: true, message: '请输入用户名', trigger: "blur", },
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", },
    ],
    passWord: [
      // { required: true, message: '请设置密码', trigger: "blur", }, 
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
    ],
    transactionPassword: [
      // { required: true, message: '请设置交易密码', trigger: "blur", }, 
      { pattern: regBlank, message: '不能含有空格', trigger: "blur", }, 
    ],
    countryCode: [
      { required: true, message: '请选择国家', trigger: "blur", },
    ],
    phone: [
      { required: true, message: '请输入手机', trigger: "blur", },
    ],
  };
  buttonLoading: boolean = false;

  get getCountryList() {
    return CommonStore.getCountryList
  }

  @Watch('info', {deep: true, immediate: true})
  onInfoChange(newVal) {
    Object.keys(this.formData).forEach(key=> {
      if(key === 'userLevel') {
        this.formData[key] = newVal[key].toString();
      } else if (key === 'userId') {
        this.formData[key] = newVal['id'];
      } else {
        this.formData[key] = newVal[key];
      }
    })

    this.showCountry = newVal.phoneCountryCode + '-' + newVal.phoneCountryTel;
    // console.log(newVal);
    
  }

  showCountry: string = '';

  created() {}

  onSelect(val) {
    console.log(val);
    let item = val.split('-');
    this.formData.phoneCountryCode = item[0];
    this.formData.phoneCountryTel = item[1];
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
    let params: any = {};
    Object.keys(this.formData).forEach(key=> {
      if(this.formData[key] && this.formData[key] != '') {
        if(key === 'passWord' || key === 'transactionPassword') {
          params[key] = md5HexToUpper(this.formData[key]);
        } else {
          params[key] = this.formData[key];
        }
      }
    })
    console.log(params);
    const res = await webGetAdminUpdateUser({
      ...params
    });
    MessageTips(res, true, true, '修改成功', () => {
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