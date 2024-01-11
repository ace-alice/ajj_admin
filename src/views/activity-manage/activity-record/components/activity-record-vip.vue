<template>
  <div class="main-container">
    <crudOperation title="router.activity-record-vip">
      <template #query>
        <el-form-item :label="$t('table.order_generate_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.get_money_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="get_time_start"
            endKey="get_time_end"
            :propTime="[crudQuery.get_time_start, crudQuery.get_time_end]"
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
        <el-form-item :label="$t('table.reward_type')">
          <el-select
            v-model="crudQuery.type"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in reward_type_options"
              :key="item.label"
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
            prop="member_name"
            :label="$t('table.bet_username')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="status"
            :label="$t('table.receiving_status')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.status, receiving_status_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('table.reward_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.type, reward_type_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reward_amount"
            label="奖励金额"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.reward_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="vip_level"
            :label="$t('table.vip_level')"
            min-width="80"
            align="center"
          >
            <template #default="scope"> VIP{{ scope.row.vip_level }} </template>
          </el-table-column>
          <el-table-column
            prop="get_time"
            :label="$t('table.get_money_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.get_time">{{
                $parseTime(String(scope.row.get_time).padEnd(13, '0'))
              }}</span>
              <span v-else>--</span>
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
import Api from '@/api/activity-manage/activity-record/activity-record-vip';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'VIP奖励记录',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['reward_amount'],
  crudTag: 'activity:record:vip:'
};

export default defineComponent({
  name: 'activity-record-vip',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel } = dictionary();

    const dict = reactive({
      receiving_status_options: [],
      reward_type_options: []
    });

    onMounted(async () => {
      [dict.receiving_status_options, dict.reward_type_options] =
        await Promise.all([
          getDicts('receiving_status_options'),
          getDicts('reward_type_options')
        ]);
    });

    return {
      ...toRefs(dict),
      ...crud,
      getLabel
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
