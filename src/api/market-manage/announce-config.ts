import request from '@/utils/request.ts';

// 获取公告列表
export function list(params: any) {
  return request({
    url: '/admin/markets.Announcement/list',
    method: 'get',
    params
  });
}

// 新增公告配置
export function add(data: any) {
  return request({
    url: '/admin/markets.Announcement/add',
    method: 'post',
    data
  });
}

// 编辑公告配置
export function edit(data: any) {
  return request({
    url: '/admin/markets.Announcement/edit',
    method: 'post',
    data
  });
}

// 删除公告配置
export function del(data: any) {
  return request({
    url: '/admin/markets.Announcement/delete',
    method: 'post',
    data
  });
}

// 更改公告状态
export function changeStatus(data: any) {
  return request({
    url: '/admin/markets.Announcement/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeStatus };
