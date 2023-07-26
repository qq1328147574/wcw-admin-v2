// rem等比适配配置文件
// import EventBus from '../utils/Event';
// // 基准大小
// const baseSize = 16  // 与vue.config.js 中设置的 remUnit 一致
// // 设置 rem 函数
// function setRem () {
//     // 当前页面宽度相对于 1440宽的缩放比例，可根据自己需要修改。
//     let winWidth = document.documentElement.clientWidth;
//     // const scale =  winWidth / 1920;
//     const scale =  winWidth / 1920;
//     // 设置页面根节点字体大小（“Math.min(scale, 2)” 指最高放大比例为2，可根据实际业务需求调整） 按1440px fontSize  1rem = 16px
//     // document.documentElement.style.fontSize = winWidth > 1024 ? baseSize * Math.min(scale, 2) + 'px' : 12 + 'px'
//     document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
// }
// // 初始化
// setRem()
// // 改变窗口大小时重新设置 rem
// window.onresize = function () {
//     setRem()
//     EventBus.$emit('windowOnResize');
// }