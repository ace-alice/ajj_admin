import request from '@/utils/request.ts';

// 获取banner标签列表
export function list(params: any) {
  return request({
    url: '/admin/markets.BannerTag/list',
    method: 'get',
    params
  });
}

// 新增banner标签
export function add(data: any) {
  return request({
    url: '/admin/markets.BannerTag/add',
    method: 'post',
    data
  });
}

// 编辑banner标签
export function edit(data: any) {
  return request({
    url: '/admin/markets.BannerTag/edit',
    method: 'post',
    data
  });
}

// 删除banner标签
export function del(data: any) {
  return request({
    url: '/admin/markets.BannerTag/delete',
    method: 'post',
    data
  });
}

// 更改banner标签状态
export function changeStatus(data: any) {
  return request({
    url: '/admin/markets.BannerTag/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, changeStatus };
