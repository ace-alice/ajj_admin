<template>
  <div class="main-container user-center">
    <el-card class="box-card-info avatar">
      <span @click.stop="dialogVisible = true" class="avatar-btn">
        <el-avatar
          shape="square"
          style="width: 100px; height: 100px"
          :src="getAvatarImg(infoList.avatar_id ? infoList.avatar_id : 0)"
          fit="contain"
        >
          <img :src="errImg" style="width: 100px; height: 100px" />
        </el-avatar>
      </span>
    </el-card>
    <el-card class="box-card-info">
      <el-form
        label-position="right"
        label-width="90px"
        ref="ruleFormRef"
        :model="infoList"
        inline
      >
        <el-form-item
          :label="$t('table.username')"
          prop="username"
          :rules="[
            {
              required: true,
              message: $t('table.username') + $t('table.not_empty')
            },
            {
              validator: userTypeValidator,
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model.trim="infoList.username"
            :placeholder="$t('table.username')"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('table.nickname')" prop="nickname">
          <el-input
            v-model.trim="infoList.nickname"
            :placeholder="$t('table.nickname')"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.phone')"
          prop="phone"
          :rules="[
            {
              validator: userPhoneValidator,
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model.trim="infoList.phone"
            :placeholder="$t('table.phone')"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.email')"
          prop="email"
          :rules="[
            {
              validator: userEmailValidator,
              trigger: 'change'
            }
          ]"
        >
          <el-input
            v-model.trim="infoList.email"
            :placeholder="$t('table.email')"
            clearable
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div v-only="otherPermission.editInfo" class="submit">
        <el-button type="primary" @click="submitForm()">
          {{ $t('crud.submit') }}
        </el-button>
        <el-button @click="resetForm()">
          {{ $t('crud.reset') }}
        </el-button>
      </div>
    </el-card>
    <el-card class="box-card-info password">
      <el-form
        label-position="right"
        label-width="90px"
        ref="rulePasswordRef"
        :model="initPassword"
      >
        <el-form-item
          :label="$t('table.password_old')"
          prop="password_old"
          :rules="[
            {
              required: true,
              message: $t('table.password_old') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="initPassword.password_old"
            type="password"
            show-password
            :placeholder="$t('table.password_old')"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.password_new')"
          prop="password_new"
          :rules="[
            {
              required: true,
              message: $t('table.password_new') + $t('table.not_empty')
            },
            {
              validator: userTypeValidator,
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model.trim="initPassword.password_new"
            type="password"
            show-password
            :placeholder="$t('table.password_new')"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div v-only="otherPermission.initPwd" class="submit">
        <el-button type="primary" @click="submitPassword">
          {{ $t('crud.submit') }}
        </el-button>
        <el-button @click="resetPassword">
          {{ $t('crud.reset') }}
        </el-button>
      </div>
    </el-card>
    <el-card class="box-card-log" v-only="otherPermission.logList">
      <LogPage />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      title="选择头像"
      width="400px"
      :show-close="false"
      :before-close="resetForm"
    >
      <div class="avatar-main">
        <div class="avatar-box" v-for="avatar in avatarList" :key="avatar.id">
          <el-avatar
            shape="square"
            style="width: 100px; height: 100px"
            :class="{ 'is-avatar': infoList.avatar_id == avatar.id }"
            :src="getAvatarImg(avatar.id)"
            @click="selectAvatar(avatar.id)"
            fit="contain"
          >
            <img :src="errImg" style="width: 100px; height: 100px" />
          </el-avatar>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">Cancel</el-button>
          <el-button type="primary" @click="submitForm">
            {{ $t('crud.submit') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getUserInfo, editUserInfo, initPwd } from '@/api/admin-config/profile';
import { RuleValidator } from '@/hook/RuleValidator';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue';
import LogPage from './components/log.vue';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';

export default defineComponent({
  name: 'profile',
  components: { LogPage },
  setup() {
    const errImg = require('@/assets/images/default_company_logo.png');

    const store = useStore();

    const dialogVisible = ref(false);

    const { getAvatarImg, avatarList } = dictionary();

    const infoList: Ref<any> = ref({});

    const initPassword = reactive({ password_old: '', password_new: '' });

    const defaultForm = ref({});

    const { proxy } = getCurrentInstance() as any;

    const otherPermission = {
      // 是否可以需改需要权限验证
      editInfo: 'profile:config:edit',
      initPwd: 'profile:config:initPwd',
      logList: 'profile:config:logList'
    };

    function getInfoList() {
      getUserInfo()
        .then((result: any) => {
          if (result.code == 1) {
            defaultForm.value = Object.assign({}, result.data);
            infoList.value = result.data;
            store.commit('userInfos/SET_USER', result.data);
          } else {
            infoList.value = {};
          }
        })
        .catch(() => {
          infoList.value = {};
        });
    }

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          editUserInfo(
            Object.assign({
              username: infoList.value.username,
              nickname: infoList.value.nickname,
              phone: infoList.value.phone,
              email: infoList.value.email,
              avatar_id: infoList.value.avatar_id
            })
          ).then((result: any) => {
            if (result.code == 1) {
              ElNotification.success(result.msg);
              getInfoList();
              dialogVisible.value = false;
            } else {
              resetForm();
            }
          });
        } else {
          console.log('error submit!');
          resetForm();
          return false;
        }
      });
    };

    const resetForm = () => {
      Object.assign(infoList.value, defaultForm.value);
      dialogVisible.value = false;
      setTimeout(() => {
        if (!proxy.$refs['ruleFormRef']) return;
        proxy.$refs['ruleFormRef'].clearValidate();
      });
    };

    const submitPassword = () => {
      if (!proxy.$refs['rulePasswordRef']) return;
      proxy.$refs['rulePasswordRef'].validate((valid: any) => {
        if (valid) {
          initPwd(initPassword)
            .then((result: any) => {
              if (result.code == 1) {
                ElNotification.success(result.msg);
              }
            })
            .finally(() => {
              resetPassword();
            });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    };

    const resetPassword = () => {
      Object.assign(initPassword, { password_old: '', password_new: '' });
      setTimeout(() => {
        if (!proxy.$refs['rulePasswordRef']) return;
        proxy.$refs['rulePasswordRef'].clearValidate();
      });
    };

    function selectAvatar(id: number) {
      infoList.value.avatar_id = id;
    }

    const {
      userTypeValidator,
      userPhoneValidator,
      userEmailValidator,
      userPasswordValidator
    } = RuleValidator();

    onMounted(() => {
      getInfoList();
    });

    return {
      infoList,
      submitForm,
      resetForm,
      userTypeValidator,
      userPhoneValidator,
      userEmailValidator,
      userPasswordValidator,
      otherPermission,
      initPassword,
      submitPassword,
      resetPassword,
      errImg,
      dialogVisible,
      getAvatarImg,
      avatarList,
      selectAvatar
    };
  }
});
</script>

<style lang="scss" scoped>
.user-center {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  .box-card-info {
    width: 53%;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 15%;
    min-height: 160px;
  }
  .password {
    width: 27%;
  }
  .box-card-log {
    width: 100%;
    flex-grow: 1;
    flex-shrink: 0;
  }
  .submit {
    text-align: center;
  }
  .avatar-btn {
    cursor: pointer;
  }
  .avatar-main {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    .avatar-box {
      margin: 5px 0;
    }
    .is-avatar {
      border: 1px solid brown !important;
      box-shadow: 3px 3px 10px brown;
    }
  }
}
</style>
