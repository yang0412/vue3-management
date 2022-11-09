import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import systemRoutes, { mainRoute, defaultRoutes } from "./systemRoute";
import config from "../config";
import i18n from "../locale";
import application from "../utils/app";

console.debug("systemRoutes", systemRoutes);
console.debug("mainRoute", mainRoute);
console.debug("config", config);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: systemRoutes,
});

console.debug("getRoutes", router.getRoutes());

router.beforeEach((to, from, next) => {
  console.debug("router.beforeEach", to, from);
  console.debug("store", store);
  console.debug("isLogin", store.getters.isLogin);
  console.debug("mainRoute", mainRoute);
  //进度条
  NProgress.start();

  let ignoreAuth = to.meta.auth === false;
  console.log(!store.getters.isLogin);
  if (!ignoreAuth && !store.getters.isLogin) {
    if (to.path == "/login") {
      next();
    } else {
      next({
        name: "Login",
      });
    }
    return;
  }
  console.debug("hasHomeRoute", router.hasRoute("Home"));
  console.debug("getRoutes", router.getRoutes());
  if (to.path == "/login" && store.getters.isLogin) {
    if (router.hasRoute("Home")) {
      next({
        name: "Home",
      });
    } else {
      if (!store.state.menu.routeLoaded) {
        store.commit("setRoute");
        next({ ...to, replace: true });
      } else {
        next();
      }
    }
    return;
  }
  // else if(to.path=='/' && store.getters.isLogin){
  // 	if(router.hasRoute('Home')){
  //     next();
  //   }
  //   else{
  //     store.commit('setRoute')
  //     next('/login');
  //   }
  //   return;
  // }
  if (!store.state.menu.routeLoaded) {
    store.commit("setRoute");
    // next({ ...to, replace: true })
    next(to.fullPath);
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  application.routerFinished(to, from);
  document.title = to.meta.title
    ? `${i18n.global.t(to.meta.title)} - ${config.system.APP_NAME}`
    : `${config.system.APP_NAME}`;
  NProgress.done();
});

router.onError((error) => {
  console.error(error);
  NProgress.done();
});
export default router;
