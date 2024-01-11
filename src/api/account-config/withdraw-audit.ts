import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashWithdraw/verify',
    method: 'get',
    params
  });
}

export function lockupOrder(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/lock',
    method: 'put',
    data
  });
}

// 获取列表
export function getDetail(params: any) {
  return request({
    url: '/admin/cash.CashWithdraw/detail',
    method: 'get',
    params
  });
}

// 一审通过
export function oneAuditPass(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyOnePass',
    method: 'put',
    data
  });
}

// 二审通过
export function twoAuditPass(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyTwoPass',
    method: 'put',
    data
  });
}

// 三审通过
export function threeAuditPass(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyThreePass',
    method: 'put',
    data
  });
}

// 一审拒绝
export function oneAuditReject(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyOneFail',
    method: 'put',
    data
  });
}

// 二审拒绝
export function twoAuditReject(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyTwoFail',
    method: 'put',
    data
  });
}

// 三审拒绝
export function threeAuditReject(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/doVerifyThreeFail',
    method: 'put',
    data
  });
}
// 提款渠道获取
export function getChannel(data: any) {
  return request({
    url: '/admin/cash.CashWithdraw/getChannel',
    method: 'put',
    data
  });
}

export default {
  list,
  lockupOrder,
  getDetail,
  oneAuditPass,
  twoAuditPass,
  threeAuditPass,
  oneAuditReject,
  twoAuditReject,
  getChannel,
  threeAuditReject
};
