<template>
  <!-- 上传图片 -->
  <div class="upload-main">
    <el-upload
      drag
      ref="upload"
      name="files"
      accept="image/*"
      list-type="picture-card"
      :data="{ groupType, name: 'file' }"
      :limit="limit"
      :action="baseUrl + uploadUrl"
      :headers="{'login-type': 'ADMIN', 'token': token}"
      :before-upload="beforeFileUpload"
      :on-success="onFileUploadSuccess"
      :file-list="fileList"
    >
      <i slot="default" class="el-icon-plus"></i>
      <!-- <div class="el-upload__tip" slot="tip">{{ $t('Common.将文件拖到此处') }}</div> -->
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="img" />
        <div class="el-upload-list__item-actions">
          <span class="el-upload-list__item-delete" @click="handleRemove(file)" >
            <i class="el-icon-delete"></i>
          </span>
          <!-- 预览 -->
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)" >
            <i class="el-icon-zoom-in"></i>
          </span>
        </div>
      </div>
    </el-upload>
    
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { baseUrl, imageUrl } from '@/common/https/baseUrl'; 
import { localData } from "@/filters/storage";

@Component({})
export default class Uploads extends Vue {
  @Prop({ default: [] }) value: any[];            // 后台返回的URL集合, v-model绑定的值
  @Prop({ default: '/api/common/upload' }) uploadUrl: any;          // 上传的url
  @Prop({ default: 5 }) limit: number;          // 最大允许上传个数
  @Prop({ default: 'image/*' }) accept?: string;  // 文件类型
  @Prop({ default: 'file' }) groupType?: string;   // 额外参数
  @Prop({ default: false }) clearFilesType?: boolean;  // 重置图片
  @Prop({ default: 2 }) fileSize: number;      // 上传的文件大小 MB

  token = localData('get', 'HasSessionToken', ''); // token 
  baseUrl: string = baseUrl;
  
  dialogImageUrl: string = "";
  dialogVisible: boolean = false;
  fileList: any[] = []; 
  
  // data: { name: string, groupType: string } = { // 上传时携带的额外参数
  //   name: '',  // 文件名
  //   groupType: '' // 文件类型
  // };

  // @Watch('groupType', {immediate: true})
  // onPrefixChange(newVal) {
  //   this.data.groupType = newVal;
  // };

  // 重置数组
  @Watch('value', {deep: true, immediate: true})
  onValueChange(newVal) {
    if(newVal === '' || newVal.length === 0) {
      // console.log(`重置数组${newVal}`);
      this.clearFilesList();
    }
    
    if(newVal && newVal.length > 0) {
      
      this.fileList = newVal.map((item, index)=> {
        return {
          name: index,
          url: imageUrl + item
        }
      })
    }
  }; 

  created() {};

  // 清除图片
  clearFilesList() {
    const _that = this;
    const ref: any = _that.$refs.upload;
    ref.clearFiles();
  };

  /**
   * @description 【0】上传之前的钩子
   * @param {Object} file      -数据
   * @return *
   */
  beforeFileUpload(file) {
    // console.log(file);

    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < this.fileSize;

    if (!isJPG) {
      const text = '上传图片格式不正确';
      this.$message.error(text);
    }
    if (!isLt2M) {
      const text = '图片文件过大';
      this.$message.error(text);
    }

    return isJPG && isLt2M;
  };

  /**
   * @description 预览已上传的图片
   * @param {Object} file      -数据
   * @return {*}
   */
  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
  };

  /**
   * @description 【2】删除上传的文件
   * @param {Object} file      -数据
   * @param {Object} uploadFiles      -上传的文件列表
   * @return {*} 
   */
  handleRemove(file) {
    // console.log(file);
    let ref: any = this.$refs.upload;
    let index = ref.uploadFiles.indexOf(file); // 查询当前要删除的文件位置
    ref.uploadFiles.splice(index, 1);
    
    this.value.splice(index, 1);
    this.$emit('input', this.value);
  };
  
  /**
   * @description 【1】文件上传成功时的钩子
   * @param {Object} res      -后台返回数据
   * @param {Object} file
   * @param {Object} fileList
   * @param {Object} data     -拼接数据
   * @return *
   */
  onFileUploadSuccess(res, file, fileList) {
    if(res.code !== 20000) {
      this.$message.error(res.data);
      return 
    }
     
    const text = window['vm'].$t('Common.上传成功');

    const url = res.data;
    this.value = [...this.value, url];
       
    this.$emit('input', this.value)
    this.$emit('onSuccess', this.value);
    this.$message.success(text);
  };

}
</script>

<style lang="scss" scoped>
::v-deep .el-upload-dragger{
  width: 150px;
  height: 150px;
}
::v-deep .el-upload {
  margin-left: auto;
  margin-right: auto;
  border: 0;
}
.el-upload__tip{
  padding-top: 10px;
}
</style>
