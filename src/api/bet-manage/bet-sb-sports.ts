import request from '@/utils/request.ts';

/**
 * 获取沙巴体育注单记录
 * @param data
 */
export function list(params: any) {
  return request({
    url: '/admin/order.SabaSport/list',
    method: 'get',
    params
  });
}

/**
 * 沙巴手动补单 电竞
 * @param data
 */
export function pullOrder(data: any) {
  return request({
    url: '/admin/order.SabaSport/saBaPullOrder',
    method: 'post',
    data
  });
}

export default { list, pullOrder };
