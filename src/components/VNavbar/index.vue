<template>
  <el-menu
    :default-active="value"
    :collapse="collapse"
    collapse-transition
    router
    unique-opened
    @select="onSelect"
  >
    <template v-for="(item) in navMenuData">
      <!-- 二级 child -->
      <template v-if="item.child && item.child.length > 0">
        <el-submenu :index="item.index" :key="item.index" :route="item.code">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ $t("Common." + item.name) }}</span>
          </template>
          <!-- 三级 child -->
          <template v-for="subItem in item.child">
            <el-submenu
              v-if="subItem.child && subItem.child.length > 0"
              :index="subItem.index"
              :key="subItem.index"
              :route="subItem.code"
            >
              <template slot="title">
                <span>{{ $t("Common." + subItem.name) }}</span>
              </template>
              <!-- 第四级 -->
              <el-menu-item
                v-for="(threeItem, i) in subItem.child"
                :key="i"
                :index="threeItem.index"
                :route="threeItem.code"
              >
                <span>{{ $t("Common." + threeItem.name) }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              :index="subItem.index"
              :key="subItem.index"
              :route="subItem.code"
              v-else
            >
              <span>{{ $t("Common." + subItem.name) }}</span>
            </el-menu-item>
          </template>
        </el-submenu>
      </template>
      <!-- 一级 -->
      <template v-else>
        <el-menu-item :index="item.index" :key="item.index" :route="item.code">
          <i :class="item.icon"></i>
          <span slot="title">{{ $t("Common." + item.title) }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UserStore } from "@/store/private/user";
import { localData } from "@/filters/storage";
import Event from "@/utils/Event";

@Component({})
export default class VNavbarPc extends Vue {
  @Prop({ default: "" }) value: string;
  @Prop({ default: [] }) navMenuData: any;

  // 监听高亮 index
  @Watch("value", { deep: true })
  onWatchPageMenuItemId(newVal, oldVal) {
    // console.log(newVal);
    // console.log(`【监听】NavBar 组件高亮: ${newVal}`);
  }

  collapse: boolean = false;
  activeLocale: string =
    (localData("get", "accessLocaleI18n", "") as string) || "zh-CN";

  // 点击导航
  onSelect(index) {
    UserStore.storeActionLeftMenuMapId(index);
    this.$emit("select", index);
    this.$emit("routeStatusType", true);
    Event.$emit('collapse', false);
  }

  //  自定义二级菜单跳转
  routeLink(path, index) {
    // console.log(index);
    if (this.$route.path !== path) {
      UserStore.storeActionLeftMenuMapId(index);
      this.$emit("routeStatusType", true);
      this.$emit("select", index);
      this.$router.push(path);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-menu-item {
  background: $defaultColor !important;
  color: #fff;
  // border-bottom: 1px solid rgba($color: #fff, $alpha: 0.1) !important;
  height: 48px !important;
  line-height: 48px !important;
  &:hover {
    background: $defaultHoverColor !important;
    color: #fff;
  }
}
::v-deep .el-submenu__title {
  background: #546e7a !important;
  color: #fff;
  height: 48px;
  line-height: 48px;
  i {
    color: #fff !important;
  }

  &:hover {
    background: $defaultHoverColor !important;
    color: #fff;
  }
}
::v-deep .el-menu-item.is-active {
  background: $defaultHoverColor !important;
  color: #fff;
  font-weight: bold;
}
.el-menu {
  width: 270px;
  border-right: 1px solid $defaultColor !important
}

</style>
