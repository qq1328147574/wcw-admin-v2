<template>
  <!-- 兑换配置 -->
  <div class="pages" style="padding: 0 10px;">
    <el-page-header @back="goBack" style="padding: 15px 0;"></el-page-header>
    <!-- <Search :formColumnData="formSearchOptions" @result="handleSearchClick" @reset="resetTableData"></Search> -->

    <h3 class="v-table-title">
      {{ $route.params.userName === '0' ? '' : $route.params.userName }} {{ $t('Users.组织树形图') }}
    </h3>

    <div class="user-container">
      <el-row>
        <!-- <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8"> -->
          <el-tree
            node-key="userId"
            :load="onLoadData"
            lazy
            highlight-current
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>
                <i class="el-icon-user-solid"></i> 
                <b>{{ data.userName }}</b>
                <!--  - 
                {{ data.lastMatchingAmount || '未购买' }} -->
              </span>
              <span>
                <el-button type="text" size="mini" @click="onClickView($event, node, data)"> {{ $t('Users.查看') }} </el-button>
              </span>
            </span>
          </el-tree>
        <!-- </el-col> -->
      </el-row>
    </div>

    <Dialog v-model="drawerVisible" :title="$t('Users.用户信息')">
      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
          <div class="v-drawer-info">
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ $t('Users.用户名') }}</div>
              <div class="weui-flex-bd">{{ drawerData.userName }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ $t('Users.本日业绩') }}</div>
              <div class="weui-flex-bd">{{ drawerData.daily }}</div>
            </div>
            <div class="weui-flex font-size14">
              <div class="weui-flex-hd font-size12 font-grey6"> {{ $t('Users.本周业绩') }}</div>
              <div class="weui-flex-bd">{{ drawerData.weekly }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import ElTable from "@/components/ElTable/index.vue";

import {
  webGetQueryUserInviteTree,
  webGetQueryLevelInfo
} from "@/api/index";

interface IndexData {
  page: number;
  pageSize: number;
  [props: string]: any;
};
let params: IndexData = {
  page: 1,
  pageSize: 100000
}

@Component({
  components: {
    ElTable,
  },
})
export default class UserTree extends Vue {
  vm = window["vm"];

  param = JSON.parse(JSON.stringify(params));

  drawerVisible: boolean = false;
  drawerData: any = {};

  levelList: any = {};

  getPackageList: any = {} // 配套
  packageList: any[] = [] // 配套

  created() {
    // this.getLevelInfo();
  }

  mounted() {}

  async getLevelInfo() {
    const { data } = await webGetQueryLevelInfo({});
    if(data.code === 20000) {
      data.data.forEach(item=> {
        this.levelList[item.level] = item.cn;
      })
    }
  }

  goBack() {
    this.$router.back();
  }

  onClickView(e, node, data) {
    this.onOpenDrawer(data);
    e.stopPropagation();
  }

  // drawer
  onOpenDrawer(row) {
    Object.keys(row).forEach(key=> {
      this.drawerData[key] = row[key];
    })
    this.drawerVisible = true;
  }

  async onLoadData(node, resolve) {
    // console.log(node);
    
    if(node.level === 0) {
      let parentId = this.$route.params.id;
      const { data: res } = await webGetQueryUserInviteTree({ 
        isDirect: false,
        userId: parentId == '0' ? '' : parentId
      });
      if (res.code === 20000) {
        let data = res.data.records;
        resolve(data);
      }
    } else {
      let { data } = node;
      const { data: res } = await webGetQueryUserInviteTree({userId: data.id});
      if (res.code === 20000) {
        let data = res.data.records;
        resolve(data);
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.v-btn-box {
  min-width: 205px;
  margin-top: 15px;
  text-align: center;
}

.v-table-title {
  padding: 15px 0;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.weui-flex-bd {
  font-weight: bold;
}

.weui-flex {
  padding: 10px 0;
}
</style>
