<template>
  <div class="main-container">
    <crudOperation title="router.commsion-list" labelWidth="120px">
      <template #query>
        <el-form-item label="代理账号">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属上级">
          <el-input
            v-model.trim="crudQuery.senior_member_username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="代理层级">
          <el-select
            v-model="crudQuery.hierarchy"
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in agent_level_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="月份">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            pickerType="monthrange"
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
            prop="date"
            label="月份"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="username"
            label="代理账号"
            min-width="160"
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
            label="所属上级"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="total_profit"
            label="团队总输赢"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_profit).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="active_member_effective"
            label="有效活跃人数"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="commission_rebate_ratio"
            label="返佣比例"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_rebate_ratio) }}%
            </template>
          </el-table-column>
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
            prop="commission_last_month"
            label="上月结余"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_last_month).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="commission_justify"
            label="冲正后返佣金额"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.commission_justify).toFixed(4) }}
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
            prop="operate"
            :label="$t('table.operate')"
            min-width="120"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.is_send == 2"
                v-only="otherPermission.send"
                @click.stop="sendComission(scope.row)"
              >
                返佣
              </el-button>
              <el-button
                type="primary"
                size="small"
                v-if="scope.row.is_send == 1"
                v-only="otherPermission.send"
                @click.stop="viewComission(scope.row)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      v-model="dialogVisible"
      title="返佣"
      width="50%"
      custom-class="withdraw-dialog"
      :before-close="closeDialog"
    >
      <el-form
        ref="crudDefaultForm"
        :inline="true"
        :model="dialotForm"
        v-loading="sending"
        label-width="120px"
      >
        <el-form-item label="冲正后返佣金额" prop="commission_justify">
          <el-input
            v-model.trim="dialotForm.commission_justify"
            clearable
            disabled
            placeholder="冲正后返佣金额"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="实发返佣金额"
          prop="amount"
          :rules="[
            {
              required: true,
              message: '实发返佣金额' + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="dialotForm.amount"
            clearable
            placeholder="实发返佣金额"
            :disabled="!isEdit"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('table.remark')"
          prop="remark"
          :rules="[
            {
              required: true,
              message: $t('table.remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="dialotForm.remark"
            clearable
            maxlength="100"
            show-word-limit
            type="textarea"
            :disabled="!isEdit"
            :placeholder="$t('table.remark')"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              closeDialog();
              dialogVisible = false;
            "
            >关闭</el-button
          >
          <el-button type="primary" v-if="isEdit" @click="sendComissionSure"
            >派发</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import * as Api from '@/api/account-config/comission-list';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
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
  crudTitle: '佣金列表',
  crudOptShow: {
    operate: true,
    download: true
  },
  crudTableParams: 'data',
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {},
  unfixedSum: [
    'active_member_effective',
  ],
  includeSumColumn: [
    'commission_remain',
    'commission_last_month',
    'commission_actual_rebate',
    'commission_justify',
    'active_member_effective',
    'commission_last_month',
    'commission_surplus',
    'total_commission',
    'total_profit'
  ],
  crudTag: 'comission:list:'
};

export default defineComponent({
  name: 'comission-list',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const i18n = useI18n();

    const dialogVisible = ref(false);
    const dialotForm: any = ref({
      id: null,
      commission_justify: null,
      amount: null,
      remark: null
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

    const router = useRouter();

    const { proxy } = getCurrentInstance() as any;

    const otherPermission = {
      send: 'comission:list:send'
    };

    let dict = reactive({
      agent_level_options: []
    });

    const { getLabel, isLockOptions, pendingUndoneOptions } = dictionary();
    const isEdit = ref(false);

    function sendComission(row: any) {
      dialotForm.value.id = row.id;
      dialotForm.value.commission_justify = row.commission_justify;
      dialogVisible.value = true;
      isEdit.value = true;
      if (proxy.$refs.crudDefaultForm) {
        proxy.$refs.crudDefaultForm.clearValidate();
      }
    }

    const sending = ref(false);
    function sendComissionSure() {
      if (sending.value) {
        return;
      }
      proxy.$refs.crudDefaultForm.validate(async (valid: any) => {
        if (valid) {
          sending.value = true;
          try {
            const { data, code, msg } = await (<any>Api.send(dialotForm.value));
            sending.value = false;
            if (code === 1) {
              ElMessage.success(msg);
              dialogVisible.value = false;
              closeDialog();
              crud.toQuery();
            } else {
              ElMessage.error(msg);
            }
          } catch (error) {
            sending.value = false;
          }
        }
      });
    }

    function closeDialog(done?: any) {
      dialotForm.value = Object.assign({}, defaultCrudOptions.defaultForm);
      done ? done() : null;
    }

    function viewComission(row: any) {
      isEdit.value = false;
      dialogVisible.value = true;
      dialotForm.value.commission_justify = row.commission_justify;
      dialotForm.value.amount = row.commission_actual_rebate;
      dialotForm.value.remark = row.remark;
    }

    onMounted(async () => {
      [dict.agent_level_options] = await Promise.all([
        getDicts('agent_level_options')
      ]);
    });

    return {
      ...crud,
      verifyStepChange,
      operateId,
      getLabel,
      viewComission,
      closeDialog,
      otherPermission,
      dialogVisible,
      isEdit,
      ...toRefs(dict),
      isLockOptions,
      sendComission,
      dialotForm,
      sending,
      sendComissionSure,
      pendingUndoneOptions
    };
  }
});
</script>
<style lang="scss">
.withdraw-dialog {
  .el-dialog__headerbtn {
    top: 0;
  }
  .el-dialog__headerbtn:focus .el-dialog__close,
  .el-dialog__headerbtn:hover .el-dialog__close {
    color: #fff;
  }
}
</style>