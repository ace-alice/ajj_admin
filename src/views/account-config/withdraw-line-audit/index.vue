<template>
  <div class="main-container">
    <crudOperation title="router.withdraw-line-audit" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.channel_name1')">
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
          :style="{ height: tableHeight }"
          :max-height="tableHeight"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="starter_admin_name"
            label="发起人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="starter_time"
            label="发起时间"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.starter_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="starter_remark"
            label="发起原因"
            min-width="240"
            align="center"
          />
          <el-table-column
            prop="verify_status_name"
            label="审核状态"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="verify_admin_name"
            label="审核人"
            min-width="120"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="250"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="success"
                @click="doVerify(scope.row, 2)"
                :permission="otherPermission.verify"
                :disabled="scope.row.verify_status != 1"
                >审核通过</el-button
              >
              <el-button
                type="danger"
                @click="doVerify(scope.row, 3)"
                :permission="otherPermission.verify"
                :disabled="scope.row.verify_status != 1"
                >审核拒绝</el-button
              >
              <el-button
                type="primary"
                @click="doDetail(scope.row)"
                :permission="otherPermission.detail"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog v-model="dialogVisible" :show-close="false">
      <template #title>
        <div class="my-header">
          <h4>查看详情</h4>
          <el-button :type="button_status[detailData.verify_status + '']">
            {{ detailData.verify_status_name }}
          </el-button>
        </div>
      </template>
      <el-form
        ref="crudDefaultForm"
        :inline="true"
        :model="detailData"
        label-width="120px"
      >
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <strong>{{ $t('table.line_properties') }}</strong>
            </div>
          </template>
          <el-form-item :label="$t('table.channel_name1')" prop="channel_name">
            <el-input
              v-model.trim="detailData.channel_name"
              :placeholder="$t('table.channel_name1')"
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.channel_code')" prop="channel_code">
            <el-input
              v-model.trim="detailData.channel_code"
              :placeholder="$t('table.channel_code')"
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.daily_limit_money')"
            prop="daily_max_amount"
          >
            <el-input
              v-model.trim="detailData.daily_max_amount"
              :placeholder="$t('table.daily_limit_money')"
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.is_blockchain')" prop="is_blockchain">
            <el-select
              v-model="detailData.is_blockchain"
              popper-class="user-select"
              clearable
              style="width: 200px"
              disabled
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
            :label="$t('table.protocol_type')"
            prop="bank_code"
            v-if="detailData.is_blockchain == 2"
          >
            <el-select
              v-model="detailData.bank_code"
              popper-class="user-select"
              clearable
              style="width: 200px"
              disabled
            >
              <el-option
                v-for="item in usdtProtocolList"
                :key="item.bank_code"
                :label="item.protocol"
                :value="item.bank_code"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('table.channel_charges_type')"
            prop="channel_charges_type"
          >
            <el-select
              v-model="detailData.channel_charges_type"
              popper-class="user-select"
              clearable
              style="width: 200px"
              @change="channelChargesTypeChange"
              disabled
            >
              <el-option
                v-for="item in channel_charges_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <template v-if="detailData.channel_charges_type == 2">
            <el-form-item
              :label="$t('table.channel_charges')"
              prop="channel_charges"
            >
              <el-input
                v-model.trim="detailData.channel_charges"
                :placeholder="$t('table.channel_charges')"
                type="number"
                style="width: 200px"
                disabled
              >
              </el-input>
            </el-form-item>
          </template>
          <template v-if="detailData.channel_charges_type == 1">
            <el-form-item
              :label="$t('table.channel_charges')"
              prop="channel_charges_ratio"
            >
              <el-input
                v-model.trim="detailData.channel_charges_ratio"
                :placeholder="$t('table.channel_charges')"
                type="number"
                style="width: 200px"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.channel_charges_min_quota')"
              prop="channel_charges_min_quota"
            >
              <el-input
                v-model.trim="detailData.channel_charges_min_quota"
                :placeholder="$t('table.channel_charges_min_quota')"
                type="number"
                style="width: 200px"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.channel_charges_max_quota')"
              prop="channel_charges_max_quota"
            >
              <el-input
                v-model.trim="detailData.channel_charges_max_quota"
                :placeholder="$t('table.channel_charges_max_quota')"
                type="number"
                style="width: 200px"
                disabled
              >
              </el-input>
            </el-form-item>
          </template>
          <template v-if="detailData.channel_charges_type == 3">
            <el-form-item label="手续费" prop="channel_charges">
              <el-input
                v-model.trim="detailData.channel_charges"
                placeholder="手续费"
                type="number"
                style="width: 200px"
                disabled
              >
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="手续费百分比" prop="channel_charges_ratio">
              <el-input
                v-model.trim="detailData.channel_charges_ratio"
                placeholder="手续费百分比"
                type="number"
                style="width: 200px"
                disabled
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.channel_charges_min_quota')"
              prop="channel_charges_min_quota"
            >
              <el-input
                v-model.trim="detailData.channel_charges_min_quota"
                :placeholder="$t('table.channel_charges_min_quota')"
                type="number"
                style="width: 200px"
                disabled
              >
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('table.channel_charges_max_quota')"
              prop="channel_charges_max_quota"
            >
              <el-input
                v-model.trim="detailData.channel_charges_max_quota"
                :placeholder="$t('table.channel_charges_max_quota')"
                type="number"
                style="width: 200px"
                disabled
              >
              </el-input>
            </el-form-item>
          </template>
        </el-card>
      </el-form>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/withdraw-line-audit';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getRechargeTypeListHook } from '@/hook/getRechargeTypeList';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { getVipLevelListHook } from '@/hook/getVipLevelList';
import { getUsdtProtocolListHook } from '@/hook/getUsdtProtocolList';
import { ElMessage } from 'element-plus';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '出款线路审核',
  crudOptShow: {
    add: false,
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
    channel_getway: null,
    channel_url: null,
    channel_charges: null,
    channel_charges_ratio: 0,
    channel_charges_min_quota: 0,
    channel_charges_max_quota: 0,
    terminal_pc_min_quota: null,
    terminal_pc_max_quota: null,
    channel_charges_refund: 2,
    terminal_h5_min_quota: null,
    terminal_h5_max_quota: null,
    terminal_app_min_quota: null,
    terminal_app_max_quota: null,
    // channel_params: [],
    support_viplevel: [],
    support_terminal: [],
    channel_charges_type: null,
    is_blockchain: null,
    bank_code: null,
    daily_max_amount: null,
    channel_status: null,
    channel_params: '待定'
  },
  crudTag: 'withdraw:line:audit:'
};

export default defineComponent({
  name: 'withdraw-line-audit',
  components: { crudOperation, udOperation, PromiseSwitch },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      top: 'withdraw:line:audit:top',
      change: 'withdraw:line:audit:change'
    };

    const { getLabel } = dictionary();

    const { vipLevelList } = getVipLevelListHook();
    const { usdtProtocolList } = getUsdtProtocolListHook();

    const dict = reactive({
      universal_status_options: [],
      terminal_type_options: [],
      channel_getway_options: [],
      channel_charges_type_options: [],
      is_blockchain_options: [],
      button_status: {
        '1': 'info',
        '2': 'primary',
        '3': 'danger'
      }
    });

    const { rechargeTypeList } = getRechargeTypeListHook();

    async function doVerify(row: any, status: any) {
      const params = {
        id: row.id,
        verify_status: status
      };
      const { data, code, msg } = await (<any>Api.verify(params));
      if (code === 1) {
        ElMessage.success(msg);
        crud.toQuery();
      } else {
        ElMessage.error(msg);
      }
    }

    const dialogVisible = ref(false);
    const detailData: any = ref({});
    async function doDetail(row: any) {
      dialogVisible.value = true;
      detailData.value = {};
      const params = {
        id: row.id
      };
      const { data, code, msg } = await (<any>Api.detail(params));
      if (code === 1) {
        detailData.value = {
          ...row,
          ...data
        };
        console.log(detailData.value)
        detailData.value.cash_type_id &&
          (detailData.value.cash_type_id = Number(
            detailData.value.cash_type_id
          ));
        detailData.value.is_blockchain &&
          (detailData.value.is_blockchain = Number(
            detailData.value.is_blockchain
          ));
        detailData.value.channel_charges_type &&
          (detailData.value.channel_charges_type = Number(
            detailData.value.channel_charges_type
          ));
      } else {
        ElMessage.error(msg);
      }
    }

    function handleClose() {
      dialogVisible.value = false;
    }

    onMounted(async () => {
      [
        dict.universal_status_options,
        dict.terminal_type_options,
        dict.channel_getway_options,
        dict.channel_charges_type_options,
        dict.is_blockchain_options
      ] = await Promise.all([
        getDicts('universal_status_options'),
        getDicts('terminal_type_options'),
        getDicts('channel_getway_options'),
        getDicts('channel_charges_type_options'),
        getDicts('is_blockchain_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      doDetail,
      rechargeTypeList,
      otherPermission,
      vipLevelList,
      ...toRefs(dict),
      handleClose,
      dialogVisible,
      doVerify,
      getLabel,
      usdtProtocolList,
      detailData
    };
  }
});
</script>
<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
}
.my-header {
  display: flex;
  flex-direction: row;
  height: 36px;
  justify-content: space-between;
  h4 {
    margin: 0;
    line-height: 36px;
    color: #fff;
    font-size: 16px;
  }
}
</style>
