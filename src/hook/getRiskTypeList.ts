import { ref, onMounted } from 'vue';
import { list } from '@/api/risk-control-config/risk-control-manage';
export function getRiskTypeListHook(initData: any = {}) {
  const riskTypeList = ref([]);

  function riskTypeListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data))
      .then((result: any) => {
        if (result.code == 1) {
          riskTypeList.value = result.data.data;
        } else {
          riskTypeList.value = [];
        }
      })
      .catch(() => {
        riskTypeList.value = [];
      });
  }

  onMounted(() => {
    riskTypeListFun(initData);
  });

  return { riskTypeList, riskTypeListFun };
}
