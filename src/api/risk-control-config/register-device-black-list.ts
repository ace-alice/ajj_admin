import request from '@/utils/request.ts';

// 获取注册终端黑名单列表
export function list(params: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/list',
    method: 'get',
    params
  });
}

// 注册终端黑名单添加
export function add(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/add',
    method: 'post',
    data
  });
}

// 注册终端黑名单编辑
export function edit(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/edit',
    method: 'post',
    data
  });
}

// 注册终端黑名单删除
export function del(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/delete',
    method: 'post',
    data
  });
}

// 注册获取用户信息
export function getLoginList(params: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/userList',
    method: 'get',
    params
  });
}

// 注册禁止用户登入;
export function disableUserLogin(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackTerminal/forbid',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, getLoginList, disableUserLogin };
