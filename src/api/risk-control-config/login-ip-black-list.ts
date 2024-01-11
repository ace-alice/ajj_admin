import request from '@/utils/request.ts';

// 获取登录ip黑名单
export function list(params: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/list',
    method: 'get',
    params
  });
}

// 新增登录ip黑名单
export function add(data: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/add',
    method: 'post',
    data
  });
}

// 编辑登录ip黑名单
export function edit(data: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/edit',
    method: 'post',
    data
  });
}

// 删除登录ip黑名单
export function del(data: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/delete',
    method: 'post',
    data
  });
}

// 获取用户信息
export function getLoginList(params: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/userList',
    method: 'get',
    params
  });
}

//禁止用户登入;
export function disableUserLogin(data: any) {
  return request({
    url: '/admin/risk.LoginBlackIp/forbid',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, getLoginList, disableUserLogin };
