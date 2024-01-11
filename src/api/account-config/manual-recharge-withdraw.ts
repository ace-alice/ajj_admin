import request from '@/utils/request.ts';

// 人工加额
export function increase(data: any) {
  return request({
    url: '/admin/cash.CashManual/increase',
    method: 'put',
    data
  });
}

// 人工减额-新接口
export function newdecrease(data: any) {
  return request({
    url: '/admin/cash.CashManualVerify/add',
    method: 'post',
    data
  });
}
// 人工减额-旧接口
export function decrease(data: any) {
  return request({
    url: '/admin/cash.CashManual/decrease',
    method: 'put',
    data
  });
}

// 减额调整类型
export function getType(params: any) {
  return request({
    url: '/admin/cash.CashManual/moneyType',
    method: 'get',
    params
  });
}

// 减额调整类型
export function getUserInfo(params: any) {
  return request({
    url: '/admin/cash.CashManual/userInfo',
    method: 'get',
    params
  });
}

// 减额调整类型
export function getBankInfo(params: any) {
  return request({
    url: '/admin/cash.CashManual/bankInfo',
    method: 'get',
    params
  });
}

export default { increase, decrease, getType, getUserInfo };
