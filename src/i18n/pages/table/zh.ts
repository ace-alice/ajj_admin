// 定义内容
const table = {
  not_empty: '不能为空',
  create_name: '创建人',
  create_time: '创建时间',
  action_name: '最近操作人',
  update_time: '最近操作时间',
  update_time1: '更新时间',
  remark_role: '备注账号',
  account_change_time: '账变时间',
  account_type: '账号类型',
  sort: '排序',
  cancel: '取 消',
  change: '更 换',
  daily_limit_money: '单日打款最高金额',
  deposit_name: '充值类型名称',
  cash_type_id: '充值类型',
  deposit_name_empty: '充值类型名称不能为空',
  deposit_logo: '充值类型LOGO',
  status: '状态',
  logo_export: 'logo上传',
  operate: '操作',
  top: '置顶',
  menu_name: '菜单名称',
  menu_url: '菜单api地址',
  menu: '菜单',
  auth: '权限',
  is_cache: '开启缓存',
  is_disable: '是否禁用',
  is_unlogin: '未登录调用',
  is_btn: '权限标识',
  button_id: '权限按钮',
  menu_pid: '上级菜单',
  role_name: '角色名称',
  role_desc: '角色描述',
  menu_assign: '菜单分配',
  admin_role: '角色',
  operator_name: '操作员名称',
  password: '密码',
  username: '用户账号',
  login_password: '登录密码',
  phone: '手机',
  email: '邮箱',
  superior_user: '上级代理',
  is_root: '是否为总代',
  information: '申请信息',
  export_file: '上传文件',
  account_name: '用户姓名',
  vip_level: 'VIP等级',
  account_status: '账号状态',
  register_terminal: '注册终端',
  create_time_1: '注册时间',
  first_deposit_time: '首存时间',
  login_time: '最后登录时间',
  danger_status: '风控层级',
  first_deposit_amount: '首存金额',
  rmb_wallet: '钱包余额',
  usdt_wallet: 'USDT钱包',
  days_without_deposit: '未存款天数',
  edit_info: '编辑信息',
  channel_id1: '充值线路ID',
  channel_name: '充值线路名称',
  recharge_card: '充值储蓄卡',
  channel_getway: '充值方式',
  channel_charges: '手续费',
  support_terminal: '支持终端',
  line_properties: '线路属性',
  channel_code: '系统识别代码',
  channel_url: '接口URL',
  channel_charges_min_quota: '手续费最小值',
  channel_charges_max_quota: '手续费最大值',
  channel_charges_refund: '是否返回手续费',
  support_viplevel: '支持VIP等级',
  terminal_quota: '端充值限额',
  terminal_pc_quota: 'PC端限额',
  terminal_pc_min_quota: 'PC端最小充值限额',
  terminal_pc_max_quota: 'PC端最大充值限额',
  terminal_wap_quota: 'H5端限额',
  terminal_wap_min_quota: 'H5端最小充值限额',
  terminal_wap_max_quota: 'H5端最大充值限额',
  terminal_app_quota: 'APP端限额',
  terminal_app_min_quota: 'APP端最小充值限额',
  terminal_app_max_quota: 'APP端最大充值限额',
  minimum: '最小',
  maximum: '最大',
  apply_pics: '申请附图',
  account_name_recharge: '充值账号名称',
  channel_id: '充值线路',
  bank_account: '收款银行卡号',
  bank_payee_name: '收款姓名',
  bank_payee_address: '所属银行支行',
  bank_id: '所属银行',
  blockchain_address: '收款地址',
  blockchain_image: '二维码上传',
  date_value_create: '发送时间',
  mark: '号码',
  update_date: '过期时间',
  is_use: '是否使用',
  code: '验证码',
  check_refuse: '审核拒绝',
  check_audit: '审核通过',
  check_reject: '审核拒绝',
  application_time: '申请时间',
  audit_time: '审核时间',
  audit_user: '审核人',
  audit_status: '审核状态',
  is_lock: '锁单状态',
  deposit_time: '存款时间',
  verify_time: '审核时间',
  deposit_succ_time: '实际到账时间',
  order_number: '订单号',
  order_username: '存款人姓名',
  terminal: '订单来源',
  recharge_ip: '存款IP',
  withdrawal_ip: '存款IP',
  order_verify: '订单状态',
  order_status_client: '客户端状态',
  recharge_ip_danger: '存款IP(风控层级)',
  audit: '审核',
  order_from_device_danger: '存款终端设备号(风控层级)',
  remark: '备注',
  add_remark: '添加备注',
  recharge_amount: '充值金额',
  withdraw_address: '提款地址',
  withdraw_bank: '提款银行',
  recharge_amount_reality: '实际到账金额',
  user_register_info: '用户注册信息',
  user_info: '用户账号信息',
  bank_num: '绑定银行卡数量',
  usdt_num: '虚拟币账号数量',
  last_bet_time: '最后下注时间',
  register_device: '注册端',
  register_device_code: '注册端设备编号',
  register_ip: '注册IP',
  audit_info: '审核信息',
  audit_remark: '审核备注',
  danger_user: '风险用户',
  danger_bank: '风险银行卡',
  danger_usdt: '风险虚拟币',
  usdt_info: '虚拟币信息',
  danger_ip: '风险IP',
  danger_device_code: '风险终端设备号',
  apply_user: '申请人',
  apply_time: '申请时间',
  apply_remark: '申请原因',
  apply_remark_placeholder: '请输出申请原因,50字以内',
  active_type: '活动类型',
  amount_times: '流水倍数',
  cash_adjust: '调整金额',
  preview_picture: '预览图片',
  recharge_currency: '充值币种',
  withdrawal_currency: '提款币种',
  withdrawal_money: '提款金额',
  apply_amount: '申请金额',
  discount_amount: '优惠金额',
  actual_deposit: '实际存入',
  back: '返回',
  submit: '提 交',
  to: '至',
  bind: '绑定',
  usdt_address: '虚拟币账户地址',
  usdt_type: '虚拟币种类',
  usdt_protocol: '虚拟币种类',
  usdt_account_status: '虚拟币账户状态',
  center_money_rest: '中心钱包余额',
  team_proxy_info: '团队代理概览',
  team_member_info: '团队会员概览',
  team_bet_info: '成员投注信息',
  start_date: '开始日期',
  sub_agent_count: '下级代理人数',
  direct_agent_count: '直属代理人数',
  sub_member_count: '下级会员人数',
  direct_member_count: '直属会员人数',
  first_diposit_count: '首存人数',
  first_diposit_momey: '首存金额',
  month_increase: '本月新增',
  month_active_member: '本月活跃人数',
  month_active_member_effer: '本月有效活跃人数',
  month_discount: '本月优惠',
  month_rebase: '本月返水',
  month_win_pure: '本月净输赢',
  month_win: '本月总输赢',
  month_total_bet: '本月总投注',
  month_bet_effer: '本月总有效投注',
  withdrew_flow_info: '提现流水信息',
  money_change_info: '充提信息',
  bet_info: '投注信息',
  summary_info: '概要信息',
  user_detail: '个人资料',
  unbind_charge_confirm_sentence: `您确定为当前用户解除充值限制吗?`,
  // unbind_charge_confirm_sentence: `您确定为用户【{username}】解除充值限制吗?`,
  username_placeholder: '4-12位,首位字母,最少2个字母+数字组合',
  senior_leader: '所属上级',
  not_yet_bind: '暂未绑定',
  upload_file: '上传附件',
  money_type: '货币类型',
  receive_bank_card: '到账银行卡账号',
  receive_usdt_card: '到账USDT账户',
  pay_third_part: '出款三方',
  protocol_type: '协议类型',
  first_instance: '一审',
  second_instance: '二审',
  dispensing: '出款',
  rule_config: '规则配置',
  first_charge: '首充金额',
  tmeplate: '模板',
  end_date: '结束日期',
  yesterday: '昨天',
  recent_week: '最近一周',
  recent_month: '最近一个月',
  recent_season: '最近三个月',
  draw_lockup: '锁单状态',
  third_party_status: '第三方状态',
  danger_level: '风控层级',
  audit_user_1: '一审人',
  audit_user_2: '二审人',
  audit_user_3: '三审人',
  withdrawal_time: '提款时间',
  last_withdrawal_time: '上次提款时间',
  last_withdrawal_money: '上次提款金额',
  last_withdrawal_cny: '上次提款至本次提款间存款人民币金额',
  last_withdrawal_usdt: '上次提款至本次提款间存款USDT金额',
  last_withdrawal_type: '上次提款方式',
  deposit_and_withdrawal_info: '存取款信息',
  recent_deposit_and_withdrawal_info: '近期存取款信息',
  total_deposit_money: '累计总存款金额',
  total_withdrawal_money: '累计总提款金额',
  total_deposit_time: '累计总存款次数',
  total_withdrawal_time: '累计总提款次数',
  deposit_and_withdrawal_diff: '累计总存提款差额',
  is_first_withdrawal: '是否为首提',
  today_withdrawal_time: '今日提款次数',
  free_withdrawal_time: '免费提款次数',
  today_withdrawal_money: '今日提款总额',
  is_withdrawal_continuous: '是否连续提款',
  withdrawal_device: '提款设备终端',
  withdrawal_domain: '提款绑定域名',
  withdrawal_info: '提款信息',
  withdrawal_audit_info: '账目审核信息',
  this_withdrawal_flow: '本次提款流水',
  this_withdrawal_money: '本次提款流水',
  is_unauth: '是否无需权限',
  page_url: '前端路由地址',
  init_password: '修改密码',
  nickname: '昵称',
  is_super: '是否超管',
  password_old: '旧密码',
  password_new: '新密码',
  request_ip: '请求ip',
  request_param: '请求参数',
  response_msg: '返回参数',
  response_code: '返回码',
  log_type: '日志类型',
  log_time: '日志时间',
  request_method: '请求方式',
  log_clear: '日志清理',
  cache_type: '缓存类型',
  token_key: 'Token密钥',
  token_exp: 'Token有效时间(小时)',
  captcha_switch: '验证码开关',
  captcha_type: '验证码类型',
  log_switch: '日志记录开关',
  log_save_time: '日志保留时间',
  api_rate_num: '接口请求速率(次数)',
  api_rate_time: '接口请求速率(时间)',
  system_name: '系统简称',
  page_title: '页面标题',
  favicon_url: 'favicon图标',
  login_bg_url: '登录背景图',
  logo_url: 'logo图片',
  email_host: 'SMTP服务器',
  email_port: 'SMTP端口',
  email_secure: 'SMTP协议',
  email_username: '用户名/账号',
  email_password: '授权码/密码',
  email_setfrom: '发件人邮箱',
  email_test: '测试邮箱',
  captcha_login: '登录验证码',
  captcha_register: '注册验证码',
  diy_config: '自定义配置',
  is_open: '是否开启',
  title: '标题',
  announcement_type: '公告类型',
  announcement_time: '公告时间',
  intro: '简介',
  content: '内容',
  start_time: '开始时间',
  end_time: '结束时间',
  title_color: '标题颜色',
  file: '文件',
  file_group: '文件分组',
  group_desc: '分组描述',
  group_name: '分组名称',
  storage: '存储方式',
  accessKey: 'AccessKey',
  secretKey: 'SecretKey',
  bucket: 'Bucket名称',
  bucket_domain: 'Bucket域名',
  domain: '访问域名',
  endpoint: '地域节点',
  region: '所属地域',
  secretId: 'SecretId',
  image: '图片',
  video: '视频',
  audio: '音频',
  word: '文档',
  other_file: '其它文件',
  file_ext: '文件后缀',
  file_size: '文件大小',
  file_ext_pl: '允许上传的文件后缀，多个逗号”,”隔开',
  file_size_pl: '允许上传的文件大小，单位MB',
  file_name: '文件名',
  file_type: '文件类型',
  is_front: '是否前台上传',
  file_id: '文件id',
  proxy_level: '代理层级',
  agent_agreement_label: '上传代理协议',
  address: '地址',
  type: '类型',
  upload_splash_bg: '上传闪屏页背景图',
  upload_splash_content: '上传闪屏页内容图',
  config_type: '字典名称',
  primary_key: 'primaryKey',
  dict_type: '数据类型',
  dictionary: '字典',
  see_details: '查看详情',
  copy: '复制',
  app_type: 'APP类型',
  app_version: 'APP版本号',
  update_type: '更新方式',
  download_url: '下载地址',
  app_explain: '更新说明',
  risk_type: '风控类型',
  risk_level: '风控层级',
  risk_remark: '风控层级描述',
  bet_date: '日期',
  bet_note_number: '注单号',
  bet_username: '用户名',
  bet_betting_time: '投注时间',
  bet_game_name: '游戏名称',
  bet_league: '联赛',
  bet_game: '比赛',
  bet_betting_content: '投注内容',
  bet_state: '状态',
  bet_betting_odds: '下注赔率',
  bet_settlement_odds: '结算赔率',
  bet_amount: '投注金额',
  bet_settlement_time: '结算时间',
  bet_valid_amount: '有效投注金额',
  bet_company_win_lose: '公司输赢',
  task_id: '任务ID',
  task_mission_name: '任务名称',
  task_founder: '创建人',
  task_creation_time: '创建时间',
  task_last_operator: '最近操作人',
  task_last_operator_time: '最近操作时间',
  task_import_users: '导入用户名',
  task: '任务',
  task_allocation_information: '分配信息',
  IP: 'Ip地址',
  ip_local: 'ip归属地',
  ip_login_number: '登录会员数量',
  ip_type: 'Ip类型',
  ip_remark: '备注',
  login_lock: '登录锁定',
  terminal_num: '终端号',
  terminal_remark: '终端备注',
  recover: '恢复',
  banner_name: '轮播图主标题',
  banner_subtitle: '轮播图副标题',
  banner_sub_label: '轮播图标签',
  banner_type: '轮播是否限时',
  target_type: '是否跳转',
  banner_target: '跳转目标',
  terminal_type: '终端类型',
  banner_effective_time: '上下架时间',
  target_content_url: 'URL链接',
  target_content_b: 'B端',
  time: '时间',
  mark_type: '标识类型',
  header_name: '标识名称',
  header_remark: '标识备注',
  img_path_id: '标识图标',
  announcement_title: '公告标题',
  banner_label_title: 'banner标签配置',
  banner_title: 'banner标签',
  time_type: '公告时效',
  up_time: '公告上架时间',
  down_time: '公告下架时间',
  banner_up_time: '轮播图上架时间',
  banner_down_time: '轮播图下架时间',
  send_app: '发送终端',
  letter_header: '站内信标题',
  send_type: '发送类型',
  send_user: '用户账号',
  user_ids: '特定用户',
  user_ids_pl: '多个账号之间用英文 "," 隔开',
  template_name: '模板名称',
  template_describe: '模板描述',
  profitLossTotal: '盈亏总额',
  gameFlow: '游戏流水',
  monthActive: '本月活跃人数',
  monthEActive: '本月有效活跃人数',
  rebateRatio: '返佣比例',
  end_audit: '结单查看',
  export_template: '导入模板',
  per_domain: '前坠域名',
  level_name: '等级名称',
  withdrawals: '单日提款次数',
  withdrawals_limit: '单日提款额度',
  upgrade_conditions: '升级条件',
  total_recharge: '累计充值',
  total_water: '累计流水',
  protect_conditions: '保级条件',
  upgrade: '晋升礼金',
  birthday: '生日礼金',
  ia_rebate: 'IA电竞返水',
  sb_rebate: '沙巴体育返水',
  pb_rebate: '平博体育返水',
  upper_limit: '返水上限',
  min_recharge: '每月单笔最低充值',
  bonus_cap: '奖金上限',
  bonus: '奖金',
  Inverse_ratio: '返现比例',
  multiple: '流水倍数',
  burden: '月负盈利',
  resurrection: '复活比例',
  activity_tab: '活动页签',
  activity_tab_remark: '页签备注',
  birthday1: '出生日期',
  vip_experience: 'VIP经验',
  invite_code: '推广码',
  trans_proxy_info: '转入代理信息',
  remove_limit: '解除充值限制',
  setting_total_agent: '设置总代',
  pay_type_manage: '支付类型管理',
  sms_service_provider: '短信验证码服务商',
  password_repeat: '确认密码',
  status_pay: '充值锁定',
  status_game: '游戏锁定',
  status_login: '登录锁定',
  need_water: '所需流水',
  completed_water: '已完成投注流水',
  remaining_water: '剩余流水',
  total_deposit: '存款总额',
  total_withdrawal: '取款总额',
  count_deposit: '存款次数',
  count_withdrawal: '取款次数',
  total_bet: '总投注',
  total_profit: '玩家输赢',
  activity: '活动',
  rebate: '返水',
  total_c_profit: '公司总输赢',
  login_time1: '登录时间',
  bank_time: '绑定时间',
  user_bank_name: '银行名称',
  card_owner_name: '持卡人',
  user_bank_account: '银行卡号',
  user_bank_address: '分行地址',
  hold_balance: '锁定金额',
  available_balance: '可用金额',
  total_balance: '总金额',
  activity_id: '活动ID',
  event_title: '活动标题',
  event_temp: '活动模板',
  incentive_bonus: '奖励奖金',
  superior_username: '上级用户',
  get_money_time: '领取时间',
  name: '姓名',
  delete: '删除',
  today: '今天',
  receiving_status: '领取状态',
  reward_type: '奖励类型',
  reward_amount: '奖励金额',
  order_generate_time: '订单生成时间',
  anti_water_amount: '返水金额',
  project_name: '返水项目',
  event_time: '活动时效',
  shuffle_rate: '洗码倍率',
  activity_status: '活动状态',
  activity_terminal: '活动支持终端',
  entrance_img: '入口图',
  show_time: '展示时间',
  activity_time: '活动时间',
  activity_label: '活动标签',
  entrance_image_upload: '入口图片上传',
  activity_target_url: '活动详情跳转地址',
  count_id: '返水人数',
  channel_charges_type: '手续费模式',
  is_blockchain: '是否是虚拟币',
  turn_off: '禁用',
  this_name: '本次操作人',
  user_count_total: '满足用户总数',
  last_name: '上次操作人',
  last_visitor: '上次回访人',
  recall_visitor: '回访人',
  recall_status: '回访状态',
  recall_time: '回访时间',
  recall_task_name: '回访任务名称',
  last_visitor_time: '上次回访时间',
  owner_task: '本次任务归属人',
  this_visit_time: '本次回访时间',
  contact_no: '联系方式',
  mark_popular: '标记为热门',
  first_choice: '首选项',
  turn_on: '开启',
  verify_step_1: '一审审核',
  verify_step_2: '二审审核',
  verify_step_3: '出款审核',
  verify_step_4: '处理完成',
  verify_step_6: '三方出款',
  verify_step_status_1: '一审通过',
  verify_step_status_3: '二审通过',
  verify_step_status_5: '出款通过',
  verify_step_status_2: '一审拒绝',
  verify_step_status_4: '二审拒绝',
  verify_step_status_6: '出款拒绝',
  verify_step_status_7: '处理完成',
  verify_remark: '审核信息',
  client_remark: '客户端备注',
  draw_is_manual: '出款方式',
  channel_name1: '出款线路名称',
  other_id: '关联订单号',
  business_type: '业务类型',
  balance_change: '账变',
  pre_balance: '账变前余额',
  last_balance: '账变后余额',
  change_amount: '账变金额',
  change_time: '账变时间',
  operations: '收支类型',
  verify_step_1_1: '一审通过',
  verify_step_2_1: '二审通过',
  verify_step_3_1: '出款通过',
  verify_step_1_2: '一审拒绝',
  verify_step_2_2: '二审拒绝',
  verify_step_3_2: '出款拒绝',
  venue_name: '场馆',
  venue_fee: '场馆费',
  final_profit: '结算盈亏',
  vip_rebase: '会员返水',
  vip_discount: '会员优惠',
  vip_save_fee: '会员存款手续费',
  vip_withdraw_fee: '会员提款手续费',
  save_fee: '存款手续费',
  withdraw_fee: '提款手续费',
  rebase_money: '返佣金额',
  target_content: '跳转内容',
  banner_img: 'banner图片',
  seeAgent: '查看代理协议',
  current_addr: '当前信息',
  venue_rate: '费率',
  venue_type: '场馆类型',
  Safeguard_game: '维护类型',
  safeguard_header: '维护标题',
  safeguard_content: '维护内容',
  safeguard_end_time: '维护结束时间',
  member_name: '会员账号',
  no_safeguard: '暂未维护',
  saving_fill_username: '存款填入姓名',
  change_type: '调整类型',
  ia_money: '小艾金额',
  saba_money: '沙巴金额',
  pinnacle_money: '平博金额',
  xj_money: '小金金额',
  ag_money: 'AG金额',
  trans_proxy: '转入代理',
  vip_info: '会员信息',
  agent_account: '代理账号',
  sub_total_commision: '下级总佣金',
  team_total_commision: '团队总佣金',
  last_month_rest: '上月结余',
  pure_bonus: '冲正净输赢',
  vip_activity_discount: 'vip活动优惠',
  direct_superior: '直属上级',
  active_prople_count: '活跃人数',
  pure_active_prople_count: '有效活跃人数',
  deserved_bonus: '应得收益',
  commision_people: '返佣人数',
  commision_money: '返佣金额',
  total_bet_people: '总投注人数',
  total_bet_count: '总注单量',
  total_bet_maney: '总投注金额',
  total_bet_payment: '总投注盈亏',
  month: '月份',
  IA_sport_profit: '小艾电竞盈亏',
  PB_sport_profit: '平博体育盈亏',
  SB_sport_profit: '沙巴体育盈亏',
  XJ_sport_profit: '小金体育盈亏',
  AG_sport_profit: 'AG真人盈亏',
  IA_sport_bet: '小艾电竞投注',
  PB_sport_bet: '平博投注',
  SB_sport_bet: '沙巴投注',
  XJ_sport_bet: '小金投注',
  AG_sport_bet: 'AG投注',
  IA_rebase: '小艾电竞返水',
  PB_rebase: '平博返水',
  SB_rebase: '沙巴返水',
  bet_compare_change: '投注环比增长/减少',
  IA_bet_profit: '小艾电竞盈亏',
  PB_bet_profit: '平博盈亏',
  SB_bet_profit: '沙巴盈亏',
  XJ_bet_profit: '小金盈亏',
  AG_bet_profit: 'AG盈亏',
  pure_earn: '净盈亏',
  pure_profit: '净盈亏',
  earn_effort_rate: '盈投比',
  rebate_rate: '返水比例',
  pure_earn_effort_rate: '净盈投比',
  proxy_comission: '代理佣金',
  bet_people: '投注人数',
  bet_count: '注单量',
  vip_payment: '会员总输赢',
  activity_bonus: '活动奖金',
  bet_profit: '投注盈亏',
  distribute_type: '发放方式',
  safeguard_close: '解除维护',
  founder_member: '发起人',
  initiation_time: '发起时间',
  initiate_reason: '发起原因',
  banner_label: 'banner标签',
  channel_name2: '渠道名称',
  channel_code2: '渠道编码',
  access_number: '访问人数',
  register_number: '注册人数'
};

export default { table };
