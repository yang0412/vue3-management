<template>
  <div class="search-box">
    <h2>筛选条件：</h2>
    <el-form :inline="true" :model="queryForm" class="query-form">
      <el-form-item label="员工姓名">
        <el-input v-model="queryForm.userName" placeholder="请输入员工姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="main-content">
    <div class="list-title">
      <h2>员工列表：</h2>
      <el-button type="primary" @click="createStaff">创建员工</el-button>
    </div>
    <el-table :data="data.userList" border v-loading="loading" max-height="500">
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="userType" label="用户类型">
        <template #default="scope">
          <div>
            {{ scope.row["userType"] == 1 ? "超级管理员" : "普通用户" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userStatus" label="用户状态" />
      <el-table-column prop="profitRatio" label="提成比例" />
      <el-table-column prop="receivableMoney" label="应付返佣金额" />
      <el-table-column prop="usableMoney" label="可付返佣金额" />
      <el-table-column prop="settledMoney" label="结算返佣金额" />
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
  <!-- 添加员工 -->
  <el-dialog v-model="visible" title="创建员工" :close-on-click-modal="false">
    <el-form :model="addForm" :rules="rules" ref="addFormRef">
      <el-form-item label="用户名称" label-width="150px" prop="userName">
        <el-input v-model="addForm.userName" clearable type="text" placeholder="请输入用户名称" />
      </el-form-item>
      <el-form-item label="登录账号" label-width="150px" prop="loginName">
        <el-input v-model="addForm.loginName" clearable type="number" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="短信验证码" label-width="150px" prop="code">
        <el-row :gutter="20" style="width: 100%">
          <el-col :span="12"
            ><el-input v-model="addForm.code" clearable type="text" placeholder="请输入短信验证码"
          /></el-col>
          <el-col :span="12"
            ><el-button type="primary" @click="getCode">{{ codeText }}</el-button></el-col
          >
        </el-row>
      </el-form-item>
      <el-form-item label="提成比例" label-width="150px" prop="profitRatio">
        <el-input
          v-model="addForm.profitRatio"
          clearable
          type="number"
          placeholder="请输入提成比例0~1"
        />
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
import { reactive, ref, computed } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { message } from "@/plugin/elementplus";
import { useStore } from "vuex";
import staffApi from "@/api/staff";
import authApi from "@/api/auth";
const router = useRouter();
const store = useStore();
const queryForm = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: null,
});
const loading = ref(false);
const data = reactive({
  userList: [],
  total: 0,
});
const getUserList = () => {
  loading.value = true;
  staffApi
    .userList(queryForm)
    .then((res) => {
      loading.value = false;
      data.userList = res.result.records || [];
      data.total = res.result.total || 0;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getUserList();
//搜索
const search = () => {
  queryForm.pageNo = 1;
  getUserList();
};
//切换页数
const handleSizeChange = (e) => {
  queryForm.pageSize = e;
  getUserList();
};
//切换当前页
const handleCurrentChange = (e) => {
  queryForm.pageNo = e;
  getUserList();
};
//创建员工
const visible = ref(false);
const addFormRef = ref(null);
const addForm = reactive({
  code: "",
  loginName: "",
  profitRatio: "",
  userName: "",
});
const loginNameValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号"));
  } else if (!/^1[3456789]\d{9}$/.test(value)) {
    callback(new Error("手机号格式不正确"));
  } else {
    callback();
  }
};
const profitRatioValidator = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入提成比例"));
  } else if (value < 0 || value > 1) {
    callback(new Error("请输入0~1区间的值"));
  } else {
    callback();
  }
};
const rules = reactive({
  code: [
    {
      required: true,
      message: "验证码不能为空",
      trigger: "change",
    },
  ],
  loginName: [
    {
      required: true,
      validator: loginNameValidator,
      trigger: "change",
    },
  ],
  profitRatio: [
    {
      required: true,
      validator: profitRatioValidator,
      trigger: "change",
    },
  ],
  userName: [
    {
      required: true,
      message: "用户名称不能为空",
      trigger: "change",
    },
  ],
});

const createStaff = () => {
  visible.value = true;
};
//获取验证码
const getCode = () => {
  if (time.value > 0) {
    return;
  }
  addFormRef.value.validateField("loginName", (valid) => {
    if (valid) {
      authApi.sendCode({ phone: addForm.loginName }).then((res) => {
        if (res.result) {
          startCountTime();
        }
      });
    }
  });
};
const time = ref(0);
const codeText = computed(() => {
  return time.value ? `${time.value}后重新获取` : "获取验证码";
});
var timer;
const startCountTime = () => {
  time.value = 60;
  timer = setInterval(() => {
    time.value--;
    if (time.value == 0) {
      clearInterval(timer);
    }
  }, 1000);
};
//提交创建员工
const saveLoading = ref(false);
const save = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      saveLoading.value = true;
      staffApi
        .addUser(addForm)
        .then((res) => {
          message({
            showClose: true,
            message: "操作成功",
            type: "success",
          });
          visible.value = false;
          saveLoading.value = false;
          addFormRef.value?.resetFields();
        })
        .catch((err) => {
          saveLoading.value = false;
        });
    }
  });
};
</script>
<style lang="scss" scoped></style>
