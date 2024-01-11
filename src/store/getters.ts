import { GetterTree } from 'vuex';
import { RootStateTypes } from './interface';

const getters: GetterTree<any, any> = {
  roles: (state: RootStateTypes) => state.userInfos.roles,
  themeConfig: (state: RootStateTypes) => state.themeConfig.themeConfig,
  user: (state: RootStateTypes) => state.userInfos.user,
  userInit: (state: RootStateTypes) => state.userInfos.userInit
};
export default getters;
