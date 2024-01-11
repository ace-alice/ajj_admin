import request from '@/utils/request.ts';

/**
 * 获取小金体育注单记录
 * @param data
 */
export function list(params: any) {
  return request({
    url: '/admin/order.XjSport/list',
    method: 'get',
    params
  });
}

/**
 * 小金手动补单 电竞
 * @param data
 */
export function pullOrder(data: any) {
  return request({
    url: '/admin/order.XjSport/xjPullOrder',
    method: 'post',
    data
  });
}

export default { list, pullOrder };
