import request from '@/utils/request.ts';

// 获取菜单列表
export function list(params: { id: string | number }) {
  return request({
    url: '/admin/home.Menu/list',
    method: 'get',
    params
  });
}

// 新增菜单
export function add(data: any) {
  return request({
    url: '/admin/home.Menu/add',
    method: 'post',
    data
  });
}

// 编辑菜单
export function edit(data: any) {
  return request({
    url: '/admin/home.Menu/edit',
    method: 'post',
    data
  });
}

// 删除菜单
export function del(data: any) {
  return request({
    url: '/admin/home.Menu/dele',
    method: 'post',
    data
  });
}

// 修改菜单是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/home.Menu/disable',
    method: 'post',
    data
  });
}
// 修改菜单是否无需登录
export function isUnLogin(data: any) {
  return request({
    url: '/admin/home.Menu/unlogin',
    method: 'post',
    data
  });
}
// 修改菜单是否无需权限
export function isUnAuth(data: any) {
  return request({
    url: '/admin/home.Menu/unauth',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, isUnAuth, isUnLogin, isDisable };
