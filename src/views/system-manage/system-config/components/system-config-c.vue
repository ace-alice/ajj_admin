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
        <nomalImageUpload
          @setImage="setTheForm"
          :formLabel="$t('table.favicon_url')"
          :data="form['favicon_url']"
          imgkey="favicon_id"
          imgUrlKey="favicon_url"
        />
        <nomalImageUpload
          @setImage="setTheForm"
          :formLabel="$t('table.login_bg_url')"
          :data="form['login_bg_url']"
          imgkey="login_bg_id"
          imgUrlKey="login_bg_url"
        />
        <nomalImageUpload
          @setImage="setTheForm"
          :formLabel="$t('table.logo_url')"
          :data="form['logo_url']"
          imgkey="logo_id"
          imgUrlKey="logo_url"
        />
        <el-form-item :label="$t('table.page_title')">
          <el-input v-model.trim="form.page_title" clearable />
        </el-form-item>
        <el-form-item :label="$t('table.system_name')">
          <el-input v-model.trim="form.system_name" clearable />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue';
import { systemEdit, systemInfo } from '@/api/system-manage/system-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'log-config',
  components: {
    nomalImageUpload
  },
  setup(props, { emit }) {
    const loading = ref(false);
    const store = useStore();

    let form = reactive({
      favicon_id: 0,
      favicon_url: '',
      login_bg_id: 0,
      login_bg_url: '',
      logo_id: '',
      logo_url: '',
      page_title: '',
      system_name: ''
    });
    function toQuery(tag?: boolean) {
      loading.value = true;
      systemInfo()
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(form, result.data);
            if (tag) {
              store.commit('userInfos/SET_USER_INIT', result.data);
            }
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      loading.value = true;
      systemEdit(form)
        .then((result: any) => {
          if (result.code == 1) {
            toQuery(true);
            ElNotification.success(result.msg);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const { captchaTypeOptions } = dictionary();

    // 设置form参数
    function setTheForm(data: any) {
      Object.assign(form, data);
    }

    const editPermission = {
      edit: 'system:system:edit'
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
      setTheForm,
      editPermission
    };
  }
});
</script>
