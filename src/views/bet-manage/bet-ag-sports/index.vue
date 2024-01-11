<template>
  <div class="main-container">
    <crudOperation title="router.bet-ag-sports">
      <template #query>
        <el-form-item :label="$t('table.bet_username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.bet_note_number')">
          <el-input
            v-model.trim="crudQuery.order_id"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="投注时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="startTime"
            endKey="endTime"
            :propTime="[crudQuery.startTime, crudQuery.endTime]"
          />
        </el-form-item>
        <el-form-item label="结算时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="settleStartTime"
            endKey="settleEndTime"
            :propTime="[crudQuery.settleStartTime, crudQuery.settleEndTime]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          show-summary
          :summary-method="getSummaries"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="bill_no"
            :label="$t('table.bet_note_number')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.bet_username')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="game_type"
            label="游戏类型"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="platform_type"
            label="平台类型"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.bet_betting_time')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}') }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bet_amount"
            :label="$t('table.bet_amount')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.bet_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="scores"
            :label="$t('table.bet_valid_amount')"
            min-width="120"
            align="center"
          /> -->
          <el-table-column
            prop="net_amount"
            label="会员输赢"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                :style="{
                  color: scope.row.net_amount >= 0 ? 'red' : 'green'
                }"
                >{{ scope.row.net_amount }}</span
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/bet-manage/bet-ag-sports';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { parseTime } from '@/utils/formatTime';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'AG真人',
  crudOptShow: {
    download: true
  },
  defaultQuery: {
    order: null,
    username: null,
    start_time: null,
    end_time: null
  },
  crudMethod: { ...Api },
  crudTableParams: 'data',
  defaultForm: {
    start: null,
    end: null
  },
  includeSumColumn: ['bet_amount', 'net_amount']
};

export default defineComponent({
  name: 'bet-ag-sports',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud, parseTime };
  }
});
</script>
