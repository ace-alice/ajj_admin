import request from '@/utils/request.ts';

// 常规活动记录活动记录—-新手任务记录
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/newPeopleTaskList',
    method: 'get',
    params
  });
}

// 常规活动记录活动记录—-新手任务签到详情
export function newPeopleTaskSignList(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/newPeopleTaskSignList',
    method: 'get',
    params
  });
}

export default { list, newPeopleTaskSignList };
