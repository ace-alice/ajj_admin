<template>
  <div class="main-container">
    <crudOperation title="router.recharge-list" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.order_number')">
          <el-input
            v-model.trim="crudQuery.order_number"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.order_username')">
          <el-input
            v-model.trim="crudQuery.order_username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_type')">
          <el-select
            v-model="crudQuery.account_type"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.account_type')"
            clearable
          >
            <el-option
              v-for="item in account_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态">
          <el-select
            v-model="crudQuery.draw_status_order"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in order_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调整类型" prop="money_change_id">
          <el-cascader
            clearable
            v-model="crudQuery.money_change_id"
            :options="cashManualTypeList"
            :props="{
              value: 'id',
              label: 'title_cn',
              children: 'blow',
              emitPath: false
            }"
            style="width: 200px"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item :label="$t('table.initiation_time' /**发起时间 */)">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.verify_time' /**审核时间 */)">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="update_start_time"
            endKey="update_end_time"
            :propTime="[
              crudQuery.update_start_time,
              crudQuery.update_end_time
            ]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="750px"
          show-summary
          :summary-method="getSummaries"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="draw_order"
            :label="$t('table.order_number')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="username"
            label="会员账号"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="account_type"
            label="账号类型"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.account_type, account_type_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="account_name"
            label="会员姓名"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="vip_current_level"
            label="VIP等级"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ `VIP${scope.row.vip_current_level}` }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_status_order"
            :label="$t('table.order_verify')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.draw_status_order, order_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="draw_status_client"
            :label="$t('table.order_status_client')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(
                  scope.row.draw_status_client,
                  order_status_client_options
                )
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="money_change_name"
            label="调整类型"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="draw_amount"
            label="调整金额"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="admin_verify_three_name"
            label="操作人"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="发起时间"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_time"
            label="审核时间"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="draw_remark"
            :label="$t('table.remark')"
            min-width="300"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/withdraw-list';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { getCashManualTypeListHook } from '@/hook/getCashManualTypeList';
const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '审核',
  crudOptShow: {
    operate: true,
    download: true
  },
  crudTableParams: 'data',
  defaultQuery: {
    order_verify: '1',
    manual: '1',
    start_time: null,
    account_type: null, //账号类型
    end_time: null,
    order_number: null, //订单号
    username: null, //用户账号
    order_username: null, //存款人姓名
    update_start_time: null,
    update_end_time: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['draw_amount'],
  crudTag: 'artificial:redu:'
};

export default defineComponent({
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { cashManualTypeList } = getCashManualTypeListHook({ money_type: 0 });

    const dict = reactive({
      account_type_options: [],
      order_status_client_options: [],
      order_status_options: []
    });

    const { getLabel } = dictionary();

    onMounted(async () => {
      [
        dict.account_type_options,
        dict.order_status_client_options,
        dict.order_status_options
      ] = await Promise.all([
        getDicts('account_type_options'),
        getDicts('order_status_client_options'),
        getDicts('order_status_options')
      ]);
    });

    return {
      ...crud,
      getLabel,
      ...toRefs(dict),
      cashManualTypeList
    };
  }
});
</script>
