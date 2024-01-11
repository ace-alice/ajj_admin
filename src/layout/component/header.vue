<template>
  <el-header class="layout-header" :height="setHeaderHeight">
    <NavBarsIndex />
  </el-header>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store/index.ts';
import NavBarsIndex from '@/layout/navBars/index.vue';
export default {
  name: 'layoutHeader',
  components: { NavBarsIndex },
  setup() {
    const store = useStore();
    // 设置 header 的高度
    const setHeaderHeight = computed(() => {
      const { isTagsview, layout } = store.state.themeConfig.themeConfig;
      if (isTagsview && layout !== 'classic') return '94px';
      else return '70px';
    });
    return {
      setHeaderHeight
    };
  }
};
</script>
