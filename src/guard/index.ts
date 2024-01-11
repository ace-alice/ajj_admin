// 引入 router 实例
import router from '@/router';
// 引入store实例
import { store } from '@/store/index.ts';
// 引入进度条插件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 引入全屏加载Loading页面
import { NextLoading } from '@/utils/loading.ts';
// 引入临时缓存 获取、清除 方法
import { getSession, clearSession } from '@/utils/storage.ts';
// 引入路由工具
import { getPageTitle, initBackEndControlRoutesFun } from '@/router/utils';
import { getLocal } from '@/utils/storage';
// import { i18n } from '@/i18n';

// 关闭进度条调节面板
NProgress.configure({ showSpinner: false });

// token白名单。无token也可访问的页面
const whiteList: Array<string> = ['/login', '/auth-redirect'];

router.beforeEach(async (to, from, next) => {
  if (to.name) NProgress.start();
  // 设置页面title
  document.title = getPageTitle(to.name);

  const token = !!getLocal('token');

  if (to.path === '/login' && !token) {
    next();
    NProgress.done();
  } else {
    if (!token) {
      // 如果没有token(没有登录或者未登录成功)
      // 判断路由是否在白名单
      if (whiteList.includes(to.path)) {
        next();
      } else {
        // 如果不在白名单，说明访问需要token 重定向到登录页面
        next({ path: `/login?redirect=${to.path}` });
        clearSession();
        NProgress.done();
      }
    } else if (token && to.path === '/login') {
      next('/');
      NProgress.done();
    } else {
      if (store.state.routesList.routesList.length > 0) {
        next();
      } else {
        NextLoading.start();

        const result = await initBackEndControlRoutesFun();

        if (result) {
          console.log(to.path);
          next({
            path: ['/home'].includes(to.path)
              ? (store.state.routesList.routesList[0] as any).path
              : to.path,
            replace: true
          });
        } else {
          throw new Error('路由加载失败');
        }
      }
    }
  }
});

// 路由加载后
router.afterEach(() => {
  NProgress.done();
  NextLoading.done();
});
