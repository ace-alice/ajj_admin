<template>
  <div class="main-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in isValidList"
        :key="item.key"
        :label="$t('router.' + item.label)"
        :name="item.component"
      >
      </el-tab-pane>
    </el-tabs>
    <component :is="activeName" :key="activeName" />
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent, ref, onMounted, computed } from 'vue';
import vipLevelConfig from './components/vip-level-config.vue';
import vipChargeConfig from './components/vip-charge-config.vue';
import vipRebateConfig from './components/vip-rebate-config.vue';
import vipReliveConfig from './components/vip-relive-config.vue';

export default defineComponent({
  name: 'vip-config',
  components: {
    vipLevelConfig,
    vipChargeConfig,
    vipRebateConfig,
    vipReliveConfig
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemList = [
      //cache
      {
        label: 'vip-level-config',
        component: 'vip-level-config',
        key: 'vip-level-config',
        permission: 'vip:config:level'
      },
      {
        label: 'vip-rebate-config',
        component: 'vip-rebate-config',
        key: 'vip-rebate-config',
        permission: 'vip:config:rebate'
      },
      {
        label: 'vip-charge-config',
        component: 'vip-charge-config',
        key: 'vip-charge-config',
        permission: 'vip:config:charge'
      },
      {
        label: 'vip-relive-config',
        component: 'vip-relive-config',
        key: 'vip-relive-config',
        permission: 'vip:config:relive'
      }
    ];

    const roles = computed(() => {
      return store.getters.roles;
    });

    const isValidList = computed(() => {
      return itemList.filter((item: any) => {
        return roles.value.includes(item.permission);
      });
    });

    const activeName = ref('vip-level-config');

    onMounted(() => {
      activeName.value = isValidList.value[0]?.label;
    });

    return {
      activeName,
      itemList,
      isValidList
    };
  }
});
</script>
