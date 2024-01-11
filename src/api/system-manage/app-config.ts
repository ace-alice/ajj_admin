import request from '@/utils/request.ts';

// 获取app list
export function list(params: any) {
  return request({
    url: '/admin/system.AppPackage/list',
    method: 'get',
    params
  });
}

// 新增app
export function add(data: any) {
  return request({
    url: '/admin/system.AppPackage/add',
    method: 'post',
    data
  });
}

// 编辑app
export function edit(data: any) {
  return request({
    url: '/admin/system.AppPackage/edit',
    method: 'post',
    data
  });
}

export default { list, add, edit };
