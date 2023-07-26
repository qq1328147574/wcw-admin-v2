import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import i18n from './langs';
import filters from './filters';
import VMixin from './utils/vueMixin';

import myECharts from "./components/Echarts/common";    // 挂载图表
import VueWechatTitle from 'vue-wechat-title';  // title
import VueClipboard from 'vue-clipboard2';    // 复制
import hljs from 'highlight.js';             // 代码高亮文件引入
import Viewer from 'v-viewer';
import { permission } from '@/utils/directive'; 
import { initThemeColor } from './theme/themeColorClient'; // 主题换肤

import * as VueGoogleMaps from 'vue2-google-maps';     // 谷歌地图
// import './common/https/nodeRSA';

import './assets/styles/css/font.css';
import './assets/styles/css/main.css';
import './assets/styles/common.scss';
import './assets/styles/theme/index.css';
import 'viewerjs/dist/viewer.css';
import 'highlight.js/styles/atom-one-dark.css'; //样式文件,文件里面还有其他样式可供选择
// import './rem' // 动态计算html fontSize

import Dialog from '@/components/Dialog/index.vue';
import Drawer from '@/components/Drawer/index.vue';
import Search from '@/components/Search/index.vue';
import Popup from '@/components/Popup/index.vue';
import VForm from '@/components/VForm/index.vue';

// 初始化
initThemeColor();
/**
 *  引入图片查看器
 */
Vue.use(Viewer);
Vue.use(VueClipboard);
Vue.use(VueWechatTitle);
Vue.use(myECharts);
Vue.component('Dialog', Dialog);
Vue.component('Drawer', Drawer);
Vue.component('Search', Search);
Vue.component('Popup', Popup);
Vue.component('VForm', VForm);
Vue.directive('permission', permission);

Vue.directive('highlight',function (el) {
  // hljs.configure({useBR: true});
  let blocks: any = el.querySelectorAll('pre code');
  blocks.forEach((block) => {
    hljs.highlightBlock(block)
  })
});
// 需要配置的属性 注意属性并没有引号
Viewer.setDefaults({
  inline: false,
  title: false,
  toolbar: true, // 工具栏
  movable: false, // 拖动
  button: false,
  fullscreen: true,
  zIndex: 3001,
});

// 全局过滤器
Object.keys(filters).forEach(filterName => {
  Vue.filter(filterName, filters[filterName])
})

// 谷歌
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyBOAbyrpY3SD8U1sl1yB_u3mJi5ZMlbAiQ', // 替换成可用的 API 密钥
    libraries: 'places',
  },
  installComponents: true
});

// 全局Mixin
Vue.mixin(VMixin);

Vue.config.productionTip = false;

window['vm'] = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
