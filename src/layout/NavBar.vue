<template>
  <div class="navBar-main">

    <div class="v-nav-list navBar-bd-h5">
      <VNavbar 
        v-model="activeIndex" 
        :navMenuData="navMenuListData" 
        @select="onSelect"
        @routeStatusType="onRouteStatusType"
      >
      </VNavbar>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { localData } from "@/filters/storage";
import { UserStore } from '@/store/private/user';
import Event from "@/utils/Event";
import navMenuData from '@/router/navbar';

import VNavbar from '@/components/VNavbar/index.vue';

// 挂载组件
@Component({
  components: {
    VNavbar
  },
})
export default class NavBar extends Vue {
  collapse = false;
  activeIndex: string = "";
  activeLocale: string = (localData("get", "accessLocaleI18n", "") as string) || "zh-CN";
  
  navMenuListData: any = [];           // 左侧菜单
  routeStatusType: boolean = false;    // 判断是否是手动点击前进后退

  adminUsername = '';    // 用户名

  get getMenuItemId() {
    const state = UserStore.MenuItemId;
    return state;
  };

  // 监听高亮 index 
  @Watch("getMenuItemId", { deep: true, })
  onWatchPageMenuItemId(newVal, oldVal) {
    console.log(`【监听】NavBar 路由高亮: ${newVal}`);
    
  };

  // 监听路由变化时执行 高亮 index 
  @Watch('$route', {deep: true, immediate: true})
  onWatchRouteIndexChange(newVal) {
    // console.log(newVal);
    if(newVal.path === '/control/center') this.activeIndex = "";  // 首页
    if(this.routeStatusType) this.routeStatusType = false;
    else {
      const sessionRouterId: any = localData('get', 'HasSessionMenuItemId', '');
      if(this.activeIndex === '') {
        if(sessionRouterId != null) {  // 有刷新
          this.getNavsMenuItemData();
          this.getNavMenuItemActiveId(newVal);
        }

      } else {   // 有高亮
        this.getNavMenuItemActiveId(newVal);
      }
    }
  };

  created() {
    // 初始化
    const sessionRouterId: any = localData('get', 'HasSessionMenuItemId', '');
    const getLocaleI18n: any = localStorage.getItem('accessLocaleI18n');
    const adminUsername: any = localData('get', 'adminUser', '');
    
    if(sessionRouterId === null) {
      this.getNavsMenuItemData();
      // this.activeIndex = '1';
    }
    if(getLocaleI18n !== null || adminUsername !== null) {
      this.activeLocale = getLocaleI18n;
      this.adminUsername = adminUsername;
    }
  };

  /**
   * @description: 获取导航高亮 index
   * @param {*} newVal -当前路由信息
   * @return {*}
   */
  getNavMenuItemActiveId(newVal) {
    const _that: any = this;
    // const navBarMenuData = this.navMenuListData;
    this.activeIndex = newVal.path;

    // console.log(newVal);

    // navBarMenuData.forEach(item => {
    //   if(item.child && item.child.length > 0) {
    //     let data = item.child;
    //     // 判断 比对子级 children
    //     let key = data.findIndex(item => item.router === newVal.path);
    //     // 存在就赋值
    //     if(key != -1) {
    //       let index = data[key].index.split('-');
    //       if(_that.currentWindow) this.activeIndex = index[0]
    //       else this.activeIndex = data[key].index
          
    //     }
        
    //   } else {
    //     if(item.router === newVal.path) this.activeIndex = item.index
    //   }
    // });

    // console.log(`当前高亮ID:${_that.activeIndex}`);
    // console.log(_that.currentWindow);
  };

  /**
   * @description: 导航栏
   * @param {*} index  -父标识
   * @return {*}
   */
  getNavsMenuItemData() {
    const routerData: any = localData('get', 'HasSessionRouterMap', ''); // 获取并循环 左侧路由数组
    let navbarData: any = JSON.parse(routerData);

    console.log(`初始导航路由:${navbarData}`);

    if (navbarData.length > 0) {
      // 添加标识
      navbarData.forEach( (el, i) => {
        let data = el.child;
        el.index = el.code;       // 父标识
        if (data.length > 0) {
          data.forEach( (cd, j) => {
            cd.child = [];
            cd.index = cd.code;  // 子标识
          });
        }
      });

      this.navMenuListData = navbarData;
      console.log('navbarData :>> ', navbarData);
      UserStore.storeActionMenuMap(navbarData);   // 缓存菜单
    };
  };

  // 点击导航
  onSelect(key: any) {
    this.activeIndex = key;
  };

  // 状态
  onRouteStatusType(val) {
    this.routeStatusType = true;
  };

  onCopy() {
    this.$message.success("复制成功!");
  };

  onError() {
    this.$message.error("复制失败!");
  };
}
</script>

<style lang='scss' scoped>
.navBar-main {
  height: 100vh;
  border-right: 1px solid #546e7a;
  background: #546e7a;

  .navBar-bd-h5 {
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
  }
}
@media  screen and (max-width: 768px) {

}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 2px;
  height: 0;
  background-color: #F5F5F5;
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
  border-radius: 10px;
  background-color: #F5F5F5;
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #f1f1f1;  // $color-body-c
}
</style>