<template>
  <div class="main-container">
    <el-card class="box-card" v-if="!loading" v-loading="loading">
      <template #header>
        <div class="card-header">
          <strong>用户提款订单详情</strong>
          <div>
            <el-button type="info" @click.stop="toPath">{{
              $t('table.back')
            }}</el-button>
            <el-button
              type="success"
              v-if="detail.status && detail.status != 4"
              @click="toAudit(orderVerify[0])"
              >{{ orderVerify[1] }}</el-button
            >
            <el-button
              type="danger"
              v-if="detail.status && detail.status != 4"
              @click="toAudit(orderVerify[2])"
              >{{ orderVerify[3] }}</el-button
            >
          </div>
        </div>
      </template>
      <!-- 用户注册信息 -->
      <el-descriptions
        direction="vertical"
        :column="7"
        border
        :title="$t('table.user_register_info')"
      >
        <el-descriptions-item
          :label="$t('table.create_time_1')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail.register.create_time) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.login_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail.register.login_time) }}
        </el-descriptions-item>
        <!-- <el-descriptions-item
          :label="$t('table.last_bet_time')"
          align="center"
          min-width="160px"
        >
         {{ $emptyData(detail.register.login_time) }}
        </el-descriptions-item> -->
        <el-descriptions-item
          :label="$t('table.register_device')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(detail.register.reg_terminal, terminal_type_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.register_ip')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.register.reg_ip) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.register_device_code')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.register.reg_ip) }}
        </el-descriptions-item>
        <el-descriptions-item label="注册域名" align="center" min-width="120px">
          {{ $emptyData(detail.register.reg_domain) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.superior_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.register.senior_member_username) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 用户账号信息 -->
      <el-descriptions
        direction="vertical"
        :column="4"
        border
        :title="$t('table.user_info')"
      >
        <el-descriptions-item
          :label="$t('table.username')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.account_name')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.account_name) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.account_status')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.status) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.vip_level')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.level) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.remark')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.remark) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.bank_num')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.bank) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.usdt_num')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.info.blockchain) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 存提款信息 -->
      <el-descriptions
        direction="vertical"
        :column="5"
        border
        :title="$t('table.deposit_and_withdrawal_info')"
      >
        <el-descriptions-item
          :label="$t('table.total_deposit_money')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail.deposit_withdrawal.total_deposit) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.total_deposit_time')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.deposit_withdrawal.count_deposit) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.total_withdrawal_money')"
          align="center"
          min-width="180px"
        >
          {{ $emptyData(detail.deposit_withdrawal.total_withdraw) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.total_withdrawal_time')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.deposit_withdrawal.count_withdrawal) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.deposit_and_withdrawal_diff')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.deposit_withdrawal.money) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 账号风控层级 -->
      <el-descriptions
        direction="vertical"
        :column="5"
        border
        title="账号风控层级"
      >
        <el-descriptions-item
          :label="$t('table.danger_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.risk.user) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_bank')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.risk.bank) }}
        </el-descriptions-item>
        <el-descriptions-item
          label="风险虚拟币"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.risk.blockchain) }}
        </el-descriptions-item>
        <el-descriptions-item label="风险IP" align="center" min-width="120px">
          {{ $emptyData(detail.risk.ip) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_device_code')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.risk.terminal) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 近期存提款信息 -->
      <el-descriptions
        direction="vertical"
        :column="3"
        border
        :title="$t('table.recent_deposit_and_withdrawal_info')"
      >
        <el-descriptions-item
          :label="$t('table.last_withdrawal_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(detail.last_withdraw.time) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.last_withdrawal_money')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.last_withdraw.amount) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.last_withdrawal_cny')"
          align="center"
          min-width="180px"
        >
          {{ $emptyData(detail.last_withdraw.between) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 订单详情-->
      <el-descriptions :column="4" border title="本次提款信息">
        <el-descriptions-item
          :label="$t('table.order_number')"
          align="center"
          min-width="120px"
          :span="2"
        >
          {{ $emptyData(detail.this_withdraw.order) }}
        </el-descriptions-item>

        <el-descriptions-item
          :label="$t('table.terminal')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(detail.this_withdraw.terminal, terminal_type_options) }}
        </el-descriptions-item>
        <el-descriptions-item label="提款IP" align="center" min-width="120px">
          {{ $emptyData(detail.this_withdraw.ip_address) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.withdrawal_currency')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(detail.this_withdraw.currency, currency_type_option) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.today_withdrawal_time')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(detail.this_withdraw.today_take_times) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.today_withdrawal_money')"
          align="center"
          min-width="120px"
          :span="2"
        >
          {{ $emptyData(detail.this_withdraw.today_take_amount) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.withdrawal_device')"
          align="center"
          min-width="120px"
          :span="2"
        >
          {{ getLabel(detail.this_withdraw.terminal, terminal_type_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.withdrawal_domain')"
          align="center"
          :span="2"
        >
          {{ $emptyData(detail.this_withdraw.domain) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.withdrawal_info')"
          align="center"
          :span="4"
        >
          {{ $emptyData(detail.this_withdraw.account_info) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.withdrawal_audit_info')"
          align="center"
        >
          <el-descriptions
            :column="detailType === 'usdt' ? 4 : 3"
            border
            direction="vertical"
          >
            <el-descriptions-item label="出款方式" align="center">
              {{
                getLabel(
                  $emptyData(detail.this_withdraw.is_manual),
                  draw_is_manual_options
                )
              }}
            </el-descriptions-item>
            <el-descriptions-item label="三方支付" align="center">
              {{ $emptyData(detail.this_withdraw.chanel_name) }}
            </el-descriptions-item>
            <el-descriptions-item label="提款金额" align="center">
              {{ $emptyData(detail.this_withdraw.amount) }}
            </el-descriptions-item>
            <el-descriptions-item
              v-if="detailType === 'usdt'"
              label="虚拟币数量"
              align="center"
            >
              {{ $emptyData(detail.this_withdraw.exchange_money) }}
            </el-descriptions-item>
            <el-descriptions-item label="订单状态" align="center">
              {{
                getLabel(
                  $emptyData(detail.this_withdraw.status),
                  withdraw_status_options
                )
              }}
            </el-descriptions-item>
          </el-descriptions>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 审核信息 -->
      <el-descriptions :column="4" border :title="$t('table.audit_info')">
        <template v-if="detail.verify_one.user">
          <el-descriptions-item
            :label="$t('table.audit_user_1')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_one.user) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_time')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_one.time) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_remark')"
            align="center"
            min-width="240px"
          >
            {{ $emptyData(detail.verify_one.remark) }}
          </el-descriptions-item>
          <el-descriptions-item
            label="一审结果"
            align="center"
            min-width="120px"
          >
            {{
              getLabel(
                $emptyData(detail.verify_one.status),
                approve_status_options
              )
            }}
          </el-descriptions-item>
        </template>
        <template v-if="detail.verify_two.user">
          <el-descriptions-item
            :label="$t('table.audit_user_2')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_two.user) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_time')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_two.time) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_remark')"
            align="center"
            min-width="240px"
          >
            {{ $emptyData(detail.verify_two.remark) }}
          </el-descriptions-item>
          <el-descriptions-item
            label="二审结果"
            align="center"
            min-width="120px"
          >
            {{
              getLabel(
                $emptyData(detail.verify_two.status),
                approve_status_options
              )
            }}
          </el-descriptions-item>
        </template>
        <template v-if="detail.verify_three.user">
          <el-descriptions-item
            :label="$t('table.audit_user_3')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_three.user) }}
          </el-descriptions-item>
          <el-descriptions-item
            :label="$t('table.audit_time')"
            align="center"
            min-width="120px"
          >
            {{ $emptyData(detail.verify_three.time) }}
          </el-descriptions-item>
          <el-descriptions-item
            label="出款备注"
            align="center"
            min-width="240px"
          >
            {{ $emptyData(detail.verify_three.remark) }}
          </el-descriptions-item>
          <el-descriptions-item
            label="出款结果"
            align="center"
            min-width="120px"
          >
            {{
              getLabel(
                $emptyData(detail.verify_three.status),
                approve_status_options
              )
            }}
          </el-descriptions-item>
        </template>
      </el-descriptions>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="$t(`table.verify_step_status_${operateStatus}`)"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormRef" :model="form" label-width="120px">
        <el-form-item
          :label="$t('table.verify_remark')"
          prop="verify_one_remark"
          v-if="[1, 2].includes(operateStatus)"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: $t('table.verify_remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.verify_one_remark"
            maxlength="50"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.verify_remark')"
          prop="verify_two_remark"
          v-if="[3, 4].includes(operateStatus)"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: $t('table.verify_remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.verify_two_remark"
            maxlength="50"
            show-word-limit
            type="textarea"
          />
        </el-form-item>

        <el-form-item
          :label="$t('table.draw_is_manual')"
          v-if="[5].includes(operateStatus)"
          prop="draw_is_manual"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: $t('table.draw_is_manual') + $t('table.not_empty')
            }
          ]"
        >
          <el-select
            v-model="form.draw_is_manual"
            clearable
            @change="drawIsManualChange"
          >
            <el-option
              v-for="item in draw_is_manual_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="代付渠道"
          v-if="[5].includes(operateStatus) && form.draw_is_manual == 2"
          prop="channel_id"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '代付渠道' + $t('table.not_empty')
            }
          ]"
        >
          <el-select v-model="form.channel_id" clearable>
            <el-option
              v-for="item in chanelList"
              :key="item.channel_id"
              :label="item.channel_name"
              :value="item.channel_id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="出款币种"
          v-if="[5].includes(operateStatus) && form.draw_is_manual == 2"
          :rules="[
            {
              required: true,
              trigger: 'blur',
              message: '出款币种' + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="detail.this_withdraw.bank_code"
            style="width: 200px"
            disabled
          />
        </el-form-item>

        <nomalImageUpload
          v-if="[5].includes(operateStatus) && form.draw_is_manual == 1"
          @setImage="setTheForm"
          formLabel="上传附件"
          :data="form['draw_order_img']"
          imgkey="file_id"
          imgUrlKey="draw_order_img"
        />

        <el-form-item
          :label="$t('table.verify_remark')"
          v-if="[5, 6].includes(operateStatus)"
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
          v-if="[2, 4, 6].includes(operateStatus)"
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
          <el-button type="primary" @click="doAudit(operateStatus)">{{
            $t('crud.submit')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  getDetail,
  oneAuditPass,
  oneAuditReject,
  twoAuditPass,
  twoAuditReject,
  threeAuditPass,
  getChannel,
  threeAuditReject
} from '@/api/account-config/withdraw-audit';
import { getDicts } from '@/utils/dictApi';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
// import { getWithdrawLineListHook } from '@/hook/getWithdrawLineList';
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
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { dictionary } from '@/hook/lib';

const defaultForm = {
  verify_one_remark: null,
  client_remark: null,
  verify_two_remark: null,
  verify_three_remark: null,
  file_id: null,
  draw_order_img: null,
  draw_is_manual: null,
  channel_id: null
};

export default defineComponent({
  name: 'withdraw-audit-info',
  components: { nomalImageUpload },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const i18n = useI18n();
    const { proxy } = getCurrentInstance() as any;
    function toPath() {
      // router.push({ name: 'recharge-audit' });
      router.go(-1);
    }

    const loading = ref(true);

    const detailId = computed(() => {
      return route.query.id;
    });

    const detailType = computed(() => {
      return route.query.type;
    });

    // const { withdrawLineList } = getWithdrawLineListHook({ status: 1 });

    const orderVerify = computed(() => {
      if (!(detail.value as any).status) return [0, '', 0, ''];
      if ((detail.value as any).status == 4) return [0, '', 0, ''];
      return [
        (detail.value as any).status * 2 - 1,
        i18n.t(
          `table.verify_step_status_${(detail.value as any).status * 2 - 1}`
        ),
        (detail.value as any).status * 2,
        i18n.t(`table.verify_step_status_${(detail.value as any).status * 2}`)
      ];
    });

    const detail = ref({
      status: null,
      register: {},
      info: {
        user: null
      },
      deposit_withdrawal: {},
      risk: {},
      last_withdraw: {},
      verify_one: {
        user: null
      },
      verify_two: {
        user: null
      },
      verify_three: {
        user: null
      }
    });

    let form = reactive(defaultForm);

    function getWithdrawDetail(id: number) {
      getDetail({ id }).then((res: any) => {
        if (res.code == 1) {
          detail.value = res.data;
          loading.value = false;
        } else {
          ElMessage.error(res.msg || res.message);
        }
      });
    }

    let operateStatus = ref(7);

    let dialogVisible = ref(false);

    function handleClose() {
      Object.assign(form, defaultForm);
      console.log(proxy.$refs['ruleFormRef']);
      if (proxy.$refs['ruleFormRef']) {
        proxy.$refs['ruleFormRef'].resetFields();
      }

      operateStatus.value = 7;
      dialogVisible.value = false;
    }

    function toAudit(status: number) {
      operateStatus.value = status;
      dialogVisible.value = true;
    }

    function doAudit(order_verify: number) {
      if (proxy.$refs['ruleFormRef']) {
        proxy.$refs['ruleFormRef'].validate(async (valid: any) => {
          if (valid) {
            let result: any = null;
            switch (order_verify) {
              case 1:
                result = await oneAuditPass({
                  id: detailId.value,
                  verify_one_remark: form.verify_one_remark
                });
                break;
              case 2:
                result = await oneAuditReject({
                  id: detailId.value,
                  verify_one_remark: form.verify_one_remark,
                  client_remark: form.client_remark
                });
                break;
              case 3:
                result = await twoAuditPass({
                  id: detailId.value,
                  verify_two_remark: form.verify_two_remark
                });
                break;
              case 4:
                result = await twoAuditReject({
                  id: detailId.value,
                  verify_two_remark: form.verify_two_remark,
                  client_remark: form.client_remark
                });
                break;
              case 5:
                result = await threeAuditPass({
                  id: detailId.value,
                  verify_three_remark: form.verify_three_remark,
                  draw_is_manual: form.draw_is_manual,
                  file_id: form.file_id,
                  draw_order_img: form.draw_order_img,
                  channel_id: form.channel_id
                });
                break;
              case 6:
                result = await threeAuditReject({
                  id: detailId.value,
                  verify_three_remark: form.verify_three_remark,
                  client_remark: form.client_remark
                });
                break;
            }

            if (result.code == 1) {
              ElNotification.success(result.msg || result.message);
              handleClose();
              toPath();
            } else {
              ElMessage.error(result.msg || result.message);
            }
          } else {
            console.log('error submit!');
            return false;
          }
        });
      }
    }

    let dict = reactive({
      chanelList: [],
      approve_status_options: [],
      currency_type_option: [],
      draw_is_manual_options: [],
      withdraw_status_options: [],
      terminal_type_options: []
    });

    function setTheForm(value: any) {
      Object.assign(form, value);
    }

    function drawIsManualChange() {
      Object.assign(form, {
        file_id: null,
        draw_order_img: null,
        channel_id: null
      });
      if (form.draw_is_manual == 2 && dict.chanelList.length == 0) {
        getChannelList();
      }
    }

    async function getChannelList() {
      const params = { id: Number(detailId.value) };
      const { data, code, msg } = await (<any>getChannel(params));
      dict.chanelList = data;
    }

    const { getLabel } = dictionary();

    onMounted(async () => {
      [
        dict.currency_type_option,
        dict.approve_status_options,
        dict.draw_is_manual_options,
        dict.withdraw_status_options,
        dict.terminal_type_options
      ] = await Promise.all([
        getDicts('currency_type_option'),
        getDicts('approve_status_options'),
        getDicts('draw_is_manual_options'),
        getDicts('withdraw_status_options'),
        getDicts('terminal_type_options')
      ]);
      nextTick(() => {
        getWithdrawDetail(Number(detailId.value));
      });
    });

    // onActivated(() => {
    //   Object.assign(form, defaultForm)
    //   dialogVisible.value = false
    //   nextTick(() => {
    //     getWithdrawDetail(Number(detailId.value));
    //   });
    // })

    return {
      toPath,
      detail,
      loading,
      doAudit,
      orderVerify,
      form,
      toAudit,
      dialogVisible,
      handleClose,
      operateStatus,
      ...toRefs(dict),
      setTheForm,
      detailType,
      drawIsManualChange,
      // withdrawLineList,
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
