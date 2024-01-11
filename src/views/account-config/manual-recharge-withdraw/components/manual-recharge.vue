<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <strong>{{ $t('other.manual_recharge_title') }}</strong>
        <span>
          <span style="color: red">* </span>{{ $t('other.is_need') }}</span
        >
      </div>
    </template>
    <div>
      <el-form
        label-position="right"
        label-width="100px"
        :model="form"
        class="add-one"
        style="max-width: 460px"
        ref="ruleFormRef"
      >
        <el-form-item
          :label="$t('table.username')"
          prop="username"
          :rules="[
            {
              required: true,
              message: $t('table.username') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.username"
            :placeholder="$t('table.username_placeholder')"
            :disabled="hasUser"
            clearable
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

          <el-form-item
            :label="$t('table.apply_remark')"
            prop="reason"
            :rules="[
              {
                required: true,
                message: $t('table.apply_remark') + $t('table.not_empty')
              }
            ]"
          >
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
              <el-icon><Check /></el-icon> {{ $t('crud.submit') }}
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
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import {
  getUserInfo,
  increase
} from '@/api/account-config/manual-recharge-withdraw';
import { getCashManualTypeListHook } from '@/hook/getCashManualTypeList';

const defaultForm = {
  amount: null,
  change_id: null,
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
  name: 'manual-recharge',
  components: { nomalImageUpload },

  setup() {
    const { proxy } = getCurrentInstance() as any;

    const hasUser = ref(false);

    const form = reactive({
      amount: null,
      change_id: null,
      username: null,
      file_img: null,
      file_id: null,
      reason: null
    });

    const userInfo = reactive({
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

    const { cashManualTypeList } = getCashManualTypeListHook({ money_type: 1 });

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          increase(form).then((result: any) => {
            if (result.code == 1) {
              ElNotification.success(result.msg || result.message);
              resetForm();
            } else {
              ElMessage.error(result.msg || result.message);
            }
          });
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

    return {
      form,
      userTypeValidator,
      submitForm,
      resetForm,
      hasUser,
      setTheForm,
      search,
      userInfo,
      cashManualTypeList
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
</style>
<style>
.add-user-select {
  min-width: 360px !important;
}
</style>
