import http from "../utils/request";
export default {
  //客户列表
  clientList: function (data) {
    return http.get("/crmadmin/distributorCustomer/page", data);
  },
  //分拨
  allocate: function (data) {
    return http.post("/crmadmin/distributorCustomer/allocate", data, { dataType: "form" });
  },
  //验证设备码
  verification: function (data) {
    return http.get("/crmadmin/distributorCustomer/verification", data);
  },
  //根据学校ID查询工单
  orderBycustomerId: function (data) {
    return http.get("/crmadmin/distributorCustomer/orderBycustomerId", data);
  },
  //激活
  activate: function (data) {
    return http.post("/crmadmin/distributorCustomer/activation", data, { dataType: "form" });
  },
};
