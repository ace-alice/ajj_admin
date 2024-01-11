import { ref, onMounted } from 'vue';
import { moneyType } from '@/api/account-config/account-change';
export function getCashChangeTypeListHook(initData = {}) {
  const moneyChangeTypeList = ref([]);

  function getCashChangeTypeListFun(data: { [key: string]: any } = {}) {
    moneyType(Object.assign({}, initData, data)).then((result: any) => {
      if (result.code == 1) {
        moneyChangeTypeList.value = result.data;
      }
    });
  }

  onMounted(() => {
    getCashChangeTypeListFun(initData);
  });

  return { getCashChangeTypeListFun, moneyChangeTypeList };
}
