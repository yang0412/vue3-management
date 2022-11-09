import storage from "@/utils/storage";
import tool from "@/utils/tool";
import { distinct } from "@/utils/array";
import router from "@/router";
import { mainRoute, defaultRoutes } from "@/router/systemRoute";
import lazyLoading from "@/utils/lazyLoading";
import typeUtil from "@/utils/type";
import config from "@/config";

const defaultState = {
  cacheRoutes: [],
  expandLeftMenu: true,
  activeLeftMenuIndex: "",
  activeTopMenuIndex: "",
  leftMenuList: [],
  topMenuList: [],
  breadcrumb: [],
  tagList: [],
  activeTag: "",
  tagChildren: {}, //同一个tag页签，可能包含不同的子页面，该tag删除时，同时删除子页面
  routeLoaded: false,
};
const DEFAULTSTATE = tool.copy(defaultState);
const storageKey = "menu";
const handleUserMenus = function (menuList) {
  return menuList.map((menu) => {
    let item = {};
    item.code = menu.code;
    item.name = menu.name;
    item.url = menu.url;
    item.component = menu.component;
    item.meta = menu.meta ? (typeUtil.isString(menu.meta) ? JSON.parse(menu.meta) : menu.meta) : {};
    item.order = menu.order || 0;
    item.icon = menu.icon;
    if (menu.children && menu.children.length > 0) {
      item.children = handleUserMenus(menu.children);
    } else {
      item.children = [];
    }
    return item;
  });
};
const handleSystemRoutes = function (routes) {
  let allRoutes = router.getRoutes();
  let defaultLoc = config.system.LAYOUT_DIRECTION == "top" ? "top" : "left";
  return routes.map((route) => {
    route.meta = route.meta ? route.meta : {};
    if (!route.meta.title) {
      route.meta.title = route.title || route.name;
    }
    route.component = typeUtil.isString(route.component)
      ? lazyLoading(route.component)
      : route.component;
    route.meta.fullscreen =
      route.fullscreen === true ||
      route.fullscreen === "true" ||
      route.meta.fullscreen === true ||
      route.meta.fullscreen === "true";

    if (allRoutes.filter((r) => r.name == route.name).length > 0) {
      let oldPos = allRoutes.filter((r) => r.name == route.name)[0].meta.position;
      let arr = [];
      if (typeUtil.isString(oldPos)) {
        arr = [oldPos];
      } else if (typeUtil.isArray(oldPos)) {
        arr = oldPos;
      }
      arr.push(defaultLoc);
      arr = distinct(arr);
      route.meta.position = arr.length > 1 ? arr : arr[0];
    } else {
      route.meta.position = defaultLoc;
    }
    return route;
  });
};
const convertUserMenusToRoutes = function (payload) {
  let allRoutes = router.getRoutes();
  return tool
    .flatMap(payload.menuList)
    .filter((a) => !(a.children && a.children.length > 0))
    .map((menu) => {
      let item = {};
      item.name = menu.code;
      item.path = menu.url;
      if (menu.component) {
        item.component = typeUtil.isString(menu.component)
          ? lazyLoading(menu.component)
          : menu.component;
      }
      if (allRoutes.filter((r) => r.name == item.name).length > 0) {
        let preRoute = allRoutes.filter((r) => r.name == item.name)[0];
        if (!menu.component && preRoute.components) {
          item.component = preRoute.components.default;
        }
        item.meta = Object.assign({}, preRoute.meta, menu.meta);
        let oldPos = preRoute.meta.position;
        let arr = [];
        if (typeUtil.isString(oldPos)) {
          arr = [oldPos];
        } else if (typeUtil.isArray(oldPos)) {
          arr = oldPos;
        }
        arr.push(payload.position || "left");
        arr = distinct(arr);
        item.meta.position = arr.length > 1 ? arr : arr[0];
      } else {
        item.meta = menu.meta;
        item.meta.position = payload.position || "left";
      }
      if (!item.meta.title) {
        item.meta.title = menu.name;
      }
      item.meta.fullscreen = menu.fullscreen === true || menu.fullscreen === "true";
      return item;
    });
};
const setRouteFunc = function (state, payload) {
  let userRoutes = convertUserMenusToRoutes(payload);
  userRoutes.filter((a) => a.meta.fullscreen).forEach((r) => router.addRoute(r));
  mainRoute.children = mainRoute.children.concat(userRoutes.filter((a) => !a.meta.fullscreen));
  if (!state.routeLoaded) {
    //加载系统路由
    const systemRoutes = handleSystemRoutes(defaultRoutes);
    systemRoutes.filter((a) => a.meta.fullscreen).forEach((r) => router.addRoute(r));
    mainRoute.children = mainRoute.children.concat(systemRoutes.filter((a) => !a.meta.fullscreen));
  }
  console.log("asa", mainRoute);
  console.debug("mainRoute ", mainRoute);
  router.addRoute(mainRoute);
  state.routeLoaded = true;
  console.debug("setRoute end", payload.position, router.getRoutes());
};
export default {
  state: defaultState,
  mutations: {
    reload(state) {
      console.debug("reload " + storageKey);
      let data = storage.get(storageKey);
      if (data) {
        Object.keys(data).forEach((k) => {
          state[k] = data[k];
        });
      }
    },
    clear(state) {
      console.debug("clear " + storageKey);
      Object.keys(DEFAULTSTATE).forEach((k) => {
        state[k] = tool.copy(DEFAULTSTATE[k]);
      });
      storage.clear(storageKey);
    },
    setRoute(state) {
      setRouteFunc(state, { menuList: state.leftMenuList, position: "left" });
      setRouteFunc(state, { menuList: state.topMenuList, position: "top" });
    },
    setLeftMenu(state, payload) {
      //加入首页菜单
      let menuList = handleUserMenus(payload.menuList || []);
      setRouteFunc(state, { menuList: menuList, position: "left" });
      state.leftMenuList = menuList;
      storage.set(storageKey + ".leftMenuList", menuList);
    },
    setTopMenu(state, payload) {
      let menuList = handleUserMenus(payload.menuList || []);
      setRouteFunc(state, { menuList: menuList, position: "top" });
      state.topMenuList = menuList;
      storage.set(storageKey + ".topMenuList", menuList);
    },
    toggleLeftMenuExpandState(state) {
      state.expandLeftMenu = !state.expandLeftMenu;
      storage.set(storageKey + ".expandLeftMenu", state.expandLeftMenu);
    },
    setMenuStatus(state, payload) {
      if (payload.leftMenuIndex) {
        state.activeLeftMenuIndex = payload.leftMenuIndex;
      }
      if (payload.topMenuIndex) {
        state.activeTopMenuIndex = payload.topMenuIndex;
        if (config.system.TOP_NAV && config.system.LAYOUT_DIRECTION != "top") {
          storage.set(storageKey + ".activeTopMenuIndex", state.activeTopMenuIndex);
        }
      }
    },
    setActiveLeftMenu(state, payload) {
      state.activeLeftMenuIndex = payload;
    },
    setActiveTopMenu(state, payload) {
      state.activeTopMenuIndex = payload;
      if (config.system.TOP_NAV && config.system.LAYOUT_DIRECTION != "top") {
        storage.set(storageKey + ".activeTopMenuIndex", state.activeTopMenuIndex);
      }
    },
    setBreadCrumb(state, payload) {
      state.breadcrumb = payload.breadcrumb;
    },
    setActiveTag(state, tag) {
      state.activeTag = tag;
      storage.set(storageKey + ".activeTag", tag);
    },
    setTagList(state, tagList) {
      state.tagList = tagList;
      storage.set(storageKey + ".tagList", tagList);
    },
    addTag(state, tag) {
      let tagList = state.tagList || [];
      tagList.push(tag);
      state.tagList = tagList;
      storage.set(storageKey + ".tagList", tagList);
    },
    setTagChildren(state, payload) {
      if (state.tagChildren[payload.key]) {
        state.tagChildren[payload.key].push(payload.value);
      } else {
        state.tagChildren[payload.key] = [payload.value];
      }
    },
    addCacheRoute(state, name) {
      console.log("luyou", name);
      if (state.cacheRoutes.indexOf(name) < 0) {
        state.cacheRoutes.push(name);
      }
    },
    removeCacheRoute(state, name) {
      let arr = [];
      if (typeUtil.isString(name)) {
        arr.push(name);
      } else if (typeUtil.isArray(name)) {
        arr = arr.concat(name);
      }
      let childArr = [];
      arr.forEach((key) => {
        const child = state.tagChildren[key];
        if (child) {
          childArr = childArr.concat(child);
        }
      });
      arr = arr.concat(childArr);
      if (arr.length > 0) {
        state.cacheRoutes = state.cacheRoutes.filter((a) => arr.indexOf(a) < 0);
      }
    },
    setCacheRoute(state, names) {
      state.cacheRoutes = names;
    },
  },
  getters: {
    leftMenuList(state) {
      let menuList = defaultRoutes
        .filter((a) => a.name == "Home")
        .map((menu) => {
          let item = {};
          item.code = menu.name;
          item.name = menu.title || menu.meta.title || menu.name;
          item.url = menu.path;
          item.icon = menu.icon;
          item.component = menu.component;
          item.meta = menu.meta
            ? typeUtil.isString(menu.meta)
              ? JSON.parse(menu.meta)
              : menu.meta
            : {};
          item.order = -99;
          item.children = [];
          return item;
        });
      function filterMenus(menus) {
        let newMenuList = menus
          .filter((a) => {
            return !a.meta.menu;
          })
          .sort((a, b) => a.order - b.order);
        newMenuList.forEach((menu) => {
          if (menu.children && menu.children.length > 0) {
            menu.children = filterMenus(menu.children);
          }
        });
        return newMenuList;
      }

      return menuList.concat(filterMenus(state.leftMenuList));
    },
    topMenuList(state) {
      let newMenuList = state.topMenuList.sort((a, b) => a.order - b.order);
      return newMenuList;
    },
  },
};
