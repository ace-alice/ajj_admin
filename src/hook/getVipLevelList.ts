import { ref, onMounted } from 'vue';
import { list } from '@/api/activity-manage/vip-config/vip-level-config';
export function getVipLevelListHook(initData: any = {}) {
  const vipLevelList = ref([]);

  function vipLevelListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data))
      .then((result: any) => {
        if (result.code == 1) {
          vipLevelList.value = result.data;
        } else {
          vipLevelList.value = [];
        }
      })
      .catch(() => {
        vipLevelList.value = [];
      });
  }

  onMounted(() => {
    vipLevelListFun(initData);
  });

  return { vipLevelList, vipLevelListFun };
}
