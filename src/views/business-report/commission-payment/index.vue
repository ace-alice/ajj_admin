<template>
  <div class="main-container">
    <crudOperation title="router.commission-payment">
      <template #query>
        <el-form-item label="时间范围">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            pickerType="monthrange"
            defaultTime="month"
            valueFormat="YYYY-MM"
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
            :label="$t('table.month')"
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
            prop="status_game"
            :label="$t('table.account_status')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <el-tag
                type="info"
                style="margin: 5px"
                v-show="scope.row.status_game"
                >{{ getLabel(2, account_status_options) }}</el-tag
              >
              <el-tag
                type="warning"
                style="margin: 5px"
                v-show="scope.row.status_login"
                >{{ getLabel(3, account_status_options) }}</el-tag
              >
              <el-tag
                type="danger"
                style="margin: 5px"
                v-show="scope.row.status_pay"
                >{{ getLabel(1, account_status_options) }}</el-tag
              >
              <el-tag
                type="success"
                style="margin: 5px"
                v-show="
                  !(
                    scope.row.status_game ||
                    scope.row.status_login ||
                    scope.row.status_pay
                  )
                "
                >{{ getLabel(0, account_status_options) }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column
            prop="commission_remain"
            :label="$t('table.deserved_bonus')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_remain).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_actual_rebate"
            label="实发返佣金额"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_actual_rebate).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_blow"
            :label="$t('table.sub_total_commision')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_blow).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="senior_member_username"
            :label="$t('table.direct_superior')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_commission"
            :label="$t('table.team_total_commision')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_commission).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_last_month"
            :label="$t('table.last_month_rest')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_last_month).toFixed(4) }}
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
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/commission-payment';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '佣金支付',
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
    'hierarchy',
    'status_game',
    'senior_member_username'
  ],
  crudTag: 'report:commissionpayment:'
};

export default defineComponent({
  name: 'commission-payment',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const dict = reactive({
      agent_level_options: [],
      account_status_options: []
    });

    onMounted(async () => {
      [
        dict.agent_level_options,
        dict.account_status_options
      ] = await Promise.all([
        getDicts('agent_level_options'),
        getDicts('account_status_options')
      ]);
    });
    return { ...crud, getLabel, ...toRefs(dict) };
  }
});
</script>

<style></style>
