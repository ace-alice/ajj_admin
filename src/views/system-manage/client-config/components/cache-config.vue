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
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'bonus-config-limit',
  setup(props, { emit }) {
    const loading = ref(false);
    function toQuery() {
      loading.value = true;
    }
    function saveHandle() {}
    return { loading, toQuery, saveHandle };
  }
});
</script>
