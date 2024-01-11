import request from '@/utils/request.ts';

// 获取角色列表
export function list(params: any) {
  return request({
    url: '/admin/home.Role/list',
    method: 'get',
    params
  });
}

// 新增角色
export function add(data: any) {
  return request({
    url: '/admin/home.Role/add',
    method: 'post',
    data
  });
}

// 编辑角色
export function edit(data: any) {
  return request({
    url: '/admin/home.Role/edit',
    method: 'post',
    data
  });
}

// 删除角色
export function del(data: any) {
  return request({
    url: '/admin/home.Role/dele',
    method: 'post',
    data
  });
}

// 分配菜单
export function grantedMenu(data: any) {
  return request({
    url: '/admin/home.Role/edit',
    method: 'post',
    data
  });
}

// 获取菜单树
export function getMenuTree() {
  return request({
    url: '/admin/home.Role/menu',
    method: 'post'
  });
}

// 获取角色详情
export function getRoleInfo(data: any) {
  return request({
    url: '/admin/home.Role/info',
    method: 'post',
    data
  });
}

// 禁用角色
export function isDisable(data: any) {
  return request({
    url: '/admin/home.Role/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, getMenuTree, getRoleInfo, isDisable };
