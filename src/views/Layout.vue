<template>
  <el-container class="layout-container" :class="[`layout-container-${size}`]">
    <el-aside
      style="height: 100%"
      v-if="$config.system.LAYOUT_DIRECTION == 'lefttop' && !(isMobile && isCollapse)"
      ref="leftmenu"
    >
      <el-scrollbar :style="{ backgroundColor: $store.state.theme.bgColor }">
        <app-logo :isCollapse="isCollapse" />
        <nav-menu />
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px; padding: 0; height: 50px" ref="header">
        <div class="toolbar">
          <top-header />
        </div>
      </el-header>
      <el-container>
        <el-aside
          style="height: 100%"
          v-if="$config.system.LAYOUT_DIRECTION == 'topleft' && !(isMobile && isCollapse)"
          ref="leftmenu"
        >
          <el-scrollbar>
            <nav-menu />
          </el-scrollbar>
        </el-aside>
        <el-main>
          <div class="nav-tags" v-if="$config.system.SHOW_TAG" ref="tag">
            <tag-view />
          </div>
          <div class="single-page-content" :class="[`page-content-${size}`]">
            <router-view v-slot="{ Component, route }">
              <keep-alive :include="cacheRoutes">
                <component
                  :is="renderComponent({ Component, route })"
                  :key="$route.meta.cache ? $route.name : $route.fullPath"
                />
              </keep-alive>
              <el-footer
                ref="footer"
                :class="{ beian: $config.system.BEIAN }"
                v-if="$config.system.FOOTER.SHOW && !$config.system.FOOTER.FIX"
                ><bottom-footer :beian="$config.system.FOOTER.BEIAN"
              /></el-footer>
            </router-view>
          </div>
        </el-main>
        <el-footer
          ref="footer"
          v-if="$config.system.FOOTER.SHOW && $config.system.FOOTER.FIX"
          class="fixed"
          :class="{ beian: $config.system.BEIAN }"
          ><bottom-footer :beian="$config.system.FOOTER.BEIAN"
        /></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script setup>
import TopHeader from "./Layout/TopHeader.vue";
import AppLogo from "./Layout/AppLogo.vue";
import NavMenu from "./Layout/NavMenu.vue";
import TagView from "./Layout/TagView.vue";
import BottomFooter from "./Layout/BottomFooter.vue";
import { ref, reactive, computed, getCurrentInstance, nextTick, watchEffect } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import typeUtil from "@/utils/type";
import config from "@/config";

const store = useStore();

const isCollapse = computed(() => !store.state.menu.expandLeftMenu);
const router = useRouter();
const isMobile = computed(() => store.state.global.isMobile);

const cacheRoutes = computed(() => store.state.menu.cacheRoutes);

const bgColor = computed(() => store.state.theme.bgColor);
const sideBorderColor = computed(() => store.state.theme.sideBorderColor);

const size = computed(() => store.state.theme.size);

const leftMenuWidth = computed(() => (isCollapse.value ? "60px" : "240px"));
const renderComponent = function ({ Component, route }) {
  try {
    if (!Component.type._init_) {
      Component.type.secondName = Component.type.name;
      Component.type._init_ = true;
    }
    if (route.meta.cache) {
      if (!Component.type.secondName) {
        Component.type.name = route.name;
      } else if (Component.type.secondName != route.name) {
        console.warn(
          "cache error, page name:",
          Component.type.secondName,
          ", should be route name:",
          route.name
        );
      }
    } else {
      Component.type.name = Component.type.secondName;
    }
  } catch {
    console.warn("error", route.name);
  }

  return Component;
};
const vm = getCurrentInstance();
const bodyHeight = ref(0);
const bodyWidth = ref(0);
watchEffect(() => {
  let width = isCollapse.value ? 8 : 8;
  nextTick().then(() => {
    let height = 20;
    if (vm.refs["header"]) {
      height += vm.refs["header"].$el.offsetHeight;
    }
    if (vm.refs["tag"]) {
      height += vm.refs["tag"].offsetHeight;
    }
    if (vm.refs["footer"] && config.system.FOOTER.FIX) {
      height += vm.refs["footer"].$el.offsetHeight;
    }
    bodyHeight.value = `calc(100% - ${height}px)`;

    if (vm.refs["leftmenu"]) {
      width += vm.refs["leftmenu"].$el.offsetWidth;
    }
    bodyWidth.value = `calc(100% - ${width}px)`;
    console.debug("bodyWidth.value", bodyWidth.value);
  });
});
</script>
<style lang="scss">
.layout-container-small {
  .el-breadcrumb {
    font-size: 12px;
  }
}
</style>
<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
}

.el-sub-menu.is-active {
  .el-sub-menu__title span {
    color: var(--el-menu-active-color);
  }
  .el-sub-menu__title .el-icon {
    color: var(--el-menu-active-color);
  }
  .el-sub-menu.is-active .el-sub-menu__title span {
    color: var(--el-menu-active-color);
  }
  .el-sub-menu.is-active .el-sub-menu__title .el-icon {
    color: var(--el-menu-active-color);
  }
  .el-sub-menu .el-sub-menu__title span {
    color: var(--el-menu-text-color);
  }
  .el-sub-menu .el-sub-menu__title .el-icon {
    color: var(--el-menu-text-color);
  }
}
.single-page-content {
  position: absolute;
  overflow: auto;
  margin-top: 2px;
  height: v-bind(bodyHeight);
  width: v-bind(bodyWidth);
  padding: 10px 10px;
  box-sizing: border-box;
}
// .single-page-content {
//     left:210px;
//     top:53px;
//     min-width: 740px;
//     position: absolute;
//     right: 0;
//     bottom: 0;
//     overflow: auto;
//     background-color: #f0f2f5;
//     transition: left .3s;
// }
.el-header {
  --el-header-height: 50px;
}
.layout-container {
  height: 100%;
}
.layout-container .el-header {
  position: relative;
  color: var(--el-text-color-primary);
}
.layout-container .el-aside {
  width: v-bind(leftMenuWidth);
  color: var(--el-text-color-primary);
  background: v-bind(bgColor) !important;
  border-right: solid 1px v-bind(sideBorderColor);
  box-sizing: border-box;
}
.layout-container .el-main {
  padding: 0;
}
.layout-container .el-menu {
  border-right: none;
  width: 100%;
}
.layout-container .toolbars {
  position: absolute;
  display: inline-flex;
  align-items: center;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

.nav-tags {
  position: relative;
  // top: 50px;
  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
  z-index: 1;
  transition: padding 0.3s;
  // background-color: #f0f0f0;
}
.el-footer {
  padding: 0;
  margin-top: 40px;
  height: 40px;
  line-height: 40px;
}
.el-footer.beian {
  height: 50px;
  line-height: inherit;
}
.el-footer.fixed {
  margin-top: 0;
  color: v-bind(bgColor);
}
</style>
