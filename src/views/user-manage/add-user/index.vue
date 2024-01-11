<template>
  <div class="main-container tabs">
    <div class="notice"><span style="color: red">*</span> 为必填项</div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="tab in currentTabs"
        :label="tab.name"
        :name="tab.code"
        :key="tab.code"
      ></el-tab-pane>
    </el-tabs>
    <transition name="el-fade-in" mode="out-in">
      <component :is="activeName" :key="activeName" />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue';
import AddOne from './components/AddOne.vue';
import AddMore from './components/AddMore.vue';
import err401 from '@/views/error/401.vue';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'add-user',
  components: { AddOne, AddMore, err401 },
  setup() {
    const activeName = ref('add-one');
    const i18n = useI18n();

    const store = useStore();

    const roles = computed(() => {
      return store.getters.roles;
    });

    const tabs = [
      { name: i18n.t('router.add-user'), code: 'add-one', per: 'user:add:one' },
      {
        name: i18n.t('router.add-user-more'),
        code: 'add-more',
        per: 'user:add:more'
      }
    ];

    const currentTabs = computed(() => {
      return tabs.filter((tab) => {
        return roles.value.includes(tab.per);
      });
    });

    onMounted(() => {
      nextTick(() => {
        if (currentTabs.value.length > 0) {
          activeName.value = currentTabs.value[0].code;
        } else {
          activeName.value = 'err401';
        }
      });
    });

    return { activeName, currentTabs };
  }
});
</script>

<style lang="scss" scoped>
.tabs {
  position: relative;
}
.notice {
  position: absolute;
  right: 20px;
  top: 15px;
  z-index: 100000;
}
</style>
