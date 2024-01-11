<template>
  <div class="main-container">
    <crudOperation title="router.withdraw-audit" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
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
        <el-form-item :label="$t('table.audit_user')">
          <el-input
            v-model.trim="crudQuery.admin_verify"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.third_party_status')"
          v-show="crudQuery.verify_step == 3"
        >
          <el-select
            v-model="crudQuery.third_party_status"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in third_party_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.withdrawal_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #left-left>
        <el-radio-group
          v-model="crudQuery.verify_step"
          @change="verifyStepChange"
          fill="#1b273d"
        >
          <el-radio-button
            v-for="status in pendingUndoneOptions"
            :key="status.value"
            :label="status.value"
            :class="{ 'is-active': crudQuery.verify_step == status.value }"
            >{{ status.label }}</el-radio-button
          >
        </el-radio-group>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          show-summary
          max-height="750px"
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
                v-model="scope.row.draw_lockup"
                :true-label="2"
                :false-label="1"
                size="large"
                :disabled="
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.draw_lockup,
                    scope.row.draw_status_order,
                    scope.row.verify_step
                  )[1]
                "
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
                    scope.row.draw_lockup,
                    scope.row.draw_status_order,
                    scope.row.verify_step
                  )[0]
                "
                :disabled="
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.draw_lockup,
                    scope.row.draw_status_order,
                    scope.row.verify_step
                  )[2]
                "
                @click.stop="toPath(scope.row)"
              >
                {{
                  btnStatus(
                    scope.row.admin_id_lockup,
                    operateId,
                    scope.row.draw_lockup,
                    scope.row.draw_status_order,
                    scope.row.verify_step
                  )[3]
                }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_order"
            :label="$t('table.order_number')"
            min-width="180"
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
            prop="danger_level"
            :label="$t('table.danger_level')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            v-if="crudQuery.verify_step == 3"
            :label="$t('table.pay_third_part')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="currency"
            :label="$t('table.withdrawal_currency')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ getLabel(scope.row.currency, currency_options) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_amount"
            :label="$t('table.withdrawal_money') + '(RMB/USDT)'"
            min-width="240"
            align="center"
          >
            <template #default="scope">
              <span>
                {{ parseFloat(scope.row.draw_amount).toFixed(4) }}
                {{
                  getLabel(scope.row.currency, currency_options) == 'CNY'
                    ? ''
                    : `/${parseFloat(scope.row.exchange_money).toFixed(4)}`
                }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_amount"
            label="实际到账"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.draw_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.apply_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="lockup_name"
            label="锁单员"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="order_verify"
            :label="$t('table.order_verify')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{
                getLabel(
                  scope.row.draw_status_step,
                  withdraw_order_status_option
                )
              }}
            </template>
          </el-table-column>
          <template v-if="crudQuery.verify_step == 3">
            <el-table-column
              prop="third_party_status"
              :label="$t('table.third_party_status')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                {{
                  getLabel(
                    scope.row.third_party_status,
                    third_party_status_options
                  )
                }}
              </template>
            </el-table-column>
          </template>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      v-model="dialogVisible"
      :title="$t(`table.verify_step_3_2`)"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormRef" :model="form" label-width="120px">
        <el-form-item
          :label="$t('table.verify_remark')"
          prop="verify_three_remark"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: $t('table.verify_remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.verify_three_remark"
            maxlength="50"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.client_remark')"
          prop="client_remark"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: $t('table.client_remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.client_remark"
            maxlength="50"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">{{
            $t('user.logOutCancel')
          }}</el-button>
          <el-button type="primary" @click="doAudit()">{{
            $t('crud.submit')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/withdraw-audit';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onActivated,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch
} from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '出款审核',
  crudOptShow: {
    autoRefresh: true
  },
  crudTableParams: 'data',
  defaultQuery: {
    verify_step: 1,
    start_time: null,
    end_time: null,
    draw_lockup: null,
    admin_verify: null,
    draw_order: null,
    third_party_status: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['draw_amount'],
  crudTag: 'withdraw:audit:'
};

export default defineComponent({
  name: 'withdraw-audit',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const i18n = useI18n();
    const dialogVisible = ref(false);

    let form = reactive({
      verify_three_remark: null,
      client_remark: null
    });

    const defaultForm = {
      verify_three_remark: null,
      client_remark: null
    };

    function verifyStepChange() {
      Object.assign(crud.crudQuery, { third_party_status: null });
      crud.toQuery();
    }

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.admin_user_id;
    });

    function changeLockupStatus(row: any) {
      Api.lockupOrder({
        id: row.id,
        draw_lockup: row.draw_lockup,
        admin_id_lockup: row.draw_lockup == 1 ? 0 : operateId.value,
        draw_status_step: row.draw_status_step
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

    function btnStatus(
      lId: number,
      oId: number,
      lStatus: number,
      drawStatusOrder: number,
      step: number
    ) {
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

      if (drawStatusOrder == 6) {
        if (lId != oId) {
          result = ['primary', true, true, '三方拒绝'];
        } else {
          result = ['primary', true, false, '三方拒绝'];
        }
      } else {
        if (step) {
          result.push(i18n.t(`table.verify_step_${step}`));
        }
      }

      return result;
    }

    const router = useRouter();

    let currentRow: any = {};
    function toPath(row: any) {
      if (row.draw_status_order == 6) {
        currentRow = row;
        dialogVisible.value = true;
        return;
      }
      router.push({
        name: 'withdraw-audit-info',
        query: { id: row.id, member_id: row.member_id }
      });
    }

    const { proxy } = getCurrentInstance() as any;
    function handleClose() {
      Object.assign(form, defaultForm);
      if (proxy.$refs['ruleFormRef']) {
        proxy.$refs['ruleFormRef'].resetFields();
      }
      dialogVisible.value = false;
    }

    async function doAudit() {
      const params = {
        id: currentRow.id,
        verify_three_remark: form.verify_three_remark,
        client_remark: form.client_remark
      };
      const { data, code, msg } = await (<any>Api.threeAuditReject(params));
      if (code === 1) {
        handleClose();
        crud.refresh();
        ElMessage.success(msg);
      } else {
        ElMessage.error(msg);
      }
    }

    let dict = reactive({
      currency_options: [],
      terminal_type_options: [],
      withdraw_order_status_option: [],
      order_status_client_options: [],
      channel_getway_options: [],
      third_party_status_options: []
    });

    const { getLabel, isLockOptions, pendingUndoneOptions } = dictionary();

    const otherPermission = {
      lock: 'withdraw:audit:lock'
    };

    const route = useRoute();

    function initStep() {
      if (route.query.step !== void 0) {
        crud.setTheQuery({ verify_step: route.query.step });
        crud.toQuery();
      }
    }

    watch(() => route.query.step, () => {
      initStep()
    }, {
      deep: true
    });

    onActivated(() => {
      initStep();
    });

    onMounted(async () => {
      [
        dict.currency_options,
        dict.terminal_type_options,
        dict.withdraw_order_status_option,
        dict.order_status_client_options,
        dict.channel_getway_options,
        dict.third_party_status_options
      ] = await Promise.all([
        getDicts('currency_options'),
        getDicts('terminal_type_options'),
        getDicts('withdraw_order_status_option'),
        getDicts('order_status_client_options'),
        getDicts('channel_getway_options'),
        getDicts('third_party_status_options')
      ]);
      initStep();
    });

    return {
      ...crud,
      verifyStepChange,
      btnStatus,
      operateId,
      toPath,
      getLabel,
      otherPermission,
      handleClose,
      changeLockupStatus,
      ...toRefs(dict),
      isLockOptions,
      dialogVisible,
      form,
      doAudit,
      pendingUndoneOptions
    };
  }
});
</script>

<style lang="scss" scoped>
.is-active {
  --el-radio-button-checked-bg-color: rgb(27, 39, 61);
  --el-radio-button-checked-border-color: rgb(27, 39, 61);
  --el-radio-button-disabled-checked-fill: rgb(27, 39, 61);
  :deep(.el-radio-button__inner) {
    background-color: rgb(27, 39, 61);
    border-color: rgb(27, 39, 61);
    box-shadow: -1px 0px 0px 0px #1b273d;
  }
}
</style>
