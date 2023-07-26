<template>
  <div class="search" id="search" v-if="formColumnData.length > 0">
    <el-form
      ref="searchForm"
      class="searchForm"
      :model="searchData"
      inline
      size="mini"
    >
      <div class="flex wrap">
        <el-form-item
          :label="item.label"
          v-for="(item, index) in formColumnData"
          :key="index"
        >
          <!-- slot -->
          <slot :name="item.slot" v-if="item.slot" :default="searchData"></slot>
          <!-- checkbox -->
          <el-checkbox
            v-else-if="item.type === 'checkbox'"
            v-model="searchData[item.key]"
          ></el-checkbox>
          <!-- select -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="searchData[item.key]"
            :placeholder="item.placeholder || ''"
          >
            <el-option
              v-for="_item in item.options"
              :key="_item.value"
              :label="_item.label"
              :value="_item.value"
            >
            </el-option>
          </el-select>
          <!-- date-picker time1 -->
          <el-date-picker
            v-else-if="item.type === 'time'"
            v-model="searchData[item.key]"
            type="datetime"
            :placeholder="item.placeholder"
            :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
          <!-- date-picker time2 -->
          <el-date-picker
            v-else-if="item.type === 'time2'"
            v-model="searchData[item.key]"
            type="daterange"
            unlink-panels
            range-separator="-"
            :start-placeholder="item.start_placeholder || ''"
            :end-placeholder="item.end_placeholder || ''"
            :value-format="item.format || 'yyyy-MM-dd HH:mm:ss'"
          >
          </el-date-picker>
          <!-- input -->
          <el-input
            :type="item.type"
            v-model="searchData[item.key]"
            :placeholder="item.placeholder || ''"
            v-else
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            class="v-primary-btn search-btn"
            @click="handleSearchClick"
          >
            {{ $t("Common.搜索") }}
          </el-button>
          <el-button
            type="default"
            icon="el-icon-refresh-left"
            size="small"
            class="search-btn"
            @click="handleResetClick"
          >
            {{ $t("Common.重置") }}
          </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import EventBus from "@/utils/Event";

interface CloseType {
  close: boolean;
}
@Component({})
export default class SearchIndex extends Vue {
  formStatus: boolean = false; // 展开或收缩
  expendIconStatus: boolean = false; // 是否显示展开图标
  searchData: object = {}; // 搜索数据

  @Prop({ default: [] }) formColumnData: any; // 传入的搜索的类型

  // @Inject 接收dialog 或者 drawer 传输的组件值， 只能使用对象形式
  @Inject() ComponentCloseType: CloseType;

  // 监听组件关闭值，重置表单
  @Watch("ComponentCloseType", { deep: true })
  onTypeChange(newVal) {
    // console.log(newVal);
    if (!newVal.close) {
      // this.handleResetClick();
      this.$emit("result", this.searchData);
    }
  }

  mounted() {
    this.getExpendStatus();
    EventBus.$on("windowOnResize", () => {
      this.getExpendStatus();
    });
  }

  destroyed() {
    EventBus.$off("windowOnResize");
  }

  /**
   * @description 获取表单的长度， 确定是否需要展开
   * @param {Array} el0W   父元素宽度
   * @param {Array} itemW  子元素宽度集合
   */
  getExpendStatus() {
    let el0: any = document.querySelector("#base-content");
    let el0W = el0.getBoundingClientRect().width;
    let elList = document.querySelectorAll(".search-item");
    // console.log(el0W);

    let itemW = 0;
    if (elList.length > 0) {
      elList.forEach((item) => {
        itemW += item.getBoundingClientRect().width;
      });
      this.expendIconStatus = itemW > el0W - 220 ? true : false;
    }
  }

  /**
   * @description 筛选用户是否输入
   */
  handleSearchClick() {
    let params = {};

    Object.keys(this.searchData).forEach((key) => {
      if (this.searchData[key] && this.searchData[key] !== "") {
        params[key] = this.searchData[key];
      }
    });

    if (Object.keys(params).length > 0) {
      console.log(this.searchData);

      this.$emit("result", this.searchData);
    } else {
      this.$message.error("请输入内容进行搜索!");
    }
  }

  /**
   * @description 重置搜索
   */
  handleResetClick() {
    for (let key in this.searchData) {
      this.searchData[key] = "";
    }
    this.$emit("reset");
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 10px 10px 0;
  background: #90a4ae;
}

::v-deep .el-form-item {
  margin: 0 10px 10px 0;
  display: flex;

  .el-form-item__content {
    flex: 1;
  }
}

::v-deep .el-form-item__label-wrap {
  margin-left: 0px !important;
}

::v-deep .el-form-item__label {
  box-sizing: border-box;
  padding: 0 12px;
  height: 33px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: #37474f !important;
  border-radius: 3px 0 0 3px;
  color: #fff;
  font-size: 13px;
  width: 90px;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  // overflow: hidden;
}

::v-deep .el-input__inner {
  border-radius: 0 3px 3px 0;
  height: 33px;
  line-height: 33px;
}

::v-deep .el-input {
  width: 100%;
}

.el-select {
  width: 100%;
}


::v-deep .el-checkbox__inner {
  margin: 5px 0 0 5px;
}

@media screen and (max-width: 768px) {
  ::v-deep .el-form-item {
    width: 47%;
  }

  .search-btn {
    padding: 9px 10px;
    width: 47%;
  }
}
</style>
