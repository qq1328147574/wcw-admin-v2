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
import { userCreateMegaAccount } from "@/api";
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
        message: this.vm.$t('Seconds.请输入密码'),
        trigger: ["blur"],
      },
      {
        min: 3,
        max: 11,
        message: this.vm.$t('Seconds.请输入3-11位密码'),
        trigger: ["blur", "change"],
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
    const res = await userCreateMegaAccount({
      password: this.formData.password,
    });

    this.btnLoading = false;
    MessageTips(
      res,
      true,
      true,
      this.vm.$t('Seconds.注册成功'),
      () => {
        this.$router.replace('/mega')
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
