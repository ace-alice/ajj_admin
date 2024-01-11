import request from '@/utils/request.ts';

/**
 * 获取AG体育注单记录
 * @param data
 */
export function list(params: any) {
  return request({
    url: '/admin/order.AgGame/list',
    method: 'get',
    params
  });
}

export default { list };
