<template>
  <div class="login-bg">
    <div class="login-row">
      <div class="login-title">
        {{ $config.system.APP_NAME }}
      </div>
      <el-form
        ref="usernameLoginForm"
        :model="loginForm"
        :rules="rules"
        hide-required-asterisk
        class="login-form"
      >
        <el-form-item prop="loginName">
          <el-input
            v-model="loginForm.loginName"
            clearable
            maxlength="50"
            placeholder="请输入用户名"
            :prefix-icon="UserFilled"
            @keyup.enter="submitLogin"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            show-password
            maxlength="50"
            v-model="loginForm.password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            @keyup.enter="submitLogin"
          />
        </el-form-item>
        <el-form-item class="remember">
          <el-checkbox
            v-model="loginForm.rememberme"
            label="记住密码"
            size="large"
            title="有效期30天"
          ></el-checkbox>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="login-btn" @click="submitLogin">登&nbsp;录</el-button>
    </div>
    <el-footer v-if="$config.system.FOOTER.SHOW" :class="{ beian: $config.system.BEIAN }"
      ><bottom-footer :beian="$config.system.BEIAN"
    /></el-footer>
  </div>
</template>
<script setup>
import topRoutes from "@/router/topRoute";
import authApi from "@/api/auth";
import BottomFooter from "@/views/Layout/BottomFooter";
import { ElLoading } from "element-plus";
import "element-plus/es/components/loading/style/css";
import { reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { UserFilled, Lock } from "@element-plus/icons-vue";
import permissions from "@/global/userPermissions";
import leftMenu from "@/global/menu";
const store = useStore();
const router = useRouter();
const loginForm = reactive({
  loginName: store.state.user.rememberme.loginName,
  password: store.state.user.rememberme.password,
  rememberme: !!store.state.user.rememberme.loginName,
});
const rules = reactive({
  loginName: [
    {
      required: true,
      message: "账号不能为空",
      trigger: "change",
    },
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "change",
    },
  ],
});
const usernameLoginForm = ref(null);
const getUserMenus = function () {
  return authApi
    .getUserMenus()
    .then((d) => {
      console.log(d);
      if (!!d && d.code == "200") {
        store.commit("setLeftMenu", { menuList: d.data });
        store.commit("setTopMenu", { menuList: topRoutes });
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .catch(() => {
      return Promise.reject();
    });
};
const getUserPermissions = function () {
  return authApi
    .getUserPermissions()
    .then((d) => {
      console.log(d);
      if (!!d && d.code == "200") {
        store.commit("setPermissions", { permissions: d.data || [] });
        return Promise.resolve();
      } else {
        return Promise.reject();
      }
    })
    .catch(() => {
      return Promise.reject();
    });
};
const submitLogin = function () {
  usernameLoginForm.value.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: "正在加载",
      });
      authApi
        .login({
          loginName: loginForm.loginName,
          password: loginForm.password,
        })
        .then((d) => {
          store.commit("setToken", d.result.token);
          store.commit("setRememberme", loginForm);
          store.commit("setLeftMenu", { menuList: leftMenu });
          store.commit("setTopMenu", { menuList: topRoutes });
          store.commit("setPermissions", { permissions: permissions || [] });
          store.commit("setUser", {
            token: d.result.token,
            name: loginForm.loginName,
            expire: d.result.expireTime,
          });
          router.push("/");
          loading.close();
          //接口获取菜单和权限
          // Promise.all([getUserMenus(), getUserPermissions()])
          //   .then(() => {
          //     store.commit("setUser", {
          //       token: d.data.token,
          //       name: d.data.user.username,
          //       expire: d.data.expire,
          //     });
          //     router.push("/");
          //     loading.close();
          //   })
          //   .catch(() => {
          //     loading.close();
          //   });
          loading.close();
        })
        .catch(() => {
          loading.close();
        });
    }
  });
};
</script>

<style scoped>
.login-title {
  font-size: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: 500;
}
.login-bg {
  text-align: center;
  height: 100%;
  width: 100%;
  background-image: url("../../assets/img/login_bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.login-bg:before {
  content: "";
  display: inline-block;
  vertical-align: middle;
  height: 100%;
}
.codeimg {
  width: 110px;
  margin-left: calc(50% - 110px);
}
.login-btn {
  width: 100%;
  line-height: 38px;
}
.login-row {
  margin-top: -100px;
  vertical-align: middle;
  display: inline-block;
  background-color: #fff;
  padding: 0 15px 15px;
  border-radius: 5px;
  width: 380px;
  /* position: absolute;
    top:50%;
    transform: translateY(-50%); */
}
.remember {
  margin-top: -5px;
  margin-bottom: 10px;
}
:deep(.el-input__inner),
.el-checkbox.el-checkbox--large :deep(.el-checkbox__label),
.login-btn,
.codeimg {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
:deep(.el-checkbox__inner)::after {
  left: 5px;
  top: 2px;
}
.el-checkbox.el-checkbox--large :deep(.el-checkbox__inner) {
  height: 16px;
  width: 16px;
}
.el-select {
  width: 100%;
}
.el-footer {
  padding: 0;
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: #fff;
  /* background-color: #f0f0f0d0; */
}
.el-footer.beian {
  height: 50px;
  line-height: inherit;
}
@media screen and (max-width: 500px) {
  .login-row {
    width: calc(100% - 30px);
  }
}
@media screen and (min-width: 501px) and (max-width: 900px) {
  .login-row {
    margin-top: 0;
    width: 70%;
    min-width: 380px;
  }
}
</style>
