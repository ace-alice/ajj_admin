<template>
  <div class="main-container">
    <crudOperation title="router.file-config" ref="crudOperation">
      <template #query>
        <el-form-item :label="$t('table.file_name')">
          <el-input
            v-model.trim="crudQuery.file_name"
            clearable
            style="width: 200px"
          ></el-input>
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
            prop="file_id"
            :label="$t('table.file_id')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="file_name"
            :label="$t('table.file_name')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <a
                style="cursor: pointer"
                class="download-link"
                :href="scope.row.file_url"
                target="_blank"
                >{{ scope.row.file_name }}</a
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="file_type"
            :label="$t('table.file_type')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>文档</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="group_id"
            :label="$t('table.group_name')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>报表导出</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/file-manage/report-export';
import { defineComponent } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '报表导出',
  crudOptShow: {
    add: true,
    hideFooter: true,
    edit: false
  },
  crudTableParams: 'data',
  defaultQuery: {
    file_name: null,
    start_time: null,
    end_time: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'file:export:'
};

export default defineComponent({
  name: 'file-config',
  components: {
    crudOperation,
    dateTimePickerQuery
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    return {
      ...crud,
      Api
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
