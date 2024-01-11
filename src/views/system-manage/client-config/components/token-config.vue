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
        <el-form-item :label="$t('table.token_key')">
          <el-input v-model.trim="form.token_key" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.token_exp')">
          <el-input-number
            v-model="form.token_exp"
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
import { tokenInfo, tokenEdit } from '@/api/system-manage/client-config';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'token-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      token_key: '',
      token_exp: 0
    });
    function toQuery() {
      loading.value = true;
      tokenInfo()
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
      tokenEdit(form)
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

    const editPermission = {
      edit: 'client:token:edit'
    };

    onMounted(() => {
      toQuery();
    });
    return { loading, toQuery, saveHandle, form, editPermission };
  }
});
</script>
