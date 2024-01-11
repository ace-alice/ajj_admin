import request from '@/utils/request.ts';

// 获取banner列表
export function list(params: any) {
  return request({
    url: '/admin/markets.BannerConf/list',
    method: 'get',
    params
  });
}

// 新增首页banner配置
export function add(data: any) {
  return request({
    url: '/admin/markets.BannerConf/add',
    method: 'post',
    data
  });
}

// 编辑首页banner配置
export function edit(data: any) {
  return request({
    url: '/admin/markets.BannerConf/edit',
    method: 'post',
    data
  });
}

// 删除首页banner配置
export function del(data: any) {
  return request({
    url: '/admin/markets.BannerConf/delete',
    method: 'post',
    data
  });
}

// banner图排序
export function sortFun(data: any) {
  return request({
    url: '/admin/markets.BannerConf/sort',
    method: 'post',
    data
  });
}

//  置顶首页banner配置
export function top(data: any) {
  return request({
    url: '/admin/markets.BannerConf/onTop',
    method: 'post',
    data
  });
}

// banner状态更改
export function changeStatus(data: any) {
  return request({
    url: '/admin//markets.BannerConf/disable',
    method: 'post',
    data
  });
}

export default { list, add, edit, del, sortFun, top, changeStatus };
