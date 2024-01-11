import request from '@/utils/request.ts';

// 获取返佣比例模板列表
export function list(params: any) {
  return request({
    url: '/admin/member.Agent/agentCheckList',
    method: 'get',
    params
  });
}

// 代理申请列表点击审核
export function toAudit(params: any) {
  return request({
    url: '/admin/member.Agent/checkInfo',
    method: 'get',
    params
  });
}

// 代理申请列表锁单
export function toLockOrder(params: any) {
  return request({
    url: '/admin/member.Agent/lockOrder',
    method: 'post',
    params
  });
}

// 代理审核截单查看
export function toLookOrder(params: any) {
  return request({
    url: '/admin/member.Agent/statementView',
    method: 'get',
    params
  });
}

// 代理审核
export function doAudit(data: any) {
  return request({
    url: '/admin/member.Agent/check',
    method: 'post',
    data
  });
}

export default { list, toAudit, toLockOrder, toLookOrder, doAudit };
