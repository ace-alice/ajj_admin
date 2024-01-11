import request from '@/utils/request.ts';

/**
 * 获取小艾注单记录
 * @param data
 */
export function list(params: any) {
  return request({
    url: '/admin/order.IaEsport/list',
    method: 'get',
    params
  });
}

/**
 * 小艾急速lol手动补单
 * @param data
 */
export function pullOrder(data: any, url?: string) {
  return request({
    url: url || '/admin/order.IaEsport/iaAutoChessPullOrder',
    method: 'post',
    data
  });
}

export default { list, pullOrder };
