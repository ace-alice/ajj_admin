<template>
  <el-dropdown
    :show-timeout="70"
    :hide-timeout="50"
    trigger="click"
    @command="onLanguageChange"
  >
    <div class="layout-navbars-breadcrumb-user-icon">
      <i
        class="iconfont"
        :class="
          disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'
        "
        :title="$t('user.title1')"
      ></i>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh-CN" :disabled="disabledI18n === 'zh-CN'"
          >简体中文</el-dropdown-item
        >
        <el-dropdown-item command="en-US" :disabled="disabledI18n === 'en-US'"
          >English</el-dropdown-item
        >
        <!-- <el-dropdown-item command="vi-VN" :disabled="disabledI18n === 'vi-VN'"
          >越南语</el-dropdown-item
        >
        <el-dropdown-item command="th-TH" :disabled="disabledI18n === 'th-TH'"
          >泰语</el-dropdown-item
        >
        <el-dropdown-item command="in-ID" :disabled="disabledI18n === 'in-ID'"
          >印尼语</el-dropdown-item
        > -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import {
  getCurrentInstance,
  defineComponent,
  reactive,
  toRefs,
  computed,
  onMounted
} from 'vue';
import { useStore } from '@/store/index';
import { useI18n } from 'vue-i18n';
import { getLocal, removeLocal, setLocal } from '@/utils/storage';
export default defineComponent({
  name: 'LangSelect',
  components: {},
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance() as any;
    const store = useStore();
    const i18n = useI18n();
    const opt = reactive({
      options: [
        {
          id: 1,
          languageCode: 'zh-CN',
          languageName: '简体中文',
          currencyCode: 'RMB',
          currencyName: '人民币',
          currencyMark: '¥'
        },
        {
          id: 2,
          languageCode: 'en-US',
          languageName: '英文',
          currencyCode: 'USD',
          currencyName: '美元',
          currencyMark: '$'
        }
        // {
        //   id: 3,
        //   languageCode: 'vi-VN',
        //   languageName: '越南语',
        //   currencyCode: 'VND',
        //   currencyName: '越南盾',
        //   currencyMark: '₫'
        // },
        // {
        //   id: 4,
        //   languageCode: 'th-TH',
        //   languageName: '泰文',
        //   currencyCode: 'THP',
        //   currencyName: '泰铢',
        //   currencyMark: '฿'
        // },
        // {
        //   id: 5,
        //   languageCode: 'in-ID',
        //   languageName: '印尼语',
        //   currencyCode: 'IDR',
        //   currencyName: '印尼盾',
        //   currencyMark: 'Rp'
        // }
      ],
      lang: 'zh-CN'
    });
    // 获取默认语言标识
    onMounted(() => {
      if (getLocal('themeConfig')) {
        proxy.$i18n.locale = getLocal('themeConfig').globalI18n;
        state.disabledI18n = getLocal('themeConfig').globalI18n;
        opt.lang = getLocal('themeConfig').globalI18n;
        initI18n();
      }
    });

    const state = reactive({
      disabledI18n: 'zh-CN'
    });

    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });

    // 语言切换
    const onLanguageChange = (lang: string) => {
      removeLocal('themeConfig');
      getThemeConfig.value.globalI18n = lang;
      setLocal('themeConfig', getThemeConfig.value);
      proxy.$i18n.locale = lang;
      proxy.mittBus.emit('changeLang', lang);
      initI18n();
    };
    // 初始化言语国际化
    const initI18n = () => {
      switch (getLocal('themeConfig').globalI18n) {
        case 'zh-CN':
          state.disabledI18n = 'zh-CN';
          break;
        case 'en-US':
          state.disabledI18n = 'en-US';
          break;
        case 'vi-VN':
          state.disabledI18n = 'vi-VN';
          break;
        case 'th-TH':
          state.disabledI18n = 'th-TH';
          break;
        case 'in-ID':
          state.disabledI18n = 'in-ID';
          break;
      }
    };
    return { ...toRefs(opt), onLanguageChange, ...toRefs(state) };
  }
});
</script>
<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: white;
  font-size: 18px;
}
</style>
