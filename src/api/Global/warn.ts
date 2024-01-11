import request from '@/utils/request.ts';

//  获取待处理出入款、额度补发数量
export function getDepositAndPaymentNum(params?: any) {
  return request({
    url: '/admin/cash.CashDeposit/noDealOrders',
    method: 'get',
    params
  });
}

// 未提现订单
export function noWithdrawOrders(params?: any) {
  return request({
    url: '/admin/cash.CashWithdraw/noWithdrawOrders',
    method: 'get',
    params
  });
}

// 未审核订单
export function noCheckOrders(params?: any) {
  return request({
    url: '/admin/cash.CashWithdraw/noCheckOrders',
    method: 'get',
    params
  });
}
