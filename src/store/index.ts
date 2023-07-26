import Vue from 'vue'
import Vuex from 'vuex'
import { IterUserListState } from './private/PageUserList'                 // 用户列表模块
import { IterPermissionState } from './private/permission'                 // 用户列表模块

Vue.use(Vuex)

// 暴露属性
interface IterRootSate {
  UserStore: IterUserListState;
  Permission: IterPermissionState;
}

// 暴露所有接口，暴露所有接口的属性
export default new Vuex.Store<IterRootSate>({})