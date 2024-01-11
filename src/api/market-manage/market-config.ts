import request from '@/utils/request.ts';

//地址配置 当前信息
export function getAddressInfo(data: any) {
  return request({
    url: '/admin/markets.SystemAddress/getCurrentInfo',
    method: 'post',
    data
  });
}

//修改地址配置
export function addAddress(data: any) {
  return request({
    url: '/admin/markets.SystemAddress/edit',
    method: 'post',
    data
  });
}

//获取地址类型
export function getAddressType() {
  return request({
    url: '/admin/markets.MarketSysConfig/typeList',
    method: 'post'
  });
}

//闪屏页配置 获取
export function getSplashScreen(data: any) {
  return request({
    url: '/admin/markets.SplashScreen/getCurrentInfo',
    method: 'post',
    data
  });
}

//闪屏页配置 编辑
export function editSplashScreen(data: any) {
  return request({
    url: '/admin/markets.SplashScreen/edit',
    method: 'post',
    data
  });
}

//上传代理协议
export function uploadProtocol(data: any) {
  return request({
    url: '/admin/markets.Protocol/protocol',
    method: 'post',
    data
  });
}

//代理协议
export function getProtocol() {
  return request({
    url: '/admin/markets.Protocol/getProtocol',
    method: 'post'
  });
}

//设置场馆费率
export function editVenueRate(data: any) {
  return request({
    url: '/admin/markets.VenueRate/setRate',
    method: 'post',
    data
  });
}

//获取场馆费率
export function getVenueRate() {
  return request({
    url: '/admin/markets.VenueRate/list',
    method: 'post'
  });
}

//添加游戏维护
export function addSafeguard(data: any) {
  return request({
    url: '/admin/markets.Maintain/add',
    method: 'post',
    data
  });
}

//获取游戏维护信息
export function getSafeguard(data: any) {
  return request({
    url: '/admin/markets.Maintain/getCurrentInfo',
    method: 'post',
    data
  });
}

//关闭游戏维护
export function cancelSafeguard(data: any) {
  return request({
    url: '/admin/markets.Maintain/closure',
    method: 'post',
    data
  });
}
