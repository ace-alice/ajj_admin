<template>
  <div class="main-container">
    <crudOperation title="router.bet-sb-sports">
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
          show-summary
          max-height="600px"
          :summary-method="getSummaries"
          row-key="id"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="order_number"
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
            prop="transaction_time"
            :label="$t('table.bet_betting_time')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.transaction_time
                  ? parseTime(new Date(scope.row.transaction_time))
                  : scope.row.transaction_time
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="settlement_time"
            :label="$t('table.bet_settlement_time')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.settlement_time
                  ? parseTime(new Date(scope.row.settlement_time))
                  : scope.row.settlement_time
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="leaguename"
            :label="$t('table.bet_game_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="ticket_status"
            :label="$t('table.bet_state')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="odds"
            :label="$t('table.bet_betting_odds')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="stake"
            :label="$t('table.bet_amount')"
            min-width="120"
            align="center"
          />
          <!-- <el-table-column
            prop="stake"
            :label="$t('table.bet_valid_amount')"
            min-width="120"
            align="center"
          /> -->
          <el-table-column
            prop="winlost_amount"
            label="公司输赢"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                :style="{
                  color: scope.row.winlost_amount >= 0 ? 'red' : 'green'
                }"
              >
                {{ scope.row.winlost_amount }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="160px"
        >
          <el-form-item
            label="补单时间"
            prop="start"
            :rules="[
              {
                required: true,
                message: '补单时间' + $t('table.not_empty')
              }
            ]"
          >
            <dateTimePickerQuery
              @setTime="setTheForm"
              unlink-panels
              :isQueryForm="false"
              :propTime="[proxyForm.start, proxyForm.end]"
              startKey="start"
              endKey="end"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/bet-manage/bet-sb-sports';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { defineComponent } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { parseTime } from '@/utils/formatTime';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.bet-sb-sports'),
  crudOptShow: {
    pullOrder: true,
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
  includeSumColumn: ['stake', 'winlost_amount'],
  crudTag: 'bet:sb:'
};

export default defineComponent({
  name: 'bet-sb-sports',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud, parseTime };
  }
});
</script>
