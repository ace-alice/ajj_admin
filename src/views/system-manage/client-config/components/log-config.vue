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
        <el-form-item :label="$t('table.log_switch')">
          <el-switch
            v-model="form.log_switch"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item :label="$t('table.log_save_time')">
          <el-input-number
            v-model="form.log_save_time"
            style="width: 350px"
            :step="1"
            step-strictly
            :min="0"
          />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { logInfo, logEdit } from '@/api/system-manage/client-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'log-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      log_save_time: 1,
      log_switch: 1
    });
    function toQuery() {
      loading.value = true;
      logInfo()
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
      logEdit(form)
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
      edit: 'client:log:edit'
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
