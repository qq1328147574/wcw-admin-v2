<template>
  <!-- APP轮播图 -->
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-button size="small" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openPopupClick(0, {})" v-permission="'添加首页轮播图'">{{$t('System.添加轮播图')}}</el-button>
      <el-table-column slot="operateTagStatus" :label="$t('System.状态')" min-width="260">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            :active-text="$t('System.正常')"
            :inactive-text="$t('System.禁用')"
            @change="handleOpenClick(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column slot="operateTagImage" :label="$t('System.图片')" min-width="220">
        <template slot-scope="scope">
          <div class="v-img-box">
            <el-image :src="commonBaseUrl +  scope.row.url" :preview-src-list="[commonBaseUrl +  scope.row.url]"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('System.操作')" min-width="220">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openPopupClick(1, scope.row)" icon="el-icon-edit-outline" v-permission="'修改首页轮播图'">{{ $t('System.修改') }}</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(scope.row)" v-permission="'删除首页轮播图'">{{$t('System.删除')}}</el-button>
        </template>
      </el-table-column>
    </ElTable>

    <Drawer v-model="drawerPopupVisible" :title="drawerPopupType === 0 ? $t('System.添加轮播图') : $t('System.修改轮播图')" @close="onPopupsClose">
      <div class="content">
        <VForm formSize="small" :formsModel="formData" :formOptions="formOptions" :refreshBtnType="refreshBtnType" :loading="btnLoading" @submit="confirmEdit" >
          <div slot="bannerUrl">
            <Upload v-model="formData.url" :limit="1" groupType="Banner" />
          </div>
        </VForm>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { imageUrl } from '@/common/https/baseUrl'; 

import ElTable from "@/components/ElTable/index.vue";
import Upload from "@/components/Upload/index.vue";

import {
  webGetAdminUserSystemBannerList,     // 查询
  webGetAdminUserSystemBannerDelete,   // 删除
  webGetAdminUserSystemBannerUpdate,
  webGetAdminUserSystemBannerAdd
} from '@/api/index';

type IndexData = {
  page: number;
  pageSize: number;
};
@Component({
  components: {
    ElTable,
    Upload,
  },
})
export default class SystemBannerList extends Vue {
  vm = window['vm'];
  commonBaseUrl = imageUrl;  // 拼接图片
  tableData = []; 
  tableColumnData: Array<object> = [
    { prop: "id", label: "ID", width: "220" },
    {slot: 'operateTagImage'},
    {slot: 'operateTagStatus'},
    { slot: "tableClickType" },
    { prop: "createTime", label: this.vm.$t('Users.创建时间'), width: "220" }, 
    { slot: "tableOperaBtn" },
  ]
  totalCount: number = 0;

  refreshBtnType: boolean = true; // 重置状态
  btnLoading: boolean = false; // 加载中状态
  drawerPopupVisible: boolean = false; // dialog 显示隐藏
  drawerPopupType: number = 0;

  formData: any = {
    id: '',
    url: '',
  };
  get formOptions() { // 表单配置
    return [
      {
        key: 'url',
        slot: "bannerUrl",
        label: this.vm.$t("System.图片"),
        rules: [
          { required: true, message: this.vm.$t("System.请上传") + this.vm.$t("System.图片"), trigger: 'blur' }
        ],
      },
    ];
  };

  param:IndexData = {
    page: 1,
    pageSize: 10,
  };

  created() {
    this.getInitData();
  };

  mounted() {};

  // 重置
  resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 刷新数据
  refreshTableData() {
    this.getInitData();
  };

  // 分页
  handleCurrentChange(val) {
    this.param.page = val
    this.refreshTableData();
  };

  // 关闭弹窗
  onPopupsClose() {
    this.drawerPopupVisible = false;
    Object.keys(this.formData).forEach(key=> {
      this.formData[key] = '';
    })
  };

  // 打开弹窗
  openPopupClick(type, row) {
    this.drawerPopupType = type;
    if(type === 1) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
    }
    this.drawerPopupVisible = true;
  };

  // 表格Switch操作 确认框
  handleOpenClick(row) {
    this.onSwitchStatusChange(row);  // 用户状态
  };

  async onSwitchStatusChange(row) {
    let {id, status} = row;
    const text = status === '0' ? this.vm.$t('System.禁用成功') : this.vm.$t('System.激活成功');
    const res = await webGetAdminUserSystemBannerUpdate({
      id, status
    });
    MessageTips(res, true, true, text, item => {
      this.getInitData();
    }, null);
  };

  /**
   * @description 删除选择
   */
  handleDelRouter(row) {
    const text = this.vm.$t('System.此操作将删除该条信息');
    const text1 = this.vm.$t('System.提示');
    const text2 = this.vm.$t('System.确定');
    const text3 = this.vm.$t('System.取消');

    this.$confirm(text, text1, {
      confirmButtonText: text2,
      cancelButtonText: text3,
      type: 'warning'
    }).then(() => {
      this.handleDeleteClick(row);
    })
  };

  /**
   * @description 删除列表
   */
  async handleDeleteClick(row) {
    const text = this.vm.$t('System.删除成功');
    let {id} = row;
    const res = await webGetAdminUserSystemBannerDelete({ id })
    MessageTips(res, true, true, text, ()=>{
      this.getInitData();
    }, null)
  };

  // 添加 修改
  confirmEdit() {
    if (this.drawerPopupType === 0) {
      this.submitFormAddClick();
    } else {
      this.submitFormUpdateClick();
    }
  };

  /**
   * @description 修改列表
   */
  async submitFormUpdateClick() {
    this.btnLoading = true; 
    let url = Array.isArray(this.formData.url) ? this.formData.url[1] : this.formData.url;
    const text = this.vm.$t("System.修改成功");
    const res = await webGetAdminUserSystemBannerUpdate({
      id: this.formData.id,
      url
    });
    MessageTips( res, true, true, text, () => { 
      this.btnLoading = false; 
      this.getInitData(); 
      this.onPopupsClose(); 
    }, (err) => { 
        this.btnLoading = false; 
    });
  };

  /**
   * @description 添加列表
   */
  async submitFormAddClick() {
    const text = this.vm.$t("System.添加成功");
    this.btnLoading = true; 
    const res = await webGetAdminUserSystemBannerAdd({
      url: this.formData.url[0]
    });

    MessageTips( res, true, true, text, () => { 
      this.btnLoading = false; 
      this.getInitData(); 
      this.onPopupsClose(); 
    }, (err) => { 
        this.btnLoading = false; 
    });
  };

  /**
   * @description 查询列表
   */
  async getInitData() {
    const {data: res} = await webGetAdminUserSystemBannerList(this.param);

    if(res.code === 20000 ) {
      let lists = res.data;
      this.tableData = lists;
      this.totalCount = lists.length;
    }
  };
  
}
</script>

<style lang="scss" scoped>
.v-img-box {
  height: 70px;
  box-sizing: border-box;
  margin: auto;
  border: 1px dashed #f1f1f1;
  .v-img {
    width: 100%;
    height: 100%;
  }
}
</style>
