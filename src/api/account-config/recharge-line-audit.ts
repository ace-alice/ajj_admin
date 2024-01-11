import request from '@/utils/request.ts';

// 获取银行卡列表
function list(params: any) {
  return request({
    url: '/admin/cash.CashChannelVerify/list',
    method: 'get',
    params
  });
}

// 充值线路审核-审核
export function verify(data: any) {
  return request({
    url: '/admin/cash.CashChannelVerify/verify',
    method: 'post',
    data
  });
}

// 充值线路审核-详情
export function detail(data: any) {
  return request({
    url: '/admin/cash.CashChannelVerify/detail',
    method: 'post',
    data
  });
}

export default {
  list,
  verify,
  detail
};
