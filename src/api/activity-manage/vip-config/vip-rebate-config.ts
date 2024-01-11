import request from '@/utils/request.ts';

// 获取返水
export function list(params: any) {
  return request({
    url: '/admin/activity.VipRebateConfig/list',
    method: 'get',
    params
  });
}

// 编辑返水
export function edit(data: any) {
  return request({
    url: '/admin/activity.VipRebateConfig/edit',
    method: 'post',
    data
  });
}

export default { list, edit };
