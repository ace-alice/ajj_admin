<template>
  <div class="main-container" :key="comptKey">
    <crudOperation title="router.bet-pb-sports">
      <template #query>
        <el-form-item prop="username" :label="$t('table.bet_username')">
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
            prop="wager_id"
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
            prop="wager_date_fm"
            :label="$t('table.bet_betting_time')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.wager_date_fm
                  ? parseTime(new Date(scope.row.wager_date_fm))
                  : scope.row.wager_date_fm
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="settle_date_fm"
            :label="$t('table.bet_settlement_time')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.settle_date_fm
                  ? parseTime(new Date(scope.row.settle_date_fm))
                  : scope.row.settle_date_fm
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sport"
            :label="$t('table.bet_game_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="status"
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
            prop="scores"
            :label="$t('table.bet_valid_amount')"
            min-width="120"
            align="center"
          /> -->
          <el-table-column
            prop="win_loss"
            label="会员输赢"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                :style="{
                  color: scope.row.win_loss >= 0 ? 'red' : 'green'
                }"
                >{{ scope.row.win_loss }}</span
              >
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
import Api from '@/api/bet-manage/bet-pb-sports';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { defineComponent, onActivated, ref } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { parseTime } from '@/utils/formatTime';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.bet-pb-sports'),
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
  includeSumColumn: ['stake', 'win_loss'],
  crudTag: 'bet:pb:'
};

export default defineComponent({
  name: 'bet-pb-sports',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const comptKey = ref(new Date().getTime())
    onActivated(() => {
      comptKey.value = new Date().getTime()
    })
    return { ...crud, parseTime, comptKey };
  }
});
</script>
