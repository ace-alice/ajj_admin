<template>
  <div
    class="layout-navbars-breadcrumb-user"
    :style="{ flex: layoutUserFlexNum }"
  >
    <!-- 警报 -->

    <div
      v-if="permissionSome(['audio:ring:rech', 'audio:ring:cash'])"
      class="layout-navbars-breadcrumb-user-icon"
    >
      <Warning />
    </div>

    <!-- 语言选择 -->
    <div class="layout-navbars-breadcrumb-user-icon">
      <LangSelect />
    </div>
    <!-- 页面搜索 -->
    <div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
      <el-icon><stopwatch /></el-icon>
    </div>
    <!-- 主题设置 -->
    <div
      class="layout-navbars-breadcrumb-user-icon"
      @click="onLayoutSetingClick"
    >
      <i class="icon-skin iconfont" :title="$t('user.title3')"></i>
    </div>
    <!-- 全屏 -->
    <div
      class="layout-navbars-breadcrumb-user-icon mr10"
      @click="onScreenfullClick"
    >
      <i
        class="iconfont"
        :title="isScreenfull ? $t('user.title5') : $t('user.title6')"
        :class="!isScreenfull ? 'icon-fullscreen' : 'icon-tuichuquanping'"
      ></i>
    </div>
    <!-- 头像 -->
    <el-dropdown
      v-if="getThemeConfig.layout != 'columns'"
      :show-timeout="70"
      :hide-timeout="50"
      @command="onHandleCommandClick"
    >
      <span class="layout-navbars-breadcrumb-user-link">
        <el-avatar shape="square" :size="40" :src="avatarImg">
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="/">{{
            $t('user.dropdown1')
          }}</el-dropdown-item>
          <el-dropdown-item command="/profile">{{
            $t('user.dropdown2')
          }}</el-dropdown-item>
          <el-dropdown-item divided command="logOut">{{
            $t('user.dropdown5')
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <Search ref="searchRef" />
  </div>
</template>

<script lang="ts">
import {
  ref,
  getCurrentInstance,
  computed,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  watch
} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import screenfull from 'screenfull';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store/index.ts';
import { clearSession, getLocal } from '@/utils/storage.ts';
import Search from '@/layout/navBars/breadcrumb/search.vue';
import LangSelect from '@/components/LangSelect/index.vue';
import { dictionary } from '@/hook/lib';
import { permissionSome } from '@/directives/some';

import Warning from '@/layout/navBars/breadcrumb/warning.vue';
import { clearLocal } from '@/utils/storage';
export default {
  name: 'layoutBreadcrumbUser',
  components: { Search, LangSelect, Warning },
  emits: ['openSetingsDrawer'],
  setup() {
    const { t } = useI18n();
    const { proxy } = getCurrentInstance() as any;
    const router = useRouter();
    const store = useStore();
    const searchRef = ref();
    const state = reactive({
      isScreenfull: false,
      isShowUserNewsPopover: false,
      disabledI18n: 'zh-cn',
      disabledSize: 'small'
    });

    const { getAvatarImg } = dictionary();

    const currentDevice = ref('computer');
    const warningShow = ref(false);
    // 获取用户信息 vuex
    const getUserInfos = computed(() => {
      return (store.state.userInfos as any).user;
    });

    const avatarImg = computed(() => {
      return getAvatarImg(
        getUserInfos.value.avatar_id ? getUserInfos.value.avatar_id : 0
      );
    });

    // 获取布局配置信息
    const getThemeConfig = computed(() => {
      return store.state.themeConfig.themeConfig;
    });
    // 设置分割样式
    const layoutUserFlexNum = computed(() => {
      const { layout, isClassicSplitMenu } = getThemeConfig.value;
      let num: any = '';
      if (
        layout === 'defaults' ||
        (layout === 'classic' && !isClassicSplitMenu) ||
        layout === 'columns'
      ) {
        num = 1;
      } else num = null;
      return num;
    });
    const Elwarning = (key: string) => {
      proxy.$message.warning(key);
    };
    // 全屏点击时
    const onScreenfullClick = () => {
      if (!screenfull.isEnabled) {
        Elwarning('暂不不支持全屏');
        return false;
      }
      screenfull.toggle();
      state.isScreenfull = !state.isScreenfull;
    };
    // 布局配置 icon 点击时
    const onLayoutSetingClick = () => {
      proxy.mittBus.emit('openSetingsDrawer');
    };
    // 下拉菜单点击时
    const onHandleCommandClick = (path: string) => {
      if (path === 'logOut') {
        ElMessageBox({
          closeOnClickModal: false,
          closeOnPressEscape: false,
          title: t('user.logOutTitle'),
          message: t('user.logOutMessage'),
          showCancelButton: true,
          confirmButtonText: t('user.logOutConfirm'),
          cancelButtonText: t('user.logOutCancel'),
          beforeClose: (
            action: string,
            instance: {
              confirmButtonLoading: boolean;
              confirmButtonText: string;
            },
            done: () => void
          ) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = t('user.logOutExit');
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 700);
            } else {
              done();
            }
          }
        })
          .then(() => {
            clearLocal();
            clearSession(); // 清除缓存/token等
            location.reload();
            // router.push('/login');
            setTimeout(() => {
              // Elsuccess(t('user.logOutSuccess'));
            }, 300);
          })
          .catch(() => {});
      } else {
        router.push(path);
      }
    };
    // 菜单搜索点击
    const onSearchClick = () => {
      searchRef.value.openSearch();
    };
    // 语言切换
    // 初始化全局组件大小
    const initComponentSize = () => {
      switch (getLocal('themeConfig').globalComponentSize) {
        case 'default':
          state.disabledSize = 'default';
          break;
        case 'medium':
          state.disabledSize = 'medium';
          break;
        case 'small':
          state.disabledSize = 'small';
          break;
        case 'mini':
          state.disabledSize = 'mini';
          break;
      }
    };
    // 获取布局配置信息
    function onLayoutResize() {
      const clientWidth = document.body.clientWidth;
      if (clientWidth < 1000) {
        currentDevice.value = 'mobile';
      } else {
        currentDevice.value = 'computer';
      }
    }
    function warningShowChange() {
      warningShow.value = !warningShow.value;
    }
    // 页面加载时
    onMounted(() => {
      if (getLocal('themeConfig')) {
        initComponentSize();
      }
      onLayoutResize();
      window.addEventListener('resize', onLayoutResize);
    });

    // 页面卸载时
    onUnmounted(() => {
      window.removeEventListener('resize', onLayoutResize);
    });
    return {
      getUserInfos,
      onLayoutSetingClick,
      onHandleCommandClick,
      onScreenfullClick,
      onSearchClick,
      searchRef,
      currentDevice,
      warningShow,
      warningShowChange,
      layoutUserFlexNum,
      ...toRefs(state),
      getAvatarImg,
      avatarImg,
      getThemeConfig,
      permissionSome
    };
  }
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &-link {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: nowrap;
    &-photo {
      width: 25px;
      height: 25px;
      border-radius: 100%;
    }
  }
  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
    &:hover {
      background: rgba(0, 0, 0, 0.04);
      i {
        display: inline-block;
        animation: logoAnimation 0.3s ease-in-out;
      }
    }
  }
  ::v-deep(.el-dropdown) {
    color: var(--bg-topBarColor);
  }
  ::v-deep(.el-badge) {
    height: 40px;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  ::v-deep(.el-badge__content.is-fixed) {
    top: 12px;
  }
}
</style>
