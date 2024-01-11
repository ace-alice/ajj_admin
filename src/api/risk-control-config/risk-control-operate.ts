import request from '@/utils/request.ts';

// 获取风控层级
export function editRisk(data: any) {
  return request({
    url: '/admin/risk.EditRisk/edit',
    method: 'post',
    data
  });
}

// 新增风控层级
export function getInfo(data: any) {
  return request({
    url: '/admin/risk.EditRisk/getInfo',
    method: 'post',
    data
  });
}

export default { editRisk, getInfo };
