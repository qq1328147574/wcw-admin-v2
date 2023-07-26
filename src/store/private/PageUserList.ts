import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import { 

} from "@/api/index"

export interface IterUserListState {

}
export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

@Module({
  name: "userList",
  dynamic: true,
  store
})
export default class UserList extends VuexModule implements IterUserListState {
  userPageList = <ResponseData>{};


  get getUserPageList() {
    return this.userPageList
  }

  
  @Action
  public async storeActionPageUserList(item: object) {  // 用户注册列表

  }



  @Mutation
  private SET_MutationPageUserList(item: ResponseData) {
    this.userPageList = item;
    // sessionData('set', 'HasSessionToken', item);
  }


}

export const UserListStore = getModule(UserList)