import request from '@/utils/request.ts';

// 获取文件列表
export function list(params: any) {
  return request({
    url: '/admin/file.File/list',
    method: 'get',
    params
  });
}

// 获取文件列表
export function info(params: { id: string | number }) {
  return request({
    url: '/admin/file.File/info',
    method: 'get',
    params
  });
}

// 新增文件
export function add(data: any) {
  return request({
    url: '/admin/file.File/add',
    method: 'post',
    data
  });
}

// 编辑文件
export function edit(data: any) {
  return request({
    url: '/admin/file.File/edit',
    method: 'post',
    data
  });
}

// 删除文件
export function del(data: any) {
  return request({
    url: '/admin/file.File/dele',
    method: 'post',
    data
  });
}

// 修改文件是否禁用
export function isDisable(data: any) {
  return request({
    url: '/admin/file.File/disable',
    method: 'post',
    data
  });
}

// 文件修改分组
export function editGroup(data: any) {
  return request({
    url: '/admin/file.File/editgroup',
    method: 'post',
    data
  });
}

// 文件修改类型
export function editType(data: any) {
  return request({
    url: '/admin/file.File/edittype',
    method: 'post',
    data
  });
}

// 文件修改域名
export function editDomain(data: any) {
  return request({
    url: '/admin/file.File/editdomain',
    method: 'post',
    data
  });
}

export default {
  list,
  add,
  edit,
  del,
  info,
  isDisable,
  editGroup,
  editType,
  editDomain
};
