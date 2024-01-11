import request from '@/utils/request.ts';

// 获取风控层级
export function list(params: any) {
  return request({
    url: '/admin/risk.RiskType/list',
    method: 'get',
    params
  });
}

// 新增风控层级
export function add(data: any) {
  return request({
    url: '/admin/risk.RiskType/add',
    method: 'post',
    data
  });
}

// 编辑风控层级
export function edit(data: any) {
  return request({
    url: '/admin/risk.RiskType/edit',
    method: 'post',
    data
  });
}

// 编辑风控层级
export function del(data: any) {
  return request({
    url: '/admin/risk.RiskType/delete',
    method: 'post',
    data
  });
}

export default { list, add, edit, del };
