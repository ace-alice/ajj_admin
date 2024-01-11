import request from '@/utils/request.ts';

// 获取充值线路列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashChannel/list',
    method: 'get',
    params
  });
}

// 新增充值线路
export function add(data: any) {
  return request({
    url: '/admin/cash.CashChannel/add',
    method: 'post',
    data
  });
}

// 编辑充值线路
export function edit(data: any) {
  return request({
    url: '/admin/cash.CashChannel/edit',
    method: 'put',
    data
  });
}

// 删除充值线路
export function del(data: any) {
  return request({
    url: '/admin/cash.CashChannel/delete',
    method: 'delete',
    data
  });
}

// 充值线路排序
export function sortFun(data: any) {
  return request({
    url: '/admin/cash.CashChannel/sort',
    method: 'put',
    data
  });
}

// 充值线路置顶
export function top(data: any) {
  return request({
    url: '/admin/cash.CashChannel/onTop',
    method: 'put',
    data
  });
}

// 充值线路禁用
export function changeStatus(data: any) {
  return request({
    url: '/admin/cash.CashChannel/disable',
    method: 'put',
    data
  });
}

// 充值线路审核-添加
export function verifyAdd(data: any) {
  return request({
    url: '/admin/cash.CashChannelVerify/add',
    method: 'put',
    data
  });
}

export default {
  list,
  add,
  edit,
  del,
  sortFun,
  top,
  changeStatus,
  verifyAdd
};
