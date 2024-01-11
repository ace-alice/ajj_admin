import { ref, onMounted } from 'vue';
import { list } from '@/api/activity-manage/activity-tab-config';
export function getActivityTabListHook() {
  const activityTabList = ref([]);

  function getActivityTabListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        activityTabList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getActivityTabListFun();
  });

  return { activityTabList, getActivityTabListFun };
}
