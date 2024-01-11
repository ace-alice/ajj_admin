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
import {
  defineComponent,
  ref,
  defineAsyncComponent,
  onMounted,
  computed
} from 'vue';

const tokenConfig = defineAsyncComponent(
  () => import('./components/token-config.vue')
);
const captchaConfig = defineAsyncComponent(
  () => import('./components/captcha-config.vue')
);
const logConfig = defineAsyncComponent(
  () => import('./components/log-config.vue')
);
const apiConfig = defineAsyncComponent(
  () => import('./components/api-config.vue')
);
const selfConfig = defineAsyncComponent(
  () => import('./components/self-config.vue')
);

export default defineComponent({
  name: 'client-config',
  components: {
    tokenConfig,
    captchaConfig,
    logConfig,
    apiConfig,
    selfConfig
  },
  setup(props, { emit }) {
    const store = useStore();
    const itemList = [
      //cache

      {
        label: 'token-config',
        component: 'token-config',
        key: 'USER_CASH_CONFIG',
        permission: 'client:token:info'
      },
      {
        label: 'captcha-config',
        component: 'captcha-config',
        key: 'RECHARGE_CONFIG',
        permission: 'client:captcha:info'
      },
      {
        label: 'log-config1',
        component: 'log-config',
        key: 'BONUS_CONFIG',
        permission: 'client:log:info'
      },
      {
        label: 'api-config',
        component: 'api-config',
        key: 'SPORT_LIVE_CONFIG',
        permission: 'client:api:info'
      },
      {
        label: 'self-config',
        component: 'self-config',
        key: 'ADMIN_LOGIN_CONFIG',
        permission: 'client:self:info'
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
