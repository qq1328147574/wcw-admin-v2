<template>
  <div class="controlCenter">
    <el-card>
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{ "列表内容 " + o }}
      </div>
      <el-button @click="dialogVisible = true" type="primary" size="small">Open Dialog</el-button>
      <el-button @click="drawerVisible = true" type="primary" size="small">Open Drawer</el-button>
      <el-button @click="popupVisible = true" type="primary" size="small">Open Popup</el-button>
    </el-card>


    <el-card>
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <Upload v-model="fileList" :limit="1" uploadUrl="/metamon-api-server/api/security-upload/upload" @onSuccess="uploadSuccess"></Upload>
    </el-card>

    <el-card>
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <el-row>
        <el-col :span="12">
          <VForm :formsModel="formData" :formOptions="formOptions"></VForm>
        </el-col>
      </el-row>
    </el-card>

    <Dialog v-model="dialogVisible" title="标题">
      <div>弹窗内容</div>
    </Dialog>
    <Drawer v-model="drawerVisible" title="标题">
      <span>我来啦!</span>
    </Drawer>
    <Popup v-model="popupVisible" title="标题">
      <div>弹窗内容</div>
    </Popup>
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import Upload from '@/components/Upload/index.vue';

@Component({
  components: {
    Upload,
  }
})
export default class ControlCenter extends Vue {
  dialogVisible: boolean = false; // dialog 状态
  drawerVisible: boolean = false; // drawer 状态
  popupVisible: boolean = false; // popup 状态
  formOptions: object = [ // 表单配置项
    {
      key: 'select',
      label: '选择器',
      type: 'select',
      options: [
        {
          label: '线上品牌商赞助',
          value: '1'
        },
        {
          label: '线上品牌商赞助',
          value: '2'
        },
      ],
      rules: [
        {
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }
      ]
    }, 
    {
      key: 'input',
      label: '输入框',
      type: 'input',
      inputType: 'input', // textarea password
      placeholder: '请输入内容',
      rules: [
        {
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }
      ]
    },
    { 
      key: 'checkbox',
      label: '多选框',
      type: 'checkbox',
      options: [
        {
          value: "1",
          label: "黄金糕",
        },
        {
          value: "2",
          label: "双皮奶",
        },
        {
          value: "3",
          label: "蚵仔煎",
        },
      ],
      rules: [
        {
          required: true,
          message: '请输入内容',
          trigger: 'blur'
        }
      ]
    },
    // {
    //   key: 'radio',
    //   label: '单选框',
    //   type: 'radio',
    //   options: [
    //     {
    //       label: '线上品牌商赞助',
    //       value: '1'
    //     },
    //     {
    //       label: '线上品牌商赞助',
    //       value: '2'
    //     },
    //   ],
    //   rules: [
    //     {
    //       required: true,
    //       message: '请输入内容',
    //       trigger: 'blur'
    //     }
    //   ]
    // }, 
    // {
    //   key: 'fileList',
    //   label: '文件上传',
    //   type: 'upload',
    //   options: {
    //     url: '/api-ezcoins/common/upload'
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       message: '请输入内容',
    //       trigger: 'blur'
    //     }
    //   ]
    // }
  ]

  formData: object = {
    select: '',
    input: '',
    checkbox: []
  };

  fileList: object = [];

  @Watch('fileList')
  onDataChange(newVal) {
    // console.log(newVal);
  }

  @Watch("popupVisible")
  onValueChange(newVal) {
    // console.log(newVal);
    
  }
  created() {
    
  }

  mounted() {}

  uploadSuccess(response) {
  }
}
</script>

<style lang="scss" scoped>
.el-card{
  margin-bottom: 20px;
}
</style>
