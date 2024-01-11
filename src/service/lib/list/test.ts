import { ConfigType, InternalName } from '@/service/interface';

const config: { [key: string]: ConfigType<InternalName> } = {
  '3.39.230.38:82': {
    api: 'http://3.39.230.38',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  },
  '3.39.230.38': {
    api: 'http://3.39.230.38',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  }
};

export default config;
