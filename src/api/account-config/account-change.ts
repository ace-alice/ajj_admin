import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashChange/list',
    method: 'get',
    params
  });
}

// 资金账变账变类型
export function moneyType(params?: any) {
  return request({
    url: '/admin/cash.CashChange/moneyType',
    method: 'get',
    params
  });
}

export default {
  list,
  moneyType
};
