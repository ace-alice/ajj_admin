<template>
  <div class="main-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <strong>{{ $t('router.risk-control-operate') }}</strong>
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
          style="max-width: 460px"
          ref="ruleFormRef"
        >
          <el-form-item
            :label="$t('table.risk_type')"
            prop="risk_type"
            :rules="[
              {
                required: true,
                message: $t('table.risk_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="form.risk_type"
              style="width: 360px"
              popper-class="add-user-select"
              fit-input-width
              @change="changeRiskType"
            >
              <el-option
                v-for="risk in riskTypeOptions"
                :key="risk.value"
                :label="risk.label"
                :value="risk.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="getLabel(form.risk_type, riskTypeOptions)"
            prop="data"
            :rules="[
              {
                required: true,
                message:
                  getLabel(form.risk_type, riskTypeOptions) +
                  $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="form.data"
              :placeholder="getLabel(form.risk_type, riskTypeOptions)"
            >
              <template #append>
                <el-button
                  @click.stop="search"
                  v-only="otherPermission.getInfo"
                  >{{ $t('crud.search') }}</el-button
                >
              </template>
            </el-input>
          </el-form-item>

          <el-form-item
            :label="$t('table.risk_level')"
            prop="risk_id"
            :rules="[
              {
                required: true,
                message: $t('table.risk_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="form.risk_id"
              style="width: 360px"
              popper-class="add-user-select"
              fit-input-width
              clearable
            >
              <el-option
                v-for="risk in riskTypeList"
                :key="risk.value"
                :label="risk.risk_level"
                :value="risk.id"
              />
            </el-select>
          </el-form-item>

          <template v-if="hasUser">
            <el-form-item
              :label="$t('table.risk_remark')"
              :rules="[
                {
                  required: true,
                  message: $t('table.risk_type') + $t('table.not_empty')
                }
              ]"
              prop="risk_remark"
            >
              <el-input
                v-model.trim="form.risk_remark"
                :autosize="{ minRows: 2, maxRows: 4 }"
                type="textarea"
                :maxlength="50"
                show-word-limit
                placeholder="请输出风控原因,50字以内"
              />
            </el-form-item>
            <el-form-item v-only="otherPermission.edit">
              <el-button type="primary" @click="submitForm()">
                {{ $t('crud.submit') }}
              </el-button>
              <el-button @click="resetForm()">
                {{ $t('crud.reset') }}</el-button
              >
            </el-form-item>
            <el-divider content-position="left">详细信息</el-divider>

            <component
              :infoDetail="infoDetail"
              :is="compConfig[form.risk_type + '']"
            ></component>
          </template>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue';
import { dictionary } from '@/hook/lib';
import { ElNotification } from 'element-plus';
import { Row } from '@/components/crud/lib/interface';
import riskUser from './components/risk-user.vue';
import riskBank from './components/risk-bank.vue';
import riskUsdt from './components/risk-usdt.vue';
import riskIP from './components/risk-IP.vue';
import riskDevice from './components/risk-device.vue';
import {
  editRisk,
  getInfo
} from '@/api/risk-control-config/risk-control-operate';
import { getRiskTypeListHook } from '@/hook/getRiskTypeList';
import { ElMessage } from 'element-plus';

const defaultForm = {
  risk_type: 1,
  risk_id: null,
  data: null,
  risk_remark: null
};

export default defineComponent({
  name: 'risk-control-operate',
  components: {
    riskUser,
    riskBank,
    riskUsdt,
    riskIP,
    riskDevice
  },
  setup() {
    const { riskTypeOptions, getLabel } = dictionary();

    const otherPermission = {
      // 是否可以需改需要权限验证
      edit: 'risk:control:operate',
      getInfo: 'risk:info:get'
    };

    const { proxy } = getCurrentInstance() as any;
    const compConfig: any = {
      '1': 'riskUser',
      '2': 'riskBank',
      '3': 'riskUsdt',
      '4': 'riskIP',
      '5': 'riskDevice'
    };

    let form = reactive({
      risk_type: 1,
      risk_id: null,
      data: null,
      risk_remark: null
    });

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          editRisk(form)
            .then((result: any) => {
              if (result.code == 1) {
                ElNotification.success(result.msg || result.message);
              } else {
                ElMessage.error(result.msg || result.message);
              }
            })
            .catch(() => {});
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

    const hasUser = ref(false);

    const resetForm = () => {
      Object.assign(form, defaultForm);
      infoDetail.value = {};
      hasUser.value = false;
      setTimeout(() => {
        if (!proxy.$refs['ruleFormRef']) return;
        proxy.$refs['ruleFormRef'].resetFields();
      });
    };

    const infoDetail: Ref<any> = ref({});
    function search() {
      proxy.$refs['ruleFormRef'].validateField(['data'], (valid: any) => {
        if (valid) {
          getInfo({ risk_type: form.risk_type, data: form.data }).then(
            (res: any) => {
              if (res.code == 1) {
                infoDetail.value = res.data.data;
                hasUser.value = true;
              }
            }
          );
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    function changeRiskType(val: any) {
      console.log(val)
      // resetForm()
      infoDetail.value = {};
      hasUser.value = false;
      form.data = null;
      form.risk_id = null;
      riskTypeListFun({ risk_type: form.risk_type });
    }

    const { riskTypeList, riskTypeListFun } = getRiskTypeListHook({
      risk_type: form.risk_type
    });

    onMounted(() => {});

    return {
      riskTypeOptions,
      form,
      otherPermission,
      hasUser,
      submitForm,
      search,
      resetForm,
      getLabel,
      riskTypeList,
      changeRiskType,
      compConfig,
      infoDetail
    };
  }
});
</script>

<style lang="scss" scoped>
.box-card {
  max-width: 680px;
  margin: auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
