<template>
  <div class="v-form-box">
    <el-form 
      ref="formData" 
      :model="formsModel" 
      :rules="rules" 
      :labelWidth="labelWidth" 
      :size="currentWindow ? 'medium': 'mini'"
      :label-position="currentWindow ? 'left': 'top'"
      >
      <!-- 输入框 -->
      <el-form-item
        v-for="(item, index) in formOptions"
        :label="item.label"
        :key="index"
        :prop="item.key"
      >
        <!-- slot 插槽 -->
        <slot :name="item.slot" v-if="item.slot" :default="formsModel"></slot>
        <!-- 输入框 -->
        <template v-else-if="item.type === 'input'">
          <el-input type="password" v-model="formsModel[item.key]" :placeholder="item.placeholder" show-password v-if="item.inputType === 'password'" ></el-input>
          <el-input :type="item.inputType" v-model="formsModel[item.key]" :placeholder="item.placeholder" :disabled="item.disabled || false" @focus="item.onfocus" v-else ></el-input>
        </template>
        <!-- 多选框 -->
        <template v-else-if="item.type === 'checkbox'">
          <el-checkbox-group v-model="formsModel[item.key]" @change="onCheckboxChange" >
            <el-checkbox v-for="(_item, _index) in item.options" :label="_item.value" :key="_index" > {{ _item.label }} </el-checkbox>
          </el-checkbox-group>
        </template>
        <!-- 单选框 -->
        <template v-else-if="item.type === 'radio'">
          <el-radio-group v-model="formsModel[item.key]" :disabled="item.disabled || false">
            <template v-if="item.inputType === 'button'">
              <el-radio-button v-for="(_item, _index) in item.options" :label="_item.value" :key="_index" > {{ _item.label }} </el-radio-button>
            </template>
            <template v-else>
              <el-radio
                v-for="(_item, _index) in item.options"
                :label="_item.value"
                :key="_index"
              >
                {{ _item.label }}
              </el-radio>
            </template>
          </el-radio-group>
        </template>
        <!-- 选择器 -->
        <template v-else-if="item.type === 'select'">
          <el-select
            v-model="formsModel[item.key]"
            filterable
            :placeholder="item.placeholder"
            @change="item.callback"
            :disabled="item.disabled || false"
          >
            <el-option
               v-for="(_item, _index) in item.options"
              :key="_index"
              :label="_item.label"
              :value="_item.value"
            >
            </el-option>
          </el-select>
        </template>
        <!-- 上传 -->
        <template v-else-if="item.type === 'upload'">
          <Upload 
            v-model="formsModel[item.key]" 
            :uploadUrl="item.options.url"
            :limit="item.options.limit"
          >
          </Upload>
        </template>
      </el-form-item>

      <el-form-item>
        <div class="v-btn-box">
          <el-button type="primary" class="v-btn" icon="el-icon-check" @click="handleSubmit" :loading="loading">{{$t('Common.提交')}}</el-button>
          <el-button type="default" class="v-btn-min" icon="el-icon-refresh-left" @click="handleReset" v-if="refreshBtnType">{{$t('Common.重置')}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import Event from '@/utils/Event';

import Upload from "@/components/Upload/index.vue";

interface CloseType {
  close: boolean
};
// 配置选项
interface Options {
  type: string;
  key: string;
  label: string;
  inputType?: string;
  placeholder?: string;
  slot?: string;
  options?: any;
  rules?: any;
  disabled?: boolean;
  callback: any;
  onfocus: any;
}

@Component({
  components: {
    Upload,
  },
})
export default class VForms extends Vue {
  @Prop({ default: [] }) formOptions!: Options[];     // 表单配置项
  @Prop({ default: {} }) formsModel!: object;         // 表单数据项
  @Prop({ default: true }) refreshBtnType?: boolean;  // 重置状态
  @Prop({ default: 'auto' }) labelWidth?: string; 
  @Prop({ default: true }) loading?: boolean; 

  rules: any = {}; // 表单验证规则

  // @Inject 接收dialog 或者 drawer 传输的组件值， 只能使用对象形式
  @Inject() ComponentCloseType: CloseType; 


  // 监听组件关闭值，移除校验 rules()
  @Watch('ComponentCloseType', {deep: true})
  onTypeChange(newVal) {
    // console.log(newVal);
    let ref:any = this.$refs.formData;
    ref.clearValidate();
  };

  // 页面中存在多个表单
  @Watch('formOptions', {deep: true, immediate: true})
  onDataChange(newVal) {
    this.setRulesOptions();
  };

  mounted() {};

  destroyed() {};

  /**
   * @description 循环对象属性,键值对 Array 转化为 Object
   * @param {Object} Object.fromEntries() 
   * @param {Object} reduce() 
   * @return {*}
   */
  inObjectRulesOption() {
    const formArr: any = this.formOptions;
    let objs = {};

    for (const item in formArr) {
      objs[formArr[item].key] = formArr[item].rules;
    }
    console.log(objs);
    
  };

  /**
   * @description 对特定数据进行处理，获取配置的rules
   * @return {*}
   */
  setRulesOptions() {
    this.formOptions.forEach((item) => {
      if(item.rules) {
        // this.rules[item.key] = [];
        this.rules[item.key] = item.rules;  // 下标索引

      }
    });
    // console.log(this.rules);
  };
  
  /**
   * @description 表单验证
   * @return {*}
   */
  handleSubmit() {
    let ref:any = this.$refs.formData;

    // console.log(this.formsModel);
    ref.validate(valid => {
      if(valid) {
        this.$emit('submit', this.formsModel);
      } else {
        console.log('error submit!!');
      }
    })
  };

  /**
   * @description 表单重置
   * @return {*}
   */
  handleReset() {
    let ref:any = this.$refs.formData;
    ref.resetFields();
    this.$emit('resetFields'); // 在表单某项需要重置时调用
  };
  
  onCheckboxChange(val) {
    // this.$forceUpdate();
  };

}
</script>

<style lang="scss" scoped>
.el-select{
  width: 100%;
}
.v-form-box {
  .v-btn-box {
    margin-top: 30px;
    .v-btn {
      min-width: 200px;
    }
  }
}
</style>
