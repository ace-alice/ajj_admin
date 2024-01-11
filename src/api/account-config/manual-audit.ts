import request from '@/utils/request.ts';

// 人工加减额审核-列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashManualVerify/list',
    method: 'get',
    params
  });
}

// 人工加减额审核-新增
export function add(data: any) {
  return request({
    url: '/admin/cash.CashManualVerify/add',
    method: 'post',
    data
  });
}

// 人工加减额审核-审核
export function verify(data: any) {
  return request({
    url: '/admin/cash.CashManualVerify/verify',
    method: 'post',
    data
  });
}

// 人工加减额审核-详情
export function detail(data: any) {
  return request({
    url: '/admin/cash.CashManualVerify/detail',
    method: 'post',
    data
  });
}
export default {
  list,
  add,
  verify,
  detail
};
