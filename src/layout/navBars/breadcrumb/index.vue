<template>
  <div class="layout-navbars-breadcrumb-index">
    <Logo v-if="setIsShowLogo" />
    <Breadcrumb />
    <Horizontal :menuList="menuList" v-if="isLayoutTransverse" />
    <User />
  </div>
</template>

<script lang="ts">
import {
  computed,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  watch
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store/index.ts';
import Breadcrumb from '@/layout/navBars/breadcrumb/breadcrumb.vue';
import User from '@/layout/navBars/breadcrumb/user.vue';
import Logo from '@/layout/logo/index.vue';
import Horizontal from '@/layout/navMenu/horizontal.vue';
export default {
  name: 'layoutBreadcrumbIndex',
  components: { Breadcrumb, User, Logo, Horizontal },
  emits: ['setSendClassicChildren'],
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const store = useStore();
    const route = useRoute();
    const state: any = reactive({
      menuList: []
    });
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });
    // 设置 logo 显示/隐藏
    const setIsShowLogo = computed(() => {
      const { isShowLogo, layout } = store.state.themeConfig.themeConfig;
      return (
        (isShowLogo && layout === 'classic') ||
        (isShowLogo && layout === 'transverse')
      );
    });
    // 设置是否显示横向导航菜单
    const isLayoutTransverse = computed(() => {
      const {
        layout,
        isClassicSplitMenu
      } = store.state.themeConfig.themeConfig;
      return (
        layout === 'transverse' || (isClassicSplitMenu && layout === 'classic')
      );
    });
    // 设置/过滤路由（非静态路由/是否显示在菜单中）
    const setFilterRoutes = () => {
      const {
        layout,
        isClassicSplitMenu
      } = store.state.themeConfig.themeConfig;
      if (layout === 'classic' && isClassicSplitMenu) {
        state.menuList = delClassicChildren(
          filterRoutesFun(store.state.routesList.routesList)
        );
        const resData = setSendClassicChildren(route.path);
        proxy.mittBus.emit('setSendClassicChildren', resData);
      } else {
        state.menuList = filterRoutesFun(store.state.routesList.routesList);
      }
    };
    // 设置了分割菜单时，删除底下 children
    const delClassicChildren = (arr: Array<any>) => {
      arr.map((v: any) => {
        if (v.children) delete v.children;
      });
      return arr;
    };
    // 路由过滤递归函数
    const filterRoutesFun = (arr: Array<any>) => {
      return arr
        .filter((item: any) => !item.hidden)
        .map((item: any) => {
          item = Object.assign({}, item);
          if (item.children) item.children = filterRoutesFun(item.children);
          return item;
        });
    };
    // 传送当前子级数据到菜单中
    const setSendClassicChildren = (path: string) => {
      const currentPathSplit = path.split('/');
      const currentData: any = {};
      filterRoutesFun(store.state.routesList.routesList).map((v, k) => {
        if (v.path === `/${currentPathSplit[1]}`) {
          v['k'] = k;
          currentData['item'] = [{ ...v }];
          currentData['children'] = [{ ...v }];
          if (v.children) currentData['children'] = v.children;
        }
      });
      return currentData;
    };
    // 监听路由的变化，动态赋值给菜单中
    watch(store.state, (val) => {
      if (val.routesList.routesList.length === state.menuList.length) {
        return false;
      }
      setFilterRoutes();
    });
    // 页面加载时
    onMounted(() => {
      setFilterRoutes();
      proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
        setFilterRoutes();
      });
    });
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off('getBreadcrumbIndexSetFilterRoutes');
    });
    return {
      getThemeConfig,
      setIsShowLogo,
      isLayoutTransverse,
      ...toRefs(state)
    };
  }
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
  height: 50px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-right: 15px;
  background: #eff2f7;
  overflow: hidden;
  border-bottom: 1px solid #bdc8db;
}
</style>
