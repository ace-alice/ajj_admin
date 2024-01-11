<template>
  <el-config-provider :locale="locale">
    <router-view v-show="getThemeConfig.lockScreenTime !== 0" />
    <LockScreen v-show="getThemeConfig.isLockScreen" />
    <Setings ref="setingsRef" v-show="getThemeConfig.lockScreenTime !== 0" />
  </el-config-provider>
</template>

<script lang="ts">
import {
  computed,
  ref,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  nextTick,
  defineComponent,
  watch
} from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';
import { getLocal } from '@/utils/storage';
import setIntroduction from '@/utils/setIconfont';
import LockScreen from '@/layout/lockScreen/index.vue';
import Setings from '@/layout/navBars/breadcrumb/setings.vue';
import EN from 'element-plus/lib/locale/lang/en';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
export default defineComponent({
  name: 'app',
  components: { LockScreen, Setings },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const setingsRef = ref();
    const route = useRoute();
    const store = useStore();

    const locale = ref(zhCn);
    //  获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });
    // 布局配置弹窗打开
    const openSetingsDrawer = () => {
      setingsRef.value.openDrawer();
    };
    // 设置初始化，防止刷新时恢复默认
    onBeforeMount(() => {
      // 设置批量第三方 icon 图标
      setIntroduction.cssCdn();
      // 设置批量第三方 js
      setIntroduction.jsCdn();
    });
    // 页面加载时
    onMounted(() => {
      store.dispatch('userInfos/getInit');
      nextTick(() => {
        // 监听布局配置弹窗点击打开
        proxy.mittBus.on('openSetingsDrawer', () => {
          openSetingsDrawer();
        });
        proxy.mittBus.on('changeLang', (lang: string) => {
          switch (lang) {
            case 'zh-CN':
              locale.value = zhCn as any;
              break;
            case 'en-US':
              locale.value = EN as any;
              break;
          }
        });
        // 获取缓存中的布局配置
        if (getLocal('themeConfig')) {
          store.dispatch('themeConfig/setThemeConfig', getLocal('themeConfig'));
          document.documentElement.style.cssText = getLocal('themeConfigStyle');
        }
      });
    });
    // 页面销毁时，关闭监听布局配置
    onUnmounted(() => {
      proxy.mittBus.off('openSetingsDrawer', () => {});
      proxy.mittBus.off('changeLang');
    });
    // 监听路由的变化，设置网站标题
    watch(
      () => route.path,
      () => {
        nextTick(() => {});
      }
    );
    return {
      setingsRef,
      getThemeConfig,
      locale
    };
  }
});
</script>
