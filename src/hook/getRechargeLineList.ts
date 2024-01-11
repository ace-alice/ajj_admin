import { ref, onMounted } from 'vue';
import { list } from '@/api/account-config/recharge-line-config';
export function getRechargeLineListHook(init: { [key: string]: any } = {}) {
  const rechargeLineList = ref([]);

  function getRechargeLineFun(data: { [key: string]: any } = init) {
    list(
      Object.assign({ page: 1, limit: 10000 }, Object.assign(init, data))
    ).then((result: any) => {
      if (result.code == 1) {
        rechargeLineList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getRechargeLineFun();
  });

  return { rechargeLineList, getRechargeLineFun };
}
