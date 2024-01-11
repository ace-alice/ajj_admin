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

import cacheConfig from './components/cache-config.vue';
import tokenConfig from './components/token-config.vue';
import systemConfigC from './components/system-config-c.vue';
import captchaConfig from './components/captcha-config.vue';
import logConfig from './components/log-config.vue';
import apiConfig from './components/api-config.vue';
import emailConfig from './components/email-config.vue';

export default defineComponent({
  name: 'system-config',
  components: {
    cacheConfig,
    tokenConfig,
    systemConfigC,
    captchaConfig,
    logConfig,
    apiConfig,
    emailConfig
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemList = [
      //cache
      {
        label: 'cache-config',
        component: 'cache-config',
        key: 'USER_REGISTRY_CONFIG',
        permission: 'system:cache:info'
      },
      {
        label: 'token-config',
        component: 'token-config',
        key: 'USER_CASH_CONFIG',
        permission: 'system:token:info'
      },
      {
        label: 'captcha-config',
        component: 'captcha-config',
        key: 'RECHARGE_CONFIG',
        permission: 'system:captcha:info'
      },
      {
        label: 'log-config1',
        component: 'log-config',
        key: 'BONUS_CONFIG',
        permission: 'system:log:info'
      },
      {
        label: 'api-config',
        component: 'api-config',
        key: 'SPORT_LIVE_CONFIG',
        permission: 'system:api:info'
      },
      {
        label: 'system-config',
        component: 'system-config-c',
        key: 'SPORT_LIVE_CONFIG',
        permission: 'system:system:info'
      },
      {
        label: 'email-config',
        component: 'email-config',
        key: 'ADMIN_LOGIN_CONFIG',
        permission: 'system:email:info'
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

    const activeName = ref('cache-config');

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
