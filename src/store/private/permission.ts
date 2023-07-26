import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '../index'
import permission from '@/router/navbar';

export interface IterPermissionState {
  permission: object;
}
@Module({
  name: "permission",
  dynamic: true,
  store
})
export default class Permission extends VuexModule implements IterPermissionState {
  permission = <any>permission;

  @Mutation
  private SET_MutationDelPermission(item: string) { 
    let index = this.permission.findIndex(_item=>_item.index === item);  
    if(index != -1) {
      this.permission.splice(index, 1);
    }else {
      this.permission.some((_item, index) => {
        if(_item.child &&  _item.child.length > 0) {
          let index2 = _item.child.findIndex((__item) => __item.index === item);
          if (index2 != -1) {
            this.permission[index].child.splice(index2, 1);
            return true;
          }
        } 
      });
    }
  }

  @Mutation
  private SET_MutationEditPermission(item: any) { 
    let index = this.permission.findIndex(_item=>_item.index === item.index);  
    if(index != -1) {
      this.permission[index] = item;
    }else {
      this.permission.some((_item, index) => {
        if(_item.child &&  _item.child.length > 0) {
          let index2 = _item.child.findIndex((__item) => __item.index === item.index);
          if (index2 != -1) {
            this.permission[index].child[index2] = item;
            return true;
          }
        } 
      });
    }
    this.permission.push([]);
    this.permission.splice(this.permission.length-1, 1);
  }

  @Action
  public async storeActionDelPermission(item: string) {  // 删除路由
    this.SET_MutationDelPermission(item);
  }

  @Action
  public async storeActionEditPermission(item: object) {  // 修改路由
    this.SET_MutationEditPermission(item);
  }
}

export const PermissionStore = getModule(Permission)