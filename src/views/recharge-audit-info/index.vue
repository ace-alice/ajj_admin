<template>
  <div class="main-container">
    <el-card class="box-card" v-if="!loading" v-loading="loading">
      <template #header>
        <div class="card-header">
          <strong>查看详情</strong>
          <div>
            <el-button type="info" @click.stop="toPath">{{
              $t('table.back')
            }}</el-button>
            <!-- v-if="detail.status == 0" -->
            <el-button
              type="success"
              @click="openDialog('audit')"
              v-if="detail.status == 0"
              v-only="'recharge:audit:pass'"
              >{{ $t('lib.audit_passed') }}</el-button
            >
            <el-button
              type="danger"
              v-if="detail.status == 0"
              @click="openDialog('reject')"
              v-only="'recharge:audit:reject'"
              >{{ $t('lib.audit_reject') }}</el-button
            >
          </div>
        </div>
      </template>
      <!-- 用户注册信息 -->
      <el-descriptions
        direction="vertical"
        :column="8"
        border
        :title="$t('table.user_register_info')"
      >
        <el-descriptions-item
          :label="$t('table.create_time_1')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.register.create_time) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.login_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.register.login_time) }}
        </el-descriptions-item>
        <!-- <el-descriptions-item
          :label="$t('table.last_bet_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.register.bet_time) }}
        </el-descriptions-item> -->
        <el-descriptions-item
          :label="$t('table.register_device')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(detail?.register.reg_terminal, terminal_type_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.register_ip')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail?.register.reg_ip) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.register_device_code')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail?.register.reg_terminal) }}
        </el-descriptions-item>
        <el-descriptions-item label="注册域名" align="center" min-width="120px">
          {{ $emptyData(detail?.register.reg_domain) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.superior_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail?.register.senior_member_username) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 用户账号信息 -->
      <el-descriptions
        direction="vertical"
        :column="7"
        border
        :title="$t('table.user_info')"
      >
        <el-descriptions-item
          :label="$t('table.username')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.saving_fill_username')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.order_username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.account_status')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.status) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.vip_level')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.level) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.remark')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.remark) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.bank_num')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.bank) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.usdt_num')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.info?.blockchain) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 账号风控层级 -->
      <el-descriptions
        direction="vertical"
        :column="7"
        border
        title="账号风控层级"
      >
        <el-descriptions-item
          :label="$t('table.danger_user')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.risk?.user) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_bank')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.risk?.bank) }}
        </el-descriptions-item>
        <el-descriptions-item
          label="风险虚拟币"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.risk?.blockchain) }}
        </el-descriptions-item>
        <el-descriptions-item label="风险IP" align="center" min-width="160px">
          {{ $emptyData(detail?.risk?.ip) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_device_code')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.risk?.terminal) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 订单详情-->
      <el-descriptions :column="4" border title="订单详情">
        <el-descriptions-item
          :label="$t('table.apply_time')"
          align="center"
          width="180px"
        >
          {{ $emptyData(detail?.order?.time) }}
        </el-descriptions-item>
        <template>
          <el-descriptions-item
            :label="$t('table.apply_user')"
            align="center"
            width="120px"
          >
            {{ $emptyData(detail?.order?.apply_name) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.apply_remark')"
            align="center"
            :span="2"
          >
            {{ $emptyData(detail?.order?.remark) }}
          </el-descriptions-item>
          <el-descriptions-item label="充值线路" align="center">
            {{ $emptyData(detail?.order?.channel_name) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('table.change_type')" align="center">
            {{ $emptyData(detail?.order?.money_change) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('table.activity_id')" align="center">
            {{ detail?.order?.active_id }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.amount_times')"
            align="center"
          >
            {{ $emptyData(detail?.order?.water_fold) }}
          </el-descriptions-item>
          <el-descriptions-item :label="$t('table.cash_adjust')" align="center">
            {{ $emptyData(detail?.order?.amount) }}
          </el-descriptions-item>
          <el-descriptions-item label="实际到账金额" align="center">
            {{ $emptyData(detail?.order?.amount_reality) }}
          </el-descriptions-item>
          <el-descriptions-item label="充值收款卡" align="center">
            {{ $emptyData(detail?.order?.third_party_message) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.preview_picture')"
            align="center"
          >
            <div style="position: relative">
              <el-image
                style="
                  width: 26px;
                  height: 26px;
                  position: absolute;
                  bottom: -13px;
                "
                :src="detail?.order?.img"
                :preview-src-list="[detail?.order?.img]"
                fit="cover"
              />
            </div>
          </el-descriptions-item>
        </template>
        <template v-if="false">
          <el-descriptions-item
            :label="$t('table.recharge_currency')"
            align="center"
          >
            {{ $emptyData(detail?.order?.currency) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.account_name_recharge')"
            align="center"
            :span="2"
          >
            {{ $emptyData(detail?.order?.account_name) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_remark')"
            align="center"
            :span="4"
          >
            {{ $emptyData(detail?.order?.account_info) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.apply_amount')"
            align="center"
          >
            {{ $emptyData(detail?.order?.amount) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.discount_amount')"
            align="center"
          >
            {{ $emptyData(detail?.order?.amount_discount) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.channel_charges')"
            align="center"
          >
            {{ $emptyData(detail?.order?.amount_charge) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.actual_deposit')"
            align="center"
          >
            {{ $emptyData(detail?.order?.amount_reality) }}
          </el-descriptions-item>
        </template>
      </el-descriptions>

      <!-- 审核信息 -->
      <el-descriptions
        direction="vertical"
        :column="3"
        border
        :title="$t('table.audit_info')"
        v-if="detail?.verify"
      >
        <el-descriptions-item
          :label="$t('table.audit_user')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.verify.user) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.audit_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail?.verify.time) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.audit_remark')"
          align="center"
          min-width="260px"
        >
          {{ $emptyData(detail?.verify.remark) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="$t(`table.check_${dialogType}`)"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormRef" :model="form" label-width="120px">
        <el-form-item
          v-if="dialogType === 'audit'"
          label="上分金额"
          prop="amount"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '上分金额' + $t('table.not_empty')
            }
          ]"
        >
          <el-input v-model.trim="form.amount" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item
          :label="$t('table.verify_remark')"
          prop="order_remark"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '订单备注' + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.order_remark"
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
          <el-button type="primary" @click="doConfirm()">{{
            $t('crud.submit')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doRejectFun, getDetail } from '@/api/account-config/recharge-audit';
import { ElMessage } from 'element-plus/lib/components';
import { doAuditFun } from '@/api/account-config/recharge-audit';
import { ElNotification } from 'element-plus';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'recharge-audit-info',
  setup() {
    const router = useRouter();
    const route = useRoute();
    function toPath() {
      // router.push({ name: 'recharge-audit' });
      router.go(-1);
    }

    const loading = ref(true);

    const detailId = computed(() => {
      return route.query.id;
    });

    const detail = ref({});

    function getRechargeDetail(id: number) {
      getDetail({ id }).then((res: any) => {
        if (res.code == 1) {
          detail.value = res.data;
          loading.value = false;
        } else {
          ElMessage.error(res.msg || res.message);
        }
      });
    }

    const form = reactive({
      amount: null,
      order_remark: null
    });

    const defaultForm = {
      amount: null,
      order_remark: null
    };
    const dialogVisible = ref(false);

    const { proxy } = getCurrentInstance() as any;
    function handleClose() {
      Object.assign(form, defaultForm);
      if (proxy.$refs['ruleFormRef']) {
        proxy.$refs['ruleFormRef'].resetFields();
      }
      dialogVisible.value = false;
    }

    const dialogType = ref('');
    function openDialog(type: string) {
      dialogType.value = type;
      dialogVisible.value = true;
    }

    function doConfirm() {
      const params: any = {
        id: detailId.value,
        order_remark: form.order_remark
      };
      if (dialogType.value == 'audit') {
        params.amount = form.amount;
        doAudit(params);
      } else {
        doReject(params);
      }
    }

    function doAudit(params: any) {
      doAuditFun(params).then((res: any) => {
        if (res.code == 1) {
          ElNotification.success(res.msg || res.message);
          toPath();
        } else {
          ElMessage.error(res.msg || res.message);
        }
      });
    }

    function doReject(params: any) {
      doRejectFun(params).then((res: any) => {
        if (res.code == 1) {
          ElNotification.success(res.msg || res.message);
          toPath();
        } else {
          ElMessage.error(res.msg || res.message);
        }
      });
    }

    const { getLabel } = dictionary();

    const dict = reactive({
      terminal_type_options: []
    });

    onMounted(async () => {
      [dict.terminal_type_options] = await Promise.all([
        getDicts('terminal_type_options')
      ]);
      nextTick(() => {
        getRechargeDetail(Number(detailId.value));
      });
    });

    // onActivated(async () => {
    //   Object.assign(form, defaultForm)
    //   dialogVisible.value = false
    //   getRechargeDetail(Number(detailId.value));
    // })

    return {
      toPath,
      detail,
      loading,
      doAudit,
      handleClose,
      dialogType,
      dialogVisible,
      form,
      doConfirm,
      openDialog,
      doReject,
      ...toRefs(dict),
      getLabel
    };
  }
});
</script>

<style lang="scss" scoped>
.el-descriptions + .el-descriptions {
  margin-top: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
