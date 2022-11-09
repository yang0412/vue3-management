const route = [
  {
    path: "/layout",
    name: "layout",
    component: () => import("../views/Layout.vue"),
    redirect: "/login",
    children: [],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "../views/Login/LoginNew.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import(/* webpackChunkName: "404" */ "../components/NotFound.vue"),
  },
];
export default route;
export const mainRoute = route.filter((a) => a.name == "layout")[0];
export const defaultRoutes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home/Home.vue"),
    icon: "HomeFilled",
    meta: { title: "首页" },
  },
  {
    path: "/mine",
    name: "mine",
    component: () => import(/* webpackChunkName: "mine" */ "../views/mine/index.vue"),
    meta: { title: "个人中心" },
  },
  {
    path: "/agency/school/list/:id",
    name: "schoolList",
    component: () =>
      import(/* webpackChunkName: "schoolDetail" */ "../views/agencyManagement/school-list.vue"),
    meta: { title: "学校列表", menu: "agency" },
  },
  {
    path: "/document/installed/list/:id",
    name: "installedList",
    component: () =>
      import(
        /* webpackChunkName: "schoolDetail" */ "../views/documentManagement/installed-list.vue"
      ),
    meta: { title: "已安装列表", menu: "workOrder" },
  },
];
