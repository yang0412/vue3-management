<template>
  <div class="search-box">
    <h2>筛选条件：</h2>
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
    <div class="list-title">
      <h2>代理商列表：</h2>
      <el-button type="primary" @click="createAgent">添加代理商</el-button>
    </div>
    <el-table :data="data.agentList" border v-loading="loading" max-height="500">
      <el-table-column prop="distributorName" label="代理商名称" />
      <el-table-column prop="contactMobile" label="联系方式" />
      <el-table-column prop="distributorAddress" label="公司地址" />
      <el-table-column label="学校数量">
        <template #default="scope">
          <a @click="jumpScholl(scope.row)">{{ scope.row["schoolNum"] }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="bankCard" label="银行卡号" />
      <el-table-column prop="depositBank" label="开户银行" />
      <el-table-column prop="creditCode" label="统一社会信用代码" />
      <el-table-column prop="profitRatio" label="提成比例" />
      <el-table-column prop="receivableMoney" label="应收返佣金额" />
      <el-table-column prop="settledMoney" label="结算返佣金额" />
      <el-table-column prop="usableMoney" label="可提现返佣金额" />
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
  <!-- 添加代理弹框 -->
  <el-dialog v-model="visible" title="创建代理商" :close-on-click-modal="false">
    <el-form :model="addForm" :rules="rules" ref="addFormRef">
      <el-form-item label="代理商名称" label-width="150px" prop="distributorName">
        <el-input v-model="addForm.distributorName" clearable type="text" />
      </el-form-item>
      <el-form-item label="联系方式" label-width="150px" prop="contactMobile">
        <el-input v-model="addForm.contactMobile" clearable type="number" />
      </el-form-item>
      <el-form-item label="登录账号" label-width="150px" prop="loginName">
        <el-input v-model="addForm.loginName" clearable type="text" />
      </el-form-item>
      <el-form-item label="登录密码" label-width="150px" prop="loginPassword">
        <el-input
          v-model="addForm.loginPassword"
          clearable
          :type="showPassword ? 'text' : 'password'"
        >
          <template #suffix>
            <el-icon v-show="showPassword" @click="showPassword = !showPassword"><View /></el-icon>
            <el-icon v-show="!showPassword" @click="showPassword = !showPassword"><Hide /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="提成比例" label-width="150px" prop="profitRatio">
        <el-input v-model="addForm.profitRatio" clearable type="number"> </el-input>
      </el-form-item>
      <el-form-item label="公司地址" label-width="150px" prop="distributorAddress">
        <el-input v-model="addForm.distributorAddress" clearable type="text" />
      </el-form-item>
      <el-form-item label="开户银行" label-width="150px" prop="depositBank">
        <el-input v-model="addForm.depositBank" clearable type="text" />
      </el-form-item>
      <el-form-item label="统一社会信用代码" label-width="150px" prop="creditCode">
        <el-input v-model="addForm.creditCode" clearable type="text" />
      </el-form-item>
      <el-form-item label="开户行支行" label-width="150px" prop="branchBank">
        <el-input v-model="addForm.branchBank" clearable type="text" />
      </el-form-item>
      <el-form-item label="银行卡号" label-width="150px" prop="bankCard">
        <el-input v-model="addForm.bankCard" clearable type="number" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button type="primary" @click="save" :loading="saveLoading"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import agentApi from "@/api/agent";
const router = useRouter();
const store = useStore();
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
getAgentList();
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
//添加代理商
const visible = ref(false);
const addFormRef = ref(null);
const createAgent = () => {
  visible.value = true;
};
const showPassword = ref(false);
const rules = reactive({
  distributorName: [
    {
      required: true,
      message: "代理商名称不能为空",
      trigger: "change",
    },
  ],
  loginName: [
    {
      required: true,
      message: "登录账号不能为空",
      trigger: "change",
    },
  ],
  loginPassword: [
    {
      required: true,
      message: "登录密码不能为空",
      trigger: "change",
    },
  ],
  contactMobile: [
    {
      required: true,
      message: "联系方式不能为空",
      trigger: "change",
    },
  ],
});
const addForm = reactive({
  distributorName: "",
  loginName: "",
  loginPassword: "",
  contactMobile: "",
  profitRatio: "",
});
//提交创建代理商
const saveLoading = ref(false);
const save = () => {
  saveLoading.value = true;
  addFormRef.value.validate((valid) => {
    if (valid) {
      agentApi
        .addAgent(addForm)
        .then((res) => {
          getAgentList();
          visible.value = false;
          saveLoading.value = false;
          addFormRef.value?.resetFields();
        })
        .catch(() => {
          saveLoading.value = false;
        });
    } else {
      saveLoading.value = false;
    }
  });
};
//跳转学校列表
const jumpScholl = (row) => {
  router.push({
    path: `/agency/school/list/${row.distributorId}`,
  });
};
</script>
<style lang="scss" scoped>
a {
  color: #409eff;
  cursor: pointer;
}
</style>
