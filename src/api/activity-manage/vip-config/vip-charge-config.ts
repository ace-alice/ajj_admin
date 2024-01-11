import request from '@/utils/request.ts';

// 获取每月首充配置
export function list(params: any) {
  return request({
    url: '/admin/activity.VipFirstMonthConfig/list',
    method: 'get',
    params
  });
}

// 编辑每月首充配置
export function edit(data: any) {
  return request({
    url: '/admin/activity.VipFirstMonthConfig/edit',
    method: 'post',
    data
  });
}

export default { list, edit };
