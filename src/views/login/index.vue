<template>
  <component :is="currentDevice"></component>
</template>

<script lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue';
import computer from './component/computer.vue';
import mobile from './component/mobile.vue';
export default {
  name: 'login',
  components: { computer, mobile },
  setup() {
    const currentDevice = ref('computer');

    // 获取布局配置信息
    function onLayoutResize() {
      const clientWidth = document.body.clientWidth;
      if (clientWidth < 1000) {
        currentDevice.value = 'mobile';
      } else {
        currentDevice.value = 'computer';
      }
    }

    // 页面加载前
    onBeforeMount(() => {
      onLayoutResize();
      window.addEventListener('resize', onLayoutResize);
    });
    // 页面卸载时
    onUnmounted(() => {
      window.removeEventListener('resize', onLayoutResize);
    });

    return {
      currentDevice
    };
  }
};
</script>

<style scoped lang="scss"></style>
