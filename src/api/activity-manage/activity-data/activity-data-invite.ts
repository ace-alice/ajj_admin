import request from '@/utils/request.ts';

// 常规活动记录活动记录—-好友邀请数据
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/inviteRecords',
    method: 'get',
    params
  });
}

export default { list };
