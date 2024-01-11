import { ref, onMounted } from 'vue';
import { list } from '@/api/admin-config/operator-config';
export function getOperatorListHook() {
  const operatorList = ref([]);

  function getOperatorListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        operatorList.value = result.data.list;
      }
    });
  }

  onMounted(() => {
    getOperatorListFun({});
  });

  return { operatorList, getOperatorListFun };
}
