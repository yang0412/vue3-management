<template>
  <div class="search-box">
    <h2>筛选条件：</h2>
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="客户名称">
        <el-input v-model="queryForm.customerName" placeholder="请输入客户名称"></el-input>
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select
          v-model="queryForm.customerType"
          class="m-2"
          :clearable="true"
          placeholder="请选择客户类型"
        >
          <el-option
            v-for="item in type"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-content">
    <div class="list-title">
      <h2>学校列表：</h2>
      <el-button type="primary" @click="allocate">分拨</el-button>
    </div>
    <el-table
      :data="data.clientList"
      border
      v-loading="loading"
      max-height="500"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column label="客户类型">
        <template #default="scope">
          <div>
            {{ type.filter((item) => item.value == scope.row["customerType"])[0].label }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="installedQuantity" label="已安装数量" />
      <el-table-column prop="registerQuantity" label="总共注册数量" />
      <el-table-column label="更新时间">
        <template #default="scope">
          <div>
            {{ tool.formatDate(new Date(scope.row["updateTime"]), "yyyy-MM-dd hh:mm:ss") }}
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="text" @click="activateDialog(scope.row)">激活</el-button>
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
  <!-- 分拨弹框 -->
  <el-dialog v-model="visible" title="分拨-选择代理商" :close-on-click-modal="false">
    <agent-list ref="agentListRef"></agent-list>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 激活弹框 -->
  <el-dialog v-model="activateVisible" title="激活" :close-on-click-modal="false">
    <activate-content :id="distributorCustomerId" ref="activateRef"></activate-content>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="activateVisible = false">关闭</el-button>
        <el-button type="primary" @click="activate" :loading="activateLoading"> 激活 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { notification, message } from "@/plugin/elementplus";
import { useStore } from "vuex";
import tool from "@/utils/tool";
import AgentList from "./agent-list.vue";
import ActivateContent from "./activate-content.vue";
import schoolApi from "@/api/school";
const router = useRouter();
const store = useStore();
//客户类型
const type = ref([
  {
    label: "学校",
    value: "school",
  },
  {
    label: "个人",
    value: "personal",
  },
  {
    label: "培训机构",
    value: "train",
  },
]);
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  customerName: null,
  customerType: null,
});
const loading = ref(false);
const data = reactive({
  clientList: [],
  total: 0,
});
const getClientList = () => {
  loading.value = true;
  schoolApi
    .clientList(queryForm)
    .then((res) => {
      loading.value = false;
      data.clientList = res.result.records || [];
      data.total = res.result.total || 0;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getClientList();
//搜索
const search = () => {
  queryForm.pageNo = 1;
  getClientList();
};
//切换页数
const handleSizeChange = (e) => {
  queryForm.pageSize = e;
  getClientList();
};
//切换当前页
const handleCurrentChange = (e) => {
  queryForm.pageNo = e;
  getClientList();
};
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
};
//分拨
const agentListRef = ref(null);
const visible = ref(false);
const allocate = () => {
  if (multipleSelection.value.length <= 0) {
    return notification({
      title: "提示",
      message: "请选择学校",
      type: "warning",
    });
  }
  visible.value = true;
  agentListRef.value.getAgentList();
};
//提交分拨
const saveLoading = ref(false);
const save = () => {
  let currentRow = agentListRef.value.tableRef.getSelectionRows();
  if (currentRow.length <= 0) {
    return notification({
      title: "提示",
      message: "请选择代理商",
      type: "warning",
    });
  }
  let idArr = multipleSelection.value.map((_) => {
    return _.distributorCustomerId;
  });
  saveLoading.value = true;
  schoolApi
    .allocate({
      distributorId: currentRow[0].distributorId,
      ids: idArr,
    })
    .then((res) => {
      message({
        showClose: true,
        message: "操作成功",
        type: "success",
      });
      visible.value = false;
      saveLoading.value = false;
      getClientList();
    })
    .catch((err) => {
      saveLoading.value = false;
    });
};
//激活
const activateRef = ref(null);
const activateVisible = ref(false);
const activateLoading = ref(false);
const distributorCustomerId = ref("");
const activateDialog = (e) => {
  activateVisible.value = true;
  distributorCustomerId.value = e.distributorCustomerId;
};
const activate = () => {
  let queryForm = activateRef.value.queryForm;
  if (!queryForm.uniqueCode) {
    return message({
      showClose: true,
      message: "请输入设备码",
      type: "warning",
    });
  }
  if (!queryForm.licenseOrderId) {
    return message({
      showClose: true,
      message: "请选择工单",
      type: "warning",
    });
  }
  if (!queryForm.machineName) {
    return message({
      showClose: true,
      message: "请输入班级名称",
      type: "warning",
    });
  }
  activateLoading.value = true;
  schoolApi
    .activate(queryForm)
    .then((res) => {
      if (res.result) {
        message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
      }
      activateLoading.value = false;
      activateVisible.value = false;
      activateRef.value.queryForm.uniqueCode = "";
      activateRef.value.isBinding = true;
    })
    .catch((err) => {
      activateLoading.value = false;
    });
};
// 监听路由离开
onBeforeRouteLeave((to, from, next) => {
  if (to.path.indexOf("school") < 0) {
    store.commit("removeCacheRoute", from.name);
  }
  next();
});
</script>
<style lang="scss" scoped></style>
