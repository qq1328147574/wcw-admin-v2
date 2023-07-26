<template>
  <!-- 布局 -->
  <div class="init">
    <div class="main-content">
      <!-- Navbar -->
      <div class="v-nav-drawer">
        <el-drawer
          direction="ltr"
          :visible.sync="drawerIphoneStatus"
          :show-close="false"
          :withHeader="false"
          @close="onDrawerClose"
        >
          <NavBar></NavBar>
        </el-drawer>
      </div>

      <!-- 内容 -->
      <div class="init-inner flex-column ">
        <HeaderBar @onThemeColorClick="onThemeColorClick"></HeaderBar>

        <div class="page-view flex-1" id="base-content">
          <router-view></router-view>
        </div>

        <!-- <VLoading :loading="loading"></VLoading> -->
      </div>
    </div>

    <!-- 颜色主题 -->
    <ThemesColor v-model="drawerThemeColorIconType" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import HeaderBar from "./HeaderBar.vue";
import NavBar from "./NavBar.vue";
import ThemesColor from "@/components/ThemesColor/index.vue";
import VLoading from "@/components/VLoading/index.vue";

import Event from "@/utils/Event";

// 挂载组件
@Component({
  components: {
    HeaderBar,
    NavBar,
    ThemesColor,
    VLoading,
  },
})
export default class Init extends Vue {
  loading: boolean = false;
  drawerIphoneStatus: boolean = false; // navbar Drawer
  closeRightIconType: boolean = false; // 按钮弹出
  drawerThemeColorIconType: boolean = false;

  get pageTitle() {
    let meta: any = this.$route.meta;
    return meta.title;
  }

  created() {
    // 响应navbar弹出
    Event.$on("collapse", (msg) => {
      this.drawerIphoneStatus = msg;
      setTimeout(() => {
        this.closeRightIconType = true;
      }, 400);
    });

    this.loading = true;
  }

  mounted() {
    Event.$on("startLoading", () => {
      this.loading = true;
    });
    Event.$on("endLoading", () => {
      setTimeout(() => {
        this.loading = false;
      }, 500);
    });
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  /**
   * @description: 切换主题
   * @param {*}
   * @return {*}
   */
  onThemeColorClick(item) {
    this.drawerThemeColorIconType = item;
  }

  // 切换navbar显示隐藏
  handleNavbarIconClick() {
    this.closeRightIconType = false;
    this.drawerIphoneStatus = false;
    Event.$emit("closeNavBar");
  }

  onDrawerClose() {
    this.closeRightIconType = false;
  }
}
</script>

<style lang='scss' scoped>
::v-deep .el-drawer {
  width: auto !important;
}

.init-inner {
  height: 100vh;
  .page-view {
    overflow-y: auto;
  }
}
</style>