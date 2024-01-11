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
            :icon="$iconMap.RefreshLeft"
            >{{ $t('crud.reset') }}</el-button
          >
        </div>
      </template>
      <el-form
        :model="form"
        label-width="150px"
        ref="ruleFormRef"
        style="width: 500px"
        v-loading="loading"
      >
        <NomalImageUpload
          @setImage="setTheFormBg"
          :formLabel="$t('table.upload_splash_bg')"
          :data="form[0].file_path"
          imgkey="file_id"
          imgUrlKey="file_path"
        />
        <NomalImageUpload
          @setImage="setTheFormContent"
          :formLabel="$t('table.upload_splash_content')"
          :data="form[1].file_path"
          imgkey="file_id"
          imgUrlKey="file_path"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import {
  getSplashScreen,
  editSplashScreen
} from '@/api/market-manage/market-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';

export default defineComponent({
  name: 'log-config',
  components: { NomalImageUpload },
  setup(props, { emit }) {
    const loading = ref(false);

    let form = reactive([
      {
        acreate_time: 0,
        admin_name: '0',
        file_path: null,
        file_id: null
      },
      {
        acreate_time: 0,
        admin_name: '0',
        file_path: null,
        file_id: null
      }
    ]);
    function toQuery() {
      loading.value = true;
      getSplashScreen({})
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(form, result.data.data);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      loading.value = true;
      editSplashScreen(form)
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
      edit: 'client:token:edit'
    };

    function setTheFormBg(value: any) {
      Object.assign(form[0], value);
    }

    function setTheFormContent(value: any) {
      Object.assign(form[1], value);
    }

    onMounted(() => {
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      captchaTypeOptions,
      editPermission,
      setTheFormBg,
      setTheFormContent
    };
  }
});
</script>
