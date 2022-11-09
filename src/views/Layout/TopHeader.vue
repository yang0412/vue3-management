<template>
  <!-- <el-affix :offset="0"> -->
  <div class="page-header">
    <app-logo
      ref="logo"
      :isCollapse="isCollapse"
      v-if="$config.system.LAYOUT_DIRECTION != 'lefttop'"
    />
    <div class="expand-icon" v-if="$config.system.LAYOUT_DIRECTION != 'top'">
      <el-icon :size="20" style="cursor: pointer">
        <expand @click="toggleExpand()" />
      </el-icon>
    </div>
    <div class="top-nav" v-if="$config.system.BREAD_CRUMB != 'none' && !isMobile">
      <el-breadcrumb separator="/">
        <template v-for="item in breadcrumbList" :key="item.name">
          <el-breadcrumb-item>{{ $t(item.title) }}</el-breadcrumb-item>
        </template>
      </el-breadcrumb>
    </div>
    <div class="top-nav" v-else-if="$config.system.TOP_NAV">
      <nav-menu position="top" />
    </div>
    <div class="right-header" ref="avatar">
      <el-badge :value="12" class="marginR24">
        <el-icon size="20px"><BellFilled /></el-icon>
      </el-badge>
      <!-- 国际化语言 -->
      <!-- <locale-select /> -->

      <el-dropdown @command="handleUserDropdown" style="padding-left: 20px; padding-right: 10px">
        <span class="el-dropdown-link">
          <el-avatar :size="32" :icon="UserFilled" class="vertical-middle" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="home">
              <el-icon><House /></el-icon>
              首页</el-dropdown-item
            >
            <el-dropdown-item command="mine">
              <el-icon><User /></el-icon>
              个人中心</el-dropdown-item
            >
            <el-dropdown-item command="dataManagement">
              <el-icon><PieChart /></el-icon>
              数据管理</el-dropdown-item
            >
            <el-dropdown-item divided command="exit">
              <el-icon> <warning /> </el-icon>退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-dropdown @command="changeTheme">
        <span class="el-dropdown-link">
          <el-icon style="transform: rotate(90deg); width: 30px"><more-filled /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in $config.theme.themes"
              :command="item.key"
              :key="item.key"
            >
              <el-icon v-if="item.key == themeName">
                <check />
              </el-icon>
              {{ item.name }}
            </el-dropdown-item>
            <el-dropdown-item divided command="null">
              <el-radio-group size="small" @change="changeLayoutSize">
                <el-radio-button
                  :label="item.value"
                  v-for="item in sizeOptions"
                  :disabled="item.value == layoutSize"
                  :key="item.value"
                  >{{ item.label }}</el-radio-button
                >
              </el-radio-group>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import AppLogo from "./AppLogo.vue";
import NavMenu from "./NavMenu.vue";
import LocaleSelect from "./LocaleSelect.vue";
import { UserFilled } from "@element-plus/icons-vue";

const { t } = useI18n();
const store = useStore();
const breadcrumbList = computed(() => store.state.menu.breadcrumb);
const isMobile = computed(() => store.state.global.isMobile);
const isCollapse = computed(() => !store.state.menu.expandLeftMenu);
const router = useRouter();

const toggleExpand = () => {
  store.commit("toggleLeftMenuExpandState");
};
function handleUserDropdown(command) {
  console.debug(command);
  if (command == "exit") {
    store.commit("clear");
    router.go(0);
  } else if (command == "mine") {
    router.push({ path: "/mine" });
  } else if (command == "home") {
    router.push({ path: "/" });
  }
}
const bgColor = computed(() => store.state.theme.bgColor);
const textColor = computed(() => store.state.theme.textColor);
const themeName = computed(() => store.state.theme.key);
const changeTheme = function (command) {
  console.debug(command);
  if (!command || command == "null") {
    return;
  }
  store.commit("changeTheme", { key: command });
};
const sizeOptions = [
  {
    value: "small",
    label: t("system.layout.small"),
  },
  {
    value: "default",
    label: t("system.layout.default"),
  },
  {
    value: "large",
    label: t("system.layout.large"),
  },
];
const layoutSize = computed(() => store.state.theme.size);
const changeLayoutSize = function (value) {
  store.commit("changeTheme", { size: value });
};
</script>
<style lang="scss" scoped>
// .el-menu--horizontal{
//     border-bottom: none;
// }
.page-header {
  display: flex;
  flex-direction: row;
  border-bottom: solid 1px var(--el-menu-border-color);
  height: 50px;
  // background-color: var(--el-color-white);
  background-color: v-bind(bgColor);
  color: v-bind(textColor);
  // .el-col{
  //     max-height: 50px;
  // }
  .expand-icon {
    border-right: none;
    width: 30px;
    line-height: 50px;
    margin-right: 10px;
    float: left;
    .el-icon {
      vertical-align: middle;
    }
  }
  .top-nav {
    float: left;
    display: flex;
    flex: 1;
    height: 100%;
    line-height: 50px;
    background-color: var(--el-menu-bg-color);
    vertical-align: middle;
    .el-menu {
      height: 100%;
    }
    .el-breadcrumb {
      line-height: 50px;
      max-height: 50px;
      overflow: hidden;
      word-wrap: break-word;
      .el-breadcrumb__item {
        max-height: 50px;
        :deep(.el-breadcrumb__inner) {
          color: v-bind(textColor);
        }
      }
    }
  }
}

// .header-right{
//     border-bottom: solid 1px var(--el-menu-border-color);
// }
.el-menu {
  --el-menu-item-height: 50px;
}
.el-menu--horizontal {
  border-bottom: none;
}
.right-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  float: right;
  :deep(.el-dropdown-link) {
    line-height: 50px;
    .el-icon {
      color: v-bind(textColor);
    }
  }
  :deep(.el-dropdown-link:hover) {
    cursor: pointer;
    color: var(--el-color-primary);
  }
}

// .avatar-round{
//   vertical-align: middle;
//   border-radius:16px;
//   background-color:#DEE1E6;
//   height:32px;
//   width:32px;
//   position: relative;
//     justify-content: center;
//     align-items: center;
//     display: inline-flex;
// }
.vertical-middle {
  vertical-align: middle;
  position: relative;
  justify-content: center;
  align-items: center;
  display: inline-flex;
}

// .top-nav{
//     height: 100%;
//     line-height: 50px;
//     background-color: var(--el-menu-bg-color);
//     vertical-align: middle;
//     :deep(.el-breadcrumb){
//         line-height: 50px;
//     }
// }
</style>
