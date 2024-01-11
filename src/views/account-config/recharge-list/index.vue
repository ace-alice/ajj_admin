<template>
  <div class="main-container">
    <crudOperation title="router.recharge-list" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.order_number')">
          <el-input
            v-model.trim="crudQuery.order_number"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.order_username')">
          <el-input
            v-model.trim="crudQuery.order_username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_type')">
          <el-select
            v-model="crudQuery.account_type"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.account_type')"
            clearable
          >
            <el-option
              v-for="item in account_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为测试">
          <el-select
            v-model="crudQuery.is_test"
            style="width: 200px"
            popper-class="user-select"
            placeholder="是否为测试"
            clearable
          >
            <el-option
              v-for="item in universal_bool_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.terminal')">
          <el-select
            v-model="crudQuery.terminal"
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in terminal_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.channel_id')">
          <el-select
            v-model="crudQuery.channel_id"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in rechargeLineList"
              :key="item.value"
              :label="item.channel_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.cash_type_id')">
          <el-select
            v-model="crudQuery.cash_type_id"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in rechargeTypeList"
              :key="item.value"
              :label="item.deposit_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.recharge_ip')">
          <el-input
            v-model.trim="crudQuery.ip"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.vip_level')">
          <el-select
            v-model="crudQuery.vip_level"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in vip_level_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.recharge_card') /**充值储蓄卡 */">
          <el-input
            v-model.trim="crudQuery.third_party_info"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.deposit_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.deposit_succ_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="transfer_start_time"
            endKey="transfer_end_time"
            :propTime="[
              crudQuery.transfer_start_time,
              crudQuery.transfer_end_time
            ]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="750px"
          show-summary
          :summary-method="getSummaries"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="operate"
            :label="$t('table.operate')"
            min-width="100"
            align="center"
            fixed="left"
          >
            <template #default="scope">
              <el-button
                type="warning"
                size="small"
                @click.stop="toPath(scope.row)"
              >
                {{ $t('table.see_details') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_number"
            :label="$t('table.order_number')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="channel_id"
            :label="$t('table.channel_id1')"
            v-only="otherPermission.show_id"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="account_type"
            label="账号类型"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.account_type, account_type_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_test"
            label="是否为测试"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.is_test, universal_bool_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_username"
            :label="$t('table.order_username')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="vip_current_level"
            label="VIP等级"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="order_from_terminal"
            :label="$t('table.terminal')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.order_from_terminal, terminal_type_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_status_system"
            :label="$t('table.order_verify')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(
                  scope.row.order_status_system,
                  order_status_system_options
                )
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="order_status_client"
            :label="$t('table.order_status_client')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(
                  scope.row.order_status_client,
                  order_status_client_options
                )
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="recharge_ip_danger"
            :label="$t('table.recharge_ip_danger')"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <span
                >{{ scope.row.order_from_ip_address
                }}{{
                  scope.row.risk_ip_name ? `(${scope.row.risk_ip_name})` : ''
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="order_from_device"
            :label="$t('table.order_from_device_danger')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.order_from_device }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel_getway"
            :label="$t('table.channel_getway')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.money_change_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cash_type_name"
            :label="$t('table.deposit_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            :label="$t('table.channel_name')"
            v-only="otherPermission.show_name"
            min-width="120"
            align="center"
          />
          <!-- <el-table-column
            prop="recharge_amount"
            :label="$t('table.recharge_amount')"
            min-width="120"
            align="center"
          /> -->
          <el-table-column
            prop="recharge_amount"
            :label="$t('table.recharge_amount')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-tag>{{ scope.row.recharge_amount }}</el-tag>
              <br />
              <el-tag
                class="ml-2"
                type="success"
                style="margin-top: 3px"
                v-if="parseFloat(scope.row.exchange_rate) != 0"
                >{{
                  `${parseFloat(scope.row.recharge_amount_exchange).toFixed(
                    4
                  )}USDT`
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="recharge_amount_charge"
            :label="$t('table.channel_charges')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="third_party_info"
            label="充值储蓄卡"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="recharge_amount_reality"
            label="实际到账金额"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-tag>{{ scope.row.recharge_amount_reality }}</el-tag>
              <br />
              <el-tag
                class="ml-2"
                type="success"
                style="margin-top: 3px"
                v-if="parseFloat(scope.row.exchange_rate) != 0"
                >{{
                  `${(
                    scope.row.recharge_amount_reality / scope.row.exchange_rate
                  ).toFixed(4)}USDT`
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="transfer_time"
            label="实际到账时间"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.deposit_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="verify_name"
            label="审核人"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.verify_name ? scope.row.verify_name : '系统' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="verify_time"
            label="审核时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.verify_name
                  ? scope.row.verify_time
                  : scope.row.transfer_time
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_remark"
            :label="$t('table.remark')"
            min-width="300"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/recharge-list';
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getRechargeTypeListHook } from '@/hook/getRechargeTypeList';
import { getRechargeLineListHook } from '@/hook/getRechargeLineList';
import { dictionary } from '@/hook/lib';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { getDicts } from '@/utils/dictApi';
const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '审核',
  crudOptShow: {
    operate: true,
    download: true
  },
  crudTableParams: 'data',
  defaultQuery: {
    order_verify: '1',
    start_time: null,
    account_type: null,
    is_test: null,
    end_time: null,
    order_number: null,
    username: null,
    order_username: null,
    terminal: null,
    currency_id: null,
    cash_type_id: null,
    channel_id: null,
    ip: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: [
    'recharge_amount',
    'recharge_amount_reality',
    'recharge_amount_charge'
  ],
  crudTag: 'recharge:list:'
};

export default defineComponent({
  name: 'recharge-list',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const router = useRouter();

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.admin_user_id;
    });
    const otherPermission = {
      show_id: 'recharge:list:show_id',
      show_name: 'recharge:list:show_name'
    };
    const { rechargeTypeList, getRechargeTypeFun } = getRechargeTypeListHook();

    const { rechargeLineList, getRechargeLineFun } = getRechargeLineListHook();

    function toPath(row: any) {
      router.push({ name: 'recharge-audit-info', query: { id: row.id } });
    }

    function btnStatus(lId: number, oId: number, lStatus: number) {
      if (lStatus == 1) return ['info', true, true];
      if (lId == oId) return ['primary', true, false];
      if (lId != oId) return ['warning', false, true];
      return ['info', false, true];
    }

    const dict = reactive({
      currency_options: [],
      account_type_options: [],
      universal_bool_options: [],
      terminal_type_options: [],
      order_status_system_options: [],
      order_status_client_options: [],
      channel_getway_options: [],
      vip_level_options: []
    });

    const { getLabel } = dictionary();

    onMounted(async () => {
      [
        dict.account_type_options,
        dict.universal_bool_options,
        dict.currency_options,
        dict.terminal_type_options,
        dict.order_status_system_options,
        dict.order_status_client_options,
        dict.channel_getway_options,
        dict.vip_level_options
      ] = await Promise.all([
        getDicts('account_type_options'),
        getDicts('universal_bool_options'),
        getDicts('currency_options'),
        getDicts('terminal_type_options'),
        getDicts('order_status_system_options'),
        getDicts('order_status_client_options'),
        getDicts('channel_getway_options'),
        getDicts('vip_level_options')
      ]);
      console.log(dict, '');
    });

    return {
      ...crud,
      getLabel,
      rechargeTypeList,
      rechargeLineList,
      getRechargeTypeFun,
      getRechargeLineFun,
      toPath,
      operateId,
      btnStatus,
      ...toRefs(dict),
      otherPermission
    };
  }
});
</script>
