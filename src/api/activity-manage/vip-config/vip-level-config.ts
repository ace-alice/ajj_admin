import request from '@/utils/request.ts';

// 获取VIP等级
export function list(params: any) {
  return request({
    url: '/admin/activity.VipLevelConfig/list',
    method: 'get',
    params
  });
}

// 编辑VIP等级
export function edit(data: any) {
  return request({
    url: '/admin/activity.VipLevelConfig/edit',
    method: 'post',
    data
  });
}

export default { list, edit };
