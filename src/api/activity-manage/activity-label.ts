import request from '@/utils/request.ts';

// 获取活动标签列表
export function list(params?: any) {
  return request({
    url: '/admin/activity.ActivityLabel/list',
    method: 'get',
    params
  });
}

// 新增活动标签
export function add(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/add',
    method: 'post',
    data
  });
}

// 编辑活动标签
export function edit(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/edit',
    method: 'post',
    data
  });
}

// 删除活动标签
export function del(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/delete',
    method: 'post',
    data
  });
}

// 设置活动标签状态
export function changeStatus(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/change',
    method: 'post',
    data
  });
}

// 置顶活动标签
export function top(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/top',
    method: 'post',
    data
  });
}

// 活动标签排序
export function sort(data: any) {
  return request({
    url: '/admin/activity.ActivityLabel/sort',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeStatus, top, sort };
