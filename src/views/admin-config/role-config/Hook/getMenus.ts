import { computed, onMounted, ref, Ref } from 'vue';
import { list } from '@/api/admin-config/menu-config';
import { useStore } from '@/store';
import { filterRouteForId } from '@/utils/menuDoWidth';

/**
 * @description 获取权限菜单
 * @returns
 */
export function getMenus() {
  const store = useStore();
  const menus: Ref<any[]> = ref([]);
  const admin_user_id = computed(() => {
    return store.getters.user.id;
  });
  function getMenusHandle() {
    list({ id: admin_user_id.value })
      .then((res: any) => {
        if (res.code == 1) {
          let menuRoutes: any[] = [];
          if (res.data.data.length > 0) {
            const routeLevel1 = res.data.data
              .filter((route: any) => {
                return route.button_id == 1 && !route.menu_pid;
              })
              .sort((a: any, b: any) => {
                return Number(a.menu_sort) - Number(b.menu_sort);
              });
            routeLevel1.forEach((route: any) => {
              const routes = filterRouteForId(2, route.id, res.data.data, 0);
              if (routes.length > 0) {
                route.children = routes;
              }
              menuRoutes.push(route);
            });
          }
          menus.value = menuRoutes;
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  onMounted(() => {
    getMenusHandle();
  });

  return { menus };
}
