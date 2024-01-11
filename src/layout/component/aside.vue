<template>
  <el-aside
    class="layout-aside"
    :class="setCollapseWidth"
    v-if="clientWidth > 1000"
  >
    <Logo v-if="setShowLogo" />
    <el-scrollbar class="flex-auto" ref="layoutAsideScrollbarRef">
      <Vertical :menuList="menuList" :class="setCollapseWidth" />
    </el-scrollbar>
  </el-aside>
  <el-drawer
    v-model="getThemeConfig.isCollapse"
    :with-header="false"
    direction="ltr"
    size="220px"
    v-else
  >
    <el-aside class="layout-aside w100 h100">
      <Logo v-if="setShowLogo" />
      <el-scrollbar class="flex-auto" ref="layoutAsideScrollbarRef">
        <Vertical :menuList="menuList" />
      </el-scrollbar>
    </el-aside>
  </el-drawer>
</template>

<script lang="ts">
import {
  toRefs,
  reactive,
  computed,
  watch,
  getCurrentInstance,
  onBeforeMount,
  onUnmounted,
  nextTick
} from 'vue';
import { useStore } from '@/store/index.ts';
import Logo from '@/layout/logo/index.vue';
import Vertical from '@/layout/navMenu/vertical.vue';
import { useRoute } from 'vue-router';
export default {
  name: 'layoutAside',
  components: { Logo, Vertical },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const store = useStore();
    const route = useRoute();

    const state: any = reactive({
      menuList: [],
      clientWidth: ''
    });
    // 路由过滤递归函数
    const filterRoutesFun = (arr: Array<any>) => {
      return arr
        .filter((item: any) => !item.meta.isHide)
        .map((item: any) => {
          item = Object.assign({}, item);
          if (item.children) item.children = filterRoutesFun(item.children);
          return item;
        });
    };
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });
    // 设置菜单展开/收起时的宽度
    const setCollapseWidth = computed(() => {
      const { layout, isCollapse, menuBar } =
        store.state.themeConfig.themeConfig;
      const asideBrColor = '';
      if (layout === 'columns') {
        // 分栏布局，菜单收起时宽度给 1px
        if (isCollapse) {
          return ['layout-aside-width1', asideBrColor];
        } else {
          return ['layout-aside-width-default', asideBrColor];
        }
      } else {
        // 其它布局给 64px
        if (isCollapse) {
          return ['layout-aside-width64', asideBrColor];
        } else {
          return ['layout-aside-width-default', asideBrColor];
        }
      }
    });
    // 设置显示/隐藏 logo
    const setShowLogo = computed(() => {
      const { layout, isShowLogo } = store.state.themeConfig.themeConfig;
      return (
        (isShowLogo && layout === 'defaults') ||
        (isShowLogo && layout === 'columns')
      );
    });
    // 设置/过滤路由（非静态路由/是否显示在菜单中）
    const setFilterRoutes = () => {
      if (store.state.themeConfig.themeConfig.layout === 'columns') {
        return false;
      }
      state.menuList = filterRoutesFun(store.state.routesList.routesList) || [];
    };
    // 设置菜单导航是否固定（移动端）
    const initMenuFixed = (clientWidth: number) => {
      state.clientWidth = clientWidth;
    };
    // 监听 themeConfig 配置文件的变化，更新菜单 el-scrollbar 的高度
    watch(store.state.themeConfig.themeConfig, (val) => {
      if (val.isShowLogoChange !== val.isShowLogo) {
        if (!proxy.$refs.layoutAsideScrollbarRef) return false;
        proxy.$refs.layoutAsideScrollbarRef.update();
      }
    });
    // 监听路由的变化，动态赋值给菜单中
    watch(store.state, (val) => {
      nextTick(() => {
        if (val.routesList.routesList.length === state.menuList.length) {
          return false;
        }
        const { layout, isClassicSplitMenu } = val.themeConfig.themeConfig;
        if (layout === 'classic' && isClassicSplitMenu) return false;
        setFilterRoutes();
      });
    });
    // 页面加载前
    onBeforeMount(() => {
      initMenuFixed(document.body.clientWidth);
      setFilterRoutes();
      proxy.mittBus.on('setSendColumnsChildren', (res: any) => {
        state.menuList = res.children;
      });
      proxy.mittBus.on('setSendClassicChildren', (res: any) => {
        const { layout, isClassicSplitMenu } =
          store.state.themeConfig.themeConfig;
        if (layout === 'classic' && isClassicSplitMenu) {
          state.menuList = [];
          state.menuList = res.children;
        }
      });
      proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
        setFilterRoutes();
      });
      proxy.mittBus.on('layoutMobileResize', (res: any) => {
        initMenuFixed(res.clientWidth);
        // location.reload();
      });
    });
    // 页面卸载时
    onUnmounted(() => {
      proxy.mittBus.off('setSendColumnsChildren');
      proxy.mittBus.off('setSendClassicChildren');
      proxy.mittBus.off('getBreadcrumbIndexSetFilterRoutes');
      proxy.mittBus.off('layoutMobileResize');
    });
    return {
      setCollapseWidth,
      setShowLogo,
      route,
      getThemeConfig,
      ...toRefs(state)
    };
  }
};
</script>
