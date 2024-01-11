import request from '@/utils/request.ts';

// 获取dict list
export function list(params: any) {
  return request({
    url: '/admin/system.Dictionary/value',
    method: 'get',
    params
  });
}

// 新增dict
export function add(data: any) {
  return request({
    url: '/admin/system.Dictionary/add',
    method: 'post',
    data
  });
}

// 编辑dict
export function edit(data: any) {
  return request({
    url: '/admin/system.Dictionary/edit',
    method: 'post',
    data
  });
}

export default { list, add, edit };
