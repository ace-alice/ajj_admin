<template>
  <div class="login-container" :style="background">
    <div></div>
    <div class="login-content animate__animated animate__bounceInRight">
      <!-- <div
        v-show="loginShow"
        class="scenes animate__animated animate__fadeInLeftBig"
      >
        <el-image
          style="width: 222px; height: 400px"
          :src="image"
          fit="contain"
        ></el-image>
      </div> -->
      <div class="login-content-box" v-show="loginShow">
        <div class="login-content-title">
          {{ initInfo.system_name }}
          <LangSelect />
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
import LangSelect from '@/components/LangSelect/index.vue';
export default {
  name: 'computer',
  components: { Account, LangSelect },
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

    const initInfo = computed(() => {
      const { login_bg_url, system_name } = store.getters.userInit;
      return { login_bg_url, system_name };
    });

    const background = computed(() => {
      return {
        background: store.getters.userInit.login_bg_url
          ? `url(${store.getters.userInit.login_bg_url}) no-repeat center center`
          : ''
      };
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
      image,
      initInfo,
      background
    };
  }
};
</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  background-image: url('../../../assets/images/bg.webp');
  background-repeat: no-repeat;
  background-size: 100% 100% !important;
  // background-size: cover;
  // background-attachment: fixed;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .login-content {
    width: 481px;
    height: 638px;
    background-color: #b5b9c640;
    backdrop-filter: blur(10px);
    // box-shadow: 0 2px 6px 0 var(--color-primary-light-5);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1;
    .scenes {
      width: 415px;
      height: 490px;
      background: url('../../../assets/images/bgc.png') no-repeat center;
      background-size: 100% 100%;
      padding: 30px;
    }
    .login-content-box {
      width: 481px;
      height: 638px;
      padding: 70px;
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
        color: #ffffff;
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
