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
          <!-- <el-button @click="downPdf" :disabled="!pdfInfo.url">
            <el-icon><Download /></el-icon>
            {{ $t('table.seeAgent') }}</el-button
          > -->
        </div>
      </template>
      <el-form
        :model="form"
        label-width="150px"
        ref="ruleFormRef"
        style="width: 500px"
        v-loading="loading"
        label-position="top"
      >
        <NomalImageUpload
          @setImage="setTheForm"
          :formLabel="$t('table.agent_agreement_label')"
          :data="form.pdf_path"
          imgkey="file_id"
          imgUrlKey="pdf_path"
        />
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from 'vue';
import { ElNotification } from 'element-plus';
import { uploadApi } from '@/api/Global/upload';
import { getProtocol, uploadProtocol } from '@/api/market-manage/market-config';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';

const defaultPdfInfo = {
  admin_update_id: null,
  update_name: null,
  id: null,
  file_id: null,
  pdf_path: null,
  update_time: null
};

export default defineComponent({
  name: 'agent-agreement',
  components: { NomalImageUpload },
  setup(props, { emit }) {
    const loading = ref(false);

    const uploadBase = uploadApi;

    const form = reactive(Object.assign({}, defaultPdfInfo));

    const uploadKey = ref(new Date().valueOf);

    const { proxy } = getCurrentInstance() as any;

    function toQuery() {
      if (proxy.$refs['ruleFormRef']) {
        proxy.$refs['ruleFormRef'].resetFields();
      }
      getProtocol().then((res: any) => {
        if (res.code == 1) {
          Object.assign(form, res.data);
        } else {
          Object.assign(form, defaultPdfInfo);
        }
      });
    }

    function saveHandle() {
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          loading.value = true;
          uploadProtocol(form)
            .then((result: any) => {
              if (result.code == 1) {
                toQuery();
                ElNotification.success(result.msg);
              }
            })
            .finally(() => {
              loading.value = false;
            });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    const editPermission = {
      edit: 'market:agreement:edit'
    };

    function setTheForm(value: any) {
      Object.assign(form, value);
    }

    onMounted(() => {
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      editPermission,
      uploadBase,
      uploadKey,
      setTheForm
    };
  }
});
</script>

<style lang="scss" scoped>
.upload-icon {
  height: 130px;
  width: 100%;
  font-size: 60px;
  line-height: 130px;
}
</style>
