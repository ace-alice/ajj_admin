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
        <el-form-item :label="$t('table.captcha_switch')">
          <el-switch
            v-model="form.captcha_switch"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('table.captcha_type')">
          <el-select v-model="form.captcha_type" style="width: 350px">
            <el-option
              v-for="item in captchaTypeOptions"
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
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { captchaInfo, captchaEdit } from '@/api/system-manage/system-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';

export default defineComponent({
  name: 'captcha-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      captcha_switch: 1,
      captcha_type: 1
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

    const captchaTypeOptions = ref([]);

    const editPermission = {
      edit: 'system:captcha:edit'
    };

    onMounted(async () => {
      toQuery();
      const captchaTypeList = await getDicts('captcha_type_options');
      if (captchaTypeList) captchaTypeOptions.value = captchaTypeList;
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
