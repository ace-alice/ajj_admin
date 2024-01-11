<template>
  <div>
    <el-card class="main-container">
      <template #header>
        <div class="card-header">
          <div>
            <el-button type="primary" @click="back">
              <el-icon><back /></el-icon> {{ $t('table.back') }}
            </el-button>
            {{ group_name }}
          </div>
          <div>
            <el-button type="primary" :loading="loading" @click="saveHandle">
              <el-icon><check /></el-icon> {{ $t('crud.save') }}
            </el-button>
            <el-button :loading="loading" @click="toQuery"
              ><el-icon><close /></el-icon> {{ $t('crud.reset') }}</el-button
            >
          </div>
        </div>
      </template>
      <el-form
        :model="form"
        label-width="120px"
        ref="ruleFormRef"
        inline
        v-loading="loading"
      >
        <el-form-item :label="$t('table.storage')">
          <el-select
            v-model="form.storage"
            style="width: 206px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in storageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-card shadow="never">
          <template #header>
            <span>{{ $t('lib.qiniu') }}</span>
          </template>
          <el-form-item :label="$t('table.accessKey')">
            <el-input
              v-model.trim="form.qiniu_access_key"
              :placeholder="$t('table.accessKey')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.secretKey')">
            <el-input
              v-model.trim="form.qiniu_secret_key"
              :placeholder="$t('table.secretKey')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.bucket')">
            <el-input
              v-model.trim="form.qiniu_bucket"
              :placeholder="$t('table.bucket')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.domain')">
            <el-input
              v-model.trim="form.qiniu_domain"
              :placeholder="$t('table.domain')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('lib.aliyun') }}</span>
          </template>
          <el-form-item :label="$t('table.accessKey')">
            <el-input
              v-model.trim="form.aliyun_access_key_id"
              :placeholder="$t('table.accessKey')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.secretKey')">
            <el-input
              v-model.trim="form.aliyun_access_key_secret"
              :placeholder="$t('table.secretKey')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.bucket')">
            <el-input
              v-model.trim="form.aliyun_bucket"
              :placeholder="$t('table.bucket')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.bucket_domain')">
            <el-input
              v-model.trim="form.aliyun_bucket_domain"
              :placeholder="$t('table.bucket_domain')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.endpoint')">
            <el-input
              v-model.trim="form.aliyun_endpoint"
              :placeholder="$t('table.endpoint')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('lib.tencent') }}</span>
          </template>
          <el-form-item :label="$t('table.secretId')">
            <el-input
              v-model.trim="form.tencent_secret_id"
              :placeholder="$t('table.secretId')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.secretKey')">
            <el-input
              v-model.trim="form.tencent_secret_key"
              :placeholder="$t('table.secretKey')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.bucket')">
            <el-input
              v-model.trim="form.tencent_bucket"
              :placeholder="$t('table.bucket')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.region')">
            <el-input
              v-model.trim="form.tencent_region"
              :placeholder="$t('table.region')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.domain')">
            <el-input
              v-model.trim="form.tencent_domain"
              :placeholder="$t('table.domain')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card> -->
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('table.image') }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model.trim="form.image_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model.trim="form.image_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('table.video') }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model.trim="form.video_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model.trim="form.video_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('table.audio') }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model.trim="form.audio_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model.trim="form.audio_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('table.word') }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model.trim="form.word_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model.trim="form.word_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
        <el-card shadow="never">
          <template #header>
            <span>{{ $t('table.other_file') }}</span>
          </template>
          <el-form-item :label="$t('table.file_ext')">
            <el-input
              v-model.trim="form.other_ext"
              :placeholder="$t('table.file_ext_pl')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_size')">
            <el-input
              v-model.trim="form.other_size"
              :placeholder="$t('table.file_size_pl')"
              clearable
            ></el-input>
          </el-form-item>
        </el-card>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { getUploadInfo, saveUploadInfo } from '@/api/file-manage/upload-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { useRoute, useRouter } from 'vue-router';
import { Check, Close, Back } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'uploadConfig',
  components: { Check, Close, Back },
  setup(props, { emit }) {
    const loading = ref(false);
    const route = useRoute();
    const router = useRouter();

    let form = reactive({
      aliyun_access_key_id: '',
      aliyun_access_key_secret: '',
      aliyun_bucket: '',
      aliyun_bucket_domain: '',
      aliyun_endpoint: '',
      audio_ext: '',
      audio_size: '',
      baidu_access_key: '',
      baidu_bucket: '',
      baidu_domain: '',
      baidu_endpoint: '',
      baidu_secret_key: '',
      create_time: '',
      delete_time: 0,
      image_ext: '',
      image_size: '',
      other_ext: '',
      other_size: '',
      qiniu_access_key: '',
      qiniu_bucket: '',
      qiniu_domain: '',
      qiniu_secret_key: '',
      setting_id: '',
      storage: '',
      tencent_bucket: '',
      tencent_domain: '',
      tencent_region: '',
      tencent_secret_id: '',
      tencent_secret_key: '',
      update_time: null,
      video_ext: '',
      video_size: '',
      word_ext: '',
      word_size: ''
    });

    const group_name = computed(() => {
      return route.query.group_name;
    });

    let storage = reactive({});

    const storageList = computed(() => {
      let result: any[] = [];
      if (Object.keys(storage).length > 0) {
        for (const keyL of Object.keys(storage)) {
          result.push({ label: (storage as any)[keyL], value: keyL });
        }
      }
      return result;
    });

    function toQuery() {
      loading.value = true;
      getUploadInfo({ group_id: route.query.group_id })
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(form, result.data.setting);
            Object.assign(storage, result.data.storage);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      loading.value = true;
      saveUploadInfo(form)
        .then((result: any) => {
          if (result.code == 1) {
            ElNotification.success(result.msg);
          }
        })
        .finally(() => {
          toQuery();
          loading.value = false;
        });
    }

    const { storageTypeOptions } = dictionary();

    function back() {
      router.push({ path: '/file-manage/file-group-manage' });
    }

    onMounted(() => {
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      storageTypeOptions,
      group_name,
      storageList,
      back
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  margin-top: 5px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  div {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>
