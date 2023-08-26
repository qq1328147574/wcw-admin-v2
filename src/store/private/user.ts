import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { localData } from '@/filters/storage';

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

@Module({ name: 'user', dynamic: true, namespaced: false, store })
export default class User extends VuexModule {
  public Token: any = null;
  public UserName: string = '';
  public UserId: any = '';
  public MenuItemId: any = '';
  public MenuItem: any = [];
  public RouterMap: any = [];
  public TagListMap: any = [];

  public getUserHomeEchartsPiesMap: any = {};   // 首页用户统计
  public getUserHomeEchartsLinesMap: any = [];  // 首页用户注册统计
  public getExportExcelsMap: any = [];    // 导出数据
  public getStoreThemesColor: any = '';   // 颜色主题

  get getUserName() {
    return `${this.UserName}`;
  }
  get getHomeStoreThemesColor() {
    return this.getStoreThemesColor;
  }
  
  get getExportExcelsList() {
    return this.getExportExcelsMap;
  }
  get getStoreUserHomeEchartsPiesMap() {
    return this.getUserHomeEchartsPiesMap;
  }
  get getStoreUserHomeEchartsLinesMap() {
    return this.getUserHomeEchartsLinesMap;
  }

  @Action
  public storeActionToken(item: any) {
    this.SET_StoreToken(item);
  }
  @Action
  public storeActionUserId(item: any) {
    this.SET_StoreUserId(item);
  }
  @Action
  public storeActionUserName(item: string) {
    this.SET_StoreUserName(item);
  }
  @Action
  public storeActionTagsListMap(item: any) {
    this.SET_StoreTagsItem(item);
  }
  @Action
  public storeActionMenuMap(item: string) {
    this.SET_StoreMenuItem(item);
  }
  @Action
  public storeActionLeftMenuMapId(item: string) {
    this.SET_StoreMenuItemId(item);
  }
  @Action
  public storeActionRouterMap(item: any) {
    this.SET_StoreRouterMap(item);
  }

  @Action
  public storeActionThemesColor(item: any) {  // 颜色切换
    this.SET_StoreMutationThemesColor(item);
    // console.log(item);
  }
  @Action
  public storeExportExcelsMap(item: any) {  // 导出表格状态
    this.SET_StoreExportExcelsMap(item);
  }

  @Action
  public storeUserHomeEchartsPiesMap(item: any) {  // 首页用户统计 饼状图
    this.SET_StoreUserHomeEchartsPiesMap(item);
    // console.log(item);
  }
  @Action
  public storeUserHomeEchartsLinesMap(item: any) {  // 首页用户注册统计 走势图
    this.SET_StoreUserHomeEchartsLinesMap(item);
    // console.log(item);
  }

  @Mutation
  private SET_StoreToken(item: any) {
    this.Token = item;
    localData('set', 'HasSessionToken', item);
    console.log(`【缓存】___用户TOKEN___${true}`);
  }
  @Mutation
  private SET_StoreUserId(item: any) {
    this.UserId = item;
    localData('set', 'HasSessionUserId', item);
    console.log(`【缓存】___用户ID___${true}`);
  }
  @Mutation
  private SET_StoreUserName(item: string) {
    this.UserName = item;
    localData('set', 'HasSessionUserName', item);
    console.log(`【缓存】___用户名___${item}`);
  }
  @Mutation
  private SET_StoreMenuItem(item: string) {
    this.MenuItem = item;
    localData('set', 'HasSessionMenuItem', item);
    console.log(`【缓存】___Navs左侧路菜单___${true}`);
  }
  @Mutation
  private SET_StoreMenuItemId(item: string) {
    this.MenuItemId = item;
    localData('set', 'HasSessionMenuItemId', item);
    console.log(`【缓存】___Navs左侧路菜单INDEX___${item}`);
  }
  @Mutation
  private SET_StoreRouterMap(item: any) {
    this.RouterMap = item;
    localData('set', 'HasSessionRouterMap', item);
    console.log(`【缓存】___初次执行路由___${item}`);
  }
  @Mutation
  private SET_StoreTagsItem(item: any) {
    this.TagListMap = item;
    localData('set', 'HasSessionTagsMap', item);
    console.log(`【缓存】___Tags标签数组___${item}`);
  }

  @Mutation
  private SET_StoreMutationThemesColor(item: any) {
    this.getStoreThemesColor = item;
    localData('set', 'HasSessionThemeColor', item);
  }
  @Mutation
  private SET_StoreExportExcelsMap(item: any) {
    this.getExportExcelsMap = item;
  }
  @Mutation
  private SET_StoreUserHomeEchartsPiesMap(item: any) {
    this.getUserHomeEchartsPiesMap = item;
    console.log(`【缓存】___饼状图___${item}`);
  }
  @Mutation
  private SET_StoreUserHomeEchartsLinesMap(item: any) {
    // console.log(item);
    this.getUserHomeEchartsLinesMap = item;
  }
}

export const UserStore = getModule(User);