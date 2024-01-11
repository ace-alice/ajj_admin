<template>
  <template v-for="val in chils">
    <el-sub-menu
      v-if="val.children && val.children.length > 0"
      :key="val.path"
      :index="val.path"
    >
      <template #title>
        <!-- <svg-icon :name="val.meta.icon" /> -->
        <span>{{ $t('router.' + val.name) }}</span>
      </template>
      <sub-item :chil="val.children" />
    </el-sub-menu>
    <el-menu-item v-else :key="val.path" :index="val.path">
      <template
        v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)"
      >
        <svg-icon :name="val.meta.icon ? val.meta.icon : ''" />
        <span>{{ $t('router.' + val.name) }}</span>
      </template>
      <template v-else>
        <a :href="val.meta.isLink" target="_blank">
          <svg-icon :name="val.meta.icon ? val.meta.icon : ''" />
          {{ $t('router.' + val.name) }}
        </a>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts">
import { computed } from 'vue';
export default {
  name: 'sub-item',
  props: {
    chil: {
      type: Array,
      default: () => []
    }
  },
  setup(props: any) {
    // 获取父级菜单数据
    const chils = computed(() => {
      return props.chil;
    });
    return {
      chils
    };
  }
};
</script>
