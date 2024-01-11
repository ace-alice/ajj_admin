import request from '@/utils/request';

export function userInfosApi() {
  return new Promise((resolve) => {
    const loginApi = (data: any) => {
      return request({
        url: '/admin/home.Login/login',
        method: 'post',
        data
      });
    };
    const getInitApi = () => {
      return request({
        url: '/admin/home.Login/setting',
        method: 'get'
      });
    };
    const buildMenusApi = () => {
      return request({
        url: '/admin/home.UserCenter/info',
        method: 'get'
      });
    };
    const logoutApi = () => {
      return request({
        url: '/admin/home.Login/logout',
        method: 'get'
      });
    };

    resolve({
      loginApi,
      getInitApi,
      buildMenusApi,
      logoutApi
    });
  });
}
