import http from "../utils/request";
export default {
  //工单列表
  orderList: function (data) {
    return http.get("/crmadmin/order/order/page", data);
  },
  //已安装列表
  machineList: function (data) {
    return http.get("/crmadmin/order/machineList", data);
  },
};
