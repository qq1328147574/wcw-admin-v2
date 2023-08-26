<template>
  <quill-editor
    v-model="value"
    ref="myQuillEditor"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @ready="onEditorReady($event)"
  >
  </quill-editor>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { baseUrl, imageUrl } from "@/common/https/baseUrl";
import { localData } from "@/filters/storage";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor, Quill } from "vue-quill-editor";
import { container, ImageExtend, QuillWatch } from "quill-image-extend-module"; // 图片上传
import ImageResize from "quill-image-resize-module"; // 调整图片大小

Quill.register("modules/ImageExtend", ImageExtend);
// use resize module
Quill.register("modules/ImageResize", ImageResize);

@Component({
  components: {
    quillEditor,
  },
})
export default class VEditor extends Vue {
  @Prop({ default: "" }) value: any; // 组件当前输入的值

  token = localData("get", "HasSessionToken", ""); // token
  editorOption = {
    // 配置项
    modules: {
      ImageExtend: {
        name: "files",
        action: baseUrl + "/api/common/upload", // 上传地址
        headers: (xhr) => {
          // 自定义请求头
          xhr.setRequestHeader("login_type", "ADMIN");
          xhr.setRequestHeader("token", this.token);
        },
        data: {
          groupType: 'file',
          name: 'png',
        }, 
        response: (res) => {
          // 接口返回的数据
          return imageUrl + res.data; // 完整的地址
        },
      },
      toolbar: {
        container: container,
        handlers: {
          image: function () {
            // 劫持原来的图片点击事件
            let _this: any = this; // this 不指向当前的vue
            QuillWatch.emit(_this.quill.id);
          },
        },
      },
      ImageResize: {
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    },
  };
  
  @Watch("value")
  onValueChange(newVal) {
    this.$emit("input", newVal);
  }

  onEditorBlur(e) {
    // console.log(e);
  }
  onEditorFocus(e) {
    // console.log(e);
  }
  onEditorReady(e) {
    // console.log(e);
  }
}
</script>

<style lang="scss" scoped></style>
