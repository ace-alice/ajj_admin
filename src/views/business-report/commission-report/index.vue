<template>
  <div class="main-container">
    <crudOperation title="router.commission-report">
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
          <el-table-column
            prop="date"
            :label="$t('table.month')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_agent"
            :label="$t('table.commision_people')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                @click="showDetaile(scope.row)"
                style="color: #02a7f0; cursor: pointer"
                >{{ scope.row.total_agent }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="total_commission"
            :label="$t('table.commision_money')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_commission).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_commission_actual_rebate"
            label="实发返佣金额"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{
                parseFloat(scope.row.total_commission_actual_rebate).toFixed(4)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_member"
            :label="$t('table.total_bet_people')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_bet_count"
            :label="$t('table.total_bet_count')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="total_bet"
            :label="$t('table.total_bet_maney')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_bet).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_profit"
            :label="$t('table.total_bet_payment')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_profit).toFixed(4) }}
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      title="返佣详情"
      v-model="dialogModel"
      destroy-on-close
      custom-class="activity-data-dialog"
      append-to-body
      width="50%"
    >
      <el-table
        :data="proxyList"
        style="width: 100%"
        v-loading="detailLoading"
        border
      >
        <el-table-column
          prop="username"
          label="代理账号"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="commission_remain"
          label="返佣金额"
          min-width="160"
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
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @page-size="handleCurrentChange"
        v-model:current-page="pageParams.page"
        :page-sizes="pageData.sizeList"
        v-model:page-size="pageParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/business-report/commission-report';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '佣金报表',
  crudOptShow: {
    download: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {},
  unfixedSum: ['total_member', 'total_bet_count', 'total_agent'],
  includeSumColumn: [
    'total_agent',
    'total_bet',
    'total_commission_actual_rebate',
    'total_bet_count',
    'total_commission',
    'total_member',
    'total_profit'
  ],
  crudTag: 'report:commissionreport:'
};

export default defineComponent({
  name: 'commission-report',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const dialogModel = ref(false);
    let state = reactive({
      proxyList: []
    });
    const pageData = ref({
      sizeList: [10, 20, 50, 100, 200, 300, 400],
      total: 0
    });
    const pageParams = ref({
      page: 1,
      limit: 10
    });

    let rowData = {};
    let detailLoading = ref(false);

    function handleSizeChange(val: any) {
      pageParams.value.limit = val;
      showDetaile(rowData);
    }
    function handleCurrentChange(val: any) {
      pageParams.value.page = val;
      showDetaile(rowData);
    }

    async function showDetaile(row: any = {}) {
      detailLoading.value = true;
      rowData = row;
      const params = {
        time: row.date,
        ...pageParams.value
      };
      dialogModel.value = true;
      const { data, code } = await (<any>Api.getUserList(params));
      detailLoading.value = false;
      if (code === 1) {
        state.proxyList = data.data;
        pageData.value.total = data.total;
      }
    }
    return {
      ...crud,
      showDetaile,
      dialogModel,
      pageData,
      detailLoading,
      handleSizeChange,
      handleCurrentChange,
      ...toRefs(state),
      pageParams
    };
  }
});
</script>

<style lang="scss">
.activity-data-dialog {
  .el-dialog__headerbtn:focus .el-dialog__close,
  .el-dialog__headerbtn:hover .el-dialog__close {
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: -4px;
  }
}
</style>
