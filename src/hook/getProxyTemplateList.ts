import { ref, onMounted } from 'vue';
import { list } from '@/api/user-manage/proxy-template';
export function getProxyTemplateListHook() {
  const proxyTemplateList = ref([]);

  function getProxyTemplateListFun(data: { [key: string]: any } = {}) {
    list(Object.assign({ page: 1, limit: 10000 }, data)).then((result: any) => {
      if (result.code == 1) {
        proxyTemplateList.value = result.data.data;
      }
    });
  }

  onMounted(() => {
    getProxyTemplateListFun({});
  });

  return { proxyTemplateList, getProxyTemplateListFun };
}
