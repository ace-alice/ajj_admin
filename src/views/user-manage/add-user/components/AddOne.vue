<template>
  <div>
    <el-form
      label-position="right"
      label-width="100px"
      :model="form"
      class="add-one"
      style="max-width: 460px"
      ref="ruleFormRef"
    >
      <el-form-item :label="$t('table.account_type')" prop="type">
        <el-select
          v-model="form.type"
          style="width: 360px"
          popper-class="add-user-select"
          @change="accountTypeChange"
        >
          <el-option
            v-for="type in accountTypeList"
            :label="type.label"
            :value="type.value"
            :key="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否为测试" prop="is_test">
        <el-select
          v-model="form.is_test"
          style="width: 360px"
          popper-class="add-user-select"
        >
          <el-option
            v-for="type in universal_bool_options"
            :label="type.label"
            :value="type.value"
            :key="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('table.username')"
        prop="username"
        :rules="[
          {
            required: true,
            message: $t('table.username') + $t('table.not_empty')
          },
          {
            validator: userTypeValidator,
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          v-model.trim="form.username"
          placeholder="3-18位,数字/字母,标点‘.’"
        />
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone"
        :rules="[
          {
            required: true,
            message: $t('table.username') + $t('table.not_empty')
          },
          {
            validator: userPhoneValidator,
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          type="tel"
          v-model.trim="form.phone"
          placeholder="请输入手机号码"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.login_password')"
        prop="password"
        :rules="[
          {
            required: true,
            message: $t('table.login_password') + $t('table.not_empty')
          },
          {
            validator: userPasswordValidator,
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          v-model.trim="form.password"
          type="password"
          show-password
          placeholder="6-20位,字母+数字组合"
        />
      </el-form-item>
      <el-form-item
        :label="$t('table.superior_user')"
        prop="senior_member_username"
        v-if="form.type == 0"
      >
        <el-input
          v-model.trim="form.senior_member_username"
          :placeholder="$t('table.superior_user')"
        />
      </el-form-item>

      <el-form-item
        :label="$t('table.contact_no')"
        v-if="form.type == 2"
        prop="connect"
        :rules="[
          {
            required: true,
            message: $t('table.contact_no') + $t('table.not_empty')
          }
        ]"
      >
        <el-input
          v-model.trim="form.connect"
          :placeholder="$t('table.contact_no')"
        >
          <template #prepend>
            <el-select
              v-model="form.connect_type"
              style="width: 120px"
              @change="form.connect = null"
            >
              <el-option
                v-for="type in proxy_contact_type_options"
                :label="type.label"
                :value="type.value"
                :key="type.value"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>

      <el-card style="margin: 30px 0; width: 600px" v-if="form.type == 2">
        <template #header>
          <div class="card-header">
            <strong>{{ $t('table.rebateRatio') }}</strong>
            <el-form-item
              :label="$t('table.export_template')"
              prop="rebate_template_id"
              :rules="[
                {
                  required: true,
                  message: $t('table.export_template') + $t('table.not_empty')
                }
              ]"
            >
              <el-select
                v-model="form.rebate_template_id"
                :placeholder="$t('table.export_template')"
                style="width: 200px"
                popper-class="user-select"
              >
                <el-option
                  v-for="item in proxyTemplateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            border
          >
            <el-table-column
              type="index"
              :label="$t('table.sort')"
              width="80"
              align="center"
            />
            <el-table-column
              prop="TValue"
              :label="$t('table.profitLossTotal')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.profitLossTotal"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="TValue"
              :label="$t('table.monthEActive')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.monthEActive"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="TValue"
              :label="$t('table.rebateRatio')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model.trim="scope.row.rebateRatio"
                  style="width: 100px"
                  type="text"
                  disabled
                />
                %
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">
          {{ $t('crud.submit') }}
        </el-button>
        <el-button @click="resetForm()">
          {{ $t('crud.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { RuleValidator } from '@/hook/RuleValidator';
import { addOne } from '@/api/user-manage/add-user';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { getProxyTemplateListHook } from '@/hook/getProxyTemplateList';

const defaultForm = {
  username: '',
  password: '',
  phone: '',
  is_test: null,
  connect_type: null,
  connect: null,
  senior_member_username: null,
  rebate_template_id: null
};

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any;

    const { loginTypeList, accountTypeList, isNot, getLabel } = dictionary();

    const dict = reactive({
      proxy_contact_type_options: [],
      universal_bool_options: []
    });

    let form = reactive({
      type: 0,
      username: '',
      phone: '',
      password: '',
      is_test: null,
      connect_type: null,
      connect: null,
      senior_member_username: null,
      rebate_template_id: null
    });

    const loginType = ref(1);

    const {
      userTypeValidator,
      userPhoneValidator,
      userEmailValidator,
      userPasswordValidator
    } = RuleValidator();

    function loginTypeChange() {
      Object.assign(form, { phone: null, email: null });
    }

    function accountTypeChange() {
      Object.assign(form, defaultForm);
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].clearValidate();
    }

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          addOne(form).then((result: any) => {
            if (result.code == 1) {
              ElNotification({
                title: '会员/代理新增成功！',
                type: 'success'
              });
              resetForm();
            } else {
              ElMessage.error(result.msg);
            }
          });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    };

    const resetForm = () => {
      Object.assign(form, defaultForm);
      setTimeout(() => {
        if (!proxy.$refs['ruleFormRef']) return;
        proxy.$refs['ruleFormRef'].resetFields();
      });
    };

    const tableData = computed(() => {
      if (form.rebate_template_id) {
        const arr = proxyTemplateList.value.filter((template: any) => {
          return template.id == form.rebate_template_id;
        });
        if (arr.length > 0) {
          return JSON.parse((arr[0] as any).config_json);
        } else {
          return [];
        }
      } else {
        return [];
      }
    });

    const { proxyTemplateList } = getProxyTemplateListHook();

    onMounted(async () => {
      [
        dict.universal_bool_options,
        dict.proxy_contact_type_options
      ] = await Promise.all([
        getDicts('universal_bool_options'),
        getDicts('proxy_contact_type_options')
      ]);
      console.log(dict);
    });

    return {
      form,
      loginType,
      userTypeValidator,
      userPhoneValidator,
      userEmailValidator,
      userPasswordValidator,
      submitForm,
      resetForm,
      loginTypeChange,
      accountTypeChange,
      loginTypeList,
      accountTypeList,
      isNot,
      getLabel,
      ...toRefs(dict),
      proxyTemplateList,
      tableData
    };
  }
});
</script>

<style lang="scss" scoped>
.add-one {
  margin: auto;
}
.add-user-select {
  max-width: 360px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
