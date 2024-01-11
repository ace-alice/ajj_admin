import { ref, onMounted } from 'vue';
import { getActivityId } from '@/api/activity-manage/activity-config';
export function getActivityIdListHook() {
  const activityIdList: any = ref({});

  function getActivityIdList() {
    activityIdList.value = [];
    getActivityId().then((result: any) => {
      if (result.code == 1) {
        console.log(result);
        let obj: any = {};
        Object.keys(result.data).map((key: string) => {
          obj = {
            label: result.data[key],
            value: Number(key)
          };
          activityIdList.value.push(obj);
        });
      }
    });
  }

  onMounted(() => {
    getActivityIdList();
  });

  return { activityIdList, getActivityIdList };
}
