<template>
  <div class="layout-navbars-breadcrumb-user-icon" v-only="permission.cash">
    <el-tooltip
      class="item"
      effect="dark"
      content="【提款审核】-【待出款】的数量"
      placement="bottom-end"
    >
      <el-badge :value="withdraw" class="item">
        <el-button
          :type="cashType"
          circle
          size="small"
          :icon="$iconMap.AlarmClock"
          @click="toPath('withdraw-audit', { step: 3 })"
        />
      </el-badge>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="提示音开关"
      placement="bottom-end"
    >
      <el-switch v-model="soundSwithState.cashSwith" size="small" />
    </el-tooltip>
  </div>
  <div class="layout-navbars-breadcrumb-user-icon" v-only="permission.rech">
    <el-tooltip
      class="item"
      effect="dark"
      content="【提款审核】-【待一审】+【待二审】的数量"
      placement="bottom-end"
    >
      <el-badge :value="deposit" class="item">
        <el-button
          :type="rechType"
          circle
          size="small"
          :icon="$iconMap.BellFilled"
          @click="toPath('withdraw-audit', { step: 1 })"
        />
      </el-badge>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="dark"
      content="提示音开关"
      placement="bottom-end"
    >
      <el-switch v-model="soundSwithState.rechSwith" size="small" />
    </el-tooltip>
  </div>
  <audio
    id="audiorech"
    src="../audio/rech.wav"
    controls
    preload
    muted
    v-only="permission.rech"
  />
  <audio
    id="audiocash"
    src="../audio/cash.wav"
    controls
    preload
    muted
    v-only="permission.cash"
  />
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  reactive,
  toRefs
} from 'vue';
import {
  getDepositAndPaymentNum,
  noCheckOrders,
  noWithdrawOrders
} from '@/api/Global/warn';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { store } from '@/store';

export default defineComponent({
  name: 'warning',
  setup() {
    const router = useRouter();

    //  权限控制
    const permission = reactive({
      rech: 'audio:ring:rech',
      cash: 'audio:ring:cash'
    });

    //  声音开关
    const soundSwithState = reactive({
      rechSwith: false,
      cashSwith: false
    });

    //  待处理出入款、额度补发数量
    const num = reactive({
      deposit: 0,
      withdraw: 0
    });

    // let feedbackNum = ref(0);

    let timer: any = null;

    //  获取待处理出入款、额度补发数量
    // function getDepositAndPaymentNumHandle() {
    //   Promise.all([noWithdrawOrders(), noCheckOrders()])
    //     .then((data: any) => {
    //       console.log(data);
    //       num.withdraw = data[0].data.number || 0;
    //       num.deposit = data[1].data.number || 0;
    //       playBeep();
    //     })
    //     .catch(() => {
    //       Object.assign(num, {
    //         deposit: 0,
    //         withdraw: 0
    //       });
    //     });
    // }

    function getNoWithdrawOrders() {
      console.log(crudFindRole.only(permission.cash));
      if (crudFindRole.only(permission.cash)) {
        noWithdrawOrders()
          .then((data: any) => {
            Object.assign(num, {
              withdraw: data.data.number || 0
            });
            playNoWithdrawOrdersBeep();
          })
          .catch(() => {
            Object.assign(num, {
              withdraw: 0
            });
          });
      }
    }

    function getNoCheckOrders() {
      console.log(crudFindRole.only(permission.rech));
      if (crudFindRole.only(permission.rech)) {
        noCheckOrders()
          .then((data: any) => {
            Object.assign(num, {
              deposit: data.data.number || 0
            });
            playNoCheckOrdersBeep();
          })
          .catch(() => {
            Object.assign(num, {
              deposit: 0
            });
          });
      }
    }

    const roles = store.state.userInfos.roles;
    const crudFindRole = {
      only(Authority: string) {
        console.log(roles.includes(Authority));
        try {
          return !!roles.includes(Authority);
        } catch (error) {
          console.error(error);
          return false;
        }
      }
    };

    //  获取提示音Dom
    const audioDom = reactive<{
      warnDom: null | HTMLElement;
      rechDom: null | HTMLElement;
      cashDom: null | HTMLElement;
    }>({
      warnDom: null,
      rechDom: null,
      cashDom: null
    });

    //  播放声音
    // function playBeep(volumeValue1 = 1) {
    //   // if (
    //   //   audioDom.warnDom &&
    //   //   soundSwithState.warnSwith &&
    //   //   num.setCreditCount > 0
    //   // ) {
    //   //   (audioDom.warnDom as any).muted = false;
    //   //   (audioDom.warnDom as any).volume = volumeValue1;
    //   //   (audioDom.warnDom as any).play();
    //   // }
    //   if (audioDom.rechDom && soundSwithState.rechSwith && num.deposit > 0) {
    //     (audioDom.rechDom as any).muted = false;
    //     (audioDom.rechDom as any).volume = volumeValue1;
    //     (audioDom.rechDom as any).play();
    //   }
    //   if (audioDom.cashDom && soundSwithState.cashSwith && num.withdraw > 0) {
    //     (audioDom.cashDom as any).muted = false;
    //     (audioDom.cashDom as any).volume = volumeValue1;
    //     (audioDom.cashDom as any).play();
    //   }
    // }
    //  播放声音
    function playNoWithdrawOrdersBeep(volumeValue1 = 1) {
      if (audioDom.cashDom && soundSwithState.cashSwith && num.withdraw > 0) {
        (audioDom.cashDom as any).muted = false;
        (audioDom.cashDom as any).volume = volumeValue1;
        (audioDom.cashDom as any).play();
      }
    }
    //  播放声音
    function playNoCheckOrdersBeep(volumeValue1 = 1) {
      if (audioDom.rechDom && soundSwithState.rechSwith && num.deposit > 0) {
        (audioDom.rechDom as any).muted = false;
        (audioDom.rechDom as any).volume = volumeValue1;
        (audioDom.rechDom as any).play();
      }
    }

    //  拿到语音Dom
    function setAudioDom() {
      // audioDom.warnDom = document.getElementById('audiowarning');
      audioDom.rechDom = document.getElementById('audiorech');
      audioDom.cashDom = document.getElementById('audiocash');
    }

    // 警告跳转按钮的type
    const rechType = computed(() => {
      if (soundSwithState.rechSwith) return 'warning';
      else return 'info';
    });

    // 警告跳转按钮的type
    const cashType = computed(() => {
      if (soundSwithState.cashSwith) return 'warning';
      else return 'info';
    });

    // // 警告跳转按钮的type
    // const warnType = computed(() => {
    //   if (soundSwithState.warnSwith) return 'warning';
    //   else return 'info';
    // });

    const isOpenVoce = () => {
      ElMessageBox.confirm('是否开启出入款提示音?', '提示', {
        confirmButtonText: '开启',
        cancelButtonText: '暂不开启',
        type: 'warning'
      })
        .then(() => {
          Object.assign(soundSwithState, {
            warnSwith: true,
            rechSwith: true,
            cashSwith: true
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '暂不开启出入款提示音'
          });
        })
        .finally(() => {
          getNoWithdrawOrders();
          getNoCheckOrders();
          // getDepositAndPaymentNumHandle();
          timer = setInterval(() => {
            // getDepositAndPaymentNumHandle();
            getNoWithdrawOrders();
            getNoCheckOrders();
          }, 6000);
        });
    };

    onMounted(() => {
      nextTick(async () => {
        isOpenVoce();
        setAudioDom();
      });
    });

    onUnmounted(() => {
      clearInterval(timer);
      timer = null;
    });

    function toPath(pathName: string, query: { [key: string]: any } = {}) {
      router.push({ name: pathName, query });
    }

    return {
      // warnType,
      rechType,
      cashType,
      soundSwithState,
      // feedbackNum,
      permission,
      toPath,
      ...toRefs(num)
    };
  }
});
</script>
<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &-icon {
    padding: 0 10px;
    cursor: pointer;
    color: var(--bg-topBarColor);
    height: 50px;
    line-height: 50px;
    display: flex;
    align-items: center;
  }

  .el-checkbox:last-of-type {
    padding: 20px 0px 0px;
  }
  audio {
    width: 1px !important;
    height: 1px !important;
  }
  .el-switch {
    width: 30px !important;
    height: 6px !important;
    margin-top: 20px;
    .el-switch__core {
      .el-switch__action {
        width: 8px !important;
        height: 8px !important;
      }
    }
  }
}
</style>
