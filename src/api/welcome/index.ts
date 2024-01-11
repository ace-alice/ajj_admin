import request from '@/utils/request.ts';

export function statisticsDay(params: any) {
  return request({
    url: '/admin/report.ReportStatistics/statisticsDay',
    method: 'get',
    params
  });
}

export default { statisticsDay };
