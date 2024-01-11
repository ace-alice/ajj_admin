import request from '@/utils/request.ts';

/**
 * 获取日常任务列表（任务分配）
 * @param params
 */
export function list(params: any) {
  return request({
    url: '/admin/recall.TaskRecallList/dayTask',
    method: 'get',
    params
  });
}

/**
 * 获取日常任务任务详情
 * @param params
 */
export function getDayTaskInfo(params: any) {
  return request({
    url: '/admin/recall.TaskRecallList/getDayTaskInfo',
    method: 'get',
    params
  });
}

export default { list, getDayTaskInfo };
