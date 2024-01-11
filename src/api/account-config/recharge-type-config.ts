import request from '@/utils/request.ts';

// 获取充值类型列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashType/list',
    method: 'get',
    params
  });
}

// 新增充值类型
export function add(data: any) {
  return request({
    url: '/admin/cash.CashType/add',
    method: 'post',
    data
  });
}

// 编辑充值类型
export function edit(data: any) {
  return request({
    url: '/admin/cash.CashType/edit',
    method: 'put',
    data
  });
}

// 删除充值类型
export function del(data: any) {
  return request({
    url: '/admin/cash.CashType/delete',
    method: 'delete',
    data
  });
}

// 充值类型排序
export function sortFun(data: any) {
  return request({
    url: '/admin/cash.CashType/sort',
    method: 'put',
    data
  });
}

// 充值类型禁用
export function changeStatus(data: any) {
  return request({
    url: '/admin/cash.CashType/disable',
    method: 'put',
    data
  });
}

// 充值类型置顶
export function top(data: any) {
  return request({
    url: '/admin/cash.CashType/onTop',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, sortFun, changeStatus, top };
