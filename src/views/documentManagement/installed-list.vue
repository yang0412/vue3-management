<template>
  <div class="main-content">
    <h2>工单列表：</h2>
    <el-table :data="data.machineList" border v-loading="loading" max-height="600">
      <el-table-column prop="machineName" label="设备名称" />
      <el-table-column prop="installerName" label="安装人姓名" />
      <el-table-column prop="licenseCode" label="注册码" />
      <el-table-column label="激活时间">
        <template #default="scope">
          <div>
            {{ tool.formatDate(new Date(scope.row["activateTime"]), "yyyy-MM-dd hh:mm:ss") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="到期时间">
        <template #default="scope">
          <div>
            {{ tool.formatDate(new Date(scope.row["expireTime"]), "yyyy-MM-dd hh:mm:ss") }}
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
import { useRoute, onBeforeRouteLeave } from "vue-router";
import orderApi from "@/api/order";
import tool from "@/utils/tool";
const route = useRoute();
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  licenseOrderId: route.params.id,
});
const loading = ref(false);
const data = reactive({
  machineList: [],
  total: 0,
});
const getMachineList = () => {
  loading.value = true;
  orderApi
    .machineList(queryForm)
    .then((res) => {
      loading.value = false;
      data.machineList = res.result || [];
      data.total = res.result.total || 0;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getMachineList();
//切换页数
const handleSizeChange = (e) => {
  queryForm.pageSize = e;
  getMachineList();
};
//切换当前页
const handleCurrentChange = (e) => {
  queryForm.pageNo = e;
  getMachineList();
};
</script>
<style lang="scss" scoped></style>
