import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { sessionData } from '@/filters/storage';

import { 
  webGetAdminGetCoinList,
  webGetAdminCountryCodesList,
  
} from "@/api/index"

export interface IterCommonConfigState {

}
export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

@Module({
  name: "CommonConfig",
  dynamic: true,
  store
})
export default class CommonConfig extends VuexModule implements IterCommonConfigState {
  coinList:any[] = []; // 币种列表 
  countryList: any[] = []; // 国家列表

  get getCoinName() { 
    let obj = {}
    let i18n = sessionData('get', 'accessLocaleI18n', '') || 'zh-CN';
    this.coinList.forEach(item=> {
      obj[item.coinName] = i18n === 'zh-CN' ? item.cnName : item.shortName
    })
    return obj
  }

  get getCountryList() {
    let i18n = sessionData('get', 'accessLocaleI18n', '') || 'zh-CN';
    return this.countryList.map(item=> {
      return {
        ...item,
        name: item.name + ' - ' + item.en
      }
    })
  }


  @Action
  public async storeActionCoinList() {  // 获取币种列表
    const {data: res} = await webGetAdminGetCoinList({});
    if(res.code === 20000) {
      this.SET_StoreMutationCoinList(res.data);
    }
  }
  @Action
  public async storeActionCountryList() {  // 获取国家列表
    const {data: res} = await webGetAdminCountryCodesList();
    if(res.code === 20000) {
      this.SET_StoreMutationCountryList(res.data);
    }
  }

  @Mutation
  private SET_StoreMutationCoinList(item: any) {
    this.coinList = item;
  }
  @Mutation
  private SET_StoreMutationCountryList(item: any) {
    this.countryList = item;
  }

}

export const CommonStore = getModule(CommonConfig)