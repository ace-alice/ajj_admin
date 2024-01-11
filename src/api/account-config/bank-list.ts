import request from '@/utils/request.ts';

// 获取银行卡列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashBank/list',
    method: 'get',
    params
  });
}

// 新增银行卡
export function add(data: any) {
  return request({
    url: '/admin/cash.CashBank/add',
    method: 'post',
    data
  });
}

// 编辑银行卡
export function edit(data: any) {
  return request({
    url: '/admin/cash.CashBank/edit',
    method: 'put',
    data
  });
}
export default {
  list,
  add,
  edit
};
