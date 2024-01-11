<template>
  <div class="main-container">
    <crudOperation title="router.proxy-profit">
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
        <el-form-item :label="$t('table.agent_account')">
          <el-input
            v-model.trim="crudQuery.username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.direct_superior')">
          <el-input
            v-model.trim="crudQuery.senior_username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.proxy_level')">
          <el-select
            v-model="crudQuery.level"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in agent_level_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.bet_amount')">
          <el-input v-model.trim="crudQuery.bet_min" style="width: 95px" />
          -
          <el-input v-model.trim="crudQuery.bet_max" style="width: 95px" />
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
            label="日期"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.agent_account')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="hierarchy"
            :label="$t('table.proxy_level')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.hierarchy, agent_level_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="senior_member_username"
            :label="$t('table.direct_superior')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_bet"
            :label="$t('table.total_bet')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_bet).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_profit"
            :label="$t('table.vip_payment')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_profit).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_venue_fee"
            :label="$t('table.venue_fee')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_venue_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_rebate"
            :label="$t('table.vip_rebase')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_discount_vip"
            :label="$t('table.vip_activity_discount')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_discount_vip).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_discount_base"
            :label="$t('table.vip_discount')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_discount_base).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_deposit_fee"
            :label="$t('table.vip_save_fee')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_deposit_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_withdrawal_fee"
            :label="$t('table.vip_withdraw_fee')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_withdrawal_fee).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_commission"
            :label="$t('table.rebase_money')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_commission).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_surplus"
            :label="$t('table.last_month_rest')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_surplus).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_justify"
            :label="$t('table.pure_bonus')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_justify).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="active_member"
            :label="$t('table.active_prople_count')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="active_member_effective"
            :label="$t('table.pure_active_prople_count')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="register_user"
            label="注册人数"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="first_deposit_user"
            label="首充人数"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="deposit_user"
            label="充值人数"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="deposit_amount"
            label="当天总存款"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.deposit_amount).toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/proxy-profit';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '代理盈亏',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {},
  unfixedSum: [
    'active_member',
    'active_member_effective',
    'register_user',
    'first_deposit_user',
    'deposit_user'
  ],
  excludeSumColumn: ['username', 'date', 'hierarchy', 'senior_member_username'],
  crudTag: 'report:proxyprofit:'
};

export default defineComponent({
  name: 'proxy-profit',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();
    const dict = reactive({
      agent_level_options: []
    });
    onMounted(async () => {
      [dict.agent_level_options] = await Promise.all([
        getDicts('agent_level_options')
      ]);
    });
    return { ...crud, getLabel, ...toRefs(dict) };
  }
});
</script>

<style></style>
