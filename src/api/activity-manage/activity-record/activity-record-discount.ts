import request from '@/utils/request.ts';

// 获取优惠活动记录
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRewardRecord/list',
    method: 'get',
    params
  });
}

// 活动记录活动申请人数
export function applyCount() {
  return request({
    url: '/admin/activity.ActivityRewardRecord/applyCount',
    method: 'get'
  });
}

export default { list, applyCount };
