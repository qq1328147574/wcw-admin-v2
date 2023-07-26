<template>
  <!-- 通知列表 -->
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
      <el-button size="small" type="primary" slot="toolbar" icon="el-icon-circle-plus-outline" @click="openPopupClick(1, null)" v-permission="'添加新通知'">{{ $t("System.添加通知") }}</el-button >
      <el-table-column slot="tableNoticeType" :label="$t('System.类型')" min-width="160" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.noticeType === 1">{{ $t("System.提示") }}</el-tag>
          <el-tag type="warning" v-else-if="scope.row.noticeType === 2">{{ $t("System.信箱") }}</el-tag>
          <el-tag v-else>H5</el-tag>
        </template>
      </el-table-column>
      <el-table-column slot="tableUserType" :label="$t('System.平台类型')" min-width="160" >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.userType === 'USER'">APP {{$t("System.用户")}}</el-tag>
          <el-tag type="warning" v-else>{{ $t("System.商家用户") }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column slot="tableOperaBtn" :label="$t('System.操作')" min-width="240">
        <template slot-scope="scope">
          <div>
            <el-button type="text" size="small" icon="el-icon-tickets" class="text-black" @click="openPopupClick(0, scope.row)">{{$t('System.查看')}}</el-button>
            <el-button type="text" size="small" icon="el-icon-edit-outline" class="v-edit-btn" @click="openPopupClick(2, scope.row)"  v-permission="'添加新通知'">{{ $t("System.添加新通知") }}</el-button >
            <el-button type="text" size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(scope.row)" v-permission="'删除通知'">{{ $t("System.删除") }}</el-button >
          </div>
        </template>
      </el-table-column>
    </ElTable>
    
    <Drawer v-model="drawerPopupVisible" :title="drawerPopupType ? $t('System.添加通知') : $t('System.查看信息')" @close="onPopupsClose">
      <!-- 资料 -->
      <div class="content" v-if="drawerPopupId === 0">
        <div class="v-drawer-info">
          <div class="v-list" v-for="item in drawerInfoData.list" :key="item.id">
            <div class="padding20-top"></div>
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">ID</div>
              <div class="weui-flex-bd">{{item.id}}</div>
              <div class="weui-flex-bd" style="text-align: right;">
                <el-button type="danger" plain size="small" icon="el-icon-delete" class="v-delete-btn" @click="handleDelRouter(item)" >{{ $t("System.删除") }}</el-button >
              </div>
            </div>
            <!-- <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.类型')}}</div>
              <div class="weui-flex-bd">
                <el-tag v-if="item.noticeType === 1">{{ $t("System.提示") }}</el-tag>
                <el-tag type="warning" v-else-if="item.noticeType === 2">{{ $t("System.信箱") }}</el-tag>
                <el-tag v-else>H5</el-tag>
              </div>
            </div> -->
            <!-- <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.状态')}}</div>
              <div class="weui-flex-bd">
                <el-tag type="info" v-if="item.readStatus === 1">{{$t("System.已读")}}</el-tag>
                <el-tag type="info" v-else>{{ $t("System.未读") }}</el-tag>
              </div>
            </div> -->
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.语言')}}</div>
              <div class="weui-flex-bd">
                <el-tag type="primary" v-if="item.language === 'zh_CN'">{{$t("System.中文")}}</el-tag>
                <el-tag type="primary" v-else>English</el-tag>
              </div>
            </div>
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.标题')}}</div>
              <div class="weui-flex-bd">
                {{item.title}}
              </div>
            </div>
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.简介')}}</div>
              <div class="weui-flex-bd">
                {{item.briefIntroduction}}
              </div>
            </div>
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.内容')}}</div>
              <div class="weui-flex-bd" v-html="item.content"></div>
            </div>
            <div class="weui-flex font-size18">
              <div class="weui-flex-hd font-size14 font-grey6">{{$t('System.创建时间')}}</div>
              <div class="weui-flex-bd">
                {{item.createTime}}
              </div>
            </div>

            <div class="padding20-top"></div>
          </div>
        </div>
      </div>

      <div class="content" v-else>
        <VForm formSize="small" :formsModel="formData" :formOptions="formOptions" :refreshBtnType="refreshBtnType" :loading="btnLoading" @submit="confirmEdit" >
          <div slot="userName">
            <el-input v-model="formData.userName" :placeholder="$t('System.请输入')+$t('System.用户名称')" :disabled="selectDisabled" ></el-input>
          </div>
          <div slot="targetType">
            <el-radio-group v-model="formData.targetType" @change="targetTypeChange" >
              <el-radio :label="1" :disabled="selectDisabled">{{$t('System.个人')}}</el-radio>
              <el-radio :label="2" :disabled="selectDisabled">{{$t('System.全部')}}</el-radio>
            </el-radio-group>
          </div>
          <div slot="briefIntroduction">
            <VEditor v-model="formData.briefIntroduction"></VEditor>
          </div>
          <div slot="content">
            <VEditor v-model="formData.content"></VEditor>
          </div>
        </VForm>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import {
  webGetAdminGetNoticeList, // 查询
  webGetAdminAddNotice, // 添加
  webGetAdminAddChildNotice,
  webGetAdminUpdateNotice, // 修改
  webGetAdminRemoveNotice, // 删除
  webGetAdminRemoveChildNotice,
  webGetAdminAllNoticeAdd,
} from "@/api/index";

import ElTable from "@/components/ElTable/index.vue";
import VEditor from "@/components/VEditorText/index.vue";

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
  },
})
export default class SystemNoticeList extends Vue {
  private vm = window["vm"];

  private roleListData: any = [];
  private tableData = [];
  private tableColumnData: Array<object> = [
    { prop: "noticeCode", label: "ID", width: "220", },
    { prop: "userName", label: this.vm.$t('System.用户名称'), width: "220" },
    // { slot: "tableNoticeType", }, 
    { slot: "tableOperaBtn", },
  ];
  private totalCount: number = 0;

  param = JSON.parse(JSON.stringify(params)); // 分页

  private btnLoading: boolean = false; // 加载中状态
  private refreshBtnType: boolean = true; // 重置状态
  private drawerPopupVisible: boolean = false; // dialog 显示隐藏
  private drawerPopupType: boolean = true;
  private drawerPopupId: number = 0;
  private selectDisabled: boolean = false;
  
  private editorContent: any = "";

  private drawerInfoData: any = {};

  private formData: any = {
    targetType: 1,
    id: '',
    userName: "",
    briefIntroduction: "",
    content: "",
    title: "",
    noticeType: 1,
    language: 'zh_CN',
    noticeCode: ''
  };
  private formOptions: any = [
    {
      key: 'targetType',
      slot: "targetType",
      label: this.vm.$t("System.发送对象"),
    },
    // {
    //   type: "radio",
    //   // inputType: "button",
    //   key: "noticeType",
    //   label: this.vm.$t("System.类型"),
    //   disabled: false,
    //   options: [
    //     { label: this.vm.$t("System.提示"), value: 1 },
    //     { label: this.vm.$t("System.信箱"), value: 2 },
    //   ],
    // },
    {
      type: "radio",
      // inputType: "button",
      key: "language",
      label: this.vm.$t("System.语言"),
      options: [
        {value: 'zh_CN', label: this.vm.$t('System.中文')},
        {value: 'en_US', label: 'English'},
      ],
    },
    {
      slot: 'userName',
      key: 'userName',
      label: this.vm.$t('System.用户名称'),
      disabled: false,
      rules: [
        {
          required: true,
          message: this.vm.$t('System.请输入') + this.vm.$t('System.用户名称'),
          trigger: 'blur'
        }
      ]
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
      key: 'briefIntroduction',
      type: "input",
      inputType: 'textarea',
      label: this.vm.$t("System.简介"),
      placeholder: this.vm.$t("System.请输入") + this.vm.$t("System.简介"),
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
      placeholder: this.vm.$t("System.请输入") + this.vm.$t("System.详情"),
      rules: [
        {
          required: true,
          message:  this.vm.$t("System.请输入") + this.vm.$t("System.详情"),
          trigger: "blur",
        },
      ],
    },
  ];

  private formSearchOptions: object = [
    {
      type: "input",
      key: "userName",
      label: this.vm.$t('System.用户名称'),
      placeholder: "",
    },
    // {
    //   type: "select",
    //   key: "noticeType",
    //   label: this.vm.$t('System.类型'),
    //   value: [
    //     {
    //       label: this.vm.$t('System.提示'),
    //       value: '1'
    //     },
    //     {
    //       label: this.vm.$t('System.信箱'),
    //       value: '2'
    //     },
    //   ],
    //   placeholder: '',
    // },
  ];

  created() {
    this.getInitData();
  }

  mounted() {}

  targetTypeChange(val) {
    if(val === 1) {
      this.selectDisabled = false;
      this.formData.userName = '';
    } else {
      this.selectDisabled = true;
      this.formData.userName = '/';
    }
  };

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
  private refreshTableData() {
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
  private handleCurrentChange(val) {
    this.param.page = val;
    this.refreshTableData();
  }

  /**
   * @description 关闭弹窗
   */
  private onPopupsClose() {
    Object.keys(this.formData).forEach((key) => {
      if (key === "noticeType" || key === "targetType") this.formData[key] = 1;
      else if (key === 'userType') this.formData[key] = 'USER';
      else if (key === 'language') this.formData[key] = 'zh_CN';
      else this.formData[key] = ''
    });

    this.drawerPopupId = 1;
    this.drawerPopupVisible = false;
  }

  /**
   * @description 打开弹窗
   */
  private openPopupClick(ids, row) {
    if(ids === 2) {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = row[key] || this.formData[key];
      });
      
      this.refreshBtnType = false;
      this.selectDisabled = true;
      this.drawerPopupType = true;
      this.formOptions[1].disabled = true;
      // this.formOptions[2].disabled = true;

    } else if(ids === 0) {
      this.drawerInfoData = row;
      console.log(this.drawerInfoData);
      
      this.drawerPopupType = false;

    } else {
      this.refreshBtnType = true;
      this.drawerPopupType = true;
      this.selectDisabled = false;
      this.formOptions[1].disabled = false;
      this.formOptions[2].disabled = false;
    }

    // console.log(this.drawerInfoData);
    this.drawerPopupId = ids;
    this.drawerPopupVisible = true;
  }

  /**
   * @description 查询列表
   */
  private async getInitData() {
    const { data: res } = await webGetAdminGetNoticeList(this.param);

    // console.log(res);
    if (res.code === 20000) {
      let lists = res.data;
      this.tableData = lists.records;
      this.totalCount = lists.total;
    }
  };

  // 删除
  private handleDelRouter(row) {
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

  // 添加 修改
  private confirmEdit(val) {
    this.btnLoading = true;
    this.formData = val;
    // console.log(val);
    
    if (this.drawerPopupType) {
      this.submitFormAddClick();
      
    } else {
      this.submitFormUpdateClick();
    }
  }

  /**
   * @description 添加通知
   */
  private async submitFormAddClick() {
    const text = this.vm.$t("System.添加成功");
    const {targetType} = this.formData;

    // console.log(this.formData);
    if(this.drawerPopupId === 1) {
      if(targetType === 1) {
        const res = await webGetAdminAddNotice({
          ...this.formData
        });

        MessageTips( res, true, true, text, () => { 
          this.btnLoading = false; 
          this.getInitData(); 
          this.onPopupsClose(); 
        }, (err) => { 
          this.btnLoading = false; 
        });       

      } else {
        const res = await webGetAdminAllNoticeAdd({
          ...this.formData
        });

        MessageTips( res, true, true, text, () => { 
          this.btnLoading = false; 
          this.getInitData(); 
          this.onPopupsClose(); 
        }, (err) => { 
          this.btnLoading = false; 
        });
      }

    } else {
      const res = await webGetAdminAddChildNotice({
        ...this.formData
      });
      MessageTips( res, true, true, text, () => { 
        this.btnLoading = false; 
        this.getInitData(); 
        this.onPopupsClose(); 
      }, (err) => { 
        this.btnLoading = false; 
      });
    }
  };

  /**
   * @description 修改通知
   */
  private async submitFormUpdateClick() {
    const text = this.vm.$t("System.修改成功");
    const res = await webGetAdminUpdateNotice({
      ...this.formData
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
   * @description 删除通知
   */
  private async handleDeleteClick(row) {
    const text = this.vm.$t("System.删除成功");
    const { id, noticeCode } = row;

    if(this.drawerPopupId === 0) {
      const res = await webGetAdminRemoveChildNotice({
        id,
        noticeCode
      });
      MessageTips( res, true, true, text, () => { 
        this.btnLoading = false; 
        this.getInitData(); 
        this.onPopupsClose(); 
      }, (err) => { 
        
      });
    } else {
      const res = await webGetAdminRemoveNotice({
        id,
        noticeCode,
      });
      MessageTips( res, true, true, text, () => { 
        this.btnLoading = false; 
        this.getInitData(); 
      }, (err) => { 
        this.btnLoading = false; 
      });
    }
  };

}
</script>

<style lang="scss" scoped>
::v-deep .el-tag {
  min-width: 80px;
  text-align: center;
}

::v-deep .el-drawer__body {
  .content {
    padding: 0 40px;
  }
  .v-drawer-info {
    .v-list {
      border-bottom: 1px solid #f1f1f1;
      &:last-child {
        border: 0;
      }
    }
    .weui-flex {
      padding: 10px 0;
      .weui-flex-hd {
        min-width: 100px;
      }
    }
  }
}
</style>
