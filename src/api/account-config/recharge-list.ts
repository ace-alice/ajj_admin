import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashDeposit/list',
    method: 'get',
    params
  });
}

export default { list };
