import request from '@/utils/request.ts';

// 获取标识列表
export function list(params: any) {
  return request({
    url: '/admin/markets.MsgTags/list',
    method: 'get',
    params
  });
}

// 新增标识
export function add(data: any) {
  return request({
    url: '/admin/markets.MsgTags/add',
    method: 'post',
    data
  });
}

// 编辑标识
export function edit(data: any) {
  return request({
    url: '/admin/markets.MsgTags/edit',
    method: 'post',
    data
  });
}

// 删除标识
export function del(data: any) {
  return request({
    url: '/admin/markets.MsgTags/delete',
    method: 'post',
    data
  });
}

// 标识状态更改
export function changeStatus(data: any) {
  return request({
    url: '/admin/markets.MsgTags/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeStatus };
