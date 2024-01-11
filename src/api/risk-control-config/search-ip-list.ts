import request from '@/utils/request.ts';

// IP查询列表
export function list(params: any) {
  return request({
    url: '/admin/risk.IpCheck/list',
    method: 'get',
    params
  });
}

export default { list };
