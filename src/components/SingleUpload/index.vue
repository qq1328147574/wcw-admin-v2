<template>
  <!-- 上传图片 -->
  <div class="upload-main">
    <el-upload
      ref="upload"
      name="files"
      accept="image/*"
      list-type="picture"
      :data="data"
      :limit="1"
      :action="imgBaseUrl + uploadUrl"
      :headers="{'login-type': 'ADMIN', 'token': token}"
      :before-upload="beforeFileUpload"
      :on-success="onFileUploadSuccess"
      :show-file-list="false"
    >
      <div class="v-upload" v-if="!showImageUrl" v-loading="uploadLoading">
        <i class="el-icon-plus"></i>
      </div>
      <div class="v-show-image" v-else>
        <img :src="imageUrl + showImageUrl" alt="">

        <div class="v-control">
          <div class="v-inner">
            <span class="v-delete" @click.stop="handleRemove" >
              <i class="el-icon-delete"></i>
            </span>
            <!-- 预览 -->
            <span class="v-preview" @click.stop="handlePictureCardPreview($event, imageUrl + showImageUrl)" >
              <i class="el-icon-zoom-in"></i>
            </span>
          </div>
        </div>
      </div>
    </el-upload>
    
    <!-- 图片预览 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { baseUrl, imageUrl } from '@/common/https/baseUrl'; 
import { localData } from "@/filters/storage";
import { AESDecryptPKey, encryptData } from '@/common/https/nodeRSA';

@Component({})
export default class Uploads extends Vue {
  @Prop({ default: '' }) value: string;            // 后台返回的URL集合, v-model绑定的值
  @Prop({ default: '/api/common/upload' }) uploadUrl: any;          // 上传的url
  @Prop({ default: 1 }) limit: number;          // 最大允许上传个数
  @Prop({ default: 'image/*' }) accept?: string;  // 文件类型
  @Prop({ default: 'file' }) groupType?: string;   // 额外参数
  @Prop({ default: false }) clearFilesType?: boolean;  // 重置图片
  @Prop({ default: 10 }) fileSize: number;      // 上传的文件大小 MB

  token = localData('get', 'HasSessionToken', '')
  imgBaseUrl: string = baseUrl;
  imageUrl: string = imageUrl;
  
  dialogImageUrl: string = "";
  dialogVisible: boolean = false;

  data: {name: string, groupType: string} = { // 上传时携带的额外参数
    name: '',  // 文件名
    groupType: '' // 文件类型
  };

  showImageUrl: string = '';
  uploadLoading: boolean = false;

  @Watch('groupType', {immediate: true})
  onPrefixChange(newVal) {
    this.data.groupType = newVal;
  };

  // 重置数组
  @Watch('value', {immediate: true})
  onValueChange(newVal) {

    if(newVal) {
      this.showImageUrl = newVal;
    }
    // console.log(newVal);
    // if(!newVal) {
    //   // this.value = [];
    //   console.log(`重置数组${newVal}`);
    //   this.clearFilesList();
    // }
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
    if(isJPG && isLt2M) {
      this.uploadLoading = true;
    }
    return isJPG && isLt2M;
  };

  /**
   * @description 预览已上传的图片
   * @param {Object} file      -数据
   * @return {*}
   */
  handlePictureCardPreview(event, file) {
    this.dialogImageUrl = file;
    this.dialogVisible = true;
  };

  /**
   * @description 【2】删除上传的文件
   * @param {Object} file      -数据
   * @param {Object} uploadFiles      -上传的文件列表
   * @return {*} 
   */
  handleRemove() {
    this.showImageUrl = '';
    this.clearFilesList();
    this.$emit('input', '');
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

    this.uploadLoading = false;

    if(res.code !== 20000) {
      this.$message.error(res.data);
      return 
    } else {
      res.data = AESDecryptPKey(res.data).result;
    }
     
  
    console.log('res.data :>> ', res.data);
    const text = window['vm'].$t('Common.上传成功');
    const url = res.data;
    this.value = url;
    this.showImageUrl = url;
    this.$emit('input', this.value)
    this.$emit('onSuccess', this.value);
    this.$message.success(text);
  };

}
</script>

<style lang="scss" scoped>

::v-deep .el-upload {
  width: 150px;
  height: 150px;
  overflow: hidden;
}

.v-upload {
  box-sizing: border-box;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #bbb;
  border-radius: 10px;
}
.v-show-image {
  position: relative;
  width: 150px;
  height: 150px;
  border: 1.5px dashed #bbb;
  border-radius: 10px;

  img {
    width: 100%;
    height: 100%;
  }

  &:hover .v-control {
    display: block;
  }

  .v-control {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #fff, $alpha: 0.3);

    .v-inner {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .v-delete, .v-preview {
        color: #0056e6;
        font-size: 16px;
        margin: 0 5px;
      }
    }
  }
 
}
</style>
