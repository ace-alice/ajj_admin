import { ref, onMounted, onActivated } from 'vue';
import { list } from '@/api/market-manage/mark-manage';
export function getMarkListHook(type: any) {
  const markList = ref([]);

  function getMarkListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, type, data)).then(
      (result: any) => {
        if (result.code == 1) {
          markList.value = result.data.data;
        }
      }
    );
  }

  onMounted(() => {
    getMarkListFun();
  });

  onActivated(() => {
    getMarkListFun();
  })

  return { markList, getMarkListFun };
}
