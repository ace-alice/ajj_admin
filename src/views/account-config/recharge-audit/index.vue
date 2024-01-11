<template>
  <div class="main-container">
    <crudOperation title="router.recharge-audit" labelWidth="120px">
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
        <el-form-item :label="$t('table.channel_getway')">
          <el-select
            v-model="crudQuery.currency_id"
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in currency_options"
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
        <el-form-item :label="$t('table.deposit_time')">
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
            prop="order_lockup"
            :label="$t('table.is_lock')"
            min-width="80"
            align="center"
            fixed="left"
            ><template #default="scope">
              <el-checkbox
                :permission="otherPermission.lock"
                :disabled="
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.order_lockup
                  )[1]
                "
                v-model="scope.row.order_lockup"
                :true-label="2"
                :false-label="1"
                size="large"
                @change="changeLockupStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            :label="$t('table.operate')"
            min-width="100"
            align="center"
            fixed="left"
          >
            <template #default="scope">
              <el-button
                :type="
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.order_lockup
                  )[0]
                "
                :disabled="
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.order_lockup
                  )[2]
                "
                @click.stop="toPath(scope.row)"
              >
                {{ $t('table.audit') }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel_id"
            :label="$t('table.channel_id1')"
            v-only="otherPermission.show_id"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="order_number"
            :label="$t('table.order_number')"
            min-width="240"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="order_username"
            :label="$t('table.order_username')"
            min-width="120"
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
            min-width="280"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.order_from_device }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel_getway"
            :label="$t('table.channel_getway')"
            min-width="140"
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
            min-width="160"
            align="center"
          />
          <!-- <el-table-column
            prop="recharge_amount"
            :label="$t('table.recharge_amount')"
            min-width="200"
            align="center"
          /> -->
          <el-table-column
            prop="recharge_amount"
            :label="$t('table.recharge_amount')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              {{
                parseFloat(scope.row.exchange_rate) == 0
                  ? scope.row.recharge_amount
                  : `${scope.row.recharge_amount}/${parseFloat(
                      scope.row.recharge_amount_exchange
                    ).toFixed(4)}USDT`
              }}
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
          <!-- <el-table-column
            prop="recharge_amount_reality"
            label="实际到账金额"
            min-width="200"
            align="center"
          /> -->
          <el-table-column
            prop="recharge_amount_reality"
            label="实际到账金额"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              {{
                parseFloat(scope.row.exchange_rate) == 0
                  ? scope.row.recharge_amount_reality
                  : `${scope.row.recharge_amount_reality}/${(
                      scope.row.recharge_amount_reality /
                      scope.row.exchange_rate
                    ).toFixed(4)}USDT`
              }}
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
import Api from '@/api/account-config/recharge-audit';
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getRechargeTypeListHook } from '@/hook/getRechargeTypeList';
import { getRechargeLineListHook } from '@/hook/getRechargeLineList';
import { dictionary } from '@/hook/lib';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus/lib/components';
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
    account_type: null,
    is_test: null,
    start_time: null,
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
  crudTag: 'recharge:audit:'
};

export default defineComponent({
  name: 'recharge-audit',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const router = useRouter();

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.admin_user_id;
    });
    const otherPermission = {
      show_id: 'recharge:audit:show_id',
      show_name: 'recharge:audit:show_name',
      lock: 'recharge:audit:lockup'
    };

    const { rechargeTypeList, getRechargeTypeFun } = getRechargeTypeListHook();

    const { rechargeLineList, getRechargeLineFun } = getRechargeLineListHook();

    function toPath(row: any) {
      router.push({ name: 'recharge-audit-info', query: { id: row.id } });
    }

    function changeLockupStatus(row: any) {
      Api.lockupOrder({
        id: row.id,
        order_lockup: row.order_lockup,
        admin_id_lockup: row.order_lockup == 1 ? 0 : operateId.value
      })
        .then((res: any) => {
          if (res.code == 1) {
            ElNotification.success(res.msg || res.message);
          } else {
            ElMessage.error(res.msg || res.message);
          }
        })
        .finally(() => {
          crud.refresh();
        });
    }

    function btnStatus(lId: number, oId: number, lStatus: number) {
      // 账号没有解除锁单权限
      // 1.自己账号锁单后才可审核该笔订单
      // 2.自己账号锁单后可解锁自己账号锁定的订单

      // 账号有解除锁单权限
      // 1.自己账号锁单后才可审核该笔订单
      // 2.自己账号锁单后可解锁自己账号锁定的订单
      // 3.1）可解锁别人账号锁单的订单，解锁后，重新锁定，才可审核。
      // 2）别人账号中该笔订单为锁定状态，如果没有解锁权限，则不可解除锁单
      let result = ['info', true, true];
      if (crud.crudFindRole.only(otherPermission.lock)) {
        if (lStatus == 2) {
          result = ['primary', false, false];
        } else {
          result = ['info', false, true];
        }
      } else {
        if (lStatus == 2) {
          if (lId == oId) {
            result = ['primary', false, false];
          } else {
            result = ['info', true, true];
          }
        } else {
          result = ['info', false, true];
        }
      }
      return result;
    }

    const dict = reactive({
      account_type_options: [],
      universal_bool_options: [],
      currency_options: [],
      terminal_type_options: [],
      order_status_system_options: [],
      order_status_client_options: [],
      channel_getway_options: []
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
        dict.channel_getway_options
      ] = await Promise.all([
        getDicts('account_type_options'),
        getDicts('universal_bool_options'),
        getDicts('currency_options'),
        getDicts('terminal_type_options'),
        getDicts('order_status_system_options'),
        getDicts('order_status_client_options'),
        getDicts('channel_getway_options')
      ]);
      console.log(dict);
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
      otherPermission,
      changeLockupStatus,
      ...toRefs(dict)
    };
  }
});
</script>
