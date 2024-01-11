import { Module } from 'vuex';
// 此处加上 `.ts` 后缀报错，具体原因不详
import { GlobalApiConfigState, RootStateTypes } from '../interface';
import { ConfigType, InternalName } from '@/service/interface';
import { setLocal } from '@/utils/storage';

const globalApiConfigModule: Module<GlobalApiConfigState, RootStateTypes> = {
  namespaced: true,
  state: {
    apiConfig: {}
  },
  mutations: {
    // 设置路由，菜单中使用到
    getApiConfig(state: any, data: ConfigType<InternalName>) {
      state.apiConfig = data;
    }
  },
  actions: {
    // 设置路由，菜单中使用到
    async setApiConfig({ commit }, data: ConfigType<InternalName>) {
      commit('getApiConfig', data);
      setLocal('baseApi', data.api);
    }
  }
};

export default globalApiConfigModule;
