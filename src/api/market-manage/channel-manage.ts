import request from '@/utils/request.ts';

// 获取banner标签列表
export function list(params: any) {
  return request({
    url: '/admin/markets.MarketChannel/list',
    method: 'get',
    params
  });
}

// 新增banner标签
export function add(data: any) {
  return request({
    url: '/admin/markets.MarketChannel/add',
    method: 'post',
    data
  });
}

// 编辑banner标签
export function edit(data: any) {
  return request({
    url: '/admin/markets.MarketChannel/edit',
    method: 'post',
    data
  });
}

// 删除banner标签
export function del(data: any) {
  return request({
    url: '/admin/markets.MarketChannel/delete',
    method: 'post',
    data
  });
}

export default { list, add, edit, del };
