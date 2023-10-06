<template>
  <div>
    <el-row type="flex" justify="center" style="width: 100%">
      <el-col :xs="22" :sm="22" :md="22" :lg="16" :xl="11">
        <el-row>
          <el-col :span="24">
            <el-form
              :model="formData"
              :rules="rules"
              ref="formData"
              label-position="top"
            >
              <el-form-item :label="$t('Seconds.密码')" prop="password">
                <el-input
                  type="password"
                  show-password
                  v-model="formData.password"
                ></el-input>
              </el-form-item>

              <el-button class="v-btn" type="primary" @click="onSubmit" :loading="btnLoading">
                {{ $t('Common.请输入您的密码') }}
              </el-button>
            </el-form>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { pussyCreateUser } from "@/api";
import { MessageTips } from "@/filters/MessageTips";
import { md5HexToUpper } from "@/utils/MD5";

@Component({
})
export default class Test extends Vue {
  vm = window['vm'];
  formData = {
    password: "",
  };
  rules = {
    password: [
      {
        required: true,
        message: this.vm.$t('Seconds.请输入6位以上数字和字母的密码, 字母需要包含大写, 并且不能有连续3位以上的数字'),
        pattern: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*\\d{3,}).{6,}$/,
        trigger: ["blur"],
      },
    ],
  };
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
    this.btnLoading = true;
    const res = await pussyCreateUser({
      password: this.formData.password,
    });

    this.btnLoading = false;
    MessageTips(
      res,
      true,
      true,
      this.vm.$t('Seconds.注册成功'),
      () => {
        this.$router.replace('/pussy')
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
  width: 100%;
  background-color: #b1861c;
  border-color: #b1861c;
}
</style>
