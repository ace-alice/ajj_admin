import request from '@/utils/request.ts';

// 会员验证码查询
export function list(params: any) {
  return request({
    url: '/admin/member.Member/userCodeList',
    method: 'get',
    params
  });
}

export default { list };
