import request from '@/utils/request.ts';

// 获取注册ip黑名单
export function list(params: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/list',
    method: 'get',
    params
  });
}

// 新增注册ip黑名单
export function add(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/add',
    method: 'post',
    data
  });
}

// 编辑注册ip黑名单
export function edit(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/edit',
    method: 'post',
    data
  });
}

// 删除注册ip黑名单
export function del(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/delete',
    method: 'post',
    data
  });
}

// 获取用户信息
export function getLoginList(params: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/userList',
    method: 'get',
    params
  });
}

//禁止用户登入;
export function disableUserLogin(data: any) {
  return request({
    url: '/admin/risk.RegisterBlackIp/forbid',
    method: 'put',
    data
  });
}

export default { list, add, edit, del, getLoginList, disableUserLogin };
