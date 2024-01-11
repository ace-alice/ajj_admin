// 引入 router 实例
import { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';
// 引入store 实例
import { store } from '@/store/index.ts';
import { defineAsyncComponent } from 'vue';
import { i18n } from '@/i18n';
import router from '..';
import { NextLoading } from '@/utils/loading';
import { getSession, getLocal } from '@/utils/storage';
import { menuIcons } from '../config';

import ErrorPage from '@/views/error/404.vue';
import LoadingPage from '@/views/error/401.vue';

export const dynamicRoutes: Array<any> = [
  {
    path: '/',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@/layout/index.vue'),
    meta: {
      isKeepAlive: true
    },
    children: []
  }
];

// 定义404界面
export const pathMatch = {
  path: '/:path(.*)*',
  redirect: '/404'
};

// const title =
//   (store.getters.themeConfig as any).globalTitle || i18n.global.t('title');

// 获取当前网页title
export function getPageTitle(key: string | undefined | unknown): string {
  const title =
    (store.getters.userInit as any).page_title ||
    (store.getters.themeConfig as any).globalTitle ||
    i18n.global.t('title');
  if (!key) {
    return title;
  }
  const hasKey = i18n.global.te(`router.${key}`);
  if (hasKey) {
    const pageName = i18n.global.t(`router.${key}`);
    return `${pageName} - ${title}`;
  }
  return title;
}

export function changeFavicon() {
  var url =
    getLocal('userInit')?.favicon_url ||
    require('@/assets/images/default_company_logo.png');
  if (!url) return;
  var links = document.querySelectorAll("link[rel*='icon']");
  if (links.length > 0) {
    for (const link of links) {
      link.setAttribute('href', url);
    }
  }
}

/**
 * 通过 mate.roles 判断是否有访问该路由的权限
 * @param roles
 * @param route
 */
function hasPermission(roles: any, route: RouteRecordRaw) {
  if (route.meta && route.meta.roles) {
    return roles.some((role: string) =>
      (route.meta as any).roles.includes(role)
    );
  } else {
    return true;
  }
}

// 递归过滤有权限的路由
export function setFilterMenuFun(routes: any) {
  const menu: any = [];
  routes.forEach((route: any) => {
    const item = { ...route };
    if (item.children) item.children = setFilterMenuFun(item.children);
    menu.push(item);
  });
  return menu;
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(
  routes: Array<RouteRecordRaw>,
  roles: string[]
): Array<RouteRecordRaw> {
  const res: RouteRecordRaw[] = [];
  routes.forEach((route: RouteRecordRaw) => {
    if ((route.component as any) == 'layout') {
      // Layout组件特殊处理
      route.component = Layout;
    } else if (route.component) {
      const component: any = route.component;
      route.component = loadView(component);
    }

    const tmp: RouteRecordRaw = { ...route };

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

// 添加动态路由
export function setAddRoute(route: any) {
  setFilterRouteEnd(route).forEach((route: any) => {
    router.addRoute((route as unknown) as RouteRecordRaw);
  });
}

const loadView = (key: string) => {
  const getComponent = defineAsyncComponent({
    // 工厂函数
    loader: () => Promise.resolve().then(() => require(`@/views/${key}`)),
    // loader: () => Promise.resolve().then(() => import(`@/views/${key}`)),
    // 加载异步组件时要使用的组件
    loadingComponent: LoadingPage,
    // 加载失败时要使用的组件
    errorComponent: ErrorPage,
    // 在显示 loadingComponent 之前的延迟 | 默认值：200（单位 ms）
    delay: 200,
    // 如果提供了 timeout ，并且加载组件的时间超过了设定值，将显示错误组件
    // 默认值：Infinity（即永不超时，单位 ms）
    timeout: 3000,
    // 定义组件是否可挂起 | 默认值：true
    suspensible: false
  });
  return getComponent;
  // return (resolve: any) => require([`@/views/${key}.vue`], resolve);
};

// 后端控制路由：模拟执行路由数据初始化
export async function initBackEndControlRoutesFun() {
  return new Promise(async (resolve, inject) => {
    try {
      const token = getLocal('token'); // 获取浏览器缓存 token 值
      if (!token) return false; // 无 token 停止执行下一步

      // 通过getInfo获取角色权限
      // const { id } = await store.dispatch('userInfos/getInfo');

      const asyncRoutes = await getBackEndControlRoutes(); // 获取路由

      store.dispatch('requestOldRoutes/setBackEndControlRoutes', asyncRoutes); // 存原始路由到 vuex 中

      dynamicRoutes[0].children = await backEndRouter(asyncRoutes); // 处理路由（component）

      dynamicRoutes[0].redirect = dynamicRoutes[0].children[0].path;

      router.addRoute(pathMatch); // 添加404界面

      await setAddRoute(dynamicRoutes); // 添加动态路由

      setFilterMenu(dynamicRoutes); // 过滤权限菜单
      setCacheTagsViewRoutes(dynamicRoutes); // 添加 keepAlive 缓存
      setRefreshPagesRestore(); // 防止界面刷新时，出现404、空白、报错等
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  });
}

// 防止界面刷新时，出现404、空白、报错等
export function setRefreshPagesRestore() {
  const { matched, query, path } = router.currentRoute.value;
  if (matched.length <= 0) router.push({ path, query });
}

// 后端控制路由
export async function getBackEndControlRoutes() {
  // 通过buildMenus配置路由
  return new Promise(async (resolve) => {
    const asyncRoutes = await store.dispatch('userInfos/buildMenus');
    // console.log(asyncRoutes);
    resolve(asyncRoutes);
  });
}

// 后端控制路由
export function setBackEndControlRefreshRoutes() {
  // getBackEndControlRoutes();
}

const defualtMeta = {
  isLink: '',
  isHide: false,
  isKeepAlive: true,
  isAffix: false,
  isIframe: false
};

// 后端控制路由，后端路由 component 转换
export function backEndRouter(routes: any, parentPath = '/') {
  if (!routes) return;
  return routes.map((item: any) => {
    item.path = parentPath + item.menu_name;
    item.name = item.menu_name == '/' ? 'home' : item.menu_name;
    if (item.meta) {
      Object.assign(item.meta, defualtMeta, {
        isHide: item.is_disable ? Boolean(item.is_disable) : false,
        isKeepAlive: item.is_cache ? Boolean(item.is_cache) : false,
        icon: menuIcons[item.menu_name] ? menuIcons[item.menu_name] : 'icon'
      });
    } else {
      const extraMeta = {
        isHide: item.is_disable ? Boolean(item.is_disable) : false,
        isKeepAlive: item.is_cache ? Boolean(item.is_cache) : false,
        icon: menuIcons[item.menu_name] ? menuIcons[item.menu_name] : 'icon'
      };
      item.meta = { ...defualtMeta, ...extraMeta };
    }
    if ((item.component as any) == 'layout') {
      // Layout组件特殊处理
      item.component = Layout;
    } else if ((item.component as any) == 'managerLayout') {
      // Layout组件特殊处理
      // route.component = ManagerLayout;
    } else if (item.page_url) {
      const component: any = item.page_url;
      item.component = loadView(component);
    }
    if (item.children && item.children.length > 0) {
      item.redirect = item.path + '/' + item.children[0].menu_name;
      backEndRouter(item.children, item.path + '/');
    }
    return item;
  });
}

// 后端控制路由，后端路由 component 转换函数 (使用vite构建工具的时候使用)
export function dynamicImport(
  // eslint-disable-next-line no-undef
  dynamicViewsModules: __WebpackModuleApi.RequireContext,
  component: string
) {
  if (component == 'layout') return import('@/layout/routerView/parent.vue');
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    return (
      key.startsWith(`../../views/${component}.vue`) ||
      key.endsWith(`../../views/${component}.vue`)
    );
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return (dynamicViewsModules as any)[matchKey].default;
  }
  if (matchKeys?.length > 1) {
    console.warn('Do not create files that do not end with. Vue');
    return false;
  }
}

// 多级嵌套数组处理成一维数组
export function formatFlatteningRoutes(arr: any) {
  if (arr.length <= 0) return false;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].children) {
      arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
    }
  }
  return arr;
}

// 多级嵌套数组处理后的一维数组，再处理成 `定义动态路由` 的格式
// 只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存
// isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
export function formatTwoStageRoutes(arr: any) {
  if (arr.length <= 0) return false;
  const newArr: any = [];
  const cacheList: Array<string> = [];
  arr.forEach((v: any) => {
    if (v.path === '/') {
      newArr.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: []
      });
    } else {
      newArr[0].children.push({ ...v });
      if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
        cacheList.push(v.name);
        store.dispatch('keepAliveNames/setCacheKeepAlive', cacheList);
      }
    }
  });
  return newArr;
}

// 缓存多级嵌套数组处理后的一维数组(tagsView、菜单搜索中使用：未过滤隐藏的(isHide))
export function setCacheTagsViewRoutes(route: any) {
  // 先处理有权限的路由，否则 tagsView、菜单搜索中无权限的路由也将显示
  // let authsRoutes = setFilterMenuFun(dynamicRoutes, store.state.userInfos.userInfos.authPageList);
  // 添加到 vuex setTagsViewRoutes 中
  store.dispatch(
    'tagsViewRoutes/setTagsViewRoutes',
    formatTwoStageRoutes(formatFlatteningRoutes(route))[0].children
  );
}

// 获取当前用户的权限去比对路由表，用于左侧菜单/横向菜单的显示
export function setFilterMenu(dynamicRoutes: any) {
  store.dispatch(
    'routesList/setRoutesList',
    setFilterMenuFun(dynamicRoutes[0].children)
  );
}

// 判断路由 auth 中是否包含当前登录用户权限字段
export function hasAuth(auths: any, route: any) {
  if (route.meta && route.meta.auth) {
    return auths.some((auth: any) => route.meta.auth.includes(auth));
  } else {
    return true;
  }
}

// 获取当前用户的权限去比对路由表，用于动态路由的添加
export function setFilterRoute(chil: any) {
  const filterRoute: any = [];
  chil.forEach((route: any) => {
    if (route.meta.auth) {
      route.meta.auth.forEach((metaAuth: any) => {
        (store.state.userInfos as any).userInfos.authPageList.forEach(
          (auth: any) => {
            if (metaAuth === auth) filterRoute.push({ ...route });
          }
        );
      });
    }
  });
  return filterRoute;
}

// 比对后的路由表，进行重新赋值
export function setFilterRouteEnd(route: any) {
  const filterRouteEnd: any = formatTwoStageRoutes(
    formatFlatteningRoutes(route)
  );
  return filterRouteEnd;
}

// 删除/重置路由
export function resetRoute(route: any) {
  setFilterRouteEnd(route).forEach((route: any) => {
    const { name } = route;
    router.hasRoute(name) && router.removeRoute(name);
  });
}

// 前端控制路由：初始化方法，防止刷新时丢失
export function initAllFun() {
  NextLoading.start(); // 界面 loading 动画开始执行
  const token = getLocal('token'); // 获取浏览器缓存 token 值
  if (!token) {
    return false;
  } // 无 token 停止执行下一步
  store.dispatch('userInfos/setUserInfos'); // 触发初始化用户信息
  router.addRoute(pathMatch); // 添加404界面
  resetRoute(dynamicRoutes); // 删除/重置路由
  setAddRoute(dynamicRoutes); // 添加动态路由
  setFilterMenu(dynamicRoutes); // 过滤权限菜单
  setCacheTagsViewRoutes(dynamicRoutes); // 添加 keepAlive 缓存
}
