import { ConfigType, InternalName } from './interface/index';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { store } from '@/store';

const host = window.location.host;

const isProd = ['prod', 'production'].includes(process.env.NODE_ENV as any);

console.log(process.env.NODE_ENV);

import { filterApiList } from './lib';

function isTrueApiConfig(data: any) {
  const isTrueType = data instanceof Object;
  const requiredKeys = ['api', 'title'];
  if (isTrueType) {
    const configKeys = Object.keys(data);
    const isAllConfig = requiredKeys.every((key) => {
      return configKeys.includes(key);
    });
    if (isAllConfig) return true;
    ElMessage({ type: 'error', message: '不是正确的api配置' });
    return false;
  } else {
    ElMessage({ type: 'error', message: '不是正确的api配置' });
    return false;
  }
}

// export function getApiSetting() {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(
//         `${process.env.VUE_APP_GET_API_URL}/api-auth/api/open/user-server/oauth/get_folder.json`
//       )
//       .then((res: any) => {
//         if (res.data.code == 1) {
//           let apiConfig = res.data.data;
//           if (apiConfig && isTrueApiConfig(apiConfig)) {
//             console.log(apiConfig);
//             console.log("获取api配置成功");
//             resolve("这是获取成功的标识");
//           } else {
//             reject("获取api配置失败");
//           }
//         } else {
//           reject("获取Api配置失败");
//         }
//       });
//   });
// }

export function getApiSetting(): Promise<ConfigType<InternalName>> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const apiConfig = filterApiList(host);
      if (apiConfig && isTrueApiConfig(apiConfig)) {
        // 将apiconfig放入vuex中
        store.dispatch('globalApiConfig/setApiConfig', apiConfig);
        resolve(apiConfig);
      } else {
        reject('获取api配置失败');
      }
    }, 1000);
  });
}
