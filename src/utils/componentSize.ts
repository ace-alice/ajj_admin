import { getLocal } from '@/utils/storage';

import { store } from '@/store';

if (getLocal('themeConfig')) {
  store.dispatch('themeConfig/setThemeConfig', getLocal('themeConfig'));
}

// 全局组件大小
export const globalComponentSize = getLocal('themeConfig')?.globalComponentSize
  ? getLocal('themeConfig')?.globalComponentSize
  : 'small';
