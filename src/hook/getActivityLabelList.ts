import { ref, onMounted } from 'vue';
import { list } from '@/api/activity-manage/activity-label';
export function getActivityLabelListHook() {
  const activityLabelList = ref([]);

  function getActivityLabelListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        activityLabelList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getActivityLabelListFun();
  });

  return { activityLabelList, getActivityLabelListFun };
}
