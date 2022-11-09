import http from "../utils/request";
export default {
  //代理商列表
  agentList: function (data) {
    return http.get("/crmadmin/distributor/page", data);
  },
  //创建代理商
  addAgent: function (data) {
    return http.post("/crmadmin/distributor/add", data, { dataType: "form" });
  },
  //根据代理商ID查询学校,培训机构，个人
  schoollist: function (data) {
    return http.get("/crmadmin/distributor/schoollist", data);
  },
};
