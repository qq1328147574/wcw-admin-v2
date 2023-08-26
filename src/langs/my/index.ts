/** 全局JSON
 *
 *  全局模块 首页/登录
 */
import home from "./Common/index.json";
import Power from "./Power/index.json"; // 权限

// 配置管理模块
import Report from "./Report/index.json";
// 用户管理模块
import Users from "./User/index.json";
// 订单管理模块
import Order from "./Order/index.json";
// 资产管理模块
import Assets from "./Assets/index.json";
// 资产类型
import Type from "./Type.json";

export default {
  Common: {
    ...home,
  },
  Powers: {
    ...Power,
  },
  Report: {
    ...Report,
  },
  Users: {
    ...Users,
  },
  Order: {
    ...Order,
  },
  Assets: {
    ...Assets,
  },
  Type: {
    ...Type,
  },
};
