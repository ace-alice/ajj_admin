import request from '@/utils/request.ts';

// 获取终端黑名单列表
export function list(params: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/list',
    method: 'get',
    params
  });
}

// 登录终端黑名单添加
export function add(data: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/add',
    method: 'post',
    data
  });
}

// 登录终端黑名单编辑
export function edit(data: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/edit',
    method: 'post',
    data
  });
}

// 登录终端黑名单删除
export function del(data: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/delete',
    method: 'post',
    data
  });
}

// 登录获取用户信息
export function getLoginList(params: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/userList',
    method: 'get',
    params
  });
}

//登录禁止用户登入;
export function disableUserLogin(data: any) {
  return request({
    url: '/admin/risk.LoginBlackTerminal/forbid',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, getLoginList, disableUserLogin };
