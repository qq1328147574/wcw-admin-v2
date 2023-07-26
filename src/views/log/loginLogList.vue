<template>
  <!-- 登录日志列表 -->
  <div class="pages">
    <ElTable
      :tableData="tableData"
      :tableColumnData="tableColumnData"
      :totalCount="totalCount"
      :totalPageSize="param.pageSize"
      @refreshTableChange="refreshTableData"
      @handleCurrentChange="handleCurrentChange"
    >
    </ElTable>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { MessageTips } from "@/filters/MessageTips";
import { FormatCurrentTime } from '@/filters/common';
import {
  webGetAdminLoginLogList,
} from '@/api/index';

import ElTable from "@/components/ElTable/index.vue";

type IndexData = {
  page: number;
  pageSize: number
};
@Component({
  components: {
    ElTable,
  },
})
export default class LoginLogList extends Vue {
  private vm = window['vm'];
  private roleListData: any = []; 
  private tableData = []; 
  private tableColumnData: Array<object> = [
    {
      prop: "id",
      label: "ID",
      width: "220"
    },
    {
      prop: "username",
      label: this.vm.$t('System.用户名'),
      width: "220"
    },
    // {
    //   prop: "logName",
    //   label: this.vm.$t('System.日志名称'),
    //   width: "220"
    // },
    {
      prop: "message",
      label: this.vm.$t('System.具体消息'),
      width: "300"
    },
    {
      prop: "remoteIp",
      label: this.vm.$t('System.登录远程IP'),
      width: "220"
    },
    // {
    //   prop: "success",
    //   label: this.vm.$t('System.执行状态'),
    //   width: "300"
    // },
    {
      prop: "createTime",
      label: this.vm.$t('System.访问时间'),
      width: "220"
    },
  ]
  private totalCount: number = 0;
  private formData: any = {
    bindAmount: '',
    level: '',
    levelName: ''
  };
  private param:IndexData = {
    page: 1,
    pageSize: 20
  }

  created() {
    this.initGetDataList();
  }

  mounted() {}

  // 重置
  private resetForm(formName: string) {
    const _that = this;
    const ref: any = _that.$refs[formName]; // 类型断言的用，定义一个变量等价ref
    ref.resetFields();
  };

  // 刷新数据
  private refreshTableData() {
    this.initGetDataList();
  }

  private handleCurrentChange(val) {
    this.param.page = val
    this.refreshTableData();
    // console.log(this.param);
  }


  // 查询
  private async initGetDataList(searchData: object = {}) {
    const {data} = await webGetAdminLoginLogList({
      ...this.param,
      ...searchData
    });

    // console.log(data);
    if(data.code === 20000 ) {
      let lists = data.data;
      if(lists.records) {
        this.tableData = lists.records;
        this.totalCount = lists.total;
      }
    }
  }

  
}
</script>

<style lang="scss" scoped>
.v-form-box {
  padding: 15px 0;
  .v-btn-box {min-width: 205px; margin-top: 30px;text-align: center;}
}
</style>
