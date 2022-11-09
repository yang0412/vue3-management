<template>
  <!-- :background-color="$store.state.theme.bgColor" :style="{'--el-menu-bg-color':$store.state.theme.bgColor}"-->
  <el-menu
    v-if="showMenu"
    :default-active="activeMenuIndex"
    :class="[
      { 'el-menu-vertical-left': isLeftMenu },
      `menu-size-${store.state.theme.size}`,
      'root-menu',
    ]"
    :mode="isLeftMenu ? 'vertical' : 'horizontal'"
    unique-opened
    :style="{ '--el-menu-bg-color': $store.state.theme.bgColor }"
    :background-color="$store.state.theme.bgColor"
    :text-color="$store.state.theme.textColor"
    :active-text-color="$store.state.theme.activeTextColor"
    :collapse="isLeftMenu && isCollapse"
    @open="handleOpen"
    @close="handleClose"
  >
    <template v-for="menu in menuList" :key="menu.code">
      <el-sub-menu
        :index="menu.code"
        v-if="menu.children && menu.children.length > 0"
        :popper-class="`shrink-menu-size-${store.state.theme.size}`"
      >
        <template #title class="aa">
          <el-icon v-if="menu.icon"><component :is="menu.icon"></component></el-icon>
          <span>{{ $t(menu.name) }}</span>
        </template>
        <template v-for="secondMenu in menu.children" :key="secondMenu.code">
          <el-sub-menu
            :index="secondMenu.code"
            v-if="secondMenu.children && secondMenu.children.length > 0"
          >
            <template #title>
              <el-icon v-if="secondMenu.icon"
                ><component :is="secondMenu.icon"></component
              ></el-icon>
              <span>{{ $t(secondMenu.name) }}</span>
            </template>
            <template v-for="thirdMenu in secondMenu.children" :key="thirdMenu.code">
              <el-menu-item :index="thirdMenu.code" @click="goToPage(thirdMenu)"
                ><el-icon
                  ><component v-if="thirdMenu.icon" :is="thirdMenu.icon"></component></el-icon
                >{{ $t(thirdMenu.name) }}</el-menu-item
              >
            </template>
          </el-sub-menu>
          <el-menu-item :index="secondMenu.code" @click="goToPage(secondMenu)" v-else>
            <el-icon v-if="secondMenu.icon"><component :is="secondMenu.icon"></component></el-icon>
            <template #title>{{ $t(secondMenu.name) }}</template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item :index="menu.code" @click="goToPage(menu)" v-else>
        <el-icon v-if="menu.icon"><component :is="menu.icon"></component></el-icon>
        <template #title>{{ $t(menu.name) }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import { ref, reactive, computed, defineProps } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import typeUtil from "@/utils/type";
import config from "@/config";
const props = defineProps({
  position: {
    type: String,
    default: "left",
  },
});
const store = useStore();
const isMobile = computed(() => store.state.global.isMobile);

const router = useRouter();

const showMenu = computed(() => {
  if (isMobile.value && isCollapse.value && props.position == "left") {
    return false;
  }
  if (config.system.LAYOUT_DIRECTION == "top" && props.position == "left") {
    return false;
  }
  return true;
});
const isLeftMenu = computed(() => showMenu.value && props.position == "left");
const isCollapse = computed(() => !store.state.menu.expandLeftMenu);
const menuList = computed(() =>
  isLeftMenu.value ? store.getters.leftMenuList : store.getters.topMenuList
);

const activeMenuIndex = computed(() =>
  isLeftMenu.value ? store.state.menu.activeLeftMenuIndex : store.state.menu.activeTopMenuIndex
);

const handleOpen = (key, keyPath) => {
  console.debug("handleOpenMenu", key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.debug("handleCloseMenu", key, keyPath);
};

function goToPage(item) {
  router.push(item.url);
}
const menuBgColor = computed(() => store.state.theme.bgColor);
const menuHoverBgColor = computed(() => store.getters.menuHoverBgColor);

const leftMenuHeight = ref("44px"); //computed(()=>store.state.theme.size=='small'?'44px':(store.state.theme.size=='large'?'60px':'52px'));
console.debug("leftMenuHeight", leftMenuHeight.value);
</script>
<style lang="scss">
.shrink-menu-size-small .el-menu {
  --el-menu-item-font-size: 12px;
}
</style>
<style lang="scss" scoped>
.root-menu :deep(*) {
  --el-menu-bg-color: v-bind(menuBgColor);
  --el-menu-hover-bg-color: v-bind(menuHoverBgColor);
}
.el-menu > .el-sub-menu :deep(.el-sub-menu__title):hover,
.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  background-color: var(--el-menu-hover-bg-color) !important;
}
.el-sub-menu {
  // --el-menu-item-height: v-bind(leftMenuHeight);
  &.is-active {
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
}
.shrink-menu-size-small {
  .el-sub-menu {
    :deep(.el-sub-menu__title) {
      line-height: 28px;
      height: 28px;
    }
  }
  .el-menu-item {
    height: 44px;
  }
  .el-menu .el-menu-item {
    line-height: 32px;
    height: 32px;
  }
}
.shrink-menu-size-default,
.shrink-menu-size- {
  .el-sub-menu {
    :deep(.el-sub-menu__title) {
      line-height: 38px;
      height: 38px;
    }
  }
  .el-menu .el-menu-item {
    line-height: 38px;
    height: 38px;
  }
}
.shrink-menu-size-large {
  .el-sub-menu {
    :deep(.el-sub-menu__title) {
      line-height: 48px;
      height: 48px;
    }
  }
  .el-menu .el-menu-item {
    line-height: 48px;
    height: 48px;
  }
}
.menu-size-small {
  :deep(*) {
    --el-menu-item-font-size: 12px;
  }
  .el-menu-item:not(.el-menu--horizontal > .el-menu-item) {
    height: 38px;
    line-height: 38px;
  }
  .el-sub-menu:not(.el-menu--horizontal > .el-sub-menu) {
    :deep(.el-sub-menu__title) {
      line-height: 38px;
      height: 38px;
    }
  }
}
.menu-size-default,
.menu-size- {
  --el-menu-item-font-size: 14px;
  .el-menu-item:not(.el-menu--horizontal > .el-menu-item) {
    height: 48px;
    line-height: 48px;
  }
  .el-sub-menu:not(.el-menu--horizontal > .el-sub-menu) {
    :deep(.el-sub-menu__title) {
      line-height: 48px;
      height: 48px;
    }
  }
}
.menu-size-large {
  --el-menu-item-font-size: var(--el-font-size-base);
  .el-menu-item:not(.el-menu--horizontal > .el-menu-item) {
    height: 56px;
    line-height: 56px;
  }
  .el-sub-menu:not(.el-menu--horizontal > .el-sub-menu) {
    :deep(.el-sub-menu__title) {
      line-height: 56px;
      height: 56px;
    }
  }
}
// .el-sub-menu__title {
//         line-height: v-bind(leftMenuHeight) !important;
//         height: v-bind(leftMenuHeight) !important;
//     }
// .el-menu-vertical-left {
//   --el-menu-item-height: v-bind(leftMenuHeight);
//   .el-sub-menu .el-menu-item{
//    height: v-bind(leftMenuHeight);;
//   }
// }
// .el-sub-menu{
//     :deep(.el-sub-menu__title) {
//         line-height: v-bind(leftMenuHeight);
//         height: v-bind(leftMenuHeight);
//     }
// }
.el-menu--collapse > .el-menu-item,
.el-menu--collapse .el-sub-menu :deep(.el-sub-menu__title) {
  margin-left: -3px;
}
</style>
