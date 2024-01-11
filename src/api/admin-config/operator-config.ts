import request from '@/utils/request.ts';

// 获取操作员列表
export function list(params?: any) {
  return request({
    url: '/admin/home.User/list',
    method: 'get',
    params
  });
}

// 新增操作员
export function add(data: any) {
  return request({
    url: '/admin/home.User/add',
    method: 'post',
    data
  });
}

// 编辑操作员
export function edit(data: any) {
  return request({
    url: '/admin/home.User/edit',
    method: 'post',
    data
  });
}

// 删除操作员
export function del(data: any) {
  return request({
    url: '/admin/home.User/dele',
    method: 'post',
    data
  });
}

// 重置密码
export function initPwd(data: any) {
  return request({
    url: '/admin/home.User/pwd',
    method: 'post',
    data
  });
}

// 设置用户是否是超管
export function isSuperAdmin(data: any) {
  return request({
    url: '/admin/home.User/super',
    method: 'post',
    data
  });
}

// 设置用户是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/home.User/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, initPwd, isSuperAdmin, isDisable };
