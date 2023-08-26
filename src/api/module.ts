/** 
 *  @description 规则小驼峰（webGet + Admin + 文件名）。接口信息定义: 以当前接口请求头作为别名,并将相关接口放置在该文件下
 *  @date 1949-10-01
 */
import service from '@/common/https/httpService';    

// 首页用户统计
export const webGetAdminUserMemberStatistics = params => service.post('/api/ping/home/homeMemberStatistics', {data: params, needEn: true});
// 首页用户注册统计
export const webGetAdminUserRegistrationsStatistics = params => service.post('/api/ping/home/userRegistrations', {data: params, needEn: true});
// 首页资产统计
export const webGetAdminUserRegistrationsStatisticsList = params => service.post('/api/ping/home/homeAssetsRecordStatistics', {data: params, needEn: true});

// 国家列表
export const webGetAdminCountryCodesList = () => service.post('/api/country/list', {data: {}, needEn: true});
// 退出登录
export const webGetAdminLogout = () => service.post('/api/admin/user/out/login', {data: {}, needEn: true});

// 登录
export const webGetAdminLogin2 = params => service.post('/api/auth-admin/login', {data: params, needEn: true});
// 登录
export const webGetAdminLogin = params => service.post('/api/auth-admin/foreverLogin', {data: params, needEn: true});
// 用户路由权限列表
export const webGetAdminLogMenusList = params => service.post('/api/auth-resource/userQueryResourceTree', {data: params, needEn: true});

// 添加-menu
export const webGetAdminAddMenu = params=> service.post('/api/auth-resource/addResource', {data: params, needEn: true});
// 列表-menu
export const webGetAdminGetMenuTree = params => service.post('/api/auth-resource/resourceTree', {data: params, needEn: true});
// 删除-menu
export const webGetAdminRemoveMenu = params => service.post('/api/auth-resource/deleteResource', {data: params, needEn: true});
// 修改-menu
export const webGetAdminUpdateMenu = params => service.post('/api/auth-resource/updateResource', {data: params, needEn: true});
// 初始化资源  
export const webGetAdminInitResource = () => service.post('/api/auth-resource/initResource', {data: {}, needEn: true});
 
// 列表-role
export const webGetAdminGetRoleList = params => service.post('/api/auth-role/queryRole', {data: params, needEn: true});
// 新增-role
export const webGetAdminAddRole = params => service.post('/api/auth-role/addRole', {data: params, needEn: true});
// 修改-role
export const webGetAdminUpdateRole = params => service.post('/api/auth-role/updateRole', {data: params, needEn: true});
// 删除-role
export const webGetAdminDeleteRole = params => service.post('/api/auth-role/deleteRole', {data: params, needEn: true});
// 修改-role Status
export const webGetAdminUpdateStatus = params => service.post('/api/auth-role/updateRole', {data: params, needEn: true});

// 角色添加资源 
export const webGetAdminRoleAddResource = params => service.post('/api/auth-role/roleAddResource', {data: params, needEn: true});
// 角色删除资源 
export const webGetAdminRoleDeleteResource = params => service.post('/api/auth-role/roleDeleteResource', {data: params, needEn: true});
// 查询角色资源
export const webGetAdminGetMenuInfoByRoleId = params => service.post('/api/auth-role/roleQueryResourceTree', {data: params, needEn: true});
 
// 权限用户-列表
export const webGetAdminPowerUserSystemList = params => service.post('/api/security-user/userList', {data: params, needEn: true});
// 权限用户-新增
export const webGetAdminPowerUserSystemAdd = params => service.post('/api/security-user/registerUser', {data: params, needEn: true});
// 权限用户-修改
export const webGetAdminPowerUserSystemUpdate = params => service.post('/api/security-user/updateUser', {data: params, needEn: true});
// 权限用户-取消绑定
export const webGetAdminPowerUserSystemDelete = params => service.post('/api/security-user/unbound', {data: params, needEn: true});
// 权限用户-修改 Status
export const webGetAdminPowerUserSystemStatus = params => service.post('/api/security-user/updateUser', {data: params, needEn: true});
 
// 添加-admin
export const webGetAdminAddAdmin = params=> service.post('/api/auth-admin/addAdmin', {data: params, needEn: true});
// 列表-Admin
export const webGetAdminGetAdminList = params => service.post('/api/auth-admin/queryAdminList', {data: params, needEn: true});
// 删除-Admin
export const webGetAdminRemoveAdmin = params => service.post('/api/security-Admin/delAdmin', {data: params, needEn: true});
// 修改-Admin  
export const webGetAdminUpdateAdmin = params => service.post('/api/security-Admin/updateAdmin', {data: params, needEn: true});
// 修改管理员状态
export const webGetAdminUpDateAdminStatus = param => service.post('/api/auth-admin/adminStatus', {data: param, needEn: true})
// 查询全部角色
export const webGetAdminQueryRoleList = param => service.post('/api/auth-role/queryRoleList', {data: param, needEn: true})
// 修改管理员密码
export const webGetAdminUpDateAdminPwd = param => service.post('/api/admin/updatePwd', {data: param, needEn: true})

// 用户添加角色 
export const webGetAdminUserAddRole = param => service.post('/api/auth-role/userAddRole', {data: param, needEn: true});
// 用户删除角色 
export const webGetAdminUserDeleterRole = param => service.post('/api/auth-role/userDeleteRole', {data: param, needEn: true});
// 用户查询角色 
export const webGetAdminUserQueryRole = param => service.post('/api/auth-role/userQueryRole', {data: param, needEn: true});

// 查询接口文档
export const webGetAdminApiList = params => service.post('back/api/security-api/apiList', {data: params, needEn: true}); 
// 查询后台系统日志
export const webGetAdminSystemLogList = params => service.post('/api/sys-log/list', {data: params, needEn: true}); 
// 查询登录日志
export const webGetAdminLoginLogList = params => service.post('/api/auth-account-log/queryAccountLog', {data: params, needEn: true}); 

// 添加-字典分组
export const webGetAdminAddDictionaryGroup = params=> service.post('/api/auth-dictionary-group/addDictionaryGroup', {data: params, needEn: true});
// 列表-字典分组
export const webGetAdminGetDictionaryGroupList = params => service.post('/api/auth-dictionary-group/dictionaryGroupList', {data: params, needEn: true});
// 删除-字典分组
export const webGetAdminRemoveDictionaryGroup = params => service.post('/api/auth-dictionary-group/delDictionaryGroup', {data: params, needEn: true});
// 修改-字典分组
export const webGetAdminUpdateDictionaryGroup = params => service.post('/api/auth-dictionary-group/updateDictionaryGroup', {data: params, needEn: true});

// 添加-字典数据
export const webGetAdminAddDictionary = params=> service.post('/api/auth-dictionary/addDictionary', {data: params, needEn: true});
// 列表-字典数据
export const webGetAdminGetDictionaryList = params => service.post('/api/auth-dictionary/dictionaryList', {data: params, needEn: true});
// 删除-字典数据
export const webGetAdminRemoveDictionary = params => service.post('/api/auth-dictionary/delDictionary', {data: params, needEn: true});
// 修改-字典数据
export const webGetAdminUpdateDictionary = params => service.post('/api/auth-dictionary/updateDictionary', {data: params, needEn: true});
// 初始化数据字典
export const webGetAdminInitDictionaryCache = () => service.post('/api/auth-dictionary/initDictionaryCache', {data: {}, needEn: true });

// 添加-全部通知
export const webGetAdminAllNoticeAdd = params=> service.post('/api/back/wu-notice/addAllNotice', {data: params, needEn: true});
// 添加-通知
export const webGetAdminAddNotice = params=> service.post('/api/back/wu-notice/addNewNotice', {data: params, needEn: true});
// 添加-子通知
export const webGetAdminAddChildNotice = params=> service.post('/api/back/wu-notice/addNotice', {data: params, needEn: true});
// 列表-通知
export const webGetAdminGetNoticeList = params => service.post('/api/back/wu-notice/noticeList', {data: params, needEn: true});
// 删除-通知
export const webGetAdminRemoveNotice = params => service.post('/api/back/wu-notice/delNotice', {data: params, needEn: true});
// 删除-子通知
export const webGetAdminRemoveChildNotice = params => service.post('/api/back/wu-notice/delNoticeCode', {data: params, needEn: true});
// 修改-通知
export const webGetAdminUpdateNotice = params => service.post('/api/back/wu-notice/updateNotice', {data: params, needEn: true});

// 添加-新闻公告
export const webGetAdminNewsMediaAdd = params=> service.post('/api/back/wu-media/addMedia', {data: params, needEn: true});
// 列表-新闻公告
export const webGetAdminGetNewsMediaList = params => service.post('/api/back/wu-media/mediaList', {data: params, needEn: true});
// 删除-新闻公告
export const webGetAdminNewsMediaRemove = params => service.post('/api/back/wu-media/delMedia', {data: params, needEn: true});
// 修改-新闻公告
export const webGetAdminNewsMediaUpdate = params => service.post('/api/back/wu-media/updateMedia', {data: params, needEn: true});

// 设置为弹出式公告
export const webGetAdminSetEjectNotice = params => service.post('/api/back/wu-media/ejectNotice', {data: params, needEn: true});

// 列表-后台文件
export const webGetAdminGetFileList = params => service.post('/api/security-local-storage/localStorageList', {data: params, needEn: true});
// 删除-后台文件
export const webGetAdminRemoveFile = params => service.post('/api/security-local-storage/delFile', {data: params, needEn: true});


// 系统配置- 轮播图列表 
export const webGetAdminUserSystemBannerList = params => service.post('/api/back/wu-slideshow/list', {data: params, needEn: true});
// 系统配置- 轮播图添加
export const webGetAdminUserSystemBannerAdd = params => service.post('/api/back/wu-slideshow/add', {data: params, needEn: true});
// 系统配置- 轮播图修改
export const webGetAdminUserSystemBannerUpdate = params => service.post('/api/back/wu-slideshow/update', {data: params, needEn: true});
// 系统配置- 轮播图删除
export const webGetAdminUserSystemBannerDelete = params => service.post('/api/back/wu-slideshow/delete', {data: params, needEn: true});

// 添加url过滤
export const webGetAdminUserAddUrlFilter = params => service.post('/api/auth-url-filter/addUrlFilter', {data: params, needEn: true});
// 删除url过滤
export const webGetAdminUserDeleteUrlFilter = params => service.post('/api/auth-url-filter/deleteUrlFilter', {data: params, needEn: true});
// 查询url过滤
export const webGetAdminUserQueryUrlFilter = params => service.post('/api/auth-url-filter/queryUrlFilter', {data: params, needEn: true});
// 修改url过滤
export const webGetAdminUserUpdateUrlFilter = params => service.post('/api/auth-url-filter/updateUrlFilter', {data: params, needEn: true});


// 增加新闻
export const webGetAdminNewsAdd = params => service.post('/api/back/wu-notice/addNewNotice', {data: params, needEn: true});
// 新闻列表
export const webGetAdminNewsList = params => service.post('/storage/api/admin/hr-news/list', {data: params, needEn: true});
// 删除新闻
export const webGetAdminNewsDelete = params => service.post('/storage/api/admin/hr-news/remove', {data: params, needEn: true});
// 修改新闻
export const webGetAdminNewsUpdate = params => service.post('/storage/api/admin/hr-news/update', {data: params, needEn: true});

// 获取API访问状态
export const webGetAdminQueryApiStatus = params => service.post('/api/auth-api/getApiStatus', {data: params, needEn: true});
// 修改API访问状态
export const webGetAdminUpdateApiStatus = params => service.post('/api/auth-api/updateApiStatus', {data: params, needEn: true});

// 查询系统配置
export const webGetAdminGetSystemConfig = params => service.post('/api/back-system-config/backSystemConfigList', {data: params, needEn: true});
// 修改系统配置
export const webGetAdminUpdateSystemConfig = params => service.post('/api/back-system-config/backUpdateSystemConfig', {data: params, needEn: true});
