import request from '@/utils/request.ts';

// 获取返佣比例模板列表
export function list(params: any) {
  return request({
    url: '/admin/member.Agent/rebateTemplateList',
    method: 'get',
    params
  });
}

// 新增返佣比例模板
export function add(data: any) {
  return request({
    url: '/admin/member.Agent/rebateTemplateAdd',
    method: 'post',
    data
  });
}

// 编辑返佣比例模板
export function edit(data: any) {
  return request({
    url: '/admin/member.Agent/rebateTemplateEdit',
    method: 'post',
    data
  });
}

// 删除返佣比例模板
export function del(data: any) {
  return request({
    url: '/admin/member.Agent/rebateTemplateDel',
    method: 'post',
    data
  });
}

export default { list, add, edit, del };
