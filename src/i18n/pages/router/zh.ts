/** @type {*} */
const router = {
  undefined: '暂无路由',
  'personal-center': '个人中心',
  /** *
   *  权限设置
   */
  'change-menu': '修改菜单',
  'menu-add': '菜单管理',
  'menu-config': '菜单管理',
  'admin-config': '权限设置',
  'role-config': '角色管理',
  'log-config': '日志管理',
  'department-config': '部门管理',
  'operator-config': '操作员管理',
  /** *
   *  会员管理
   */
  'user-manage': '用户管理',
  'add-user': '新增用户',
  'add-user-more': '批量新增用户',
  'user-config': '会员管理',
  'user-verification-code': '用户验证码查询',
  'proxy-application-audit': '代理申请审核',
  'main-proxy-application-audit': '申请总代审核',
  'user-add-audit-info': '新增会员审核详情',
  'vip-bind-audit-info': '会员绑定审核详情',
  'proxy-template': '代理返佣模板配置',
  'proxy-audit-info': '代理审核详情',
  'basic-info': '基本信息',
  'wallet-info': '钱包信息',
  'cash-flow-info': '充值流水信息',
  'login-info': '登录信息',
  'bank-info': '银行卡信息',
  'usdt-info': '虚拟币信息',
  'comission-rate': '佣金比例',
  'team-info': '团队信息',
  'vip-bind-apply': '会员绑定上级',
  'vip-bind-apply-list': '会员绑定审核列表',
  /** *
   *  账房管理
   */
  'account-config': '账房管理',
  'recharge-type-config': '充值类型设置',
  'recharge-line-config': '充值线路配置',
  'withdraw-line-config': '出款线路配置',
  'withdraw-line-audit': '出款线路审核',
  'manual-recharge-withdraw': '人工加减额',
  'manual-recharge': '人工加额',
  'manual-withdraw': '人工减额',
  'recharge-account-config': '充值账号设置',
  'recharge-audit': '充值审核',
  'withdraw-audit': '提款审核',
  'recharge-list': '充值列表',
  'withdraw-list': '提款列表',
  'withdraw-list-rmb': '人民币提款列表',
  'withdraw-list-usdt': '虚拟币提款列表',
  'recharge-audit-info': '充值审核详情',
  'withdraw-audit-info': '提款审核详情',
  'account-change': '资金账变',
  'commsion-list': '佣金列表',
  'bank-list': '提款银行卡设置',
  'recharge-line-audit': '充值线路审核',
  'artificial-plus': '人工加额订单',
  'artificial-redu': '人工减额订单',
  'manual-audit': '人工减额审核',
  /**
   * 风控管理
   */
  'risk-control-config': '风控管理',
  'login-device-black-list': '登录设备黑名单',
  'login-ip-black-list': '登录IP黑名单',
  'register-device-black-list': '注册设备黑名单',
  'register-ip-black-list': '注册IP黑名单',
  'risk-control-manage': '创建风控层级',
  'risk-control-operate': '编辑风控层级',
  'search-ip-list': 'IP查询',

  /** *
   * 系统管理
   */
  'system-manage': '系统管理',
  'system-config': '系统配置',
  'cache-config': '缓存设置',
  'token-config': 'Token设置',
  'captcha-config': '验证码设置',
  'log-config1': '日志设置',
  'api-config': '接口设置',
  'email-config': '邮件设置',
  'client-config': '客户端配置',
  'self-config': '自定义设置',
  'announcement-manage': '后台公告',
  'dictionary-manage': '参数字典管理',
  'app-config': '安装包管理',
  /**
   *文件管理
   */
  'file-manage': '文件管理',
  'file-config': '文件管理',
  'file-group-manage': '文件分组管理',
  'upload-config': '上传配置',
  'file-recover': '文件回收站',
  'data-export-file': '数据导出报表',
  /** *
   * 市场管理
   */
  'market-manage': '市场管理',
  'market-config': '市场配置',
  'agent-agreement': '代理协议配置',
  'market-address': '市场地址配置',
  'splash-page': '闪屏页配置',
  'game-maintenance': '游戏维护',
  'venue-rate': '场馆费率配置',
  'banner-manage': '首页banner配置',
  'banner-label-manage': 'banner标签配置',
  'mark-manage': '公告/站内信标识配置',
  'announce-config': '公告配置',
  'site-message-config': '站内信配置',
  'channel-manage': '渠道管理',
  // 注单
  'bet-manage': '注单',
  'bet-ia-gaming': 'IA电竞',
  'bet-sb-sports': '沙巴体育',
  'bet-pb-sports': '平博体育',
  'bet-xj-sports': '小金体育',
  'bet-ag-sports': 'AG真人',
  // 电维管理
  'tel-maintenance-manage': '电维管理',
  'task-assignment': '任务分配',
  'daily-task-list': '日常任务列表',
  'my-task': '我的任务',
  'available-users': '可用用户',
  /** *
   * 活动管理
   */
  'activity-manage': '活动管理',
  'vip-config': ' VIP管理',
  'vip-level-config': 'VIP等级配置',
  'vip-rebate-config': 'VIP返水配置',
  'vip-charge-config': 'VIP每月首充配置',
  'vip-relive-config': 'VIP月复活金配置',
  'activity-tab-config': '活动页签配置',
  'activity-label': '活动标签配置',
  'activity-record': '活动记录',
  'activity-record-discount': '优惠活动记录',
  'activity-record-rebate': '返水记录',
  'activity-record-vip': 'VIP奖励记录',
  'activity-config': '活动配置',
  'activity-data': '活动数据',
  'activity-fake-data': '活动假数据',
  'activity-data-task': '新手任务',
  'activity-data-invite': '好友邀请',
  'activity-data-lottory': '实物抽奖',
  'activity-data-venue': '场馆包赔',
  'activity-data-lucky': '红包雨',
  'activity-data-rebase': '投注返水',
  'activity-charge-discount': '充值优惠',
  /**
   * 业务报表
   */
  'business-report': '业务报表',
  'commission-payment': '佣金收付',
  'commission-report': '佣金报表',
  'member-report': '会员日报表',
  'total-member-report': '总盈亏报表',
  'proxy-profit': '代理日报',
  'venye-report': '场馆盈亏',
  'rebate-report': '返水报表'
};

export default { router };
