import request from '@/utils/request.ts';

// 获取出款线路列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashChannelWithdrawVerify/list',
    method: 'get',
    params
  });
}

// 提款线路审核-审核
export function verify(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdrawVerify/verify',
    method: 'post',
    data
  });
}

// 提款线路审核-详情
export function detail(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdrawVerify/detail',
    method: 'put',
    data
  });
}

export default {
  list,
  verify,
  detail
};
