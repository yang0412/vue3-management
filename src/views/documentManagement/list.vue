<template>
  <div class="main-content">
    <h2>工单列表：</h2>
    <el-table :data="data.orderList" border v-loading="loading" max-height="600">
      <el-table-column prop="orderName" label="注册人姓名" />
      <el-table-column prop="distributorUserNames" label="安装人姓名" />
      <el-table-column prop="licenseMonths" label="有效月份数量" />
      <el-table-column label="完成状态">
        <template #default="scope">
          {{ scope.row["finishStatus"] ? "已完成" : "未完成" }}
        </template>
      </el-table-column>
      <el-table-column prop="licenseQuantity" label="注册数量" />
      <el-table-column label="已安装数量">
        <template #default="scope">
          <a @click="jumpInstalled(scope.row)">{{ scope.row["usedQuantity"] }}</a>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <div>
            {{ tool.formatDate(new Date(scope.row["createTime"]), "yyyy-MM-dd hh:mm:ss") }}
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="queryForm.pageNo"
        v-model:page-size="queryForm.pageSize"
        :page-sizes="[10, 50, 100, 150]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import orderApi from "@/api/order";
import tool from "@/utils/tool";
const router = useRouter();
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
});
const loading = ref(false);
const data = reactive({
  orderList: [],
  total: 0,
});
const getOrderList = () => {
  loading.value = true;
  orderApi
    .orderList(queryForm)
    .then((res) => {
      loading.value = false;
      data.orderList = res.result.records || [];
      data.total = res.result.total || 0;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getOrderList();
//搜索
const search = () => {
  queryForm.pageNo = 1;
  getOrderList();
};
//切换页数
const handleSizeChange = (e) => {
  queryForm.pageSize = e;
  getOrderList();
};
//切换当前页
const handleCurrentChange = (e) => {
  queryForm.pageNo = e;
  getOrderList();
};
//跳转已安装列表
const jumpInstalled = (row) => {
  router.push({
    path: `/document/installed/list/${row.licenseOrderId}`,
  });
};
</script>
<style lang="scss" scoped>
a {
  color: #409eff;
  cursor: pointer;
}
</style>
