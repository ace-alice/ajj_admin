import request from '@/utils/request.ts';

// 获取公告列表
export function list(params: any) {
  return request({
    url: '/admin/home.Notice/list',
    method: 'get',
    params
  });
}

// 新增公告
export function add(data: any) {
  return request({
    url: '/admin/home.Notice/add',
    method: 'post',
    data
  });
}

// 编辑公告
export function edit(data: any) {
  return request({
    url: '/admin/home.Notice/edit',
    method: 'post',
    data
  });
}

// 删除公告
export function del(data: any) {
  return request({
    url: '/admin/home.Notice/dele',
    method: 'post',
    data
  });
}

// 修改公告是否禁用
export function isOpen(data: any) {
  return request({
    url: '/admin/home.Notice/isopen',
    method: 'post',
    data
  });
}
// 获取公告详情
export function getInfo(params: any) {
  return request({
    url: '/admin/home.Notice/info',
    method: 'get',
    params
  });
}
// 修改公告公告开启时间
export function changeOpenTime(data: any) {
  return request({
    url: '/admin/home.Notice/opentime',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeOpenTime, getInfo, isOpen };
