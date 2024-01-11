<template>
  <div class="main-container">
    <crudOperation title="router.withdraw-list" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_name')">
          <el-input
            v-model.trim="crudQuery.account_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.order_number')">
          <el-input
            v-model.trim="crudQuery.draw_order"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.draw_lockup')">
          <el-select
            v-model="crudQuery.draw_lockup"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in isLockOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.order_status_client')">
          <el-select
            v-model="crudQuery.draw_status_client"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in draw_status_client_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.pay_third_part')">
          <el-input
            v-model.trim="crudQuery.channel_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="三方订单号">
          <el-input
            v-model.trim="crudQuery.third_draw_order"
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
        <el-form-item label="出款方式">
          <el-select
            v-model="crudQuery.draw_is_manual"
            style="width: 200px"
            popper-class="user-select"
            placeholder="出款方式"
            clearable
          >
            <el-option
              v-for="item in draw_manual_options"
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
        <el-form-item label="审核状态">
          <el-select
            v-model="crudQuery.verify_steps"
            style="width: 100px"
            popper-class="user-select"
            placeholder="审核状态"
            clearable
          >
            <el-option label="一审" :value="1" />
            <el-option label="二审" :value="2" />
            <el-option label="出款" :value="3" />
          </el-select>
          <el-select
            v-model="crudQuery.verify_step_status"
            style="width: 100px;margin-left: 10px"
            popper-class="user-select"
            clearable
          >
            <el-option label="通过" :value="1" />
            <el-option label="拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="出款人">
          <el-input
            v-model.trim="crudQuery.admin_verify_three_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-select
            v-model="crudQuery.mark_step"
            style="width: 78px"
            popper-class="user-select"
            placeholder="备注"
            clearable
          >
            <el-option label="一审" :value="1" />
            <el-option label="二审" :value="2" />
            <el-option label="出款" :value="3" />
          </el-select>
          <el-input
            v-model.trim="crudQuery.mark_info"
            clearable
            style="width: 118px;margin-left: 10px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.audit_user')">
          <el-input
            v-model.trim="crudQuery.admin_verify"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('table.withdrawal_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item> -->
        <el-form-item :label="$t('table.apply_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
        <el-form-item label="实际到账时间">
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
            prop="draw_order"
            :label="$t('table.order_number')"
            min-width="220"
            align="center"
          />
          <el-table-column
            prop="third_draw_order"
            label="三方订单号"
            min-width="220"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="account_name"
            :label="$t('table.account_name')"
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
            :label="$t('table.vip_level')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>VIP{{ scope.row.vip_current_level }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="currency"
            :label="$t('table.withdrawal_currency')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ getLabel(scope.row.currency, currency_options) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="draw_status_order"
            label="订单状态"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.draw_status_order, withdraw_status_options)
              }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="draw_status_client"
            :label="$t('table.order_status_client')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{
                getLabel(
                  scope.row.draw_status_client,
                  draw_status_client_options
                )
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_amount"
            :label="$t('table.withdrawal_money')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.draw_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="draw_amount_charge"
            :label="$t('table.withdraw_fee')"
            min-width="120"
            align="center"
          /> -->
          <!-- <el-table-column
            prop="draw_amount"
            :label="$t('table.recharge_amount_reality')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.draw_amount).toFixed(4) }}
            </template>
          </el-table-column> -->
          <el-table-column
            prop="transfer_time"
            label="实际到账时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.transfer_time ? scope.row.transfer_time : '-' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bank_name"
            :label="$t('table.withdraw_bank')"
            min-width="120"
            align="center"
          />
          <!-- / -->
          <el-table-column
            prop="bank_address"
            :label="$t('table.withdraw_address')"
            min-width="170"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            :label="$t('table.pay_third_part')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="submit_time"
            :label="$t('table.apply_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.audit_user')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <div>
                <p v-if="scope.row.admin_verify_one_name">
                  {{ $t('table.first_instance') }}：{{
                    scope.row.admin_verify_one_name
                  }}
                </p>
                <p v-if="scope.row.admin_verify_two_name">
                  {{ $t('table.second_instance') }}：{{
                    scope.row.admin_verify_two_name
                  }}
                </p>
                <p v-if="scope.row.admin_verify_three_name">
                  {{ $t('table.dispensing') }}：{{
                    scope.row.admin_verify_three_name
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.audit_time')"
            min-width="240"
            align="center"
          >
            <template #default="scope">
              <div>
                <p v-if="scope.row.verify_one_time">
                  {{ $t('table.first_instance') }}：{{
                    scope.row.verify_one_time
                  }}
                </p>
                <p v-if="scope.row.verify_two_time">
                  {{ $t('table.second_instance') }}：{{
                    scope.row.verify_two_time
                  }}
                </p>
                <p v-if="scope.row.verify_three_time">
                  财务点击：{{ scope.row.verify_three_time }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.audit_status')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <div>
                <p v-if="scope.row.verify_one_status">
                  {{ $t('table.first_instance') }}：{{
                    getLabel(
                      scope.row.verify_one_status,
                      approve_status_options
                    )
                  }}
                </p>
                <p v-if="scope.row.verify_two_status">
                  {{ $t('table.second_instance') }}：{{
                    getLabel(
                      scope.row.verify_two_status,
                      approve_status_options
                    )
                  }}
                </p>
                <p v-if="scope.row.verify_three_status">
                  {{ $t('table.dispensing') }}：{{
                    getLabel(
                      scope.row.verify_three_status,
                      approve_status_options
                    )
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.ip_remark')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <div>
                <p v-if="scope.row.verify_one_remark">
                  {{ $t('table.first_instance') }}：{{
                    scope.row.verify_one_remark
                  }}
                </p>
                <p v-if="scope.row.verify_two_remark">
                  {{ $t('table.second_instance') }}：{{
                    scope.row.verify_two_remark
                  }}
                </p>
                <p v-if="scope.row.verify_three_remark">
                  {{ $t('table.dispensing') }}：{{
                    scope.row.verify_three_remark
                  }}
                </p>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/withdraw-list';
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '出款审核列表',
  crudOptShow: {
    operate: true,
    download: true
  },
  crudTableParams: 'data',
  defaultQuery: {
    verify_steps: null,
    start_time: null,
    end_time: null,
    account_type: null,
    is_test: null,
    draw_lockup: null,
    admin_verify: null,
    draw_order: null,
    username: null,
    currency: 1,
    third_party_status: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: [
    'commission_actual_rebate',
    'commission_surplus',
    'commission_justify',
    'draw_amount',
    'draw_amount_charge',
    'total_commission',
    'total_profit'
  ],
  crudTag: 'withdraw:audit:'
};

export default defineComponent({
  name: 'withdraw-list-rmb',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const i18n = useI18n();
    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.admin_user_id;
    });

    const router = useRouter();

    function toPath(row: any) {
      router.push({
        name: 'withdraw-audit-info',
        query: { id: row.id, type: 'rmb' }
      });
    }

    const dict = reactive({
      account_type_options: [],
      universal_bool_options: [],
      draw_manual_options: [],
      approve_status_options: [],
      currency_options: [],
      terminal_type_options: [],
      draw_status_client_options: [],
      order_status_client_options: [],
      channel_getway_options: [],
      third_party_status_options: [],
      withdraw_status_options: []
    });

    const { getLabel, isLockOptions, thirdPartyStatusOptions } = dictionary();

    onMounted(async () => {
      [
        dict.account_type_options,
        dict.draw_manual_options,
        dict.universal_bool_options,
        dict.approve_status_options,
        dict.currency_options,
        dict.terminal_type_options,
        dict.draw_status_client_options,
        dict.order_status_client_options,
        dict.channel_getway_options,
        dict.third_party_status_options,
        dict.withdraw_status_options
      ] = await Promise.all([
        getDicts('account_type_options'),
        getDicts('draw_manual_options'),
        getDicts('universal_bool_options'),
        getDicts('approve_status_options'),
        getDicts('currency_options'),
        getDicts('terminal_type_options'),
        getDicts('draw_status_client_options'),
        getDicts('order_status_client_options'),
        getDicts('channel_getway_options'),
        getDicts('third_party_status_options'),
        getDicts('withdraw_status_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      getLabel,
      operateId,
      toPath,
      ...toRefs(dict),
      isLockOptions,
      thirdPartyStatusOptions
    };
  }
});
</script>
