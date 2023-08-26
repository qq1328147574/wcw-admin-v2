<template>
  <div class="v-theme-wrap">
    <el-drawer
      title=""
      :size="currentWindow ? '15%' : '70%'"
      :visible.sync="value"
      :with-header="false"
      @close="onCloseIconClick" 
    >
      <div class="v-drawer-picker">
        <div class="page-container">
          <p class="v-title">整体风格设置</p>
          <div class="v-img-box">
            <el-tooltip class="item" effect="dark" content="暗色菜单风格" placement="top">
              <span>导航</span>
            </el-tooltip>
            <img src="@/assets/LCkqq.svg" alt="LCkqq.svg" class="v-img">
            <div class="v-success-icon">
              <i class="el-icon-success"></i>
            </div>
          </div>
        </div>
        <div class="page-container">
          <p class="v-title">主题色</p>
          <ul class="v-color-box">
            <li @click="onSuccessIconClick(0, '#409EFF')">
              <el-tooltip class="item" effect="dark" content="拂晓蓝" placement="top">
                <span>主题</span>
              </el-tooltip>
              <span style="background-color: rgb(64, 158, 255);"></span>
              <div class="v-success-icon" v-if="iconSuccessType === 0">
                <i class="el-icon-success"></i>
              </div>
            </li>
            <li @click="onSuccessIconClick(1, '#FAAD14')">
              <el-tooltip class="item" effect="dark" content="日暮" placement="top">
                <span>主题</span>
              </el-tooltip>
              <span style="background-color: rgb(250, 173, 20);"></span>
              <div class="v-success-icon" v-if="iconSuccessType === 1">
                <i class="el-icon-success"></i>
              </div>
            </li>
            <li @click="onSuccessIconClick(2, '#0ABE5F')">
              <el-tooltip class="item" effect="dark" content="极光绿(默认)" placement="top">
                <span>主题</span>
              </el-tooltip>
              <span style="background-color: rgb(103, 194, 58);"></span>
              <div class="v-success-icon" v-if="iconSuccessType === 2">
                <i class="el-icon-success"></i>
              </div>
            </li>
            <li @click="onSuccessIconClick(3, '#722Ed1')">
              <el-tooltip class="item" effect="dark" content="酱紫" placement="top">
                <span>主题</span>
              </el-tooltip>
              <span style="background-color: rgb(114, 46, 209);"></span>
              <div class="v-success-icon" v-if="iconSuccessType === 3">
                <i class="el-icon-success"></i>
              </div>
            </li>
            <li>
              <el-color-picker
                size="medium"
                v-model="mainColor"
                @change="changeColor">
              </el-color-picker>
            </li>
          </ul>
        </div>
        <div class="page-container">
          <p class="v-title">导航模式</p>
          <div class="v-img-box">
            <el-tooltip class="item" effect="dark" content="侧边栏导航" placement="top">
              <span>导航</span>
            </el-tooltip>
            <img src="@/assets/LCkqq.svg" alt="LCkqq.svg" class="v-img">
            <div class="v-success-icon">
              <i class="el-icon-success"></i>
            </div>
          </div>
        </div>
        <div class="page-container">
          <div class="weui-flex">
            <div class="weui-flex-bd">内容区域宽度</div>
            <div class="weui-flex-ft">固定</div>
          </div>
        </div>
        
      </div>
      <transition name="el-zoom-in-center">
        <div class="v-close-icon transition-box" @click="onCloseIconClick" v-show="closeLeftIconType" >
          <i class="el-icon-close"></i>
        </div>
      </transition>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { UserStore } from '@/store/private/user';
import { localData } from "@/filters/storage";
import { changeThemeColor, curColor } from '@/theme/themeColorClient';

@Component({})
export default class ThemesColor extends Vue {
  @Prop({ default: true }) value: boolean; // 状态
  
  closeLeftIconType = false;  // 关闭图标
  iconSuccessType:number = 2;
  mainColor = curColor;

  get drawerSyncType() {
    return `${this.value}`
  }

  @Watch("value")
  onWatchValueChange(newVal) {
    // console.log(newVal);
    if(newVal) {
      setTimeout(() => {
        this.closeLeftIconType = newVal
      }, 500)
    }
  }

  created() {
    const ids = localData('get', 'themeSuccessIconType', '');  // 缓存高亮 index
    // console.log(ids);
    if(ids !== null) this.iconSuccessType = Number(ids);
  }

  mounted() {}

  /**
   * @description: 关闭状态 父<->子
   * @param {*} input 事件，绑定value值
   * @return {*}
   */
  onCloseIconClick() {
    this.$emit("input", false);
    this.closeLeftIconType = false;
  }

  /**
   * @description: 切换颜色,路由模式hash
   * @param {number} ids 标识
   * @param {string} newColor 颜色
   * @return {*}
   */
  onSuccessIconClick(ids, newColor) {
    this.$message.success('切换成功');
    UserStore.storeActionThemesColor(newColor);
    localData('set', 'themeSuccessIconType', ids);
    this.iconSuccessType = ids;
    this.mainColor = newColor;

    // 传递值
    changeThemeColor(newColor).then(() => {
      console.log('获取颜色成功')
    })
  }

  /**
   * @description: 自由切换颜色,路由模式hash
   * @param {string} newColor 颜色
   * @return {*}
   */
  changeColor(newColor) {
    this.$message.success('切换成功');
    UserStore.storeActionThemesColor(newColor);
    localData('set', 'themeSuccessIconType', '-1');
    this.iconSuccessType = -1;
    
    // 传递值
    changeThemeColor(newColor).then(() => {
      console.log('自由获取颜色成功')
    })
  }
}
</script>

<style lang="scss" scoped>
.v-close-icon {
  cursor: pointer;
  z-index: 99999;
  position: fixed;
  top: 50%;
  right: 15%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  border-radius: 6px 0 0 6px;
  color: #fff;
  background-color: $defaultColor;
}
.v-drawer-picker {
  padding: 6px 16px 16px;
  .el-tooltip {
    position: absolute;
    top: 4px;
    width: 100% !important;
    opacity: 0;
  }
  .page-container {
    padding: 10px 0 16px;
    &:nth-child(2) {
      padding-top: 0;
      border-bottom: 2px solid #eeeeee;
    }
    .weui-flex {
      font-size: 14px;
      color: #666;
      .weui-flex-ft {
        padding: 4px 16px;
        border: 1px solid #eeeeee;
        border-radius: 4px;
      }
    }
    .v-title {padding: 6px 0 16px;}
    .v-success-icon {
      position: absolute;
      bottom: 8px;
      right: 4px;
      font-size: 14px;
      color: #0ABE5F;
    }
    .v-img-box {
      cursor: pointer;
      position: relative;
      display: inline-block;
      .el-tooltip {
        font-size: 26px;
      }
    }
    .v-color-box {
      font-size: 0;
      > li {
        cursor: pointer;
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        padding: 3px;
        vertical-align: middle;
        margin-right: 10px;
        font-size: 12px;
        border: 1px solid #eee;
        border-radius: 4px;
        .v-success-icon {
          bottom: 4px;
          right: 6px;
          font-size: 12px;
          color: #fff;
        }
        &:last-child {
          padding: 0;
          border: none;
          border-radius: 0;
        }
        span {
          display: block;
          width: 28px;
          height: 28px;
          border-radius: 4px;
        }
      }
    }
  }
}
.head{
  height:100px;
  width: 100%; 
  background-color: #0ABE5F;
}
.font-test{
  font-size: 20px;
  line-height: 40px;
  color: #0ABE5F;
}
.font-test1{
  font-size: 20px;
  line-height: 40px;
  color: #000000;
}

@media screen and (max-width: 768px) {
  .v-close-icon{
    right: 70%;
    width: 40px;
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    border-radius: 6px 0 0 6px;
  }
  .v-drawer-picker{
    padding: 6px 16px 16px;
    .page-container{
      padding: 10px 0 16px;
      .v-title {padding: 4px 0 16px; font-size: 14px;}
      .weui-flex {
        font-size: 14px;
        .weui-flex-ft {
          padding: 2px 12px;
          border-radius: 4px;
        }
      }
      .v-success-icon {
        bottom: 8px;
        right: 4px;
        font-size: 14px;
      }
      .v-color-box {
        & > li {
          padding: 3px;
          margin-right: 10px;
          border-radius: 4px;
          span {
            width: 28px;
            height: 28px;
            border-radius: 4px;
          }
          .v-success-icon {
            bottom: 4px;
            right: 6px;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>