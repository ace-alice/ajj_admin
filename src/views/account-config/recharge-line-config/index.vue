<template>
  <div class="main-container">
    <crudOperation title="router.recharge-line-config" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.channel_name')">
          <el-input
            v-model.trim="crudQuery.channel_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in universal_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
        <el-form-item :label="$t('table.create_name')">
          <el-input
            v-model.trim="crudQuery.create_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
          <el-input
            v-model.trim="crudQuery.update_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="750px"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="id"
            :label="$t('table.channel_id1')"
            v-only="otherPermission.show_id"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            :label="$t('table.channel_name')"
            v-only="otherPermission.show_name"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="cash_type_id"
            :label="$t('table.cash_type_id')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(
                  scope.row.cash_type_id,
                  rechargeTypeList,
                  'id',
                  'deposit_name'
                )
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel_status"
            :label="$t('table.status')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.channel_name"
                :initValue="scope.row.channel_status"
                :activeValue="1"
                :inactiveValue="2"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id,
                  channel_status: scope.row.channel_status
                }"
                paramKey="channel_status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.change"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="support_terminal"
            :label="$t('table.support_terminal')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.support_terminal">
                <el-tag
                  v-for="terminal in scope.row.support_terminal.split(',')"
                  :key="terminal"
                  style="margin: 5px"
                  effect="plain"
                  type="warning"
                  >{{ getLabel(terminal, terminal_type_options) }}</el-tag
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.create_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="250"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ id: scope.row.id })"
                @top="toTop(scope.row)"
                :rowData="scope.row"
                :permission="crudPermission"
              >
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <strong>{{ $t('table.line_properties') }}</strong>
              </div>
            </template>
            <el-form-item
              :label="$t('table.channel_name')"
              prop="channel_name"
              :rules="[
                {
                  required: true,
                  message: $t('table.channel_name') + $t('table.not_empty')
                }
              ]"
            >
              <el-input
                v-model.trim="proxyForm.channel_name"
                :placeholder="$t('table.channel_name')"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.channel_code')"
              prop="channel_code"
              :rules="[
                {
                  required: true,
                  message: $t('table.channel_code') + $t('table.not_empty')
                }
              ]"
            >
              <el-input
                v-model.trim="proxyForm.channel_code"
                :placeholder="$t('table.channel_code')"
                style="width: 200px"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.cash_type_id')"
              prop="cash_type_id"
              :rules="[
                {
                  required: true,
                  message: $t('table.cash_type_id') + $t('table.not_empty')
                }
              ]"
            >
              <el-select
                v-model="proxyForm.cash_type_id"
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

            <el-form-item
              :label="$t('table.is_blockchain')"
              prop="is_blockchain"
              :rules="[
                {
                  required: true,
                  message: $t('table.is_blockchain') + $t('table.not_empty')
                }
              ]"
            >
              <el-select
                v-model="proxyForm.is_blockchain"
                popper-class="user-select"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="item in is_blockchain_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('table.channel_charges_type')"
              prop="channel_charges_type"
              :rules="[
                {
                  required: true,
                  message:
                    $t('table.channel_charges_type') + $t('table.not_empty')
                }
              ]"
            >
              <el-select
                v-model="proxyForm.channel_charges_type"
                popper-class="user-select"
                clearable
                style="width: 200px"
                @change="channelChargesTypeChange"
              >
                <el-option
                  v-for="item in channel_charges_type_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <template v-if="proxyForm.channel_charges_type == 2">
              <el-form-item
                :label="$t('table.channel_charges')"
                prop="channel_charges"
                :rules="[
                  {
                    required: true,
                    message: $t('table.channel_charges') + $t('table.not_empty')
                  }
                ]"
              >
                <el-input
                  v-model.trim="proxyForm.channel_charges"
                  :placeholder="$t('table.channel_charges')"
                  type="number"
                  style="width: 200px"
                >
                </el-input>
              </el-form-item>
            </template>
            <template v-if="proxyForm.channel_charges_type == 1">
              <el-form-item
                :label="$t('table.channel_charges')"
                prop="channel_charges"
                :rules="[
                  {
                    required: true,
                    message: $t('table.channel_charges') + $t('table.not_empty')
                  }
                ]"
              >
                <el-input
                  v-model.trim="proxyForm.channel_charges"
                  :placeholder="$t('table.channel_charges')"
                  type="number"
                  style="width: 200px"
                >
                  <template #append>%</template>
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('table.channel_charges_min_quota')"
                prop="channel_charges_min_quota"
                :rules="[
                  {
                    required: true,
                    message:
                      $t('table.channel_charges_min_quota') +
                      $t('table.not_empty')
                  }
                ]"
              >
                <el-input
                  v-model.trim="proxyForm.channel_charges_min_quota"
                  :placeholder="$t('table.channel_charges_min_quota')"
                  type="number"
                  style="width: 200px"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('table.channel_charges_max_quota')"
                prop="channel_charges_max_quota"
                :rules="[
                  {
                    required: true,
                    message:
                      $t('table.channel_charges_max_quota') +
                      $t('table.not_empty')
                  }
                ]"
              >
                <el-input
                  v-model.trim="proxyForm.channel_charges_max_quota"
                  :placeholder="$t('table.channel_charges_max_quota')"
                  type="number"
                  style="width: 200px"
                >
                </el-input>
              </el-form-item>
            </template>
            <el-form-item
              :label="$t('table.support_terminal')"
              prop="support_terminal"
            >
              <el-select
                v-model="proxyForm.support_terminal"
                multiple
                popper-class="user-select"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="terminal in terminal_type_options"
                  :key="terminal.value"
                  :label="terminal.label"
                  :value="terminal.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              style="width: 90%"
              :label="$t('table.support_viplevel')"
              prop="support_viplevel"
            >
              <el-checkbox-group v-model="proxyForm.support_viplevel">
                <el-checkbox
                  v-for="vip in vipLevelList"
                  :key="vip.level"
                  border
                  :label="vip.level"
                  >VIP{{ vip.level }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-descriptions direction="vertical" :column="3" border>
              <el-descriptions-item :label="$t('table.terminal_pc_quota')">
                <el-form-item
                  :label="$t('table.minimum')"
                  label-width="80px"
                  prop="terminal_pc_min_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_pc_min_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_pc_min_quota"
                    :placeholder="$t('table.terminal_pc_min_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('table.maximum')"
                  label-width="80px"
                  prop="terminal_pc_max_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_pc_max_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_pc_max_quota"
                    :placeholder="$t('table.terminal_pc_max_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('table.terminal_wap_quota')">
                <el-form-item
                  :label="$t('table.minimum')"
                  label-width="80px"
                  prop="terminal_h5_min_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_wap_min_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_h5_min_quota"
                    :placeholder="$t('table.terminal_wap_min_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('table.maximum')"
                  label-width="80px"
                  prop="terminal_h5_max_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_wap_max_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_h5_max_quota"
                    :placeholder="$t('table.terminal_wap_max_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('table.terminal_app_quota')">
                <el-form-item
                  :label="$t('table.minimum')"
                  label-width="80px"
                  prop="terminal_app_min_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_app_min_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_app_min_quota"
                    :placeholder="$t('table.terminal_app_min_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
                <el-form-item
                  :label="$t('table.maximum')"
                  label-width="80px"
                  prop="terminal_app_max_quota"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.terminal_app_max_quota') +
                        $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.trim="proxyForm.terminal_app_max_quota"
                    :placeholder="$t('table.terminal_app_max_quota')"
                    type="number"
                    style="width: 150px"
                  >
                  </el-input>
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          <el-card style="margin-top: 10px" v-if="crudStatus.edit">
            <template #header>
              <div class="card-header">
                <strong>变更原因</strong>
              </div>
            </template>
            <el-form-item
              label="发起原因"
              prop="starter_remark"
              style="width: 90%"
              :rules="[
                {
                  required: true,
                  message: '发起原因' + $t('table.not_empty')
                }
              ]"
            >
              <el-input
                v-model.trim="proxyForm.starter_remark"
                :rows="3"
                placeholder="发起原因"
                type="textarea"
              >
              </el-input>
            </el-form-item>
          </el-card>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/recharge-line-config';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getRechargeTypeListHook } from '@/hook/getRechargeTypeList';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { getVipLevelListHook } from '@/hook/getVipLevelList';
import { ElMessage, ElMessageBox } from 'element-plus/lib/components';
import { ElNotification } from 'element-plus';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '充值线路',
  crudOptShow: {
    add: true,
    dragAble: false,
    formSize: '70%'
  },
  defaultQuery: {
    status: null,
    deposit_name: null,
    create_name: null,
    update_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    channel_name: null,
    channel_code: null,
    cash_type_id: null,
    is_blockchain: null,
    channel_charges: null,
    channel_charges_min_quota: null,
    channel_charges_max_quota: null,
    terminal_pc_min_quota: null,
    terminal_pc_max_quota: null,
    terminal_h5_min_quota: null,
    terminal_h5_max_quota: null,
    terminal_app_min_quota: null,
    terminal_app_max_quota: null,
    support_viplevel: [],
    support_terminal: [],
    starter_remark: null,
    channel_charges_type: null,
    channel_status: null,
    channel_params: '待定'
  },
  crudTag: 'recharge:line:'
};

export default defineComponent({
  name: 'recharge-line-config',
  components: { crudOperation, udOperation, PromiseSwitch },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      top: 'recharge:line:top',
      change: 'recharge:line:change',
      show_id: 'recharge:line:show_id',
      show_name: 'recharge:line:show_name'
    };

    const { getLabel } = dictionary();

    const { vipLevelList } = getVipLevelListHook();

    const dict = reactive({
      universal_status_options: [],
      terminal_type_options: [],
      channel_charges_type_options: [],
      is_blockchain_options: []
    });

    const { rechargeTypeList } = getRechargeTypeListHook();

    crud.crudHook.beforeToEdit = (form: any) => {
      form.support_terminal = form.support_terminal
        .split(',')
        .map((num: string) => Number(num));
      form.support_viplevel = form.support_viplevel
        .split(',')
        .map((num: string) => Number(num));
      return true;
    };

    const { proxy } = <any>getCurrentInstance();
    crud.crudHook.beforeValidateCU = (form: any) => {
      form.support_terminal = form.support_terminal.join(',');
      form.support_viplevel = form.support_viplevel.join(',');
      proxy.$refs['crudDefaultForm'].validate(async (valid: any) => {
        if (valid) {
          const res = await doConfirm(form);
          if (res) {
            proxy.mittBus.emit('closeCrudDialog');
            setTimeout(() => {
              crud.refresh();
            }, 1000);
          }
        }
        return false;
      });
    };

    function channelChargesTypeChange() {
      crud.proxyForm.channel_charges = null;
      crud.proxyForm.channel_charges_min_quota = null;
      crud.proxyForm.channel_charges_max_quota = null;
    }

    async function doConfirm(form: any) {
      return new Promise(async (resolve, reject) => {
        if (!form.starter_remark) {
          const { code, data, msg } = await (<any>Api.add(form));
          if (code == 1) {
            ElNotification.success(msg);
            resolve(true);
          } else {
            ElMessage.error(msg);
            resolve(false);
          }
        } else {
          let params = {
            channel_id: form.id,
            config_arr: { ...form },
            starter_remark: form.starter_remark
          };
          const { code, data, msg } = await (<any>Api.verifyAdd(params));
          console.log(code, msg, '111111111111111111111111');
          if (code == 1) {
            ElNotification.success(msg);
            resolve(true);
          } else {
            ElMessage.error(msg);
            resolve(false);
          }
        }
      });
    }

    onMounted(async () => {
      [
        dict.universal_status_options,
        dict.terminal_type_options,
        dict.channel_charges_type_options,
        dict.is_blockchain_options
      ] = await Promise.all([
        getDicts('universal_status_options'),
        getDicts('terminal_type_options'),
        getDicts('channel_charges_type_options'),
        getDicts('is_blockchain_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      rechargeTypeList,
      otherPermission,
      vipLevelList,
      ...toRefs(dict),
      getLabel,
      channelChargesTypeChange
    };
  }
});
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
</style>
