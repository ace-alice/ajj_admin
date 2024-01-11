import request from '@/utils/request.ts';

// 通过username获取会员信息
export function getUserInfoByName(params: any) {
  return request({
    url: '/admin/member.Member/getInfoByName',
    method: 'get',
    params
  });
}

// 通过id获取会员信息
export function getInfoById(params: any) {
  return request({
    url: '/admin/member.Member/getInfoById',
    method: 'get',
    params
  });
}

export function getDictFun(params: { primary_key: string }) {
  return request({
    url: '/admin/system.Dictionary/getValue',
    method: 'get',
    params
  });
}

export default { getUserInfoByName, getDictFun, getInfoById };
