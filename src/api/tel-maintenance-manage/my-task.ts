import request from '@/utils/request.ts';

/**
 * 获取我的任务列表
 * @param params
 */
export function list(params: any) {
  return request({
    url: '/admin/recall.TaskRecallList/myTask',
    method: 'get',
    params
  });
}

/**
 * 回访记录
 * @param params
 */
export function myTaskVisit(data: any) {
  return request({
    url: '/admin/recall.TaskRecallList/myTaskVisit',
    method: 'post',
    data
  });
}

export default { list, myTaskVisit };
