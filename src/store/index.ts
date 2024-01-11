import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { RootStateTypes } from './interface';
import { InjectionKey } from 'vue';
import keepAliveNames from './modules/keepAliveNames';
import requestOldRoutes from './modules/requestOldRoutes';
import routesList from './modules/routesList';
import tagsViewRoutes from './modules/tagsViewRoutes';
import themeConfig from './modules/themeConfig';
import userInfos from './modules/userInfos';
import globalApiConfig from './modules/globalApiConfig';
import getters from './getters';

export const key: InjectionKey<Store<RootStateTypes>> = Symbol();

export const store = createStore({
  modules: {
    themeConfig,
    routesList,
    keepAliveNames,
    tagsViewRoutes,
    userInfos,
    requestOldRoutes,
    globalApiConfig
  },
  getters
});

export function useStore() {
  return baseUseStore(key);
}
