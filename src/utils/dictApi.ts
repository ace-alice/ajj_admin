import { getDictFun } from '@/api/Global/utilApi';
/**
 * 获取数据字典的对象处理成数组
 * @param {String} key
 * @returns {Array}
 */
export function getDicts(primary_key: string): any {
  return new Promise(async (resolve) => {
    getDictFun({ primary_key })
      .then((result: any) => {
        if (result.code == 1) {
          resolve(result.data.data);
        } else {
          resolve([]);
        }
      })
      .catch(() => {
        resolve([]);
      });
  });
}
