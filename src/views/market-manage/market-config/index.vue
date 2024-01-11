<template>
  <div class="main-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in isValidList"
        :key="item.label"
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

import AgentAgreement from './components/agent-agreement.vue';
import MarketAddress from './components/market-address.vue';
import SplashPage from './components/splash-page.vue';
import GameMaintenance from './components/game-maintenance.vue';
import VenueRate from './components/venue-rate.vue';

export default defineComponent({
  name: 'market-config',
  components: {
    AgentAgreement,
    MarketAddress,
    SplashPage,
    GameMaintenance,
    VenueRate
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemList = [
      // 代理协议修改
      {
        label: 'agent-agreement',
        component: 'agent-agreement',
        permission: 'market:config:agreement'
      },

      // 市场地址配置
      {
        label: 'market-address',
        component: 'market-address',
        permission: 'market:config:address'
      },
      // 闪屏页配置
      {
        label: 'splash-page',
        component: 'splash-page',
        permission: 'market:config:splash'
      },
      // 游戏维护
      {
        label: 'game-maintenance',
        component: 'game-maintenance',
        permission: 'market:config:maintenance'
      },
      // 场馆费率配置
      {
        label: 'venue-rate',
        component: 'venue-rate',
        permission: 'market:config:venue'
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

    const activeName = ref('');

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
