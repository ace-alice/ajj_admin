import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
export function dictionary() {
  const i18n = useI18n();

  function getAvatarImg(value: number) {
    return require(`@/assets/avatar/id_${value}.webp`);
  }

  //头像列表
  const avatarList = ref([
    { id: 1, url: getAvatarImg(1) },
    { id: 2, url: getAvatarImg(2) },
    { id: 3, url: getAvatarImg(3) },
    { id: 4, url: getAvatarImg(4) },
    { id: 5, url: getAvatarImg(5) },
    { id: 6, url: getAvatarImg(6) },
    { id: 7, url: getAvatarImg(7) },
    { id: 8, url: getAvatarImg(8) },
    { id: 9, url: getAvatarImg(9) }
  ]);

  //根据是否使用值获取label
  function getLabel(
    val: number | string,
    options: Array<any>,
    keyL: string = 'value',
    nKey: string = 'label'
  ) {
    let resultArr = options.filter((status: any) => {
      const value =
        status[keyL] || status.value || status.code || status.id || 0;
      return value == val;
    });
    if (resultArr.length > 0) {
      const result =
        resultArr[0][nKey] ||
        resultArr[0].code ||
        resultArr[0].value ||
        resultArr[0].id;
      return result;
    } else {
      return '--';
    }
  }

  //是否
  const isNot = ref([
    { label: i18n.t('lib.yes'), value: 1 },
    { label: i18n.t('lib.no'), value: 0 }
  ]);

  //订单来源
  const orderSource = ref([
    { label: 'PC', code: 1 },
    { label: 'H5', code: 2 },
    { label: 'APP', code: 3 }
  ]);
  //充值方式
  const channelGetwayList = ref([
    { value: 0, label: i18n.t('lib.Three_party_recharge') },
    { value: 1, label: i18n.t('lib.three_way_jump') },
    { value: 2, label: i18n.t('lib.Internal_account_recharge') }
  ]);

  //账号类型
  const accountTypeList = ref([
    { value: 0, label: i18n.t('lib.member') },
    { value: 2, label: i18n.t('lib.rootProxy') }
  ]);

  //联系方式
  const loginTypeList = ref([
    { value: 1, label: i18n.t('lib.phone') },
    { value: 2, label: i18n.t('lib.email') }
  ]);

  //币种
  const currencyOptions = [
    { value: 1, label: 'CNY' },
    { value: 2, label: 'USDT' }
  ];

  // 状态
  const statusOptions = ref([
    { value: 0, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('lib.on') },
    { value: 2, label: i18n.t('lib.off') }
  ]);

  //根据状态值获取状态名
  function getStatusLabel(status: number | string) {
    let idx = Number(status);
    if (idx && idx < 3 && idx > 0) {
      return statusOptions.value[idx].label;
    } else {
      return '--';
    }
  }

  // 是否禁用
  const isDisableOptions = ref([
    { value: -1, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('lib.off') },
    { value: 0, label: i18n.t('lib.on') }
  ]);

  // 是否使用
  const isUseOptions = ref([
    { value: 0, label: i18n.t('lib.not_used') },
    { value: 1, label: i18n.t('lib.used') }
  ]);

  //审核状态
  const auditStatusOptions = ref([
    { value: 1, label: i18n.t('lib.awaiting_audit') },
    { value: 2, label: i18n.t('lib.audit_passed') },
    { value: 3, label: i18n.t('lib.audit_reject') }
  ]);

  //是否鎖定
  const isLockOptions = ref([
    { value: 1, label: i18n.t('lib.not_lock') },
    { value: 2, label: i18n.t('lib.is_lock') }
  ]);

  //订单后台状态
  const orderStatusSystemOptions = ref([
    { value: 0, label: i18n.t('lib.awaiting_handle') },
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.fail') },
    { value: 3, label: i18n.t('lib.expired') }
  ]);

  //订单后台状态
  const orderStatusClientOptions = ref([
    { value: 0, label: i18n.t('lib.awaiting_handle') },
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.expired') }
  ]);

  //出款审核未完成状态
  const pendingUndoneOptions = ref([
    { value: 1, label: i18n.t('lib.audit_1') },
    { value: 2, label: i18n.t('lib.audit_2') },
    { value: 3, label: i18n.t('lib.audit_3') }
  ]);

  //出款审核未完成状态
  const pendingDoneOptions = ref([
    { value: 4, label: i18n.t('lib.audit_4') },
    { value: 5, label: i18n.t('lib.audit_5') },
    { value: 6, label: i18n.t('lib.audit_6') },
    { value: 6, label: i18n.t('lib.audit_7') }
  ]);

  // 出款第三方状态
  const thirdPartyStatusOptions = ref([
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.fail') },
    { value: 3, label: i18n.t('lib.time_out') },
    { value: 4, label: i18n.t('lib.getting') }
  ]);

  // 风控类型
  const riskTypeOptions = ref([
    { value: 1, label: i18n.t('lib.risky_user') },
    { value: 2, label: i18n.t('lib.risky_bank') },
    { value: 3, label: i18n.t('lib.risky_usdt') },
    { value: 4, label: i18n.t('lib.risky_ip') },
    { value: 5, label: i18n.t('lib.risky_device_code') }
  ]);

  // 是否需要
  const isNeedOptions = ref([
    { value: -1, label: i18n.t('lib.all') },
    { value: 0, label: i18n.t('lib.is_no') },
    { value: 1, label: i18n.t('lib.is_yes') }
  ]);

  // 日志类型
  const logTypeOptions = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') },
    { value: 3, label: i18n.t('lib.exit') }
  ]);

  //验证码类型
  const captchaTypeOptions = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') }
  ]);

  //公告类型
  const announcementType = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') }
  ]);

  //存储方式
  const storageTypeOptions = ref([
    { value: 'local', label: i18n.t('lib.local') },
    { value: 'qiniu', label: i18n.t('lib.qiniu') },
    { value: 'aliyun', label: i18n.t('lib.aliyun') },
    { value: 'tencent', label: i18n.t('lib.tencent') }
  ]);

  // app类型
  const appTypeOptions = ref([
    { value: 1, label: i18n.t('lib.android') },
    { value: 2, label: i18n.t('lib.ios') }
  ]);

  // app更新方式
  const appUpdateTypeOptions = ref([
    { value: 1, label: i18n.t('lib.not_upgrade') },
    { value: 2, label: i18n.t('lib.recommend_upgrade') },
    { value: 3, label: i18n.t('lib.forcibly_upgrade') }
  ]);

  return {
    orderSource,
    channelGetwayList,
    accountTypeList,
    loginTypeList,
    isNot,
    statusOptions,
    getStatusLabel,
    currencyOptions,
    isUseOptions,
    getLabel,
    auditStatusOptions,
    isLockOptions,
    orderStatusSystemOptions,
    orderStatusClientOptions,
    pendingUndoneOptions,
    pendingDoneOptions,
    thirdPartyStatusOptions,
    riskTypeOptions,
    isNeedOptions,
    isDisableOptions,
    getAvatarImg,
    avatarList,
    logTypeOptions,
    captchaTypeOptions,
    announcementType,
    storageTypeOptions,
    appTypeOptions,
    appUpdateTypeOptions
  };
}
