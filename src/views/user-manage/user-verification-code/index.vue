<template>
  <div class="main-container">
    <crudOperation title="router.user-verification-code">
      <template #query>
        <!-- <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('table.mark')">
          <el-input
            v-model.trim="crudQuery.phone"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.date_value_create')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="750px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <!-- <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="100"
            align="center"
          /> -->
          <el-table-column
            prop="create_time"
            :label="$t('table.date_value_create')"
            min-width="160"
            align="center"
            sortable
          />
          <el-table-column
            prop="expired_time"
            :label="$t('table.update_date')"
            min-width="160"
            align="center"
            sortable
          />
          <el-table-column
            prop="code"
            :label="$t('table.code')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="phone"
            :label="$t('table.mark')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="is_use"
            :label="$t('table.is_use')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <el-tag :type="scope.row.is_use ? '' : 'info'">{{
                getLabel(scope.row.is_use, isUseOptions)
              }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/user-manage/user-verification-code';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '审核',
  crudOptShow: {
    operate: false
  },
  crudTableParams: 'data',
  defaultQuery: {
    username: null,
    code: null,
    date_value_create: []
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'account:line:'
};

export default defineComponent({
  name: 'user-verification-code',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel, isUseOptions } = dictionary();

    return { ...crud, getLabel, isUseOptions };
  }
});
</script>
