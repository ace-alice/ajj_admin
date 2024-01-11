<template>
  <div class="main-container">
    <crudOperation title="router.activity-record-discount">
      <template #query>
        <el-form-item label="时间范围">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
            @search="toQuery"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          border
          max-height="600px"
          show-summary
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="project_name"
            :label="$t('table.project_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="sum_anti_water"
            :label="$t('table.anti_water_amount')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="count_id"
            :label="$t('table.count_id')"
            min-width="120"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/rebate-report';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '返水报表',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'businessreport:rebate:'
};

export default defineComponent({
  name: 'rebate-report',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud };
  }
});
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}
:deep(.el-descriptions) {
  margin: 10px;
}
</style>
