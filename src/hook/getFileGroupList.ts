import { ref, onMounted } from 'vue';
import { list } from '@/api/file-manage/file-group-manage';
export function getOperatorListHook() {
  const fileGroupList = ref([]);

  function getFileGroupListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        fileGroupList.value = result.data.list;
      }
    });
  }

  onMounted(() => {
    getFileGroupListFun({});
  });

  return { fileGroupList, getFileGroupListFun };
}
