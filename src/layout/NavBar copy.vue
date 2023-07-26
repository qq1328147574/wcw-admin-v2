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
import { sessionData } from "@/filters/storage";
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
  activeLocale: string = (sessionData("get", "accessLocaleI18n", "") as string) || "zh-CN";
  
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
      const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
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
    const sessionRouterId: any = sessionData('get', 'HasSessionMenuItemId', '');
    const getLocaleI18n: any = sessionStorage.getItem('accessLocaleI18n');
    const adminUsername: any = sessionData('get', 'adminUser', '');
    
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
    const navBarMenuData = this.navMenuListData;
    // console.log(newVal);

    navBarMenuData.forEach(item => {
      if(item.child && item.child.length > 0) {
        let data = item.child;
        // 判断 比对子级 children
        let key = data.findIndex(item => item.router === newVal.path);
        // 存在就赋值
        if(key != -1) {
          let index = data[key].index.split('-');
          if(_that.currentWindow) this.activeIndex = index[0]
          else this.activeIndex = data[key].index
          
        }
        
      } else {
        if(item.router === newVal.path) this.activeIndex = item.index
      }
    });

    // console.log(`当前高亮ID:${_that.activeIndex}`);
    // console.log(_that.currentWindow);
  };

  /**
   * @description: 导航栏
   * @param {*} index  -父标识
   * @return {*}
   */
  getNavsMenuItemData() {
    const routerData: any = sessionData('get', 'HasSessionRouterMap', ''); // 获取并循环 左侧路由数组
    let navbarData: any = JSON.parse(routerData);

    console.log(`初始导航路由:${navbarData}`);

    if (navbarData.length > 0) {
      // 添加标识
      navbarData.forEach( (el, i) => {
        let data = el.child;
        el.index = i.toString();       // 父标识
        if (data.length > 0) {
          data.forEach( (cd, j) => {
            cd.child = [];
            let num = Number(j) + 1;
            let index = (i + '-' + num).toString();
            cd.index = index;  // 子标识
          });
        }
      });

      this.navMenuListData = navbarData;
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
  @include flex-direction(column, flex-start);
  border-right: 1px solid #e6e6e6;
  .navBar-hd {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;
    .avatar {
      width: 38px;
      height: 38px;
      margin-right: 10px;
      background: #162630;
      line-height: 38px;
      text-align: center;
      color: #fff;
      border-radius: 50%;
    }
    .username {
      > p {
        cursor: pointer;
        color: #999999;
        i {
          color: $defaultColor;
        }
      }
    }
  }
  .navBar-bd {
    flex: 1;
    padding: 20px 10px 10px;
    min-width: 260px;
    overflow-y: auto;
    .el-menu {
      border-right: 0;
    }
    ul {
      position: relative;
      z-index: 9;
      height: 100%;
    }

    .sidebar::-webkit-scrollbar {
      width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
      width: 100%;
    }

    .sidebar > ul {
      height: 100%;
    }
  }
  .navBar-ft {
    padding: 20px 0 20px 40px;
    .logo {
      img {
        height: 32px;
      }
    }
    span {
      color: #999999;
    }
  }
  .navBar-bd-h5 {
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    overflow-y: auto;
    .el-menu{
      width: 100%;
      border-right: 0;
      .el-menu-item{
        width: 100%;
      }
    }
  }
}
.menu-arrow-right {
  float: right;
  display: flex;
  align-items: center;
  height: 100%;
}

@media  screen and (max-width: 768px) {
  .navBar {
    .navBar-hd {
      .avatar {
        width: 30px;
        height: 30px;
        line-height: 30px;
      }
    }
  }
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