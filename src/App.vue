<template>
  <div id="app">
    <router-view v-wechat-title="$t('Common.' + $route.meta.title)" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { localData } from '@/filters/storage';
import { UserStore } from '@/store/private/user';
import { CommonStore } from '@/store/private/common';
import { changeThemeColor } from '@/theme/themeColorClient';
import { webGetAdminLogMenusList } from '@/api';
import { setChildrenRoute } from "@/router";

@Component({
  components: {},
})
export default class Index extends Vue {
  '$route': any;
  created () {
    // 更换默认颜色
    changeThemeColor('#37474f');
    
    // 重新载入路由
    const routersMapList = UserStore.RouterMap;
    const sessionRouterMap: any = localData('get', 'HasSessionRouterMap', '');
    if (routersMapList.length === 0 && sessionRouterMap !== null) {
      this.getUserAddRoutes();
      UserStore.storeActionRouterMap(JSON.parse(sessionRouterMap));
      console.log(`【刷新】再次执行路由${routersMapList}`);
    }
    
    // 获取公共资源
    let token = localData('get', 'HasSessionToken', '');
    if(!token) return 
    // CommonStore.storeActionCoinList();
    CommonStore.storeActionCountryList();

    this.getRoute();
  };

  mounted() {}

  /**
   * @description: 首先获取 Url，然后把 Url 通过 // 截成两部分，再从后一部分中截取相对路径。如果截取到的相对路径中有参数，则把参数去掉。
   * @param {*} split -url "//"
   * @return {*} https://www.cnblogs.com/exmyth/p/7833240.html
   */
  private getRouterUrl() {
    const url = document.location.toString();
    const arrUrl = url.includes('#') ? url.split("#") : url.split("//");  // 判断当前路由模式

    const start = arrUrl[1].indexOf("/");
    let relUrl = arrUrl[1].substring(start); //stop省略，截取从start开始到结尾的所有字符

    // split 截取 ？参数
    if (relUrl.indexOf("?") != -1) {
      relUrl = relUrl.split("?")[0];
    }

    return relUrl
  }

  // 刷新路由
	getUserAddRoutes() {
    const getLastUrl = this.getRouterUrl();
    this.$router.push({path: getLastUrl});
  }

  async getRoute() {
    const response = await webGetAdminLogMenusList({});
      if(response.data.code === 20000) {
        let data = response.data.data;
        localStorage.setItem('allPermissions', JSON.stringify(data));

        let filterList: string[] = ['/', '/WEB']; // 需要过滤的权限菜单
        let routerList = data.filter(item=> !filterList.includes(item.code)); // 过滤权限菜单

        routerList.sort((a,b)=> a - b );
        this.filterUserRouterMenu(routerList);

      }
  }

     /**
   * @description: 路由比对
   * @param {Object} item  -路由数据
   * @return {*}
   */
   filterUserRouterMenu(item) {
    UserStore.storeActionRouterMap(item);
    // 初始路由
    setChildrenRoute();

  }
}
</script>

<style lang="scss">


</style>
