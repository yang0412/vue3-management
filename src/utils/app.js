import typeUtil from "@/utils/type";
import store from "../store";
import config from "../config";
import router from "@/router";
import { defaultRoutes } from "@/router/systemRoute";
function hasChild(name, menuList, parentList) {
  return menuList.some((menu) => {
    if (menu.code == name) {
      return true;
    } else if (menu.children && menu.children.length > 0) {
      if (hasChild(name, menu.children, parentList)) {
        parentList.push(menu);
        return true;
      }
    }
    return false;
  });
}
function findDirectParentMenu(name, menuList) {
  let parentList = [];
  if (hasChild(name, menuList, parentList) && parentList.length > 0) {
    return parentList.find((menu) => {
      if (menu.meta) {
        if (typeUtil.isString(menu.meta)) {
          if (JSON.parse(menu.meta).menu !== false) {
            return true;
          }
        } else if (menu.meta.menu !== false) {
          return true;
        }
      } else {
        return true;
      }
    });
  }
  return undefined;
}
function setBreadCrumb(name, to) {
  let menuList = [];
  if (config.system.BREAD_CRUMB == "left") {
    menuList = store.getters.leftMenuList;
  } else if (config.system.BREAD_CRUMB == "top") {
    menuList = store.state.menu.topMenuList;
  }
  if (menuList.length > 0) {
    let parentList = [];
    if (hasChild(name, menuList, parentList)) {
      let newList =
        parentList.length > 0
          ? parentList.reverse().map((a) => {
              return {
                name: a.code,
                title: a.name,
                url: a.url,
              };
            })
          : [];
      if (to.meta.menu) {
        const route = router.getRoutes().find((a) => a.name == to.meta.menu);
        if (route) {
          newList.push({
            name: route.meta.menu,
            title: route.meta.title,
            url: route.path,
          });
        }
      }
      newList.push({
        name: to.name,
        title: to.meta.title,
      });
      console.log("BreadCrumb", newList);
      store.commit("setBreadCrumb", { breadcrumb: newList });
    }
  }
}
function setTag(to) {
  if (!config.system.SHOW_TAG) {
    return;
  }
  if (!(["Login", "404"].indexOf(to.name) == -1 && (to.name || to.meta.title))) {
    return;
  }
  let targetTagCode = to.name;
  const showTag = to.meta.tag !== false;
  let tagItem = {
    name: targetTagCode,
    title: to.meta.title,
    params: to.params,
    query: to.query,
  };
  if (!showTag) {
    //使用所属菜单的tag
    if (to.meta.menu) {
      const route = router.getRoutes().find((a) => a.name == to.meta.menu);
      if (route) {
        targetTagCode = to.meta.menu;
        tagItem = {
          name: to.meta.menu,
          title: route.meta.title,
        };
      }
    }
  }
  const originTagCode = store.state.menu.activeTag;
  if (targetTagCode == originTagCode) {
    return;
  }
  let tagList = store.state.menu.tagList || [];
  if (!tagList.some((a) => a.name == "Home")) {
    let homeRoute = defaultRoutes.find((a) => a.name == "Home");
    let item = {
      name: homeRoute.name,
      title: homeRoute.meta.title,
    };
    store.commit("addTag", item);
  }
  if (!tagList.some((a) => a.name == targetTagCode)) {
    store.commit("addTag", tagItem);
  }
  store.commit("setActiveTag", targetTagCode);
}
function setCache(to) {
  const targetTagCode = to.name;
  if (to.meta.cache === true || to.meta.cache === "true") {
    store.commit("addCacheRoute", targetTagCode);
    //不显示tag，包含在已有菜单的tag中
    if (to.meta.tag === false && to.meta.menu) {
      const route = router.getRoutes().find((a) => a.name == to.meta.menu);
      if (route) {
        store.commit("setTagChildren", { key: to.meta.menu, value: targetTagCode });
      }
    }
  }
}
export default {
  routerFinished: (to, from) => {
    console.debug("routerFinished", to, from);
    //菜单open状态
    let targetIndex = to.name;
    if (to.meta.menu) {
      targetIndex = to.meta.menu;
    }
    if (typeUtil.isString(to.meta.position)) {
      if (to.meta.position == "left") {
        store.commit("setActiveLeftMenu", targetIndex);
      } else {
        store.commit("setActiveTopMenu", targetIndex);
        store.commit("setActiveLeftMenu", "");
      }
    } else if (typeUtil.isArray(to.meta.position)) {
      if (to.meta.position.indexOf("left") > -1 && to.meta.position.indexOf("top") > -1) {
        store.commit("setMenuStatus", { leftMenuIndex: targetIndex, topMenuIndex: targetIndex });
      } else if (to.meta.position.indexOf("left") > -1) {
        store.commit("setMenuStatus", { leftMenuIndex: targetIndex });
      } else if (to.meta.position.indexOf("top") > -1) {
        store.commit("setMenuStatus", { topMenuIndex: targetIndex });
      }
    }
    //breadcrumb
    setBreadCrumb(targetIndex, to);
    //设置tag标签
    setTag(to);
    //keep-alive缓存
    setCache(to);
  },
};
