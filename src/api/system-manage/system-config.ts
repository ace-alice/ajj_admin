import request from '@/utils/request.ts';

//缓存设置信息
export function cacheInfo() {
  return request({
    url: '/admin/home.Setting/cacheInfo',
    method: 'get'
  });
}

//缓存设置清除
export function cacheClear() {
  return request({
    url: '/admin/home.Setting/cacheClear',
    method: 'get'
  });
}

//Token设置信息
export function tokenInfo() {
  return request({
    url: '/admin/home.Setting/tokenInfo',
    method: 'get'
  });
}

//Token设置修改
export function tokenEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/tokenEdit',
    method: 'post',
    data
  });
}

//验证码设置信息
export function captchaInfo() {
  return request({
    url: '/admin/home.Setting/captchaInfo',
    method: 'get'
  });
}

//验证码设置修改
export function captchaEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/captchaEdit',
    method: 'post',
    data
  });
}

//日志设置信息
export function logInfo() {
  return request({
    url: '/admin/home.Setting/logInfo',
    method: 'get'
  });
}

//日志设置修改
export function logEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/logEdit',
    method: 'post',
    data
  });
}

//接口设置信息
export function apiInfo() {
  return request({
    url: '/admin/home.Setting/apiInfo',
    method: 'get'
  });
}

//接口设置修改
export function apiEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/apiEdit',
    method: 'post',
    data
  });
}

//系统设置信息
export function systemInfo() {
  return request({
    url: '/admin/home.Setting/systemInfo',
    method: 'get'
  });
}

//系统设置修改
export function systemEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/systemEdit',
    method: 'post',
    data
  });
}

//邮件设置信息
export function emailInfo() {
  return request({
    url: '/admin/home.Setting/emailInfo',
    method: 'get'
  });
}

//邮件设置修改
export function emailEdit(data?: any) {
  return request({
    url: '/admin/home.Setting/emailEdit',
    method: 'post',
    data
  });
}

//邮件设置测试
export function emailTest(data?: any) {
  return request({
    url: '/admin/home.Setting/emailEdit',
    method: 'post',
    data
  });
}
