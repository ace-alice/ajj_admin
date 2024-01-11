import request from '@/utils/request.ts';

// 获取出款线路列表
export function list(params: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/list',
    method: 'get',
    params
  });
}

// 新增出款线路
export function add(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/add',
    method: 'post',
    data
  });
}

// 编辑出款线路
export function edit(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/edit',
    method: 'put',
    data
  });
}

// 删除出款线路
export function del(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/delete',
    method: 'delete',
    data
  });
}

// 出款线路排序
export function sortFun(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/sort',
    method: 'put',
    data
  });
}

// 出款线路置顶
export function top(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/onTop',
    method: 'put',
    data
  });
}

// 出款线路禁用
export function changeStatus(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdraw/disable',
    method: 'put',
    data
  });
}
// 协议信息
export function getUsdtProtocol() {
  return request({
    url: '/admin/cash.CashChannelWithdraw/getUsdtProtocol',
    method: 'get'
  });
}

// 提款线路审核-添加
export function verifyAdd(data: any) {
  return request({
    url: '/admin/cash.CashChannelWithdrawVerify/add',
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
  getUsdtProtocol,
  verifyAdd
};
