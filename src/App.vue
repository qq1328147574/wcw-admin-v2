<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { sessionData } from '@/filters/storage';
import { UserStore } from '@/store/private/user';
import { CommonStore } from '@/store/private/common';
import { changeThemeColor } from '@/theme/themeColorClient';

@Component({
  components: {},
})
export default class Index extends Vue {
  created () {
    // 更换默认颜色
    changeThemeColor('#37474f');
    
    // 重新载入路由
    const routersMapList = UserStore.RouterMap;
    const sessionRouterMap: any = sessionData('get', 'HasSessionRouterMap', '');
    if (routersMapList.length === 0 && sessionRouterMap !== null) {
      this.getUserAddRoutes();
      UserStore.storeActionRouterMap(JSON.parse(sessionRouterMap));
      console.log(`【刷新】再次执行路由${routersMapList}`);
    }
    
    // 获取公共资源
    let token = sessionData('get', 'HasSessionToken', '');
    if(!token) return 
    // CommonStore.storeActionCoinList();
    CommonStore.storeActionCountryList();
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
	private getUserAddRoutes() {
    const getLastUrl = this.getRouterUrl();
    this.$router.push({path: getLastUrl});
  }
}
</script>

<style lang="scss">


</style>
