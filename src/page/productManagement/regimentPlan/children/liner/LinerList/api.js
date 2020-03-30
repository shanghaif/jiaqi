import Vue from 'vue'
let { $http, GLOBAL, $message }= Vue.prototype;

// 保存sku库存价格多个
export const getSkuPlanListPage= function(payload){
  return new Promise((resolve, reject) => {
    $http.post(GLOBAL.serverSrcYL + "/linerapi/v1/sku/sku-plan/listpage", payload)
    .then(res => {
      let { code, message, data }= res.data;
      if(code!== 200) throw ('查询团期计划列表失败'+ (message || ''));
      resolve(data);
    })
    .catch(err => {
      err && $message.error(err.toString());
    })
  })
}