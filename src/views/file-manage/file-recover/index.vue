<template>
  <div class="main-container">
    <crudOperation title="router.file-recover">
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
          <!-- <el-input
            v-model.trim="crudQuery.file_name"
            clearable
            style="width: 200px"
          ></el-input> -->
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
            prop="file_name"
            :label="$t('table.file_name')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.file_name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="file_id"
            :label="$t('table.file_id')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="per_domain"
            :label="$t('table.per_domain')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.domain }}
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
                :disabled="true"
              >
                <el-option
                  v-for="item in fileGroupList"
                  :key="item.group_id"
                  :label="item.group_name"
                  :value="item.group_id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            prop="file_type"
            :label="$t('table.file_type')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="is_front"
            :label="$t('table.is_front')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.is_front, isNot) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="160"
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
                <template #right>
                  <el-button
                    type="text"
                    v-only="otherPermission.reco"
                    @click="toRecover(scope.row)"
                    >{{ $t('table.recover') }}</el-button
                  >
                </template>
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/file-manage/recover';
import { computed, defineComponent, reactive, ref } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { i18n } from '@/i18n';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getOperatorListHook } from '@/hook/getFileGroupList';
import { ElMessage } from 'element-plus';
import { ElNotification } from 'element-plus';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.file'),
  crudOptShow: {
    operate: false,
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
    group_id: null,
    file_type: null,
    file_name: null,
    is_front: null,
    sort: 1
  },
  crudTag: 'file:recover:'
};

export default defineComponent({
  name: 'file-recover',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    let file_type: any = reactive({});

    const { fileGroupList } = getOperatorListHook();

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
      Object.assign(file_type, form.filetype);
      return true;
    };

    const dialogVisible = ref(false);

    const { isDisableOptions, isNot, getLabel } = dictionary();

    function toRecover(row: any) {
      Api.recoverReco({ ids: [row.file_id] }).then((res: any) => {
        if (res.code != 1) {
          ElMessage.error(res.msg);
        } else {
          ElNotification.success(res.message || res.msg);
          crud.refresh();
        }
      });
    }

    const otherPermission = {
      //是否可以需改需要权限验证
      reco: 'file:recover:reco'
    };

    return {
      ...crud,
      fileTypeList,
      isDisableOptions,
      isNot,
      Api,
      dialogVisible,
      fileGroupList,
      otherPermission,
      toRecover,
      getLabel
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
