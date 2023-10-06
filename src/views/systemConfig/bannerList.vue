<template>
  <!-- APP轮播图 -->
  <div class="pages">
    <ElTable :tableData="tableData" :tableColumnData="tableColumnData" :totalCount="totalCount"
      :totalPageSize="param.pageSize" @refreshTableChange="refreshTableData" @handleCurrentChange="handleCurrentChange">
      <el-button size="small" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline"
        @click="openPopupClick(0, {})">{{ $t('Common.添加') }}</el-button>
      <el-table-column slot="operateTagStatus" :label="$t('Common.状态')" min-width="260">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="1" inactive-value="0" :active-text="$t('Common.正常')"
            :inactive-text="$t('Common.禁用')" @change="handleOpenClick(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column slot="operateTagImage" :label="$t('Common.图片')" min-width="220">
        <template slot-scope="scope">
          <div class="v-img-box">
            <el-image :src="commonBaseUrl + scope.row.img"
              :preview-src-list="[commonBaseUrl + scope.row.img]"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column slot="tableOperaBtn" :label="$t('Common.操作')" min-width="220">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="openPopupClick(1, scope.row)" icon="el-icon-edit-outline">{{
            $t('Common.修改') }}</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn"
            @click="handleDelRouter(scope.row)">{{ $t('Common.删除') }}</el-button>
        </template>
      </el-table-column>
    </ElTable>

    <Dialog v-model="dialogVisible" :title="drawerPopupType === 0 ? $t('Common.添加') : $t('Common.修改')"
      @close="onCloseDialog" @confirm="confirmEdit">
      <el-form :model="formData" :rules="rules" ref="formData" size="medium" label-width="auto" label-position="top"
        v-if="dialogVisible">
        <el-form-item :label="$t('Common.图片')" prop="img">
          <SingleUpload ref="SingleUpload" v-model="formData.img"></SingleUpload>
        </el-form-item>
        <el-form-item :label="$t('Common.排序')" prop="sort">
          <el-input v-model="formData.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('Common.状态')" prop="status">
          <el-radio-group v-model="formData.status" :placeholder="$t('Common.请选择')">
            <el-radio-button :label="1">{{ $t('Common.开启') }}</el-radio-button>
            <el-radio-button :label="-1">{{ $t('Common.关闭') }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { imageUrl } from '@/common/https/baseUrl';

import ElTable from "@/components/ElTable/index.vue";
import SingleUpload from "@/components/SingleUpload/index.vue";

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
    SingleUpload,
  },
})
export default class SystemBannerList extends Vue {
  vm = window['vm'];
  commonBaseUrl = imageUrl;  // 拼接图片
  tableData = [];
  tableColumnData: Array<object> = [
    { prop: "id", label: "ID", width: "220" },
    { prop: "sort", label: this.vm.$t('Common.排序'), width: "160" },
    { slot: 'operateTagImage' },
    { prop: "createTime", label: this.vm.$t('Users.创建时间'), width: "220" },
    { slot: "tableOperaBtn" },
  ]
  totalCount: number = 0;

  refreshBtnType: boolean = true; // 重置状态
  btnLoading: boolean = false; // 加载中状态
  dialogVisible: boolean = false; // dialog 显示隐藏
  drawerPopupType: number = 0;

  formData = {
    id: '',
    img: '',
    sort: '',
    status: '1'
  };
  get rules() { // 表单配置
    return {
      img: [
        { required: true, message: this.vm.$t("Common.请上传"), trigger: 'blur' }
      ],
      sort: [
        { required: true, message: this.vm.$t("Common.请输入"), trigger: 'blur' }
      ],
      status: [
        { required: true, message: this.vm.$t("Common.请选择"), trigger: 'blur' }
      ]
    }
  };

  param: IndexData = {
    page: 1,
    pageSize: 10,
  };

  created() {
    this.getInitData();
  };

  mounted() { };

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
    this.dialogVisible = false;
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = '';
    })
  };

  // 打开弹窗
  openPopupClick(type, row) {
    this.drawerPopupType = type;
    if (type === 1) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key];
      });
    }
    this.dialogVisible = true;
  };

  // 表格Switch操作 确认框
  handleOpenClick(row) {
    this.onSwitchStatusChange(row);  // 用户状态
  };

  async onSwitchStatusChange(row) {
    let { id, status } = row;
    const text = status === '0' ? this.vm.$t('Common.禁用成功') : this.vm.$t('Common.激活成功');
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
    const text = this.vm.$t('Common.此操作将删除该条信息');
    const text1 = this.vm.$t('Common.提示');
    const text2 = this.vm.$t('Common.确定');
    const text3 = this.vm.$t('Common.取消');

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
    const text = this.vm.$t('Common.删除成功');
    let { id } = row;
    console.log('id :>> ', id);
    const res = await webGetAdminUserSystemBannerDelete({ id })
    MessageTips(res, true, true, text, () => {
      this.getInitData();
    }, null)
  };

  // 添加 修改
  confirmEdit() {
    let ref: any = this.$refs['formData'];
    ref.validate(valid => {
      if (valid) {
        if (this.drawerPopupType === 0) {
          this.submitFormAddClick();
        } else {
          this.submitFormUpdateClick();
        }
      }
    })
  };

  /**
   * @description 修改列表
   */
  async submitFormUpdateClick() {
    this.btnLoading = true;
    const text = this.vm.$t("Common.修改成功");
    const res = await webGetAdminUserSystemBannerUpdate({
      ...this.formData
    });
    MessageTips(res, true, true, text, () => {
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
    const text = this.vm.$t("Common.添加成功");
    this.btnLoading = true;

    console.log('this.formData :>> ', this.formData);
    const res = await webGetAdminUserSystemBannerAdd({
      ...this.formData
    });

    MessageTips(res, true, true, text, () => {
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
    const { data: res } = await webGetAdminUserSystemBannerList(this.param);

    if (res.code === 20000) {
      let lists = res.data;
      this.tableData = lists;
      this.totalCount = lists.length;
    }
  };

  // 关闭弹窗
  onCloseDialog() {
    Object.keys(this.formData).forEach(key => {
      this.formData[key] = '';
    })

    let ref: any = this.$refs['SingleUpload'];
    ref.handleRemove();
  }
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
