import request from '@/utils/request.ts';

//Token设置信息
export function tokenInfo() {
  return request({
    url: '/admin/home.SettingClient/tokenInfo',
    method: 'get'
  });
}

//Token设置修改
export function tokenEdit(data?: any) {
  return request({
    url: '/admin/home.SettingClient/tokenEdit',
    method: 'post',
    data
  });
}

//验证码设置信息
export function captchaInfo() {
  return request({
    url: '/admin/home.SettingClient/captchaInfo',
    method: 'get'
  });
}

//验证码设置修改
export function captchaEdit(data?: any) {
  return request({
    url: '/admin/home.SettingClient/captchaEdit',
    method: 'post',
    data
  });
}

//日志设置信息
export function logInfo() {
  return request({
    url: '/admin/home.SettingClient/logInfo',
    method: 'get'
  });
}

//日志设置修改
export function logEdit(data?: any) {
  return request({
    url: '/admin/home.SettingClient/logEdit',
    method: 'post',
    data
  });
}

//接口设置信息
export function apiInfo() {
  return request({
    url: '/admin/home.SettingClient/apiInfo',
    method: 'get'
  });
}

//接口设置修改
export function apiEdit(data?: any) {
  return request({
    url: '/admin/home.SettingClient/apiEdit',
    method: 'post',
    data
  });
}

//自定义设置
export function diyInfo() {
  return request({
    url: '/admin/home.SettingClient/diyInfo',
    method: 'get'
  });
}

//自定义设置修改
export function diyEdit(data?: any) {
  return request({
    url: '/admin/home.SettingClient/diyEdit',
    method: 'post',
    data
  });
}
