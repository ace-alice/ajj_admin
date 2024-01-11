import request from '@/utils/request.ts';

// 获取分组列表
export function list(params: any) {
  return request({
    url: '/admin/file.Group/list',
    method: 'get',
    params
  });
}

// 获取分组列表
export function info(params: { id: string | number }) {
  return request({
    url: '/admin/file.Group/info',
    method: 'get',
    params
  });
}

// 新增分组
export function add(data: any) {
  return request({
    url: '/admin/file.Group/add',
    method: 'post',
    data
  });
}

// 编辑分组
export function edit(data: any) {
  return request({
    url: '/admin/file.Group/edit',
    method: 'post',
    data
  });
}

// 删除分组
export function del(data: any) {
  return request({
    url: '/admin/file.Group/dele',
    method: 'post',
    data
  });
}

// 修改分组是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/file.Group/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, info, isDisable };
