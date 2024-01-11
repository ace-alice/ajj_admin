<template>
  <div class="main-container">
    <crudOperation title="router.bet-xj-sports">
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
            prop="order_id"
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
            prop="create_time"
            :label="$t('table.bet_betting_time')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="settle_time"
            :label="$t('table.bet_settlement_time')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="event_name"
            :label="$t('table.bet_game_name')"
            min-width="320"
            align="center"
          />
          <el-table-column
            prop="bet_status"
            :label="$t('table.bet_state')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.bet_status, xj_game_status_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="odds"
            :label="$t('table.bet_betting_odds')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.odds).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="stake"
            :label="$t('table.bet_amount')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.stake).toFixed(4) }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="scores"
            :label="$t('table.bet_valid_amount')"
            min-width="120"
            align="center"
          /> -->
          <el-table-column
            prop="return_amount"
            label="会员输赢"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                :style="{
                  color: scope.row.return_amount >= 0 ? 'red' : 'green'
                }"
                >{{ scope.row.return_amount }}</span
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
import Api from '@/api/bet-manage/bet-xj-sports';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { parseTime } from '@/utils/formatTime';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '小金体育',
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
  includeSumColumn: ['stake', 'return_amount'],
  crudTag: 'bet:xj:'
};

export default defineComponent({
  name: 'bet-xj-sports',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const dict: any = reactive({
      xj_game_status_options: []
    });

    onMounted(async () => {
      [dict.xj_game_status_options] = await Promise.all([
        getDicts('xj_game_status_options')
      ]);
    });

    return { ...crud, parseTime, ...toRefs(dict), getLabel };
  }
});
</script>
