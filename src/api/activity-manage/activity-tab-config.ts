import request from '@/utils/request.ts';

// 获取活动页签列表
export function list(params?: any) {
  return request({
    url: '/admin/activity.ActivityTab/list',
    method: 'get',
    params
  });
}

// 新增活动页签
export function add(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/add',
    method: 'post',
    data
  });
}

// 编辑活动页签
export function edit(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/edit',
    method: 'post',
    data
  });
}

// 删除活动页签
export function del(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/delete',
    method: 'post',
    data
  });
}

// 设置活动页签状态
export function changeStatus(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/change',
    method: 'post',
    data
  });
}

// 置顶活动页签
export function top(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/top',
    method: 'post',
    data
  });
}

// 活动页签排序
export function sort(data: any) {
  return request({
    url: '/admin/activity.ActivityTab/sort',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeStatus, top, sort };
