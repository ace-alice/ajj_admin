import { Module } from 'vuex';

import {
  getSession,
  setSession,
  removeSession,
  getLocal,
  setLocal,
  removeLocal
} from '@/utils/storage';

import {
  UserInfosState,
  RootStateTypes,
  UserInitType
} from '@/store/interface';

import { userInfosApi } from '@/api/Global/userInfos';

import { filterRouteForId } from '@/utils/menuDoWidth';
import { changeFavicon } from '@/router/utils';

const defaultInit: UserInitType = {
  system_name: 'IA E-SPORTS',
  page_title: 'IA E-SPORTS',
  logo_url: require('@/assets/images/default_company_logo.png'),
  favicon_url: require('@/assets/images/default_company_logo.png'),
  login_bg_url: require('@/assets/images/bg.webp'),
  captcha_switch: true,
  captcha_id: '',
  captcha_src: ''
};

const userInfosModule: Module<UserInfosState, RootStateTypes> = {
  namespaced: true,
  state: {
    token: getLocal('token') || '',
    user: {},
    roles: [],
    // 第一次加载菜单时用到
    loadMenus: false,
    userInit: getLocal('userInit') || defaultInit
  },
  mutations: {
    // 设置token
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    // 设置用户信息
    SET_USER: (state, user) => {
      setSession('adminName', user.username);
      state.user = user;
      setSession('user', user);
    },
    // 设置权限
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    // 设置第一次加载菜单标识
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus;
    },
    SET_USER_INIT: (state, info) => {
      Object.assign(state.userInit, info);
      setLocal('userInit', state.userInit);
      changeFavicon();
    }
  },
  actions: {
    // 用户登录
    login({ commit }, userInfo) {
      return new Promise<boolean>(async (resolve, reject) => {
        const userInfosApis = (await userInfosApi()) as any;
        userInfosApis
          .loginApi(userInfo)
          .then((response: { data: any; code: number }) => {
            if (response.code == 1) {
              const { data } = response;
              commit('SET_TOKEN', data.adminToken);
              setLocal('token', data.adminToken);
              // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
              commit('SET_LOAD_MENUS', true);
              setSession('adminId', data.adminUserId);
              // commit('SET_USER', data);
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    getInit({ commit }) {
      return new Promise(async (resolve, reject) => {
        const userInfosApis = (await userInfosApi()) as any;
        userInfosApis
          .getInitApi()
          .then((response: { data: any }) => {
            console.log(response);
            const { data } = response;
            if (!data) {
              reject('Verification failed, please Login again.');
            }

            commit('SET_USER_INIT', data);

            resolve(data);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },

    // 获取菜单
    buildMenus({ commit, state }) {
      return new Promise(async (resolve, reject) => {
        const userInfosApis = (await userInfosApi()) as any;
        userInfosApis
          .buildMenusApi()
          .then((response: { data: any }) => {
            let { data } = response;
            let menuRoutes: any[] = [];
            if (!data) {
              data = [];
              // reject('get user buildMenus failed, please Login again.')
            } else {
              commit('SET_ROLES', data.btn_url);
              commit('SET_USER', data);
              const routeLevel1 = data.page_url
                .filter((route: any) => {
                  return (
                    !route.is_btn && !route.menu_pid && route.page_url
                    // && route.admin_menu_id == 1
                  );
                })
                .sort((a: any, b: any) => {
                  return Number(a.menu_sort) - Number(b.menu_sort);
                });
              routeLevel1.forEach((route: any) => {
                const routes = filterRouteForId(
                  2,
                  route.admin_menu_id,
                  data.page_url
                );
                if (routes.length > 0) {
                  route.children = routes;
                }
                menuRoutes.push(route);
              });
            }
            resolve(menuRoutes);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },

    // 用户登出
    logout({ commit, state, dispatch }) {
      return new Promise<void>(async (resolve, reject) => {
        const userInfosApis = (await userInfosApi()) as any;
        userInfosApis
          .logoutApi()
          .then(() => {
            commit('SET_TOKEN', '');
            commit('SET_ROLES', []);

            removeLocal('token');

            // dispatch('tagsView/delAllViews', null, { root: true });
            location.reload();
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },

    // 更新菜单加载标识
    updateLoadMenus({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false);
      });
    }
  }
};

export default userInfosModule;
