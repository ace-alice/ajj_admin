import request from '@/utils/request.ts';

// 获取优惠活动记录
export function list(params: any) {
  return request({
    url: '/admin/activity.VipRebateRecord/list',
    method: 'get',
    params
  });
}

export default { list };
