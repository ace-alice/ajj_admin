<template>
  <div class="main-container">
    <crudOperation title="router.bet-ia-gaming">
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
            prop="order_number"
            :label="$t('table.bet_note_number')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.bet_username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.bet_betting_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.create_time
                  ? parseTime(new Date(scope.row.create_time))
                  : scope.row.create_time
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="game_name"
            :label="$t('table.bet_game_name')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="bonus_time"
            label="结算时间"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="event_name"
            :label="$t('table.bet_league')"
            min-width="120"
            align="center"
          />
          <el-table-column
            :label="$t('table.bet_game')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.team_name_one && scope.row.team_name_two"
                >{{ scope.row.team_name_one }} VS
                {{ scope.row.team_name_two }}</span
              >
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="desc"
            :label="$t('table.bet_betting_content')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="prize_status"
            :label="$t('table.bet_state')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.prize_status == 1 ? '赢' : '输' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="user_points"
            :label="$t('table.bet_betting_odds')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="odds"
            :label="$t('table.bet_settlement_odds')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="amount"
            :label="$t('table.bet_amount')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="bonus"
            :label="$t('table.bonus')"
            min-width="120"
            align="center"
          />
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
            label="游戏类型"
            prop="game_type"
            :rules="[
              {
                required: true,
                message: '游戏类型' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.game_type"
              @change="changeGame"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in ai_game_options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
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
import Api from '@/api/bet-manage/bet-ia-gaming';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { parseTime } from '@/utils/formatTime';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.bet-ia-gaming'),
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
    game_type: null,
    start: null,
    end: null
  },
  includeSumColumn: ['amount', 'bonus'],
  crudTag: 'bet:ia:'
};

export default defineComponent({
  name: 'bet-ia-gaming',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const dict: any = reactive({
      ai_game_options: []
    });

    function changeGame(val: any) {
      console.log(val);
    }

    onMounted(async () => {
      [dict.ai_game_options] = await Promise.all([getDicts('ai_game_options')]);
    });
    return { ...crud, parseTime, ...toRefs(dict), changeGame };
  }
});
</script>
