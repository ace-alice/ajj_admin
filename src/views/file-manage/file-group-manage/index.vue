<template>
  <div class="main-container">
    <crudOperation title="router.file-group-manage">
      <template #query>
        <el-form-item :label="$t('table.group_name')">
          <el-input
            v-model.trim="crudQuery.group_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.group_desc')">
          <el-input
            v-model.trim="crudQuery.group_desc"
            clearable
            style="width: 200px"
          ></el-input>
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
            prop="group_name"
            :label="$t('table.group_name')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="group_desc"
            :label="$t('table.group_desc')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="is_disable"
            :label="$t('table.is_disable')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.group_name"
                :initValue="scope.row.is_disable"
                :options="isDisableOptions"
                :defaultParam="{
                  ids: [scope.row.group_id],
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
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
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
            min-width="220"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.group_id] })"
                :permission="crudPermission"
              >
                <template #right>
                  <el-button
                    type="text"
                    v-only="otherPermission.uploadConfig"
                    @click="toPath(scope.row)"
                    >{{ $t('router.upload-config') }}</el-button
                  >
                </template>
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
            :label="$t('table.group_name')"
            prop="group_name"
            :rules="[
              {
                required: true,
                message: $t('table.group_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.group_name"
              :placeholder="$t('table.group_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.group_desc')" prop="group_desc">
            <el-input
              v-model.trim="proxyForm.group_desc"
              :placeholder="$t('table.group_desc')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="group_sort">
            <el-input-number
              v-model="proxyForm.group_sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
            />
          </el-form-item>
          <!-- <el-form-item :label="$t('table.is_disable')" prop="is_disable">
            <el-switch
              v-model="proxyForm.is_disable"
              style="width: 185px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item> -->
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/file-manage/file-group-manage';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { i18n } from '@/i18n';
import { dictionary } from '@/hook/lib';
import { dateTimePickerQuery } from '@/components/dateComponents';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { useRouter } from 'vue-router';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.file_group'),
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    group_name: null,
    group_desc: null,
    is_disable: -1,
    group_id: null,
    start_time: null,
    end_time: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    group_name: null,
    group_desc: null,
    is_disable: 0,
    group_id: null,
    group_sort: 1
  },
  crudTag: 'file:group:'
};

export default defineComponent({
  name: 'file-group-manage',
  components: {
    crudOperation,
    udOperation,
    dateTimePickerQuery,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const router = useRouter();

    const otherPermission = {
      //是否可以需改需要权限验证
      is_disable: 'file:group:disable',
      uploadConfig: 'file:group:config'
    };

    function toPath(row: any) {
      router.push({
        name: 'uploadConfig',
        query: { group_id: row.group_id, group_name: row.group_name }
      });
    }

    const { isDisableOptions } = dictionary();

    return { ...crud, isDisableOptions, otherPermission, toPath };
  }
});
</script>
