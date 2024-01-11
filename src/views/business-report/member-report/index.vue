<template>
  <div class="main-container">
    <crudOperation title="router.member-report">
      <template #query>
        <el-form-item label="时间范围">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
            @search="toQuery"
          />
        </el-form-item>
        <el-form-item prop="username" :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.danger_status') /**风控层级*/">
          <el-select
            v-model="crudQuery.risk_control_mark_id"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in riskTypeList"
              :key="item.value"
              :label="item.risk_level"
              :value="item.id"
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
          :default-sort="{ prop: null, order: null }"
          @sort-change="sortChange"
          max-height="600px"
          :summary-method="getSummaries"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="date"
            :label="$t('table.bet_date')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="risk_control_mark"
            :label="$t('table.risk_level')"
            min-width="100"
            align="center"
          />
          <el-table-column align="center" :label="$t('table.IA_sport_profit')">
            <el-table-column
              prop="ia_bet"
              :label="$t('table.IA_sport_bet')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_growth"
              :label="$t('table.bet_compare_change')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_growth).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_profit"
              :label="$t('table.IA_bet_profit')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_net_profit"
              :label="$t('table.pure_earn')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_net_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_profit_ratio"
              :label="$t('table.earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_net_profit_ratio"
              :label="$t('table.pure_earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_net_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_rebate_ratio"
              :label="$t('table.rebate_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_rebate_ratio).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.PB_sport_profit')">
            <el-table-column
              prop="pinnacle_bet"
              :label="$t('table.PB_sport_bet')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_growth"
              :label="$t('table.bet_compare_change')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_growth).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_profit"
              :label="$t('table.PB_bet_profit')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_net_profit"
              :label="$t('table.pure_earn')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_net_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_profit_ratio"
              :label="$t('table.earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_net_profit_ratio"
              :label="$t('table.pure_earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_net_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_rebate_ratio"
              :label="$t('table.rebate_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_rebate_ratio).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.SB_sport_profit')">
            <el-table-column
              prop="saba_bet"
              :label="$t('table.SB_sport_bet')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_growth"
              :label="$t('table.bet_compare_change')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_growth).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_profit"
              :label="$t('table.SB_bet_profit')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_net_profit"
              :label="$t('table.pure_earn')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_net_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_profit_ratio"
              :label="$t('table.earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_net_profit_ratio"
              :label="$t('table.pure_earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_net_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_rebate_ratio"
              :label="$t('table.rebate_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_rebate_ratio).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.XJ_sport_profit')">
            <el-table-column
              prop="xj_bet"
              :label="$t('table.XJ_sport_bet')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_growth"
              :label="$t('table.bet_compare_change')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_growth).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_profit"
              :label="$t('table.XJ_bet_profit')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_net_profit"
              :label="$t('table.pure_earn')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_net_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_profit_ratio"
              :label="$t('table.earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_net_profit_ratio"
              :label="$t('table.pure_earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_net_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_rebate_ratio"
              :label="$t('table.rebate_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_rebate_ratio).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.AG_sport_profit')">
            <el-table-column
              prop="ag_bet"
              :label="$t('table.AG_sport_bet')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_growth"
              :label="$t('table.bet_compare_change')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_growth).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_profit"
              :label="$t('table.AG_bet_profit')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_net_profit"
              :label="$t('table.pure_earn')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_net_profit).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_profit_ratio"
              :label="$t('table.earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_net_profit_ratio"
              :label="$t('table.pure_earn_effort_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_net_profit_ratio).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_rebate_ratio"
              :label="$t('table.rebate_rate')"
              min-width="120"
              sortable="custom"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_rebate_ratio).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="discount_base"
            :label="$t('table.activity_bonus')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.discount_base).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="discount_vip"
            label="VIP活动"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.discount_vip).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ia_rebate"
            :label="$t('table.IA_rebase')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.ia_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="pinnacle_rebate"
            :label="$t('table.PB_rebase')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.pinnacle_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="saba_rebate"
            :label="$t('table.SB_rebase')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.saba_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xj_rebate"
            label="小金返水"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.xj_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="ag_rebate"
            label="AG返水"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.ag_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="risk_reimburse"
            label="风控补偿"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.risk_reimburse).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="risk_deduct"
            label=" 风控扣减"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.risk_deduct).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="agent_commission"
            :label="$t('table.proxy_comission')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.agent_commission).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_net_profit"
            :label="$t('table.pure_profit')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_net_profit).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="deposit_fee"
            :label="$t('table.save_fee')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.deposit_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="withdraw_fee"
            :label="$t('table.withdraw_fee')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.withdraw_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_venue_fee"
            :label="$t('table.venue_fee')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_venue_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="settlement_profit"
            :label="$t('table.final_profit')"
            min-width="120"
            sortable="custom"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.settlement_profit).toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/member-report';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { defineComponent, ref, watch } from 'vue';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getRiskTypeListHook } from '@/hook/getRiskTypeList';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '会员报表',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {},
  excludeSumColumn: [
    'username',
    'risk_control_mark',
    'date',
    'ia_profit_ratio',
    'ia_net_profit_ratio',
    'ia_rebate_ratio',
    'pinnacle_profit_ratio',
    'pinnacle_net_profit_ratio',
    'pinnacle_rebate_ratio',
    'xj_profit_ratio',
    'xj_net_profit_ratio',
    'xj_rebate_ratio',
    'saba_profit_ratio',
    'saba_net_profit_ratio',
    'saba_rebate_ratio',
    'ag_profit_ratio',
    'ag_net_profit_ratio',
    'ag_rebate_ratio'
  ],
  crudTag: 'report:memberreport:'
};

export default defineComponent({
  name: 'member-report',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const sortParams: any = ref(null);

    function sortChange(row: any) {
      sortParams.value = {
        [row.prop]: null
      };
      if (row.order === 'ascending') {
        sortParams.value[row.prop] = 1;
      } else if (row.order === 'descending') {
        sortParams.value[row.prop] = 2;
      }
    }

    const { riskTypeList } = getRiskTypeListHook({
      risk_type: 1
    });

    watch(
      () => sortParams,
      () => {
        crud.toQuery(sortParams.value);
      },
      {
        deep: true
      }
    );

    return { ...crud, sortChange, riskTypeList };
  }
});
</script>

<style></style>
