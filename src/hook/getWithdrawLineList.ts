import { ref, onMounted } from 'vue';
import { getChannel } from '@/api/account-config/withdraw-audit';
export function getWithdrawLineListHook(init: { [key: string]: any } = {}) {
  const withdrawLineList = ref([]);

  function getWithdrawLineFun(data: { [key: string]: any } = init) {
    getChannel(
      Object.assign({ page: 1, limit: 10000 }, Object.assign(init, data))
    ).then((result: any) => {
      if (result.code == 1) {
        withdrawLineList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getWithdrawLineFun({});
  });

  return { withdrawLineList, getWithdrawLineFun };
}
