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
        <el-form-item :label="$t('table.captcha_login')">
          <el-switch
            v-model="form.captcha_login"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('table.captcha_register')">
          <el-switch
            v-model="form.captcha_register"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('table.sms_service_provider')">
          <el-select
            v-model="form.sms_service_provider"
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in sms_service_provider_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { captchaInfo, captchaEdit } from '@/api/system-manage/client-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';

export default defineComponent({
  name: 'captcha-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      captcha_login: 1,
      captcha_register: 1,
      sms_service_provider: null
    });

    let dict = reactive({
      sms_service_provider_options: []
    });

    function toQuery() {
      loading.value = true;
      captchaInfo()
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
      captchaEdit(form)
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
      edit: 'client:captcha:edit'
    };

    onMounted(() => {
      getDicts('sms_service_provider_options').then((res: any) => {
        if (res) {
          dict.sms_service_provider_options = res;
        }
      });
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      captchaTypeOptions,
      editPermission,
      ...toRefs(dict)
    };
  }
});
</script>
