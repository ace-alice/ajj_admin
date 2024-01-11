<template>
  <div class="main-container">
    <crudOperation title="router.account-change">
      <template #query>
        <el-form-item :label="$t('table.other_id')">
          <el-input
            v-model.trim="crudQuery.order"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_name')">
          <el-input
            v-model.trim="crudQuery.account_name"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_status')">
          <el-select
            v-model="crudQuery.user_status"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in account_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账变类型" prop="change_id">
          <el-cascader
            v-model="crudQuery.change_id"
            :options="moneyChangeTypeList"
            :props="{
              value: 'id',
              label: 'title_cn',
              children: 'blow',
              emitPath: false
            }"
            style="width: 200px"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item :label="$t('table.change_amount')">
          <el-input
            v-model.trim="crudQuery.money_start"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.money_end"
            style="width: 98px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.vip_level')">
          <el-input
            v-model.trim="crudQuery.vip_level_start"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.vip_level_end"
            style="width: 98px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.operations')">
          <el-select
            v-model="crudQuery.operation"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in operations_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form-item :label="$t('table.change_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          show-summary
          max-height="750px"
          :summary-method="getSummaries"
          row-key="id"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="other_id"
            :label="$t('table.other_id')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="account_name"
            :label="$t('table.account_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="senior_member_username"
            :label="$t('table.senior_leader')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="risk_control_mark"
            :label="$t('table.risk_level')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="status_game"
            :label="$t('table.account_status')"
            min-width="100"
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
            prop="vip_current_level"
            :label="$t('table.vip_level')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>VIP{{ scope.row.vip_current_level }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="title_cn"
            label="账变类型"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="parent_name"
            :label="$t('table.business_type')"
            min-width="100"
            align="center"
          />

          <el-table-column
            prop="operations"
            :label="$t('table.operations')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.operations, operations_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="pre_balance"
            :label="$t('table.pre_balance')"
            min-width="120"
            align="center"
          >
            <el-table-column
              prop="pre_hold_balance"
              :label="$t('table.hold_balance')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="pre_available_balance"
              :label="$t('table.available_balance')"
              min-width="120"
              align="center"
            />
          </el-table-column>
          <el-table-column
            prop="amount"
            :label="$t('table.change_amount')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span
                :style="{
                  color: scope.row.operations == 1 ? 'green' : 'red'
                }"
                ><span>{{ scope.row.operations == 1 ? '+' : '-' }}</span>
                {{ scope.row.amount }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="last_balance"
            :label="$t('table.last_balance')"
            min-width="120"
            align="center"
          >
            <el-table-column
              prop="hold_balance"
              :label="$t('table.hold_balance')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="available_balance"
              :label="$t('table.available_balance')"
              min-width="120"
              align="center"
            />
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.account_change_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="description"
            :label="$t('table.remark')"
            min-width="200"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/account-change';
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  Ref,
  ref,
  toRefs,
  watch
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { getCashChangeTypeListHook } from '@/hook/getCashChangeTypeList';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getRiskTypeListHook } from '@/hook/getRiskTypeList';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { i18n } from '@/i18n';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: String(i18n.global.te(`router.balance_change`)),
  crudOptShow: {
    operate: true,
    download: true
  },
  crudTableParams: 'data',
  defaultQuery: {
    username: null,
    code: null,
    change_id: null,
    date_value_create: []
  },
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: [
    'available_balance',
    'hold_balance',
    'amount',
    'pre_available_balance',
    'pre_hold_balance'
  ],
  crudTag: 'account:change:'
};

export default defineComponent({
  name: 'account-change',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel, isUseOptions } = dictionary();

    const { moneyChangeTypeList } = getCashChangeTypeListHook();

    const dict = reactive({
      operations_options: [],
      account_status_options: [],
      danger_status_options: []
    });

    onMounted(async () => {
      [
        dict.operations_options,
        dict.account_status_options
      ] = await Promise.all([
        getDicts('operations_options'),
        getDicts('account_status_options')
      ]);
      console.log(dict);
    });
    const { riskTypeList } = getRiskTypeListHook({
      risk_type: 1
    });
    return {
      ...crud,
      getLabel,
      isUseOptions,
      ...toRefs(dict), riskTypeList,
      moneyChangeTypeList
    };
  }
});
</script>
