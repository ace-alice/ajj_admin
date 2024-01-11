<template>
  <span
    type="text"
    class="clipboard"
    ref="copy"
    data-clipboard-action="copy"
    :data-clipboard-text="content"
    @click.stop="copyHandle"
  >
    <slot name="label" />
  </span>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, nextTick, onMounted } from 'vue';
import Clipboard from 'clipboard';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: 'clipboard',
  props: ['content'],
  setup(props) {
    const { proxy } = getCurrentInstance() as any;
    function copyHandle() {
      let clipboard = new Clipboard(proxy.$refs['copy'], {
        text: () => {
          return props.content;
        }
      });

      clipboard.on('success', (e) => {
        ElMessage({ type: 'success', message: '复制成功！' });
        clipboard.destroy();
      });
      clipboard.on('error', (e) => {
        ElMessage({ type: 'error', message: '复制失败！' });
        clipboard.destroy();
      });
    }
    onMounted(() => {
      nextTick(() => {
        copyHandle();
      });
    });
    return { copyHandle };
  }
});
</script>

<style lang="scss" scoped>
.clipboard {
  cursor: pointer;
  &:hover {
    // color: #409eff;
  }
}
</style>
