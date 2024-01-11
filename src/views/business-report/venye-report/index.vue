<template>
  <div class="main-container">
    <crudOperation title="router.venye-report">
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
          <el-table-column>
            <el-table-column
              prop="date"
              :label="$t('table.bet_date')"
              min-width="120"
              align="center"
            />
          </el-table-column>
          <el-table-column align="center" :label="$t('table.IA_sport_profit')">
            <el-table-column
              prop="ia_bet_member"
              :label="$t('table.bet_people')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="ia_bet_count"
              :label="$t('table.bet_count')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="ia_bet"
              :label="$t('table.bet_amount')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ia_profit"
              :label="$t('table.bet_profit')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ia_profit).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.PB_sport_profit')">
            <el-table-column
              prop="pinnacle_bet_member"
              :label="$t('table.bet_people')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="pinnacle_bet_count"
              :label="$t('table.bet_count')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="pinnacle_bet"
              :label="$t('table.bet_amount')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="pinnacle_profit"
              :label="$t('table.bet_profit')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.pinnacle_profit).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.SB_sport_profit')">
            <el-table-column
              prop="saba_bet_member"
              :label="$t('table.bet_people')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="saba_bet_count"
              :label="$t('table.bet_count')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="saba_bet"
              :label="$t('table.bet_amount')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="saba_profit"
              :label="$t('table.bet_profit')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.saba_profit).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.XJ_sport_profit')">
            <el-table-column
              prop="xj_bet_member"
              :label="$t('table.bet_people')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="xj_bet_count"
              :label="$t('table.bet_count')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="xj_bet"
              :label="$t('table.bet_amount')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="xj_profit"
              :label="$t('table.bet_profit')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.xj_profit).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" :label="$t('table.AG_sport_profit')">
            <el-table-column
              prop="ag_bet_member"
              :label="$t('table.bet_people')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="ag_bet_count"
              :label="$t('table.bet_count')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="ag_bet"
              :label="$t('table.bet_amount')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_bet).toFixed(4) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="ag_profit"
              :label="$t('table.bet_profit')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                {{ parseFloat(scope.row.ag_profit).toFixed(4) }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/venye-report';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { defineComponent } from 'vue';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '场馆报表',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {},
  unfixedSum: [
    'ia_bet_count',
    'ia_bet_member',
    'pinnacle_bet_count',
    'pinnacle_bet_member',
    'xj_bet_count',
    'xj_bet_member',
    'saba_bet_count',
    'saba_bet_member',
    'ag_bet_count',
    'ag_bet_member'
  ],
  includeSumColumn: [
    'ia_bet',
    'ia_bet_count',
    'ia_bet_member',
    'ia_bonus',
    'ia_profit',
    'pinnacle_bet',
    'pinnacle_bet_count',
    'pinnacle_bet_member',
    'pinnacle_bonus',
    'pinnacle_profit',
    'xj_bet',
    'xj_bet_count',
    'xj_bet_member',
    'xj_bonus',
    'xj_profit',
    'saba_bet',
    'saba_bet_count',
    'saba_bet_member',
    'saba_bonus',
    'saba_profit',
    'ag_bet',
    'ag_bet_count',
    'ag_bet_member',
    'ag_bonus',
    'ag_profit'
  ],
  crudTag: 'report:venyereport:'
};

export default defineComponent({
  name: 'venye-report',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud };
  }
});
</script>

<style></style>
