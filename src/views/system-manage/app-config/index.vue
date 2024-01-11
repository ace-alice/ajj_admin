<template>
  <div class="main-container">
    <crudOperation title="router.app-config">
      <template #query>
        <el-form-item :label="$t('table.app_type')" prop="app_type">
          <el-select
            v-model="crudQuery.app_type"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in appTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.app_version')" prop="app_version">
          <el-input
            v-model.trim="crudQuery.app_version"
            :placeholder="$t('table.app_version')"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.update_type')" prop="update_type">
          <el-select
            v-model="crudQuery.update_type"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in appUpdateTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="app_type"
            :label="$t('table.app_type')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{ getLabel(scope.row.app_type, appTypeOptions) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="app_version"
            :label="$t('table.app_version')"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="update_type"
            :label="$t('table.update_type')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.update_type, appUpdateTypeOptions)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="download_url"
            :label="$t('table.download_url')"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <el-tooltip
                placement="top"
                :content="scope.row.download_url"
                effect="light"
              >
                <el-button size="small">{{
                  $t('table.see_details')
                }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="app_explain"
            :label="$t('table.app_explain')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-tooltip placement="top" effect="light">
                <template #content>
                  <div v-html="scope.row.app_explain"></div>
                </template>
                <el-button size="small">{{
                  $t('table.see_details')
                }}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.create_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="140"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.id] })"
                :permission="crudPermission"
              >
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-form-item
            :label="$t('table.update_type')"
            prop="update_type"
            :rules="[
              {
                required: true,
                message: $t('table.update_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.update_type"
              popper-class="user-select"
            >
              <el-option
                v-for="item in appUpdateTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.app_type')"
            prop="app_type"
            :rules="[
              {
                required: true,
                message: $t('table.app_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.app_type"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in appTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.app_version')"
            prop="app_version"
            :rules="[
              {
                required: true,
                message: $t('table.app_version') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.app_version"
              :placeholder="$t('table.app_version')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.download_url')"
            prop="download_url"
            :rules="[
              {
                required: true,
                message: $t('table.download_url') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              :placeholder="$t('table.download_url')"
              style="width: 400px"
              clearable
              v-model.trim="proxyForm.download_url"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.app_explain')"
            prop="app_explain"
            :rules="[
              {
                required: true,
                message: $t('table.app_explain') + $t('table.not_empty')
              }
            ]"
          >
            <tinymce
              :value="proxyForm.app_explain"
              paramKey="app_explain"
              @input="crudTinymce"
              height="300"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/system-manage/app-config';
import { defineComponent, getCurrentInstance } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getLocal } from '@/utils/storage';
import { ElNotification } from 'element-plus';
import Tinymce from '@/components/Tinymce/index.vue';
import { uploadApi } from '@/api/Global/upload';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'APP',
  crudOptShow: {
    add: true,
    formSize: '70%'
  },
  defaultQuery: {
    update_type: null,
    app_version: null,
    app_type: null
  },
  crudMethod: { ...Api },
  crudTableParams: 'data',
  defaultForm: {
    id: null,
    update_type: 2,
    app_version: null,
    app_explain: null,
    app_type: 1,
    admin_id_create: null,
    admin_id_action: null,
    create_time: null,
    update_time: null,
    download_url: null,
    create_name: null,
    action_name: null
  },
  crudTag: 'system:app:'
};

export default defineComponent({
  name: 'app-config',
  components: { crudOperation, udOperation, Tinymce },
  props: {
    headers: {
      type: Object,
      default: () => uploadApi.headers
    },
    action: {
      type: String,
      default: () => uploadApi.fileUploadApi
    }
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const i18n = useI18n();

    const { proxy } = getCurrentInstance() as any;

    const baseApi = getLocal('baseApi');

    const { appTypeOptions, appUpdateTypeOptions, getLabel } = dictionary();

    function uploadSuccess(res: any) {
      console.log(res);
      crud.proxyForm.download_url = null;
      if (res.code != 1) {
        ElMessage.error(res.msg);
      } else {
        crud.proxyForm.download_url = res.data.file_url;
        ElNotification.success(res.message || res.msg);
      }
    }

    function uploadError(res: any) {
      console.log(res);
      crud.proxyForm.download_url = null;
      proxy.$refs['upload']!.clearFiles();
    }

    return {
      ...crud,
      appTypeOptions,
      appUpdateTypeOptions,
      getLabel,
      baseApi,
      uploadSuccess,
      uploadError
    };
  }
});
</script>

<style lang="scss" scoped>
.upload-icon {
  height: 100px;
  width: 100%;
  font-size: 60px;
  line-height: 130px;
}
:deep(.tinymce-box) {
  width: 100% !important;
}
</style>
