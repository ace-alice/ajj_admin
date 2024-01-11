import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashDeposit/verify',
    method: 'get',
    params
  });
}

export function lockupOrder(data: any) {
  return request({
    url: '/admin/cash.CashDeposit/lock',
    method: 'put',
    data
  });
}

// 获取充值类型列表
export function getDetail(params: any) {
  return request({
    url: '/admin/cash.CashDeposit/detail',
    method: 'get',
    params
  });
}

// 充值审核
export function doAuditFun(data: any) {
  return request({
    url: '/admin/cash.CashDeposit/doVerifyPass',
    method: 'put',
    data
  });
}

// 充值审核
export function doRejectFun(data: any) {
  return request({
    url: '/admin/cash.CashDeposit/doVerifyFail',
    method: 'put',
    data
  });
}

export default { list, lockupOrder, getDetail, doAuditFun, doRejectFun };
