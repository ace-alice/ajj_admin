import request from '@/utils/request.ts';

// 场馆包赔数据
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsRecord',
    method: 'get',
    params
  });
}
// 场馆包赔订单审核
export function sportsOrderVerify(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsOrderVerify',
    method: 'post',
    data
  });
}
// 场馆包赔派发奖励
export function sportsSendBonus(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsSendBonus',
    method: 'post',
    data
  });
}
// 场馆包赔详情页
export function sportsDetail(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsDetail',
    method: 'get',
    params
  });
}
// 场馆包赔锁定订单
export function sportsLockOrder(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsLockOrder',
    method: 'post',
    data
  });
}

export default {
  list,
  sportsOrderVerify,
  sportsSendBonus,
  sportsLockOrder,
  sportsDetail
};
