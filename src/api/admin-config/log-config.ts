import request from '@/utils/request.ts';

// 获取日志列表
export function list(params: any) {
  return request({
    url: '/admin/home.UserLog/list',
    method: 'get',
    params
  });
}

// 删除日志
export function del(data: any) {
  return request({
    url: '/admin/home.UserLog/dele',
    method: 'post',
    data
  });
}

// 日志清理
export function clear(data: any) {
  return request({
    url: '/admin/home.UserLog/clear',
    method: 'post',
    data
  });
}

export default { list, del, clear };
