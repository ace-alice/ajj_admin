<template>
  <div>
    <el-card class="main-container animate__animated animate__fadeInUp">
      <template #header>
        <div class="card-header">
          <el-button
            v-only="editPermission.edit"
            type="primary"
            :loading="loading"
            :icon="$iconMap.Check"
            @click="saveHandle"
          >
            {{ $t('crud.save') }}
          </el-button>
          <el-button
            :loading="loading"
            @click="toQuery"
            :icon="$iconMap.RefreshRight"
          >
            {{ $t('crud.reset') }}
          </el-button>
        </div>
      </template>
      <el-form
        :model="form"
        label-width="150px"
        ref="ruleFormRef"
        style="width: 500px"
        v-loading="loading"
      >
        <el-form-item :label="$t('table.email_host')">
          <el-input v-model.trim="form.email_host" style="width: 350px" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.email_port')">
          <el-input v-model.trim="form.email_port" style="width: 350px" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.email_secure')">
          <el-input
            v-model.trim="form.email_secure"
            style="width: 350px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.email_username')">
          <el-input
            v-model.trim="form.email_username"
            style="width: 350px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.email_password')">
          <el-input
            v-model.trim="form.email_password"
            style="width: 350px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.email_setfrom')">
          <el-input
            v-model.trim="form.email_setfrom"
            style="width: 350px"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('table.email_test')">
          <el-input v-model.trim="form.email_test" style="width: 350px" clearable />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import {
  emailInfo,
  emailEdit,
  emailTest
} from '@/api/system-manage/system-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'email-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      email_host: '',
      email_password: '',
      email_port: '',
      email_secure: '',
      email_setfrom: '',
      email_test: '',
      email_username: ''
    });
    function toQuery() {
      loading.value = true;
      emailInfo()
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(form, result.data);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      loading.value = true;
      emailEdit(form)
        .then((result: any) => {
          if (result.code == 1) {
            toQuery();
            ElNotification.success(result.msg);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const { captchaTypeOptions } = dictionary();

    const editPermission = {
      edit: 'system:email:edit'
    };

    onMounted(() => {
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      captchaTypeOptions,
      editPermission
    };
  }
});
</script>
