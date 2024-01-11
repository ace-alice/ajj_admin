import request from '@/utils/request.ts';

// 充值优惠配置列表
export function list(params?: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/activityDepositConfig',
    method: 'get',
    params
  });
}

// 充值优惠配置修改
export function edit(params?: any) {
  return request({
    url: '/admin/activity.ActivityConfiguration/configEdit',
    method: 'get',
    params
  });
}

export default { list, edit };
