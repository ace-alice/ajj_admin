import request from '@/utils/request.ts';

// 变更会员审核列表
export function list(params: any) {
  return request({
    url: '/admin/member.Agent/changeCheckList',
    method: 'get',
    params
  });
}

// 变更会员审核详情
export function toAudit(params: any) {
  return request({
    url: '/admin/member.Agent/checkChangeInfo',
    method: 'get',
    params
  });
}

// 变更会员上级锁单
export function toLockOrder(params: any) {
  return request({
    url: '/admin/member.Agent/lockChangeOrder',
    method: 'post',
    params
  });
}

// 变更上级结单查看
export function toLookOrder(params: any) {
  return request({
    url: '/admin/member.Agent/statementChangeView',
    method: 'get',
    params
  });
}

// 变更会员上级审核
export function doAudit(data: any) {
  return request({
    url: '/admin/member.Agent/checkChange',
    method: 'post',
    data
  });
}

export default { list, toAudit, toLockOrder, toLookOrder, doAudit };
