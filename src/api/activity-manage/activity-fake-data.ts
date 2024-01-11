import request from '@/utils/request.ts';

// 获取活动标签列表
export function list(params?: any) {
  return request({
    url: '/admin/activity.ActivityRecords/list',
    method: 'get',
    params
  });
}

// 新增活动标签
export function add(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/add',
    method: 'post',
    data
  });
}

// 编辑活动标签
export function edit(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/edit',
    method: 'post',
    data
  });
}

// 删除活动标签
export function del(data: any) {
  return request({
    url: '/admin/activity.ActivityRecords/delete',
    method: 'post',
    data
  });
}
// 活动标签
export function getActivityTemplate() {
  return request({
    url: '/admin/activity.ActivityConfiguration/getActivityTemplate',
    method: 'post'
  });
}

// 活动列表
export function lotteryActivityList() {
  return request({
    url: '/admin/activity.ActivityRecords/lotteryActivityList',
    method: 'get'
  });
}

export default {
  list,
  add,
  edit,
  del,
  getActivityTemplate,
  lotteryActivityList
};
