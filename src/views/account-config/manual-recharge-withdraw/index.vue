<template>
  <div class="main-container">
    <el-tabs v-model="activeName" class="demo-tabs">
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
import manualRecharge from './components/manual-recharge.vue';
import manualWithdraw from './components/manual-withdraw.vue';
import err401 from '@/views/error/401.vue';
import { useStore } from '@/store';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'manual-recharge-withdraw',
  components: { manualRecharge, manualWithdraw, err401 },
  setup() {
    const activeName = ref('manual-recharge');

    const store = useStore();

    const i18n = useI18n();

    const roles = computed(() => {
      return store.getters.roles;
    });

    const tabs = [
      {
        name: i18n.t('router.manual-recharge'),
        code: 'manual-recharge',
        per: 'account:manual:recharge'
      },
      {
        name: i18n.t('router.manual-withdraw'),
        code: 'manual-withdraw',
        per: 'account:manual:withdraw'
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
