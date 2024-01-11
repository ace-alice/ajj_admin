import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashAccount/list',
    method: 'get',
    params
  });
}

// 新增充值类型
export function add(data: any) {
  return request({
    url: '/admin/cash.CashAccount/add',
    method: 'post',
    data
  });
}

// 编辑充值类型
export function edit(data: any) {
  return request({
    url: '/admin/cash.CashAccount/edit',
    method: 'post',
    data
  });
}

// 新增充值类型
export function del(data: any) {
  return request({
    url: '/admin/cash.CashAccount/delete',
    method: 'delete',
    data
  });
}

// 充值类型排序
export function sortFun(data: any) {
  return request({
    url: '/admin/cash.CashAccount/sort',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, sortFun };
