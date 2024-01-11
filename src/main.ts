import { createApp } from 'vue';
import App from './App.vue';
import { registerServiceWorker } from './registerServiceWorker';
import router from './router';
import { store, key } from './store';
import { i18n, locale } from '@/i18n';

import { emptyData } from '@/utils/valueDealWith';
import { parseTime } from './utils/formatTime';

// 引入项目Api配置获取方法（返回项目全局Api配置）
import { getApiSetting } from '@/service';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 导入事件管理者'passive'添加被动事件监听器来阻止'touchstart'事件
import 'default-passive-events';

// 引入全局样式
import '@/theme/index.scss';

// 引入animate动画库
import 'animate.css/animate.min.css';

import mitt from 'mitt';

// 引入全局GEETEST极验验证码
import '@/utils/gt.js';

// 引入svg模块
import './icons';

// svg-icon 组件
import SvgIcon from '@/components/SvgIcon/index.vue'; // svg component

// web端自定义截屏插件(Vue3版) 本插件仅支持Vue3,如需在其他平台使用请移步 ：js-web-screen-shot
// import screenShort from 'vue-web-screen-shot';

// vue-grid-layout是一款Vue.js布局组件，用于创建可拖动和可调整大小的网格布局
import VueGridLayout from 'vue-grid-layout';

// 引入全局路由守卫
import '@/guard';

/** 自定义指令：全局注册自定义指令 */
import directives from './directives';

// 引入 datav 框架
// import dataV from '@jiaminghi/data-view';

const theApp = createApp(App);

import * as iconList from '@element-plus/icons-vue';

function render() {
  registerServiceWorker();
  // 全局注册组件
  theApp.component('SvgIcon', SvgIcon);

  theApp.config.globalProperties.$iconMap = {};

  Object.keys(iconList).forEach((key) => {
    theApp.component(key, (iconList as any)[key]);
    theApp.config.globalProperties.$iconMap[key] = (iconList as any)[key];
  });

  // 全局注册指令
  Object.keys(directives).forEach((directive) => {
    theApp.directive(directive, (directives as any)[directive]);
  });

  theApp
    // .use(dataV)
    .use(router)
    .use(store, key)
    .use(ElementPlus, {
      i18n: i18n.global.t,
      locale
    })
    .use(i18n)
    // .use(screenShort, { enableWebRtc: false })
    .use(VueGridLayout)
    .mount('#app');
  theApp.config.globalProperties.mittBus = mitt();
  theApp.config.globalProperties.$emptyData = emptyData;
  theApp.config.globalProperties.$parseTime = parseTime;
}

// import { ConfigType, InternalName } from './service/interface';

// getApiSetting().then((data: ConfigType<InternalName>) => {
//   console.log(
//     `%c host=${window.location.host} baseApi=${data.api}`,
//     'color:yellow;font-size:18px'
//   );
//   render();
// });

render();
