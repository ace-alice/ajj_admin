import request from '@/utils/request.ts';

/**
 * 获取平博体育注单记录
 * @param data
 */
export function list(params: any) {
  return request({
    url: '/admin/order.PinnacleSport/list',
    method: 'get',
    params
  });
}

/**
 * 平博手动补单 电竞
 * @param data
 */
export function pullOrder(data: any) {
  return request({
    url: '/admin/order.PinnacleSport/pinnaclePullOrder',
    method: 'post',
    data
  });
}

export default { list, pullOrder };
