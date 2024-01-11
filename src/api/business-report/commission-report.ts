import request from '@/utils/request.ts';

// 获取返水报表
export function list(params: any) {
  return request({
    url: '/admin/report.ReportCommission/list',
    method: 'get',
    params
  });
}

// 返佣人数
export function getUserList(params: any) {
  return request({
    url: '/admin/report.ReportCommission/people',
    method: 'get',
    params
  });
}

export default { list, getUserList };
