import request from '@/utils/request.ts';

// 常规活动记录活动记录—-新手任务记录
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/sportsRebateRecord',
    method: 'get',
    params
  });
}

export default { list };
