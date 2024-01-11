import { createI18n } from 'vue-i18n';
// 简体中文
import zhcnLocale from 'element-plus/es/locale/lang/zh-cn';
// 英文
import enLocale from 'element-plus/es/locale/lang/en';
// 泰语
import thLocale from 'element-plus/lib/locale/lang/th';
// 印尼语
import idLocale from 'element-plus/lib/locale/lang/id';
// 越南语
import viLocale from 'element-plus/lib/locale/lang/vi';

import nextZhcn from '@/i18n/lang/zh.ts';
import nextEn from '@/i18n/lang/en.ts';
import nextVi from '@/i18n/lang/vi.ts';
import nextTh from '@/i18n/lang/th.ts';
import nextId from '@/i18n/lang/id.ts';

// 通过 vite方法 import.meta.globEager批量导入 满足条件的文件
const enFiles = {};
const enctx = require.context('./pages', true, /en\.ts$/);
for (const key of enctx.keys()) {
  Object.assign(enFiles, enctx(key).default);
}

const zhFiles = {};
const zhctx = require.context('./pages', true, /zh\.ts$/);
for (const key of zhctx.keys()) {
  Object.assign(zhFiles, zhctx(key).default);
}

const idFiles = {};
const idctx = require.context('./pages', true, /id\.ts$/);
for (const key of idctx.keys()) {
  Object.assign(idFiles, idctx(key).default);
}

const thFiles = {};
const thctx = require.context('./pages', true, /th\.ts$/);
for (const key of thctx.keys()) {
  Object.assign(thFiles, thctx(key).default);
}

const viFiles = {};
const victx = require.context('./pages', true, /vi\.ts$/);
for (const key of victx.keys()) {
  Object.assign(viFiles, victx(key).default);
}

// 定义语言国际化内容
/**
 * 说明：
 * /src/i18n/lang 下的 ts 为框架的国际化内容
 * /src/i18n/pages 下的 ts 为各界面的国际化内容
 */
const messages = {
  'zh-CN': {
    el: zhcnLocale.el,
    ...nextZhcn,
    ...zhFiles
  },
  'en-US': {
    el: enLocale.el,
    ...nextEn,
    ...enFiles
  },
  'th-TH': {
    el: thLocale.el,
    ...nextTh,
    ...thFiles
  },
  'in-ID': {
    el: idLocale.el,
    ...nextId,
    ...idFiles
  },
  'vi-VN': {
    el: viLocale.el,
    ...nextVi,
    ...viFiles
  }
};

// 导出语言国际化
export const i18n = createI18n({
  locale: 'zh-CN',
  fallbackLocale: zhcnLocale.name,
  messages
});

export const locale = zhcnLocale;
