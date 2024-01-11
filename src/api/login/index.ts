import request from '@/utils/request';

// 获取登录验证方式
export function loginConfig(data: any) {
  return request({
    url: '/admin/home.Login/setting',
    method: 'post',
    data
  });
}

// 获取图片验证码和uuid
export function getCodeImg() {
  return request({
    url: '/admin/home.Login/captcha',
    method: 'get'
  });
}
