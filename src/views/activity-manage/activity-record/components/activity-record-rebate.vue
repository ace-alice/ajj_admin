<template>
  <div class="main-container">
    <crudOperation title="router.activity-record-rebate">
      <template #query>
        <el-form-item :label="$t('table.order_generate_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <!-- <el-form-item :label="$t('table.order_number')">
          <el-input
            v-model.trim="crudQuery.order_id"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('table.bet_username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          border
          show-summary
          max-height="750px"
          :summary-method="getSummaries"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <!-- <el-table-column
            prop="order_id"
            :label="$t('table.order_number')"
            min-width="140"
            align="center"
          /> -->
          <el-table-column
            prop="username"
            :label="$t('table.bet_username')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="valid_bet_amount"
            :label="$t('table.bet_valid_amount')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.valid_bet_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="$t('table.anti_water_amount')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="venue"
            :label="$t('table.venue_name')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <span>{{ getLabel(scope.row.venue, venue_options) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.order_generate_time')"
            min-width="160"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-record/activity-record-rebate';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '返水记录',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['valid_bet_amount', 'amount'],
  crudTag: 'activity:record:rebate:'
};

export default defineComponent({
  name: 'activity-record-rebate',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel } = dictionary();

    const dict = reactive({
      venue_options: []
    });

    onMounted(async () => {
      [dict.venue_options] = await Promise.all([getDicts('venue_options')]);
    });

    return {
      getLabel,
      ...crud,
      ...toRefs(dict)
    };
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
