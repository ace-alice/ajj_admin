import request from '@/utils/request.ts';

// 常规活动记录活动记录—-红包雨数据列表
export function list(params: any) {
  return request({
    url: '/admin/activity.ActivityRecords/redPacketInfo',
    method: 'get',
    params
  });
}

export default { list };
