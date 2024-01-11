import request from '@/utils/request.ts';

// 获取返水报表
export function list(params: any) {
  return request({
    url: '/admin/report.ReportMember/list',
    method: 'get',
    params
  });
}

export default { list };
