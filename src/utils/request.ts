import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { clearLocal, clearSession, getLocal, getSession, removeLocal, removeSession } from '@/utils/storage';
import router from '@/router/index';

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: window.location.origin + '/api',
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' }
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么 token
    if (getLocal('token')) {
      config.headers['AdminToken'] = getLocal('token');
    }
    if (getSession('language')) {
      config.headers.common['country'] = getSession('language') || '';
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const code = response.status;
    if (code < 200 || code > 300) {
      ElMessage({
        message: '一个错误',
        type: 'error',
        duration: 3000
      });
      return Promise.reject('error');
    } else if ([602, 603, 604, 605].includes(parseInt(response.data.code))) {
      ElMessage({
        message: response.data.msg || response.data.message,
        type: 'error',
        duration: 3000
      });
      setTimeout(() => {
        clearLocal();
        clearSession();
        router.push({ path: '/login' });
        location.reload();
      }, 1000);
      return Promise.reject('error');
    } else if (parseInt(response.data.code) != 1) {
      ElMessage({
        message: response.data.msg || response.data.message,
        type: 'error',
        duration: 3000
      });
      return Promise.reject('error');
    } else {
      return response.data;
    }
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      let code = 0;

      try {
        code = error.response.data.code;
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          ElMessage({
            message: '网络超时',
            type: 'error',
            duration: 3000
          });
          return Promise.reject(error);
        }
      }
      if (code) {
        if (code === 401) {
          ElMessageBox.confirm('请求超时', '状态', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            removeLocal('token');
            router.push({ path: '/login' });
          });
        } else if (code === 403) {
          router.push({ path: '/401' });
        } else {
          const errorMsg =
            error.response.data.msg || error.response.data.message;
          if (errorMsg !== undefined) {
            ElMessage({
              message: errorMsg || error,
              type: 'warning',
              duration: 3000
            });
          }
        }
      } else {
        ElMessage({
          message: '网络错误',
          type: 'error',
          duration: 3000
        });
      }
    } else {
      clearLocal();
      clearSession();
      router.push({ path: '/login' });
      location.reload();
      ElMessage({
        message: '网络错误',
        type: 'error',
        duration: 3000
      });
    }

    return Promise.reject(error);
  }
);

export default service;
