<template>
  <el-dropdown
    :show-timeout="70"
    :hide-timeout="50"
    @command="onHandleCommandClick"
  >
    <span class="layout-navbars-breadcrumb-user-link">
      <el-avatar :size="40" :src="avatarImg">
        <img
          src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
        />
      </el-avatar>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="/welcome">{{
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
</template>

<script lang="ts">
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { clearLocal, clearSession } from '@/utils/storage';
import { ElMessageBox } from 'element-plus';
import { computed, defineComponent, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'userCenter',
  setup() {
    const { t } = useI18n();
    const { proxy } = getCurrentInstance() as any;
    const router = useRouter();
    const store = useStore();
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
            clearLocal(); // 清除缓存/token等
            clearSession(); // 清除缓存/token等
            location.reload();
            // router.push('/login');
            setTimeout(() => {
              // Elsuccess(t('user.logOutSuccess'));
            }, 300);
          })
          .catch(() => {});
      } else if (path === '/welcome') {
        proxy.mittBus.emit('onThemeConfigChange');
        router.push(path);
      } else {
        router.push(path);
      }
    };

    const { getAvatarImg } = dictionary();

    // 获取用户信息 vuex
    const getUserInfos = computed(() => {
      return (store.state.userInfos as any).user;
    });

    const avatarImg = computed(() => {
      return getAvatarImg(
        getUserInfos.value.avatar_id ? getUserInfos.value.avatar_id : 0
      );
    });

    return { avatarImg, onHandleCommandClick };
  }
});
</script>
