import { ref, onMounted } from 'vue';
import * as Api from '@/api/account-config/withdraw-line-config';
export function getUsdtProtocolListHook() {
  const usdtProtocolList = ref([]);

  function getUsdtProtocolList() {
    Api.getUsdtProtocol().then((result: any) => {
      if (result.code == 1) {
        usdtProtocolList.value = result.data;
      }
    });
  }

  onMounted(() => {
    getUsdtProtocolList();
  });

  return { usdtProtocolList, getUsdtProtocolList };
}
