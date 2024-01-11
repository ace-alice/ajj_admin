import { ref, onMounted } from 'vue';
import { list } from '@/api/account-config/recharge-type-config';
export function getRechargeTypeListHook() {
  const rechargeTypeList = ref([]);

  function getRechargeTypeFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        rechargeTypeList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getRechargeTypeFun({ currency_id: '1' });
  });
  return { rechargeTypeList, getRechargeTypeFun };
}
