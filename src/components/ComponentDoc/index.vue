<template>
<!-- 文档组件 -->
  <el-tabs tab-position="left" v-model="activeIndex">
    <el-tab-pane :label="item.title" v-for="(item,index) in docOption" :key="index">
      <div class="panel-content">
        <!-- 副标题 -->
        <div class="panel-hd">{{item.subTitle}}</div>
        <!-- 描述 -->
        <div class="panel-desc"  v-if="item.desc">
          <p class="panel-desc-text" v-for="(desc, descIndex) in item.desc" :key="descIndex">
            <span> {{desc.title}} </span>
            {{desc.desc}}
          </p>
        </div>
        <!-- 请求地址 -->
        <div class="address" v-if="item.request">
          <div class="address-hd sub-title">请求接口:</div>
          <div class="address-bd">
            <div class="address-bd-method">{{item.request.mode}}</div>
            <span class="address-bd-url">
              {{ item.request.address }}
            </span>
            <div class="address-bd-btn">
              <el-button
                size="small"
                type="default"
                class="tag-copy"
                :data-clipboard-text="item.request.address"
                @click="copyText()"
                >复制接口</el-button
              >
            </div>
          </div>
        </div>
        <template v-for="(ctn, ctnIndex) in (item.container || [])" >
          <!-- 请求参数 -->
          <div class="table" :key="ctnIndex" v-if="ctn.type === 'requestParams'">
            <div class="table-title sub-title">{{ctn.label}}</div>
            <el-table :data="ctn.value" stripe style="width: 100%" size="small">
              <el-table-column prop="parameter" label="参数" width="auto">
              </el-table-column>
              <el-table-column prop="type" label="类型" width="auto">
              </el-table-column>
              <el-table-column prop="desc" label="说明"></el-table-column>
            </el-table>
          </div>
          <!-- 代码块 -->
          <div class="code-box" :key="ctnIndex" v-else-if="ctn.type === 'code'">
            <div class="sub-title">{{ctn.label}}</div>
            <pre v-highlight>
              <code class="js">
                {{ctn.value}}                
              </code>
            </pre>
          </div>
        </template>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch} from "vue-property-decorator";
import Clipboard from 'clipboard';
@Component({})
export default class Test extends Vue { 

  // 
  @Prop({default: {}, type: Array}) docOption: object;

  private activeIndex: number = 0;
  copyText(val) { 
    const clipboard = new Clipboard(".tag-copy");
    const success = '复制成功';
    const error = '复制失败';

    clipboard.on("success", (e) => {
      this.$message.success(success);
      // 释放内存
      clipboard.destroy();
    });
    clipboard.on("error", (e) => {
      this.$message.error(error);
      // 不支持复制
      console.log("该浏览器不支持复制");
      clipboard.destroy();
    });
  }
}
</script>

<style lang="scss" scoped>

.panel-content {
  padding: 15px;
}
.panel-hd {
  font-weight: bold;
  font-size: 28px;
}
.panel-desc {
  font-size: 14px;
  &-text {
    padding: 10px 0;
    line-height: 20px;
    span {
      display: block;
    }
  }
}
.address {
  padding: 10px 0;
  &-hd {
    padding-bottom: 10px;
  }
  &-bd {
    display: flex;
    align-items: center;
    padding: 2px;
    background: rgba($color: #49cc90, $alpha: 0.2);
    border-radius: 5px;
    color: #fff;
    &-method {
      padding: 10px 20px;
      background: #49cc90;
      border-radius: 5px;
      margin-right: 15px;
    }
    &-url {
      flex: 1;
      color: #000;
    }
  }
}
.table {
  padding: 10px 0;

  ::v-deep .el-table td {
    padding: 7px 0;
  }
}
.sub-title {
  font-size: 16px;
  font-weight: bold;
}
.sub-title-desc {
  padding-top: 10px;
  font-weight: bold;
}
::v-deep .hljs-comment{
  font-style: normal !important;
}
.desc{
  .sub-title{
    padding-bottom: 15px;
  }
}
</style>