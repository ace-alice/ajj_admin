<template>
  <div class="main-container" :key="tabKey">
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
import { defineComponent, ref, computed, onActivated } from 'vue';
import basicInfo from './components/basic-info.vue';
import bankInfo from './components/bank-info.vue';
import usdtInfo from './components/usdt-info.vue';
import walletInfo from './components/wallet-info.vue';
import loginInfo from './components/login-info.vue';
import cashFlowInfo from './components/cash-flow-info.vue';
import comissionRate from './components/comission-rate.vue';
import teamInfo from './components/team-info.vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'user-info-edit',
  components: {
    basicInfo,
    bankInfo,
    walletInfo,
    loginInfo,
    cashFlowInfo,
    comissionRate,
    teamInfo,
    usdtInfo
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemList = [
      // cache
      {
        label: 'basic-info',
        component: 'basic-info',
        key: 'basic-info',
        permission: 'user:config:edit'
      },
      {
        label: 'wallet-info',
        component: 'wallet-info',
        key: 'wallet-info',
        permission: 'user:config:wallet'
      },
      {
        label: 'cash-flow-info',
        component: 'cash-flow-info',
        key: 'cash-flow-info',
        permission: 'user:config:cash'
      },
      {
        label: 'login-info',
        component: 'login-info',
        key: 'login-info',
        permission: 'user:config:login'
      },
      {
        label: 'bank-info',
        component: 'bank-info',
        key: 'bank-info',
        permission: 'user:config:bank'
      },
      {
        label: 'usdt-info',
        component: 'usdt-info',
        key: 'usdt-info',
        permission: 'user:config:usdt'
      }
    ];

    const proxyUser = [
      {
        label: 'team-info',
        component: 'team-info',
        key: 'team-info',
        permission: 'user:config:team'
      },
      {
        label: 'comission-rate',
        component: 'comission-rate',
        key: 'comission-rate',
        permission: 'user:config:comission'
      }
    ];

    const roles = computed(() => {
      return store.getters.roles;
    });

    const route: any = useRoute();
    const isValidList = computed(() => {
      let ret: any = itemList.filter((item: any) => {
        return roles.value.includes(item.permission);
      });
      if (route.query.account_type != 0) {
        ret = [...ret, ...proxyUser];
      }
      return ret;
    });

    const activeName = ref('basic-info');
    const tabKey = ref(Math.random());

    onActivated(() => {
      // 刷新tab组件 避免keepalive缓存
      tabKey.value = Math.random();
      activeName.value = 'basic-info';
    });

    return {
      activeName,
      itemList,
      tabKey,
      isValidList
    };
  }
});
</script>
