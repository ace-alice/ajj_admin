import { ref, onMounted } from 'vue';
import { getType } from '@/api/account-config/manual-recharge-withdraw';
export function getCashManualTypeListHook(initData = {}) {
  const cashManualTypeList = ref([]);

  function getCashManualTypeListFun(data: { [key: string]: any } = {}) {
    getType(Object.assign({}, initData, data)).then((result: any) => {
      if (result.code == 1) {
        cashManualTypeList.value = result.data;
      }
    });
  }

  onMounted(() => {
    getCashManualTypeListFun(initData);
  });

  return { getCashManualTypeListFun, cashManualTypeList };
}
