<template>
  <!-- 新闻公告列表 -->
  <div class="pages">
    <Search :formColumnData="formSearchOptions" @result="handleSearchClick" @reset="resetTableData"></Search>

    <ElTable
      ref="ElTable"
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    >
      <el-button size="small" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openPopupClick(1, {})"  v-permission="'添加媒体'">{{ $t("System.添加新闻公告") }}</el-button >

      <el-table-column slot="tableMediaType" :label="$t('System.类型')" min-width="160" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mediaType === 1">{{ $t("System.新闻") }}</el-tag>
          <el-tag type="warning" v-else-if="scope.row.mediaType === 2">{{ $t("System.公告") }}</el-tag>
          <el-tag v-else>H5</el-tag>
        </template>
      </el-table-column>

      <el-table-column slot="tableSlotIconImage" label="缩略图" min-width="160">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-zoom-in" @click="openDialog(0, scope.row)"> 查看图片 </el-button>
        </template>
      </el-table-column>
      <el-table-column slot="tableSlotBannerImage" label="轮播图" min-width="160">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-zoom-in" @click="openDialog(1, scope.row)"> 查看图片 </el-button>
        </template>
      </el-table-column>

      <el-table-column slot="tableSwitch" :label="$t('System.设置为弹出公告')" min-width="160" >
        <template slot-scope="{row}">
          <el-tag type="primary" v-if="row.ejectStatus === 1">开启</el-tag>
          <el-tag type="info" v-else>关闭</el-tag>
        </template>
      </el-table-column>

      <el-table-column slot="tableOperaBtn" :label="$t('System.操作')" min-width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit-outline" class="v-edit-btn" @click="openPopupClick(2, scope.row)"  v-permission="'修改媒体'">{{ $t("System.编辑") }}</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(scope.row)" v-permission="'删除媒体'">{{ $t("System.删除") }}</el-button>
        </template>
      </el-table-column>
    </ElTable>
    
    <Drawer v-model="drawerPopupVisible" :title="drawerPopupType ? $t('System.添加新闻公告') : $t('System.修改新闻公告')" @close="onPopupsClose">
      <div class="content">
        <VForm formSize="small" :formsModel="formData" :formOptions="formOptions" :refreshBtnType="refreshBtnType" :loading="btnLoading" @submit="confirmEdit" >
          <div slot="briefIntroduction">
            <VEditor v-model="formData.briefIntroduction"></VEditor>
          </div>
          <div slot="content">
            <VEditor v-model="formData.content"></VEditor>
          </div>
          <div slot="banner">
            <Upload v-model="formData.banner" :limit="3" groupType="Banner" />
            <p class="font-size14 font-red" v-if="!drawerPopupType">* {{$t('System.不修改则传递默认值')}}。</p>
          </div>
          <div slot="icon">
            <Upload v-model="formData.icon" :limit="1" groupType="Banner" />
            <p class="font-size14 font-red" v-if="!drawerPopupType">* {{$t('System.不修改则传递默认值')}}。</p>
          </div>
        </VForm>
      </div>
    </Drawer>

    <!-- 表单操作 -->
    <Dialog v-model="dialogVisible" title="查看图片" >
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-image :src="item" v-for="(item,index) in pictureList" :key="index" :preview-src-list="pictureList" lazy></el-image>
        </el-col>
      </el-row>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { localData } from "@/filters/storage";
import { imageUrl } from '@/common/https/baseUrl';

import ElTable from "@/components/ElTable/index.vue";
import VEditor from "@/components/VEditorText/index.vue";
import Upload from "@/components/Upload/index.vue";

import {
  webGetAdminGetNewsMediaList, // 查询
  webGetAdminNewsMediaAdd, // 添加
  webGetAdminNewsMediaUpdate, // 修改
  webGetAdminNewsMediaRemove, // 删除
  webGetAdminSetEjectNotice
} from "@/api/index";

type IndexData = {
  page: number;
  pageSize: number;
  [props: string]: string | number;
};

let params:IndexData = {
  page: 1,
  pageSize: 14,
}
@Component({
  components: {
    ElTable,
    VEditor,
    Upload,
  },
})
export default class SystemMediaList extends Vue {
  vm = window["vm"];
  tableSystemMediaCache: string[] = JSON.parse(localStorage.getItem('tableSystemMediaCache') as any) || [];
  roleListData: any = [];
  tableData = [];
  tableColumnData: Array<object> = [
    { prop: "id", label: "ID", width: "160" },
    { prop: "title", label: this.vm.$t("System.标题"), width: "200" }, 
    { prop: "briefIntroduction", label: this.vm.$t("System.简介"), width: "260" }, 
    // { slot: "tableMediaType" }, 
    // { slot: 'tableSwitch' }, 
    { slot: 'tableSlotIconImage' }, 
    { slot: 'tableSlotBannerImage' }, 
    { prop: "createTime", label: this.vm.$t("System.创建时间"), width: "160" }, 
    { slot: "tableOperaBtn" },
  ];
  totalCount: number = 0;

  param = JSON.parse(JSON.stringify(params)); // 分页

  refreshBtnType: boolean = true; // 重置状态
  btnLoading: boolean = false; // 加载中状态
  drawerPopupVisible: boolean = false; // dialog 显示隐藏
  drawerPopupType: boolean = true;
  drawerVisible: boolean = false;
  drawerType: string = ''; 
  editorContent: any = "";

  dialogVisible: boolean = false;
  dialogType: number = 0;
  pictureList: any[] = [];

  formData: any = {
    id: '',
    status: 1,
    briefIntroduction: '',
    content: '',
    title: '',
    banner: [],
    icon: [],
    mediaType: 1,
    ejectStatus: 0
  };
  get formOptions() { // 表单配置
    return [
      // {
      //   type: "radio",
      //   key: "mediaType",
      //   label: this.vm.$t("System.类型"),
      //   options: [
      //     { label: this.vm.$t("System.新闻"), value: 1 },
      //     { label: this.vm.$t("System.公告"), value: 2 },
      //   ],
      // },
      {
        type: "radio",
        key: "status",
        label: this.vm.$t("System.状态"),
        options: [
          { label: this.vm.$t("System.开启"), value: 1 },
          { label: this.vm.$t("System.关闭"), value: 0 },
        ],
      },
      {
        type: "input",
        key: "title",
        label: this.vm.$t("System.标题"),
        placeholder: this.vm.$t("System.请输入") + this.vm.$t("System.标题"),
        rules: [
          {
            required: true,
            message: this.vm.$t("System.请输入") + this.vm.$t("System.标题"),
            trigger: "blur",
          },
        ],
      },
      {
        key: 'icon',
        slot: "icon",
        label: this.vm.$t("System.略缩图"),
        rules: [],
      },
      {
        key: 'banner',
        slot: "banner",
        label: this.vm.$t("System.轮播图"),
        rules: [],
      },
      {
        key: 'briefIntroduction',
        type: 'input',
        inputType: 'textarea',
        label: this.vm.$t("System.简介"),
        rules: [
          {
            required: true,
            message: this.vm.$t("System.请输入") + this.vm.$t("System.简介"),
            trigger: "blur",
          },
        ],
      },
      {
        key: 'content',
        slot: "content",
        label: this.vm.$t("System.详情"),
        rules: [
          {
            required: true,
            message: this.vm.$t("System.请输入") + this.vm.$t("System.详情"),
            trigger: "blur",
          },
        ],
      },
    ];
  }

  formSearchOptions: object = [
    {
      type: "input",
      key: "title",
      label: this.vm.$t('System.标题'),
      placeholder: "",
    },
    {
      type: "select",
      key: "mediaType",
      label: this.vm.$t('System.类型'),
      options: [
        {
          label: this.vm.$t('System.新闻'),
          value: '1'
        },
        {
          label: this.vm.$t('System.公告'),
          value: '2'
        },
      ],
      placeholder: '',
    },
  ];

  @Watch('drawerVisible') 
  onDataChange(newVal) {
    // console.log(newVal);
  }

  created() {
    this.getInitData();
  }

  mounted() {}

   // 打开弹窗
  openDialog(type, row) {
    this.dialogType = type;

    if(type === 0) {
      this.pictureList = row.icon.split(',').map(item=> imageUrl + item );
    } else {
      this.pictureList = row.banner.split(',').map(item=> imageUrl + item );
      
    }

    this.dialogVisible = true;
  }

  /**
   * @description 搜索
   */
  handleSearchClick(val) {
    // 重置搜索为第一页
    let ref:any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    Object.assign(this.param, val);
    this.getInitData();
  }

  /**
   * @description 刷新数据
   */
  refreshTableData() {
    this.getInitData();
  }
  
  resetTableData() {
    // 重置搜索为第一页
    let ref:any = this.$refs.ElTable;
    ref.resetCurrentPage();
    this.param.page = 1;

    this.param = JSON.parse(JSON.stringify(params));
    this.getInitData();
  }

  /**
   * @description 分页
   */
  handleCurrentChange(val) {
    this.param.page = val;
    this.refreshTableData();
  }

  /**
   * @description 关闭弹窗
   */
  onPopupsClose() {
    const {banner, icon} = this.formData;
    
    Object.keys(this.formData).forEach((key) => {
      if (key === "mediaType") this.formData[key] = 1;
      else if (key === "banner" || key === 'icon') return
      else if (key === "status") this.formData[key] = 1;
      else if (key === "ejectStatus") this.formData[key] = 0;
      else this.formData[key] = ''
    });
    if(banner.length > 0) this.formData['banner'] = '';
    if(icon.length > 0) this.formData['icon'] = '';

    this.drawerPopupVisible = false;
  }

  /**
   * @description 打开弹窗
   */
  openPopupClick(ids, row) {
    if(ids === 2) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
      this.refreshBtnType = false;
      this.drawerPopupType = false;
      
    } else {
      this.formData['banner'] = [];
      this.formData['icon'] = [];
      this.refreshBtnType = true;
      this.drawerPopupType = true;
    }
    this.drawerPopupVisible = true;
  }

  /**
   * @description 查询列表
   */
  async getInitData() {
    const { data: res } = await webGetAdminGetNewsMediaList(this.param);
    if (res.code === 20000) {
      let lists = res.data;
      if (lists.records) {
        this.tableData = lists.records.map(item=> {
          return {
            ...item, 
          }
        });
        this.totalCount = lists.total;
      }
    }
  }

  // 删除
  handleDelRouter(row) {
    const text = this.vm.$t("System.此操作将删除该条信息");
    const text1 = this.vm.$t("System.提示");
    const text2 = this.vm.$t("System.确定");
    const text3 = this.vm.$t("System.取消");

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: "warning",
    }).then(() => {
      this.handleDeleteClick(row);
    });
  }

  /**
   * @description 删除通知
   */
  async handleDeleteClick(row) {
    const text = this.vm.$t("System.删除成功");
    const { id } = row;

    const res = await webGetAdminNewsMediaRemove({
      id,
    });
           
    MessageTips( res, true, true, text, () => { 
      this.btnLoading = false; 
      this.getInitData(); 
      this.onPopupsClose(); 
    }, (err) => { 
      this.btnLoading = false; 
    });
  }

  // 添加 修改
  confirmEdit(val) {
    this.btnLoading = true;
    this.formData = val;
    const {banner, icon} = this.formData;

    if(banner.length === 0 || icon.length === 0) {
      const text = '图片不能为空';
      this.$message.error(text);
      this.btnLoading = false;
    } else {
      if (this.drawerPopupType) {
        this.submitFormAddClick();
      } else {
        this.submitFormUpdateClick();
      }
    }
  }

  /**
   * @description 添加通知
   */
  async submitFormAddClick() {
    const text = this.vm.$t("System.添加成功");
    let { banner, icon} = this.formData;
    const res = await webGetAdminNewsMediaAdd({
      ...this.formData,
      banner: banner.toString(),
      icon: icon.toString()
    });

    MessageTips(res, true, true, text, () => { 
      this.btnLoading = false; 
      this.getInitData(); 
      this.onPopupsClose(); 
    }, (err) => { 
      this.btnLoading = false; 
    });
  }

  /**
   * @description 修改通知
   */
  async submitFormUpdateClick() {
    const text = this.vm.$t("System.修改成功");
    let { banner, icon} = this.formData;

    const res = await webGetAdminNewsMediaUpdate({
      ...this.formData,
      banner: banner.toString(),
      icon: icon.toString()
    });

    MessageTips( res, true, true, text, () => { 
      this.btnLoading = false; 
      this.getInitData(); 
      this.onPopupsClose(); 
    }, (err) => { 
      this.btnLoading = false; 
    });
  }

  // 修改状态
  async onSwitchChange(row) {
   

  }

}
</script>

<style lang="scss" scoped>
</style>
