import request from '@/utils/request.ts';

// 修改个人信息详情
export function getUserInfo() {
  return request({
    url: '/admin/home.UserCenter/info',
    method: 'get'
  });
}

// 编辑个人信息
export function editUserInfo(data: any) {
  return request({
    url: '/admin/home.UserCenter/edit',
    method: 'post',
    data
  });
}

// 修改个人密码
export function initPwd(data: any) {
  return request({
    url: '/admin/home.UserCenter/pwd',
    method: 'post',
    data
  });
}

// 获取我的日志
export function list(data: any) {
  return request({
    url: '/admin/home.UserCenter/log',
    method: 'post',
    data
  });
}

export default { list, getUserInfo, editUserInfo, initPwd };
