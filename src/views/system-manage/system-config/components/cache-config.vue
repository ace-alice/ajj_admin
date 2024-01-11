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
        <el-form-item :label="$t('table.cache_type')">
          <el-input v-model.trim="form.cache_type" clearable />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { cacheInfo, cacheClear } from '@/api/system-manage/system-config';
import { ElNotification } from 'element-plus';

export default defineComponent({
  name: 'cache-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive({
      cache_type: ''
    });
    function toQuery() {
      loading.value = true;
      cacheInfo()
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
      cacheClear()
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
      edit: 'system:cache:clear'
    };

    onMounted(() => {
      toQuery();
    });
    return { loading, toQuery, saveHandle, form, editPermission };
  }
});
</script>
