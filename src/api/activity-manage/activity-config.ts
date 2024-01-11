import request from '@/utils/request.ts';

// 获取活动配置列表
export function list(params?: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/list',
    method: 'get',
    params
  });
}

// 编辑活动配置
export function edit(data: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/edit',
    method: 'post',
    data
  });
}

// 新增活动配置
export function add(data: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/add',
    method: 'post',
    data
  });
}

//  活动配置--- - • 删除
export function del(data: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/delete',
    method: 'post',
    data
  });
}

//  状态切换 禁用———开启
export function changeStatus(data: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/change',
    method: 'post',
    data
  });
}
//  首选标签切换
export function book(data: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/hotBook',
    method: 'post',
    data
  });
}

// 活动页签
export function tabList() {
  return request({
    url: '/admin/activity.ActivityConfiguration/tabList',
    method: 'post'
  });
}

// 活动标签
export function labelList() {
  return request({
    url: '/admin/activity.ActivityConfiguration/labelList',
    method: 'post'
  });
}

// 活动标签
export function getActivityTemplate() {
  return request({
    url: '/admin/activity.ActivityConfiguration/getActivityTemplate',
    method: 'post'
  });
}
// 活动id
export function getActivityId() {
  return request({
    url: '/admin/activity.ActivityConfiguration/getActivityId',
    method: 'get'
  });
}

// 排序列表
export function sortList(params?: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/sortList',
    method: 'get',
    params
  });
}

// 排序列表
export function updateSort(data?: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/updateSort',
    method: 'post',
    data
  });
}

export default {
  list,
  add,
  edit,
  del,
  tabList,
  labelList,
  changeStatus,
  book,
  getActivityTemplate,
  getActivityId,
  updateSort,
  sortList
};
