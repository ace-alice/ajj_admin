import { ConfigType, InternalName } from './../interface/index';
import localhost from './list/localhost';
import test from './list/test';
import { ElMessage } from 'element-plus';

const configAll = {
  ...localhost,
  ...test
};

export function filterApiList(host: string): ConfigType<InternalName> {
  const configKeys = Object.keys(configAll);
  if (configKeys.includes(host)) return configAll[host];
  ElMessage({
    type: 'error',
    message: '获取Api配置失败,建议您刷新浏览器重试！'
  });
  return {} as any;
}
