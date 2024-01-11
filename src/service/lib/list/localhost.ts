import { ConfigType, InternalName } from '@/service/interface';

const config: { [key: string]: ConfigType<InternalName> } = {
  'localhost:8088': {
    api: 'http://192.168.1.233',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  },
  '192.168.1.123:8088': {
    api: 'http://192.168.1.233',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  },
  '127.0.0.1:8088': {
    api: 'http://54.255.203.94',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  },
  '192.168.1.218:8088': {
    api: 'http://3.39.230.38',
    title: {
      'en-US': 'IA E-Sport',
      'zh-CN': 'IA E-Sport',
      'in-ID': 'IA E-Sport',
      'th-TH': 'IA E-Sport',
      'vi-VN': 'IA E-Sport'
    }
  },
  '192.168.1.172:8088': {
    api: 'http://54.255.203.94',
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
