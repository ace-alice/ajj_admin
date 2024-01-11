import request from '@/utils/request.ts';

// 佣金列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashCommission/list',
    method: 'get',
    params
  });
}

// 佣金发放
export function send(data: any) {
  return request({
    url: '/admin/cash.CashCommission/send',
    method: 'post',
    data
  });
}

export default { send };
