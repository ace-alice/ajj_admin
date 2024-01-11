import request from '@/utils/request.ts';

// 获取站内信列表
export function list(params: any) {
  return request({
    url: '/admin/markets.Letter/list',
    method: 'get',
    params
  });
}

// 新增站内信配置
export function add(data: any) {
  return request({
    url: '/admin/markets.Letter/add',
    method: 'post',
    data
  });
}

// 删除站内信配置
export function recall(data: any) {
  return request({
    url: '/admin/markets.Letter/revoke',
    method: 'post',
    data
  });
}

export default { list, add, recall };
