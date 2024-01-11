import request from '@/utils/request.ts';

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/file.Download/list',
    method: 'get',
    params
  });
}

export default {
  list
};
