// 递归遍历
const TreeForeach = (tree, func) => {
  if (!tree || typeof tree !== 'object') return null;
  tree.forEach((data) => {
    console.log(data);
    if (typeof data.child === 'object' && data.child.length > 0 && data.type == 'MENU') { // 遍历一层
      TreeForeach(data.child, func);   // 函数调用函数自身
    } else {
      func(data);                         // 递归出口
    }
  })
}

// 去重
const FormatArrMapHas = (tree) => {
  let map = new Map();
  for (let item of tree) {
    if (!map.has(item.title)) {
      map.set(item.title, item);
    }
  }
  return [...map.values()]
}

/**
 * @param {*} time  时间戳
 * 
 * @param {*} Y  年
 * @param {*} m  月
 * @param {*} d  日
 * @param {*} H  时
 * @param {*} M  分
 * @param {*} S  秒
 * @returns 
 */
const FormatCurrentTime = (fmt, time) => {
  let date = new Date(time)
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(),
    "m+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "M+": date.getMinutes().toString(),
    "S+": date.getSeconds().toString()
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt
}

/**
 * 定义一个深拷贝函数  接收目标target参数
 * 
 */
const deepCloneData = (target) => {
  // 定义一个变量
  let result;
  // 如果当前需要深拷贝的是一个对象的话
  if (typeof target === 'object') {
    // 如果是一个数组的话
    if (Array.isArray(target)) {
      result = []; // 将result赋值为一个数组，并且执行遍历
      for (let i in target) {
        // 递归克隆数组中的每一项
        result.push(deepCloneData(target[i]))
      }
      // 判断如果当前的值是null的话；直接赋值为null
    } else if(target===null) {
      result = null;
      // 判断如果当前的值是一个RegExp对象的话，直接赋值    
    } else if(target.constructor===RegExp){
      result = target;
    }else {
      // 否则是普通对象，直接for in循环，递归赋值对象的所有值
      result = {};
      for (let i in target) {
        result[i] = deepCloneData(target[i]);
      }
    }
   // 如果不是对象的话，就是基本数据类型，那么直接赋值
  } else {
    result = target;
  }
  // 返回最终结果
  return result
}

/**
 * scrollReveal 动画
 * 
 * @param {*} duration  动画的时长
 * @param {*} origin    动画开始的位置，'bottom', 'left', 'top', 'right'
 * @param {*} reset     回滚的时候是否再次触发动画
 * @param {*} mobile    在移动端是否使用动画
 * @param {*} distance 
 * @returns 
 */
 export function scrollRevealEffect(duration: number, origin: string, reset: boolean, mobile: boolean, distance: string) {
  let item = {
    // 动画的时长
    duration: duration,
    // 延迟时间
    delay: 0,
    // 动画开始的位置
    origin: origin,
    // 回滚的时候是否再次触发动画
    reset: reset,
    // 在移动端是否使用动画
    mobile: mobile,
    // 滚动的距离，单位可以用%，rem等
    distance: distance,
    // 其他可用的动画效果
    opacity: 0.001,
    easing: 'linear',
    scale: 1,
  };
  return item
}

/**
 * 暴露函数  去除HTML tag
 */
export function removeHTMLTag(str) {
  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
  str = str.replace(/\s+/g, ''); //去除多余空行
  str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;

  return str
}

export { 
  TreeForeach, 
  FormatArrMapHas, 
  FormatCurrentTime, 
  deepCloneData 
}