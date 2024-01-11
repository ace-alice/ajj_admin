import request from '@/utils/request.ts';

// 获取复活金
export function list(params: any) {
  return request({
    url: '/admin/activity.VipResurrectionConfig/list',
    method: 'get',
    params
  });
}

// 编辑复活金
export function edit(data: any) {
  return request({
    url: '/admin/activity.VipResurrectionConfig/edit',
    method: 'post',
    data
  });
}

export default { list, edit };
