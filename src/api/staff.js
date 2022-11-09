import http from "../utils/request";
export default {
  //员工列表
  userList: function (data) {
    return http.get("/crmadmin/didistributoruser/page", data);
  },
  //新增员工
  addUser: function (data) {
    return http.post("/crmadmin/didistributoruser/add", data);
  },
};
