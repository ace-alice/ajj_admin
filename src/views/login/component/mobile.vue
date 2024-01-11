<template>
  <div class="login-container">
    <div class="login-content animate__animated animate__bounceInRight">
      <div class="login-content-box" v-show="loginShow">
        <div class="login-content-title">
          {{ getThemeConfig.globalViceTitle }}<label>后台管理系统</label>
        </div>
        <div class="login-content-main">
          <div>
            <Account />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, onMounted, nextTick } from 'vue';
import Account from '@/views/login/component/account.vue';
import { useStore } from '@/store/index.ts';
export default {
  name: 'mobile',
  components: { Account },
  setup() {
    const store = useStore();
    const image = require('@/assets/images/c.png');
    const state = reactive({
      loginShow: false,
      tabsActiveName: 'account'
    });
    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });

    onMounted(() => {
      nextTick(() => {
        setTimeout(() => {
          state.loginShow = true;
        }, 300);
      });
    });
    return {
      getThemeConfig,
      ...toRefs(state),
      image
    };
  }
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  background: url('../../../assets/images/c.png') no-repeat center;
  background-size: 334px 600px;
  background-color: #1b2d43;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-content {
    width: 400px;
    height: 80%;
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 2px 6px 0 var(--color-primary-light-5);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .login-content-box {
      width: 400px;
      padding: 40px;
      height: 420px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      .login-content-title {
        width: 100%;
        text-align: center;
        height: 60px;
        line-height: 60px;
        font-size: 26px;
        font-weight: bold;
        color: #f9fafc;
      }
      label {
        font-size: 20px;
        font-weight: bold;
        margin: 10px;
      }
      .login-content-main {
        width: 100%;
      }
    }
  }
}
</style>
