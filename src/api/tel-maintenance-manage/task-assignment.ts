import request from '@/utils/request.ts';

/**
 * 获取任务列表（任务分配）
 * @param params
 */
export function list(params: any) {
  return request({
    url: '/admin/recall.TaskDistribute/list',
    method: 'get',
    params
  });
}

/**
 * 新增任务（任务分配）
 */
export function add(params: any) {
  return request({
    url: '/admin/recall.TaskDistribute/add',
    method: 'post',
    data: params
  });
}

/**
 * 查看详情（任务分配）
 */
export function getInfo(params: any) {
  return request({
    url: '/admin/recall.TaskDistribute/getInfo',
    method: 'get',
    params
  });
}

/**
 * 任务禁用（任务分配）
 */
export function changeStatus(params: any) {
  return request({
    url: '/admin/recall.TaskDistribute/status',
    method: 'get',
    params
  });
}
/**
 * 可用用户
 */
export function available(params: any) {
  return request({
    url: '/admin/recall.TaskDistribute/available',
    method: 'post',
    data: params
  });
}

/**
 * 删除任务（任务分配）
 */
export function del(data: any) {
  return request({
    url: '/admin/recall.TaskDistribute/delete',
    method: 'delete',
    data
  });
}

export default { list, add, getInfo, del, changeStatus, available };
