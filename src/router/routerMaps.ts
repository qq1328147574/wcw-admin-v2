import Layout from '@/layout/Init.vue'

const getComponentSMin = (name: any) => () => import(`@/views/${name}.vue`)

/** 
 *  动态路由加载 
 */
const getComponentMMin = (name: any, component: any) => {
  return (resolve: any) => require([`@/views/${name}/${component}.vue`], resolve)
}

/**
 *  动态挂载路由1
 *  -navRouters
 */
export const mountRouterMenu: any[] = [
  {
    path: '/',
    name: 'dashboard',
    component: Layout,
    redirect: '/controlcenter',
    children: [
      {
        path: '/controlcenter',
        name: 'controlcenter',
        component: () => import('@/views/dashboard/ControlCenterMin.vue'),
        meta: { title: '控制台' }
      },
      {
        path: '/invite-tree/:id/:userName',
        name: 'InviteTree',
        component: () => import('@/views/common-page/user/userTree.vue'),
        meta: { title: '组织树形图' },
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/userLogin/login.vue'),
    meta: { title: '登录' },
  },
  { path: '/404', name: '404', component: () => import('@/views/404.vue'), meta: { title: '404' } },
  { path: '*', redirect: '/404' }
]
/**
 *  需要比对 -本地路由比对后台路由2
 *  -dynamicRouter
 */
export const localsRouter: any[] = [
  {
    path: '/doc',
    name: 'doc',
    component: () => import('@/views/dashboard/DOC.vue'),
    meta: { title: '文档' }
  },
  {
    path: '/power/permission',
    name: 'PowerPermission',
    component: getComponentMMin('userPower', 'permission'),
    meta: { title: '菜单管理' }
  },
  {
    path: '/power/role',
    name: 'PowerRoleList',
    component: getComponentMMin('userPower', 'roleList'),
    meta: {
      title: '角色管理',
      btnPermissions: ['add', 'edit']
    }
  },
  {
    path: '/power/admin',
    name: 'PowerAdminList',
    component: getComponentMMin('userPower', 'adminList'),
    meta: {
      title: '管理员列表',
      btnPermissions: ['add', 'edit']
    }
  },
  {
    path: '/urlFilter/index',
    name: 'UrlFilter',
    component: () => import('@/views/urlFilter/index.vue'),
    meta: { title: 'URL过滤' }
  },
  {
    path: '/power/log',
    name: 'PowerLogList',
    component: getComponentMMin('userPower', 'logFilter'),
    meta: { title: '日志接口管理' }
  },
  {
    path: '/system/device',
    name: 'DeviceManagementList',
    component: getComponentMMin('systemConfig', 'deviceManagementList'),
    meta: { title: '设备列表' }
  },
  {
    path: '/log/operate',
    name: 'SystemLogList',
    component: () => import('@/views/log/systemLogList.vue'),
    meta: { title: '操作日志列表' }
  },
  {
    path: '/log/login',
    name: 'LoginLogList',
    component: () => import('@/views/log/loginLogList.vue'),
    meta: { title: '登录日志列表' }
  },
  {
    path: '/dictionary/group',
    name: 'DictionaryGroup',
    component: () => import('@/views/dictionary/dictionaryGroup.vue'),
    meta: { title: '字典分组', btnPermissions: ['add', 'edit'] }
  },
  {
    path: '/dictionary/list',
    name: 'DictionaryList',
    component: () => import('@/views/dictionary/dictionaryList.vue'),
    meta: { title: '数据字典', btnPermissions: ['add', 'edit'] }
  },
  {
    path: '/system/media',
    name: 'SystemMediaList',
    component: getComponentMMin('systemConfig', 'systemMediaList'),
    meta: { title: '新闻公告列表' }
  },
  {
    path: '/system/notice',
    name: 'SystemNoticeList',
    component: getComponentMMin('systemConfig', 'systemNotice'),
    meta: { title: '通知列表' }
  },
  {
    path: '/system/banner',
    name: 'SystemBannerList',
    component: getComponentMMin('systemConfig', 'bannerList'),
    meta: { title: '轮播图列表' }
  },
  {
    path: '/collection/list',
    name: 'CollectionList',
    component: getComponentMMin('common-page/collection', 'collectionList'),
    meta: { title: '归集地址列表' }
  },
  {
    path: '/collection/bank-records',
    name: 'CollectionHistory',
    component: getComponentMMin('common-page/collection', 'collectionHistory'),
    meta: { title: '归集历史记录' }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: getComponentMMin('common-page/user', 'userList'),
    meta: { title: '用户列表' }
  },
  {
    path: '/config/exchange-rate',
    name: 'ExchangeRate',
    component: getComponentMMin('common-page/config', 'exchangeRateConfig'),
    meta: { title: '汇率配置' }
  },
  {
    path: '/assets/records',
    name: 'AssetsRecords',
    component: getComponentMMin('common-page/assets', 'assetsRecords'),
    meta: { title: '资产记录' }
  },
  {
    path: '/assets/wallets',
    name: 'assetsWallets',
    component: getComponentMMin('common-page/assets', 'assetsWallet'),
    meta: { title: '用户钱包列表' }
  },
  {
    path: '/bet/order',
    name: 'BetOrder',
    component: getComponentMMin('common-page/bet', 'betOrder'),
    meta: { title: '下注订单' }
  },
  {
    path: '/bet/result',
    name: 'BetResult',
    component: getComponentMMin('common-page/bet', 'betResults'),
    meta: { title: '开奖信息' }
  },
  {
    path: '/bet/number',
    name: 'BetNumber',
    component: getComponentMMin('common-page/bet', 'betNumber'),
    meta: { title: '中奖号码' }
  },
  {
    path: '/config/bet',
    name: 'COnfigBet',
    component: getComponentMMin('common-page/config', 'betConfig'),
    meta: { title: '下注配置' }
  },
  {
    path: '/order/withdraw',
    name: 'OrderWithdraw',
    component: getComponentMMin('common-page/order', 'withdrawRecords'),
    meta: { title: '提现订单' }
  },
  {
    path: '/order/convert',
    name: 'OrderConvert',
    component: getComponentMMin('common-page/order', 'convert'),
    meta: { title: '兑换订单' }
  },
  {
    path: '/order/transfer',
    name: 'OrderTransfer',
    component: getComponentMMin('common-page/order', 'transfer'),
    meta: { title: '会员转会员订单' }
  },
  {
    path: '/assets/withdraw',
    name: 'AssetsWithdraw',
    component: getComponentMMin('common-page/assets', 'withdrawOrder'),
    meta: { title: '提款订单' }
  },
  {
    path: '/assets/voucher-recharge',
    name: 'AssetsVoucherRecharge',
    component: getComponentMMin('common-page/assets', 'voucherRecharge'),
    meta: { title: '凭证充值订单' }
  },
]
