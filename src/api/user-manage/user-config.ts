import request from '@/utils/request.ts';

// 获取用户列表
export function list(params: any) {
  return request({
    url: '/admin/member.Member/list',
    method: 'get',
    params
  });
}

// 获取用户详情
export function getMemberBaseInfo(params: any) {
  return request({
    url: '/admin/member.Member/info',
    method: 'get',
    params
  });
}

// 会员详情->修改状态
export function changeStatus(data: any) {
  return request({
    url: '/admin/member.Member/userStateChange',
    method: 'post',
    data
  });
}

// 会员详情->修改生日
export function changeBirthday(data: any) {
  return request({
    url: '/admin/member.Member/userBirthdayChange',
    method: 'post',
    data
  });
}

// 会员详情->添加备注
export function addRemark(data: any) {
  return request({
    url: '/admin/member.Member/userRemarkAdd',
    method: 'post',
    data
  });
}

// 会员详情->修改密码
export function changePassword(data: any) {
  return request({
    url: '/admin/member.Member/userPasswordChange',
    method: 'post',
    data
  });
}

// 会员详情->解除充值限制
export function liftDepositLimit(data: any) {
  return request({
    url: '/admin/member.Member/liftDepositLimit',
    method: 'post',
    data
  });
}

// 获取用户流水
export function getCashFlowInfo(params: any) {
  return request({
    url: '/admin/member.Member/getCashFlowInfo',
    method: 'get',
    params
  });
}

// 清空流水
export function cleanBetFlow(data: any) {
  return request({
    url: '/admin/member.Member/cleanBetFlow',
    method: 'POST',
    data
  });
}

// 获取用户登录列表
export function getLoginList(params: any) {
  return request({
    url: '/admin/member.Member/loginList',
    method: 'get',
    params
  });
}

// 获取用户登录列表
export function getBankList(params: any) {
  return request({
    url: '/admin/member.Member/bankList',
    method: 'get',
    params
  });
}

// 获取用户钱包信息
export function getWalletInfo(params: any) {
  return request({
    url: '/admin/member.Member/getWalletInfo',
    method: 'get',
    params
  });
}

// 修改银行卡信息
export function userBankStateChange(data: any) {
  return request({
    url: '/admin/member.Member/userBankStateChange',
    method: 'post',
    data
  });
}

// 修改银行卡信息
export function getAgentTeamInfo(data: any) {
  return request({
    url: '/admin/member.Agent/agentTeamInfo',
    method: 'post',
    data
  });
}

// 返佣比例模板列表
export function getRebateTemplateList(params: any) {
  return request({
    url: '/admin/member.Agent/rebateTemplateList',
    method: 'get',
    params
  });
}

// 返佣比例模板列表
export function getRebateRatio(params: any) {
  return request({
    url: '/admin/member.Agent/getRebateRatio',
    method: 'get',
    params
  });
}

// 返佣比例模板列表
export function updateRebateRatio(data: any) {
  return request({
    url: '/admin/member.Agent/updateRebateRatio',
    method: 'post',
    data
  });
}

// 用户虚拟币信息
export function blockChainList(data: any) {
  return request({
    url: '/admin/member.Member/blockChainList',
    method: 'post',
    data
  });
}

// 修改虚拟币信息
export function userBlockChainChange(data: any) {
  return request({
    url: '/admin/member.Member/userBlockChainChange',
    method: 'post',
    data
  });
}

// 余额回收：将三方钱包余额都转入主钱包
export function getBackAllMoney(data: any) {
  return request({
    url: '/admin/member.Member/getBackAllMoney',
    method: 'post',
    data
  });
}

// 三方钱包转到主钱包
export function moneyTransferOut(data: any) {
  return request({
    url: '/admin/member.Member/moneyTransferOut',
    method: 'post',
    data
  });
}

// 将用户变为总代
export function userChangeAgent(data: any) {
  return request({
    url: '/admin/member.Member/userChangeAgent',
    method: 'post',
    data
  });
}
//渠道风控列表
export function getRiskChannel(params: any) {
  return request({
    url: '/admin/member.Member/riskChannel',
    method: 'get',
    params
  });
}
//渠道风控设置
export function riskChannelSet(params: any) {
  return request({
    url: '/admin/member.Member/riskChannelSet',
    method: 'get',
    params
  });
}

export default {
  list,
  getMemberBaseInfo,
  changeStatus,
  changeBirthday,
  addRemark,
  changePassword,
  liftDepositLimit,
  getCashFlowInfo,
  getLoginList,
  getBankList,
  userBankStateChange,
  getAgentTeamInfo,
  getWalletInfo,
  getRebateRatio,
  cleanBetFlow,
  getRebateTemplateList,
  blockChainList,
  userBlockChainChange,
  moneyTransferOut,
  getBackAllMoney,
  updateRebateRatio,
  userChangeAgent,
  getRiskChannel,
  riskChannelSet
};
