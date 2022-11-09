<template>
  <div>
    <div class="search-box">
      <el-form :inline="true" :model="queryForm" class="query-form">
        <el-form-item label="代理商名称">
          <el-input v-model="queryForm.distributorName" placeholder="请输入代理商名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content">
      <el-table
        ref="agentTableRef"
        :data="data.agentList"
        border
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="distributorName" label="代理商名称" />
        <el-table-column prop="contactMobile" label="联系方式" />
        <el-table-column prop="distributorAddress" label="公司地址" />
        <el-table-column prop="profitRatio" label="提成比例" />
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
  </div>
</template>
<script setup>
import agentApi from "@/api/agent";
import { reactive, ref, defineExpose, onMounted } from "vue";
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  distributorName: null,
});
const loading = ref(false);
const data = reactive({
  agentList: [],
  total: 0,
});
const getAgentList = () => {
  loading.value = true;
  agentApi
    .agentList(queryForm)
    .then((res) => {
      loading.value = false;
      data.agentList = res.result.records || [];
      data.total = res.result.total || 0;
    })
    .catch((err) => {
      loading.value = false;
    });
};
onMounted(() => {
  getAgentList();
});
//搜索
const search = () => {
  queryForm.pageNo = 1;
  getAgentList();
};
//切换页数
const handleSizeChange = (e) => {
  queryForm.pageSize = e;
  getAgentList();
};
//切换当前页
const handleCurrentChange = (e) => {
  queryForm.pageNo = e;
  getAgentList();
};
const agentTableRef = ref(null);
const handleSelectionChange = (selection, row) => {
  if (selection.length > 1) {
    let del_row = selection.shift();
    agentTableRef.value.toggleRowSelection(del_row, false);
  }
};
defineExpose({
  tableRef: agentTableRef,
  getAgentList: getAgentList,
});
</script>
<style lang="scss" scoped>
// 隐藏全选按钮
:deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
