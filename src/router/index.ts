import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import { mountRouterMenu, localsRouter } from './routerMaps';
import { sessionData } from '@/filters/storage';
import { TreeForeach } from "@/filters/common";
import 'nprogress/nprogress.css';
import Event from '@/utils/Event';
import navMenuData from './navbar';
Vue.use(Router);

// 解决报错 NAVIGATION.
const originalPush: any = Router.prototype.push;
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () => new Router({
  routes: mountRouterMenu,
  mode: 'hash',  // hash  history
});

const router: any = createRouter();

// 清除路由
export function resetRouter() {
  const newRouter: any = createRouter();
  router.matcher = newRouter.matcher;
}

let routeType = 0;  // 初始标识
// 设置路由权限列表
export const setChildrenRoute = () => {
  const lists: any = sessionData("get", "HasSessionRouterMap", '');  // 后台缓存路由
  const navMenuList = JSON.parse(lists);
  
  let routerNewsList = mountRouterMenu;     // 挂载路由

  if(navMenuList) {
    const getMenuList = (data:any[], callback)=> {
      data.forEach(item=> {
        if(item.type === 'MENU') {
          if(item.child && item.child.length > 0) {
            getMenuList(item.child, callback);
          }
          callback(item);
        }
      })
    }
    getMenuList(navMenuList, (tree)=> {
      localsRouter.forEach(el=> {
        if (tree.code === el.path) {
          if(tree.child && tree.child.length > 0) {
            el.meta.btnPermissions = tree.child.map(item => item.name);
          }
          routerNewsList[0].children.push(el);
        }
      })
    })

    // console.log(`缓存后台权限路由：${routerNewsList}`);
    
    router.addRoutes(routerNewsList);
  }
};
// 刷新挂载
if(routeType === 0) setChildrenRoute()

// 登陆页面路由 name
const LOGIN_PAGE_NAME = ['Login', 'CompanyLogin', '404', 'AgentLogin'];

// 跳转之前
router.beforeEach((to: any, from, next) => {
  Event.$emit('startLoading');
  NProgress.start();
  const token = sessionData('get', 'HasSessionToken', '');
  // console.log(`${to}__${from}__${token}`);
  
  if (token !== null) {
    routeType = 1;
    next();
  } else {
    // 未登陆且要跳转的页面是登录页
    if (LOGIN_PAGE_NAME.includes(to.name) || to.name === 'LoginRegister' || to.name === 'LoginRetrievePass' || to.name === 'Index') next();
    else {
      // 未登录且要跳转的页面不是登录页，则跳转到登录页
      next({
        name: 'Login'
      });
    }
  }
  
  Event.$emit('endLoading');
  next();
});

// 跳转之后
router.afterEach(to => {
  NProgress.done();
});

export default router;