import http from "../utils/request";
export default {
  login: function (data) {
    return http.get("/crmadmin/common/login", data, { dataType: "form" });
  },
  getUserMenus: function () {
    return http.get("/login/menu");
  },
  getUserPermissions: function () {
    return http.get("/user/permissions");
  },
  //获取验证码
  sendCode: function (data) {
    return http.post("/crmadmin/common/sendCode", data);
  },
};
