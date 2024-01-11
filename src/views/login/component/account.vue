<template>
  <el-form
    class="login-content-form"
    ref="loginRef"
    size="default"
    :model="loginForm"
    :rules="loginRules"
    autocomplete="off"
  >
    <el-form-item prop="username">
      <el-input
        type="text"
        ref="usernameinput"
        :placeholder="$t('login.account.accountPlaceholder1')"
        v-model.trim="loginForm.username"
        clearable
        autocomplete="off"
        size="large"
      >
        <template #prefix>
          <el-icon><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        type="password"
        ref="password"
        :placeholder="$t('login.account.accountPlaceholder2')"
        v-model.trim="loginForm.password"
        show-password
        autocomplete="off"
        size="large"
      >
        <template #prefix>
          <el-icon><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item prop="googleCode" v-if="googleCodeM.googleCodeSwitch">
      <el-input
        type="text"
        ref="googleCode"
        :placeholder="$t('login.account.accountPlaceholder2')"
        v-model.trim.number="loginForm.googleCode"
        clearable
        autocomplete="off"
      >
        <template #prefix>
          <svg-icon name="google" />
        </template>
      </el-input>
    </el-form-item> -->
    <el-form-item prop="code" v-if="verifyCode.captcha_switch">
      <el-input
        type="text"
        ref="code"
        :placeholder="$t('login.account.accountPlaceholder3')"
        @keyup.enter="onSignIn"
        v-model.trim="loginForm.captcha_code"
        autocomplete="off"
        size="large"
      >
        <template #prefix>
          <svg-icon name="valid_code" />
        </template>
        <template #suffix>
          <el-image
            class="el-image-img"
            v-show="!!verifyCode.captcha_src"
            :src="verifyCode.captcha_src"
            @click.stop="getCode"
          />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        class="login-content-submit"
        size="large"
        @click="onSignIn"
        :loading="loading.signIn"
      >
        <span>{{ $t('login.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {
  toRefs,
  reactive,
  defineComponent,
  getCurrentInstance,
  onMounted,
  computed
} from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store';
import { getCodeImg } from '@/api/login';
import { NextLoading } from '@/utils/loading';
import { Lock, User } from '@element-plus/icons-vue';
export default defineComponent({
  name: 'login',
  components: { Lock, User },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const { t } = useI18n();
    const store = useStore();
    // const route = useRoute();
    const router = useRouter();
    const state = reactive({
      loginForm: {
        username: '',
        password: '',
        captcha_id: '',
        captcha_code: ''
      },
      loading: {
        signIn: false
      },
      loginRules: reactive({
        username: [
          {
            required: true,
            trigger: 'blur',
            message: t('login.account.UserNotEmpty')
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            message: t('login.account.passNotEmpty')
          }
        ],
        googleCode: [
          {
            required: true,
            trigger: 'blur',
            message: t('login.account.GoogleNotEmpty')
          }
        ],
        captcha_code: [
          {
            required: true,
            trigger: 'change',
            message: t('login.account.codeNotEmpty')
          }
        ]
      }),
      googleCodeM: {
        googleCodeSwitch: false
      }
    });

    const verifyCode = computed(() => {
      const {
        captcha_switch,
        captcha_src,
        captcha_id
      } = store.getters.userInit;
      return { captcha_switch, captcha_src, captcha_id };
    });

    // 登录
    const onSignIn = async () => {
      proxy.$refs['loginRef'].validate((valid: any) => {
        if (valid) {
          verifySuccess();
        }
      });
    };

    // 登录信息
    const userForm = {
      username: '',
      password: '',
      captcha_id: '',
      captcha_code: '',
      client_id: 'webApp',
      client_secret: 'webApp'
    };

    // 验证成功后进行登录
    const verifySuccess = () => {
      state.loading.signIn = true;
      Object.assign(userForm, {
        username: state.loginForm.username,
        password: state.loginForm.password
        // password: getEncryCode(state.loginForm.password)
      });
      if (verifyCode.value.captcha_switch) {
        Object.assign(userForm, {
          captcha_id: verifyCode.value.captcha_id,
          captcha_code: state.loginForm.captcha_code
        });
      }
      store
        .dispatch('userInfos/login', userForm)
        .then((res) => {
          if (res) {
            signInSuccess();
            router.push('/welcome');
            NextLoading.start();
            state.loading.signIn = false;
          }
        })
        .catch(() => {
          getCode();
          state.loading.signIn = false;
        });
    };

    // 获取code图
    function getCode() {
      if (!verifyCode.value.captcha_switch) return;
      state.loginForm.captcha_code = '';
      getCodeImg().then((res: any) => {
        if (res.code == 1) {
          store.commit('userInfos/SET_USER_INIT', {
            captcha_src: res.data.captcha_src,
            captcha_id: res.data.captcha_id
          });
        }
      });
    }

    // 登录成功后的跳转
    const signInSuccess = () => {
      ElMessage({ type: 'success', message: t('login.signInText') });
    };

    // 页面加载前钩子函数
    onMounted(async () => {
      if (!state.loginForm.username) {
        proxy.$refs['usernameinput'].focus();
      } else if (!state.loginForm.password) {
        proxy.$refs['password'].focus();
      }
    });

    return {
      onSignIn,
      ...toRefs(state),
      verifyCode,
      getCode
    };
  }
});
</script>

<style scoped lang="scss">
// /deep/ input:-webkit-autofill,
// input:-webkit-autofill:hover,
// input:-webkit-autofill:focus {
//   border: 1px solid rgb(190, 188, 188);
//   -webkit-text-fill-color: black;
//   background-color: rgba(0, 0, 0, 0.5);
//   box-shadow: 0 0 0 1000px rgba(15, 63, 81, 0.5) inset;
//   transition: background-color 5000s ease-in-out 0s;
// }

/deep/ input {
  background-color: rgba(0, 0, 0, 0) !important;
  // color: #ffffff;
}
.login-content-form {
  margin-top: 20px;
  .login-content-code {
    display: flex;
    align-items: center;
    justify-content: space-around;
    .login-content-code-img {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #ffffff;
      border: 1px solid rgb(220, 223, 230);
      color: #333;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 5px;
      text-indent: 5px;
      text-align: center;
      cursor: pointer;
      transition: all ease 0.2s;
      border-radius: 4px;
      user-select: none;
      &:hover {
        border-color: #c0c4cc;
        transition: all ease 0.2s;
      }
    }
  }
  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
.el-image-img {
  position: absolute;
  height: 41px;
  width: 120px;
  right: 0;
  border-start-end-radius: 5px;
  border-end-end-radius: 5px;
}
</style>
