<template>
  <div class="header-bar flex justify-between">
    <div class="flex align-center">
      <div class="v-logo-img">
        <!-- navbar 显示隐藏按钮 -->
        <div class="header-collapse-btn pointer" @click="collapseChange">
          <i class="el-icon-s-unfold small-window-icon icon-size" ></i>
        </div>
      </div>
      <h3 class="header-meta-title">
        {{ $t('Common.' + pageTitle) }}
      </h3>
    </div>
    
    <div class="header-right flex align-center">
      <!-- 主题 -->
      <!-- <div class="home v-icon-box" @click="onThemeColorClick">
        <el-tooltip
          :hide-after="hideAfterTip"
          class="item"
          effect="dark"
          content="更换主题"
          placement="top-start"
        >
          <i class="el-icon-magic-stick small-window-icon"></i>
        </el-tooltip>
      </div> -->
      <div class="v-right-item pointer" @click="openLiveTickets">
        {{ $t('Common.实时交易') }}
      </div>
      <!-- 语言 -->
      <div class="v-right-item">
        <el-dropdown trigger="click" @command="handleLanguageCommand" size="medium">
          <span class="el-dropdown-show pointer">
            <i class="el-icon-setting icon-size"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">{{ $t('Common.' + '控制台') }}</el-dropdown-item>
            <el-dropdown-item command="zh-CN">简体中文</el-dropdown-item>
            <el-dropdown-item command="en-US">English</el-dropdown-item>
            <el-dropdown-item command="ms-MY">Malay</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>  
      </div>
     
      <div class="v-right-item">
        <el-dropdown trigger="click" @command="handleDropdownClick" size="medium">
          <span class="el-dropdown-show pointer">
            {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">
              <logout theme="filled" fill="#000000" class="font-base" /> 
              {{ $t('Common.退出登录') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { localData } from "@/filters/storage";
import Event from "@/utils/Event";
import { Logout } from '@icon-park/vue';

@Component({
  components: {
    Logout
  },
})
export default class HeaderBar extends Vue {
  hideAfterTip: number = 1000;  // 持续时间
  langType: any = localData("get", "accessLocaleI18n", "") || "zh-CN";
  collapse: boolean = false;
  userName: any = (localData('get', 'adminUser', '') as any).toUpperCase();

  get pageTitle() {
    let meta: any = this.$route.meta;
    console.log('this.$route :>> ', this.$route);
    return meta.title;
  }

  created() {

    Event.$on("closeNavBar", () => {
      this.collapse = false;
    });
  };

  mounted() {};

  // 返回首页
  backHome() {
    localData('clean', 'HasSessionMenuItemId', '');
    this.$router.replace("/");
  };

  /**
   * @description: 切换颜色主题
   * @param {Function} onThemeColorClick  -回调
   * @return {*}
   */
  onThemeColorClick() {
    this.$emit("onThemeColorClick", true);
  };

  // 切换navbar
  collapseChange() {
    Event.$emit("collapse", true);
  };
  
  /**
   * @description: 下拉菜单点击事件 -切换语言
   * @param {String} e  -值
   * @return {*}
   */
  handleLanguageCommand(e: string) {
    console.log('e :>> ', e);
    if(e === 'home') {
      this.backHome();
      localData('set', 'HasSessionMenuItemId', '');

    } else {
      localData("set", "accessLocaleI18n", e);
      window.location.reload();
    }
  };

  // 退出登录
  handleDropdownClick(e) {
    if(e === 'logout') {
      this.handleLogout();
    }
  };
  
  // 退出登录
  handleLogout() {
    // this.userLogout();
    this.$message({
      type: 'success',
      message: '正在退出登录...',
      onClose: ()=> {
        localData('clean', 'HasSessionToken', '');
        localData('clean', 'HasSessionRouterMap', '');
        localData('clean', 'HasSessionMenuItemId', '');
        localData('clean', 'adminUser', '');
        let loginType = localData('get', 'userLoginType', '');
        if(loginType === 'Admin') {
          this.$router.push('/login')
        } else if(loginType === 'Company'){
          this.$router.push('/company-login')
        }
      }
    })
  };

  // 退出登录
  async userLogout() {
  };

  openLiveTickets() {
    const { href } = this.$router.resolve({
      path: "/live-tickets",
    });
    let windowWidth = window.innerWidth - 100;
    let windowHeight = window.innerHeight - 100;
    window.open(href, "_blank", `width=${windowWidth}, height=${windowHeight}`);
  }

}
</script>

<style lang="scss" scoped>
.header-bar {
  box-sizing: border-box;
  padding: 10px;
  height: 50px;
  background: #546e7a;
  color: #fff;

  .header-meta-title {
    padding-left: 15px;
  }

  .header-right {
    .v-right-item {
      padding-left: 15px;
      .el-dropdown-show {
        color: #fff;
      }
    }
  }
}

@media screen and (max-width: 768px) {
}
</style>