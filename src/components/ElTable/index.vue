<template>
  <div class="table-box">
    <div class="toolbar" v-if="needToolbar">
      <div class="btn-left-box">
        <slot name="toolbar"></slot>
      </div>
      <div class="btn-left-box">
        <el-button
          size="small"
          type="default"
          @click="handleExportExcel"
          v-if="tableExcelType"
        >
          <i class="el-icon-folder-opened"></i> 导出表格
        </el-button>
        <el-button
          style="margin-left: 20px"
          size="small"
          type="default"
          circle
          title="刷新数据"
          @click="refreshTableData"
          v-if="needRefresh"
        >
          <i class="el-icon-refresh-right"></i>
        </el-button>
      </div>
    </div>
    <!--渲染树形数据（row-key）default-expand-all-->
    <div class="v-table">
      <el-table
        ref="filterTable"
        size="small"
        border
        :row-key="rowKey"
        :data="tableData"
        :tree-props="treeProps"
        :height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="index" width="50" label="#"></el-table-column> -->
        <template v-for="(column, index) in tableColumnData">
          <!--复选框（START）-->
          <el-table-column
            v-if="column.type == 'selection'"
            type="selection"
            :min-width="column.width"
            :key="index"
          >
          </el-table-column>
          <el-table-column
            v-if="column.type == 'index'"
            type="index"
            :min-width="column.width"
            :label="column.label"
            :key="index"
          >
          </el-table-column>

          <el-table-column
            v-else-if="column.type == 'image'"
            :min-width="column.width"
            :label="column.label"
            :key="index"
          >
            <template slot-scope="{ row }">
              <el-image
                v-if="row[column.prop]"
                :src="row[column.prop]"
                :preview-src-list="[row[column.prop]]"
                style="width: 100%; height: 80px;"
                fit="cover"
              ></el-image>
            </template>
          </el-table-column>

          <!-- 操作列/自定义列  slot 添加自定义配置项 -->
          <slot v-else-if="column.slot" :name="column.slot" :tit="index"></slot>

          <!-- 默认渲染列-渲染每一列的汉字 -->
          <el-table-column
            :label="column.label"
            :min-width="column.width"
            :show-overflow-tooltip="false"
            :key="column.id || index"
            v-else-if="column.type === 'user'"
          >
            <template slot-scope="{row}">
              <span style="color: #009688; font-weight: 600;">{{ row[column.prop] }}</span>
            </template>
          </el-table-column>

          <el-table-column
            :prop="column.prop"
            :label="column.label"
            :min-width="column.width"
            :show-overflow-tooltip="false"
            :key="column.id || index"
            v-else
          >
          </el-table-column>
        </template>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="v-pagination-box">
      <el-pagination
        v-if="needPagination"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        :page-size="totalPageSize"
        :current-page.sync="currentPage"
        :pager-count="pageCount"
        :size="pageCount > 3 ? 'medium' : 'small'"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>

    <!-- 导出 -->
    <ExportExcels
      :excelsTableHeader="excelHeader"
      :excelsFilterVal="excelKeys"
      :excelsName="excelsName"
      @getExportExcelInput="getExportExcelInput"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import { UserStore } from "@/store/private/user";
import { localData } from "@/filters/storage";
import ExportExcels from "../ExportExcels/index.vue";



@Component({
  name: "ElTables",
  components: {
    ExportExcels,
  },
})
export default class ElTable extends Vue {
  @Prop({ default: [] }) tableData!: Array<object>; // 表格数据
  @Prop({ default: [] }) tableColumnData!: any[]; // 表格表头
  @Prop({ default: 0 }) totalCount!: number | string; // 总信息条数
  @Prop({ default: 12 }) totalPageSize: number; // 分页数
  @Prop({ default: "medium" }) tableSize: string; // 表格大小
  @Prop({ default: "id" }) rowKey: string;
  @Prop({ default: { children: "children" } }) treeProps: object; // 下级折叠
  @Prop({ default: true }) needPagination: boolean;
  @Prop({ default: true }) needRefresh: boolean;
  @Prop({ default: false }) tableExcelType: boolean; // 导出状态
  @Prop({ default: [] }) tableColumnExcelData: Array<object>; // 导出表头
  @Prop({ default: false }) needTableHeight: boolean; // 是否需要设置高度
  @Prop({ default: false }) heightHalf: boolean; // 一半高度
  @Prop({ default: true }) needToolbar: boolean;

  currentPage: number = 1;
  loadingType: boolean = false;

  // 导出
  excelHeader: any = [];
  excelKeys: any = [];
  excelsName: string = "";
  


  @Emit("handleSelectionChange")
  handleSelectionChange(val): void {
    return val;
  }

  // 分页-获取用户点击的当前页后刷新表格数据
  @Emit("handleCurrentChange")
  handleCurrentChange(val) {
    return val;
  }

  tableHeight: string = "";

  pageCount: number = 7;

  // 生命周期
  mounted() {
    if(!this.needTableHeight) {
      this.getTableHeight();
      window.addEventListener("resize", () => {
        this.getTableHeight();

        let winWidth = window.innerWidth;

        if (winWidth <= 768) {
          this.pageCount = 3;
        } else {
          this.pageCount = 7;
        }
      });
    }
  }

  getTableHeight() {
    if(this.heightHalf) {
      this.tableHeight = window.innerHeight / 2 - 50 - 50 + 'px';
    } else {
      let winHeight = window.innerHeight;
      let search = document.getElementById("search") as any;
      if (search) {
        let tableHeight = winHeight - search.offsetHeight - 50 - 50 - 50 + "px";
        this.tableHeight = tableHeight;
      } else {
        let tableHeight = winHeight - 50 - 50 - 50 + "px";
        this.tableHeight = tableHeight;
      }
    }
    
  }

  // 重置分页器
  resetCurrentPage() {
    this.currentPage = 1;
  }

  // 根据用户获取的每页显示页面数量显示页面
  handleSizeChange(val) {
    // console.log(val);
  }

  /**
   * @description: 导出数据弹窗
   * @param {Array} excelHeader   excel 头
   * @param {Array} excelKeys     关键key -name
   * @return {*}
   */
  handleExportExcel() {
    const route: any = this.$route.meta;
    const name = route.title;

    let columnData: any = [];
    let tableExcelData = this.tableColumnExcelData;

    // 表格头数据
    if (tableExcelData.length > 0) {
      // data.push.apply(data, tableExcelData)
      const column = this.tableColumnData;
      columnData = column.concat(tableExcelData); // 合并
    } else {
      columnData = this.tableColumnData;
    }

    let excelHeader: Array<string> = [];
    let excelKeys: Array<string> = [];
    columnData.forEach((item) => {
      if (!item.slot) {
        excelHeader.push(item.label);
        excelKeys.push(item.prop);
      }
    });

    this.excelsName = name;
    this.excelHeader = excelHeader;
    this.excelKeys = excelKeys;
    UserStore.storeExportExcelsMap([{ ids: 0 }]);
  }

  /**
   * @description: 导出数据
   * @return {*}
   */
  getExportExcelInput(page: number, pageSize: number) {
    this.$emit("getExportExcelDataClick", {
      page,
      pageSize,
    });
  }

  // 刷新
  refreshTableData() {
    this.$emit("refreshTableChange", true);
    this.loadingType = true;
    setTimeout(() => {
      this.loadingType = false;
    }, 600);
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-table th {
  background: #f7f7f7;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 10px;

  .btn-left-box {
    display: flex;
  }
}

.v-pagination-box {
  margin-top: 10px;
  box-sizing: border-box;
  height: 40px;
  text-align: right;
  padding-right: 10px;
  overflow: hidden;
}
</style>
