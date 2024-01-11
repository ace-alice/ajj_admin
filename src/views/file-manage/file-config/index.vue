<template>
  <div class="main-container">
    <crudOperation title="router.file-config" ref="crudOperation">
      <template #query>
        <el-form-item :label="$t('table.file_ext')">
          <el-input
            v-model.trim="crudQuery.file_ext"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.file_name')">
          <el-input
            v-model.trim="crudQuery.file_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.group_name')">
          <el-select
            v-model="crudQuery.group_id"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in fileGroupList"
              :key="item.group_id"
              :label="item.group_name"
              :value="item.group_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.file_type')">
          <el-select
            v-model="crudQuery.file_type"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in fileTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.storage')">
          <el-select
            v-model="crudQuery.storage"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in storageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')">
          <el-select
            v-model="crudQuery.is_disable"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_front')">
          <el-select
            v-model="crudQuery.is_front"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.create_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="member_id"
          max-height="600px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="sort"
            :label="$t('table.sort')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.sort }}
              <el-button
                type="text"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @click="editFileFunc(scope.row, 'sort', 'number')"
              >
                <el-icon><edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="file_name"
            :label="$t('table.file_name')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <a
                class="download-link"
                :href="scope.row.file_url"
                target="_blank"
                >{{ scope.row.file_name }}</a
              >
              <el-button
                type="text"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @click="editFileFunc(scope.row, 'file_name')"
              >
                <el-icon><edit /></el-icon>
              </el-button>
              <Clipboard class="Clipboard" :content="scope.row.file_url">
                <template #label>
                  <svg-icon name="copy"></svg-icon>
                </template>
              </Clipboard>
            </template>
          </el-table-column>
          <el-table-column
            prop="file_id"
            :label="$t('table.file_id')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="file_url"
            label="图片预览"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.file_type != 'image'">--</span>
              <el-image
                v-if="scope.row.file_type == 'image'"
                style="width: 60px; height: 60px"
                :src="scope.row.file_url"
                :preview-src-list="[scope.row.file_url]"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="per_domain"
            :label="$t('table.per_domain')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.domain }}
              <el-button
                type="text"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @click="editFileFunc(scope.row, 'domain')"
              >
                <el-icon><edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="group_id"
            :label="$t('table.group_name')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.group_id"
                style="width: 120px"
                popper-class="user-select"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @change="editFile(scope.row)"
              >
                <el-option
                  v-for="item in fileGroupList"
                  :key="item.group_id"
                  :label="item.group_name"
                  :value="Number(item.group_id)"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="file_type"
            :label="$t('table.file_type')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.file_type"
                style="width: 120px"
                popper-class="user-select"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @change="editFile(scope.row)"
              >
                <el-option
                  v-for="item in fileTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_disable"
            :label="$t('table.is_disable')"
            min-width="130"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.file_id"
                :initValue="scope.row.is_disable"
                :options="isDisableOptions"
                :defaultParam="{
                  ids: [scope.row.file_id],
                  is_disable: scope.row.is_disable
                }"
                paramKey="is_disable"
                :changeFun="changeStatus"
                emitFunName="isDisable"
                :permission="otherPermission.is_disable"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_front"
            :label="$t('table.is_front')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-select
                v-model="scope.row.is_front"
                style="width: 120px"
                popper-class="user-select"
                :disabled="!crudFindRole.only(otherPermission.edit)"
                @change="editFile(scope.row)"
              >
                <el-option
                  v-for="item in isNot"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="100"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.file_id] })"
                :permission="crudPermission"
                :show="crudOptShow"
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
          <el-form-item :label="$t('table.file_name')" prop="file_name">
            <el-input
              v-model.trim="proxyForm.file_name"
              :placeholder="$t('table.file_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.file_type')">
            <el-select
              v-model="proxyForm.file_type"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in fileTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.is_front')">
            <el-select
              v-model="proxyForm.is_front"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in isNot"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
            />
          </el-form-item>
          <el-form-item :label="$t('table.group_name')" prop="group_id">
            <el-select
              v-model="proxyForm.group_id"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in fileGroupList"
                :key="item.group_id"
                :label="item.group_name"
                :value="item.group_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.file')" prop="file">
            <el-upload
              class="upload-demo"
              ref="upload"
              drag
              :headers="uploadApi.headers"
              :action="uploadApi.fileUploadApi"
              :limit="1"
              name="file"
              :data="proxyForm"
              :on-error="uploadError"
              :on-success="uploadSuccess"
            >
              <div class="upload-icon"><svg-icon name="type"></svg-icon></div>
              <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  先填写文件的基本信息然后选择文件自动上传
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/file-manage/file-config';
import { computed, defineComponent, getCurrentInstance, reactive } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { i18n } from '@/i18n';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus';
import { ElNotification } from 'element-plus';
import { getOperatorListHook } from '@/hook/getFileGroupList';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { parseTime } from '@/utils/formatTime';
import { ElMessageBox } from 'element-plus';
import { uploadApi } from '@/api/Global/upload';
import Clipboard from '@/components/Clipboard/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.file'),
  crudOptShow: {
    add: true,
    hideFooter: true,
    edit: false
  },
  defaultQuery: {
    file_ext: null,
    file_hash: null,
    file_md5: null,
    file_name: null,
    file_id: null,
    start_time: null,
    end_time: null,
    group_id: null,
    file_type: null,
    is_front: null,
    is_disable: -1,
    storage: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    group_id: 1,
    file_type: 'other',
    file_name: String(parseTime(new Date(), '{y}-{m}-{d}')) + ' upload',
    is_front: 0,
    sort: 1
  },
  crudTag: 'file:manage:'
};

export default defineComponent({
  name: 'file-config',
  components: {
    crudOperation,
    udOperation,
    Clipboard,
    dateTimePickerQuery,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    let storage: any = reactive({});

    let file_type: any = reactive({});

    const { proxy } = getCurrentInstance() as any;

    const { fileGroupList } = getOperatorListHook();

    const otherPermission = {
      is_disable: 'file:manage:disable',
      edit: 'file:manage:edit'
    };

    const storageList = computed(() => {
      let result: any[] = [];
      if (Object.keys(storage).length > 0) {
        for (const keyL of Object.keys(storage)) {
          result.push({ label: (storage as any)[keyL], value: keyL });
        }
      }
      return result;
    });

    const fileTypeList = computed(() => {
      let result: any[] = [];
      if (Object.keys(file_type).length > 0) {
        for (const keyL of Object.keys(file_type)) {
          result.push({ label: (file_type as any)[keyL], value: keyL });
        }
      }
      return result;
    });

    crud.crudHook.afterRefresh = (form: any) => {
      Object.assign(storage, form.storage);
      Object.assign(file_type, form.filetype);
      return true;
    };

    function handleClose() {
      proxy.$refs['upload']!.clearFiles();
      crud.crudSetProxyFormKey(defaultCrudOptions.defaultForm as any);
      proxy.$refs['crudOperation']!.handleClose();
      crud.refresh();
    }

    function uploadSuccess(res: any) {
      console.log(res);
      if (res.code != 1) {
        ElMessage.error(res.msg);
        proxy.$refs['upload']!.clearFiles();
      } else {
        ElNotification.success(res.message || res.msg);
      }
      proxy.$refs['upload']!.clearFiles();
      handleClose();
    }

    function uploadError(res: any) {
      console.log(res);
      proxy.$refs['upload']!.clearFiles();
    }

    const { isDisableOptions, isNot } = dictionary();

    function getDomain(url: string) {
      let str = url.match(/[(?<=http://)|(?<=https://)]+[\w\.]+[^/?#]/);
      if (str && str.length > 0) {
        return str[0];
      } else {
        return '';
      }
    }

    function editFile(form: any) {
      Api.edit(form)
        .then((res: any) => {
          if (res.code == 1) {
            ElNotification.success(res.msg || res.message);
            crud.refresh();
          } else {
            ElMessage.error(res.msg || res.message);
          }
        })
        .finally(() => {
          crud.refresh();
        });
    }

    const editFileFunc = (
      row: any,
      keyL: string,
      type: string = 'text',
      pattern: any = /^.+$/
    ) => {
      ElMessageBox.prompt('', '输入内容', {
        confirmButtonText: '修改',
        cancelButtonText: '放弃',
        inputPattern: pattern,
        inputErrorMessage: '输入内容不能为空',
        inputType: type
      })
        .then(async ({ value }: any) => {
          await editFile(Object.assign(row, { [keyL]: value }));
        })
        .catch(() => {
          ElMessage.info('放弃');
        });
    };

    return {
      ...crud,
      storageList,
      fileTypeList,
      isDisableOptions,
      isNot,
      Api,
      uploadApi,
      handleClose,
      uploadSuccess,
      uploadError,
      fileGroupList,
      otherPermission,
      editFile,
      getDomain,
      editFileFunc
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
.download-link {
  color: #666;
  text-decoration: none;
}
</style>
