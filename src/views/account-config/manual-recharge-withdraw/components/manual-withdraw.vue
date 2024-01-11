<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <strong>{{ $t('other.manual_withdraw_title') }}</strong>
        <span>
          <span style="color: red">* </span>{{ $t('other.is_need') }}</span
        >
      </div>
    </template>
    <div>
      <el-form
        label-position="right"
        label-width="140px"
        :model="form"
        class="add-one"
        style="max-width: 460px"
        ref="ruleFormRef"
      >
        <!-- {
              validator: userTypeValidator,
              trigger: 'blur'
            } -->
        <el-form-item
          :label="$t('table.send_user')"
          prop="username"
          :rules="[
            {
              required: true,
              message: $t('table.send_user') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.username"
            :placeholder="$t('table.username_placeholder')"
            clearable
            :disabled="hasUser"
          >
            <template #append>
              <el-button @click.stop="search">{{
                $t('crud.search')
              }}</el-button>
            </template>
          </el-input>
        </el-form-item>

        <template v-if="hasUser">
          <el-descriptions
            border
            direction="vertical"
            :column="4"
            style="margin: 0 0 20px 30px"
          >
            <el-descriptions-item
              :label="$t('table.username')"
              :min-width="100"
              align="center"
            >
              <el-tag type="warning">{{ userInfo.username }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('table.account_name')"
              :min-width="100"
              align="center"
            >
              <el-tag type="warning">{{
                userInfo.account_name
                  ? userInfo.account_name
                  : $t('table.not_yet_bind')
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('table.vip_level')"
              :min-width="100"
              align="center"
            >
              <el-tag type="warning"
                >VIP {{ userInfo.vip_level ? userInfo.vip_level : 0 }}</el-tag
              >
            </el-descriptions-item>
            <el-descriptions-item
              :label="$t('table.rmb_wallet')"
              :min-width="100"
              align="center"
            >
              <el-tag type="warning">{{
                userInfo.available_balance ? userInfo.available_balance : 0
              }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
          <el-form-item
            :label="$t('table.change_type')"
            prop="change_id"
            :rules="[
              {
                required: true,
                message: $t('table.change_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-cascader
              v-model="form.change_id"
              :options="cashManualTypeList"
              :props="{
                value: 'id',
                label: 'title_cn',
                children: 'blow',
                emitPath: false
              }"
              style="width: 360px"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item
            :label="$t('table.money_type')"
            prop="currency"
            v-if="form.change_id == 2"
            :rules="[
              {
                required: true,
                message: $t('table.money_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="form.currency"
              @change="getUserBankInfo"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in currency_type_option"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="
              form.currency == 1
                ? $t('table.receive_bank_card')
                : $t('table.receive_usdt_card')
            "
            prop="bank_id"
            v-if="form.change_id == 2"
            :rules="[
              {
                required: true,
                message: `${
                  form.currency == 1
                    ? $t('table.receive_bank_card')
                    : $t('table.receive_usdt_card')
                }${$t('table.not_empty')}`
              }
            ]"
          >
            <el-select
              v-model="form.bank_id"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in bankList"
                :key="item.bank_info"
                :label="item.bank_info"
                :value="item.bank_id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('table.cash_adjust')"
            prop="amount"
            :rules="[
              {
                required: true,
                message: $t('table.cash_adjust') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.number="form.amount"
              type="number"
              :placeholder="$t('table.cash_adjust')"
            />
          </el-form-item>
          <el-form-item :label="$t('table.apply_remark')">
            <el-input
              v-model.trim="form.reason"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              :maxlength="50"
              show-word-limit
              :placeholder="$t('table.apply_remark_placeholder')"
            />
          </el-form-item>
          <nomalImageUpload
            @setImage="setTheForm"
            :formLabel="$t('table.upload_file')"
            :data="form['file_img']"
            imgkey="file_id"
            imgUrlKey="file_img"
          />
          <el-form-item>
            <el-button type="primary" @click="submitForm()">
              <el-icon><check /></el-icon> {{ $t('crud.submit') }}
            </el-button>
            <el-button @click="resetForm()"
              ><el-icon><refresh /></el-icon> {{ $t('crud.reset') }}</el-button
            >
          </el-form-item>
        </template>
      </el-form>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Row } from '@/components/crud/lib/interface';
import { RuleValidator } from '@/hook/RuleValidator';
import { ElMessage } from 'element-plus';
import { ElNotification } from 'element-plus';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import {
  getUserInfo,
  getBankInfo,
  decrease,
  newdecrease
} from '@/api/account-config/manual-recharge-withdraw';
import { getCashManualTypeListHook } from '@/hook/getCashManualTypeList';
import { getDicts } from '@/utils/dictApi';

const defaultForm = {
  amount: null,
  change_id: null,
  bank_id: null,
  username: null,
  file_img: null,
  file_id: null,
  reason: null
};

const defaultUserInfo = {
  id: null,
  username: null,
  total_balance: null,
  hold_balance: null,
  available_balance: null,
  is_lock: null,
  vip_level: null,
  member_id: null,
  account_name: null,
  update_time: null,
  create_time: null
};

export default defineComponent({
  name: 'manual-withdraw',
  components: { nomalImageUpload },

  setup() {
    const { proxy } = getCurrentInstance() as any;

    const hasUser = ref(false);

    let form = reactive({
      amount: null,
      change_id: null,
      username: null,
      file_img: null,
      file_id: null,
      bank_id: null,
      currency: null,
      reason: null
    }) as any;

    let userInfo = reactive({
      id: null,
      username: null,
      total_balance: null,
      hold_balance: null,
      available_balance: null,
      is_lock: null,
      vip_level: null,
      member_id: null,
      account_name: null,
      update_time: null,
      create_time: null
    });

    const { userTypeValidator } = RuleValidator();

    const { cashManualTypeList } = getCashManualTypeListHook({ money_type: 0 });

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          if (
            //取款-》直接扣款，风控扣减-》风控扣款 且金额大于2000
            (form.change_id == 35 || form.change_id == 51) &&
            Number(form?.amount >= 2000)
          ) {
            newdecrease({ config_arr: form }).then((result: any) => {
              if (result.code == 1) {
                ElNotification.success(result.msg || result.message);
                resetForm();
              } else {
                ElMessage.error(result.msg || result.message);
              }
            });
          } else {
            decrease(form).then((result: any) => {
              if (result.code == 1) {
                ElNotification.success(result.msg || result.message);
                resetForm();
              } else {
                ElMessage.error(result.msg || result.message);
              }
            });
          }
        } else {
          console.log('error submit!');
          return false;
        }
      });
    };

    // 设置form参数
    function setTheForm(data: Row) {
      Object.assign(form, data);
    }

    const resetForm = () => {
      Object.assign(form, defaultForm);
      Object.assign(userInfo, defaultUserInfo);
      hasUser.value = false;
      setTimeout(() => {
        if (!proxy.$refs['ruleFormRef']) return;
        proxy.$refs['ruleFormRef'].resetFields();
      });
    };

    function search() {
      proxy.$refs['ruleFormRef'].validateField(['username'], (valid: any) => {
        if (valid) {
          getUserInfo({ username: form.username }).then((result: any) => {
            if (result.code == 1) {
              hasUser.value = true;
              Object.assign(userInfo, defaultUserInfo, result.data);
              // form.id = userInfo.id;
            } else {
              ElMessage.error(result.msg);
            }
          });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    const dict: any = reactive({
      bankList: [],
      currency_type_option: []
    });

    async function getUserBankInfo() {
      form.bank_id = null;
      dict.bankList = [];
      const params = {
        username: form.username,
        currency: form.currency
      };
      const { data, code, msg } = await (<any>getBankInfo(params));
      if (code === 1) {
        dict.bankList = data;
      }
    }

    onMounted(async () => {
      [dict.currency_type_option] = await Promise.all([
        getDicts('currency_type_option')
      ]);
    });

    return {
      ...toRefs(dict),
      form,
      userTypeValidator,
      submitForm,
      resetForm,
      hasUser,
      setTheForm,
      search,
      getUserBankInfo,
      cashManualTypeList,
      userInfo
    };
  }
});
</script>

<style lang="scss" scoped>
.box-card {
  max-width: 600px;
  margin: auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
:deep(.el-select) {
  width: 100%;
}
</style>
<style>
.add-user-select {
  min-width: 360px !important;
}
</style>
