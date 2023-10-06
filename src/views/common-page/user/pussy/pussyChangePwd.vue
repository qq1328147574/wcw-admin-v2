<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formData"
      label-position="top"
    >
      <el-form-item :label="$t('Seconds.密码')" prop="PassWd">
        <el-input
          type="password"
          show-password
          v-model="formData.PassWd"
        ></el-input>
      </el-form-item>

      <el-button class="v-btn" type="primary" @click="onSubmit" :loading="btnLoading">
        {{ $t('Seconds.确认修改') }}
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { pussyUpdateUserPwd } from "@/api";
import { MessageTips } from "@/filters/MessageTips";
import { md5HexToUpper } from "@/utils/MD5";

@Component({
})
export default class Test extends Vue {
  @Prop({default: ''}) password: string;
  vm = window['vm'];
  formData = {
    PassWd: "",
    OldPassWd: ""
  };
  get rules() {
    return {
      PassWd: [
        {
          required: true,
          validator: (rule, value, callback) => {
            let pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\\d{3,}).{6,}$/;
            if(value) {
              if(!pattern.test(value)) {
                callback(new Error(this.vm.$t('Seconds.请输入6位以上数字和字母的密码, 字母需要包含大写, 并且不能有连续3位以上的数字')));
              } else {
                console.log('this.password :>> ', this.password);
                if(value === this.password) {
                  callback(new Error(this.vm.$t('Seconds.新密码不能与旧密码相同')));
                } else {
                  callback();
                }
              }
            } else {
              callback(new Error(this.vm.$t('Seconds.请输入6位以上数字和字母的密码, 字母需要包含大写, 并且不能有连续3位以上的数字')))
            }
          },
          trigger: ['blur', 'change'],
        },
      ],
    };
  }
  created() {}

  mounted() {}

  onSubmit() {
    let ref: any = this.$refs["formData"];
    ref.validate((valid) => {
      if (valid) {
        this.onRegister();
      }
    });
  }

  btnLoading: boolean = false;
  async onRegister() {
    this.formData.OldPassWd = this.password;
    let { PassWd } = this.formData;

    if(this.password === PassWd) {
      this.$message.error('新密码不能与旧密码相同');
      return
    }

    console.log('this.formData :>> ', this.formData);
    this.btnLoading = true;
    const res = await pussyUpdateUserPwd(this.formData);
    this.btnLoading = false;
    MessageTips(
      res,
      true,
      true,
      "修改成功",
      () => {
        this.$emit('success');
        this.formData.PassWd = '';
      },
      () => {}
    );
  }
}
</script>

<style lang="scss" scoped>
.v-submit {
  width: 100%;
}

.v-btn {
  margin-top: 30px;
  width: 100%;
  background-color: #b1861c;
  border-color: #b1861c;
}
</style>
