import client from 'webpack-theme-color-replacer/client';
import forElementUI from 'webpack-theme-color-replacer/forElementUI';
import { sessionData } from '@/filters/storage';

// 注意自己项目里的引入路径
const appConfig = require('./app-config.ts');

export let curColor = appConfig.themeColor;

/**
 * @description: 动态切换主题色 https://blog.csdn.net/pnjtvxcp/article/details/108141255
 * @param {string} newColor 颜色
 * @return {*}
 */
export function changeThemeColor(newColor: string) {
  let options = {
    newColors: [...forElementUI.getElementUISeries(newColor)]
  }
  // console.log(newColor);
  return client.changer.changeColor(options, Promise)
    .then(() => {
      curColor = newColor;
      // localStorage.setItem('theme_color', curColor)
    })
}

// 更新
export function initThemeColor() {
  let savedColor:any = sessionData('get', 'HasSessionThemeColor', '');
  
  if (savedColor) {
    curColor = savedColor
    changeThemeColor(savedColor)
  }
  // console.log(curColor);
}