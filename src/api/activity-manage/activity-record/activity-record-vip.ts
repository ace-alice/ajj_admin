import request from '@/utils/request.ts';

// 获取VIP奖励记录
export function list(params: any) {
  return request({
    url: '/admin/activity.VipRewardRecord/list',
    method: 'get',
    params
  });
}

export default { list };
