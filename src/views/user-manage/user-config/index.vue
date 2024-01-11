<template>
  <div class="main-container">
    <crudOperation
      title="router.user-config"
      labelWidth="120px"
      ref="crudOperation"
    >
      <template #query>
        <el-form-item :label="$t('table.username')">
          <el-input
            v-model.trim="crudQuery.username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.account_name')">
          <el-input
            v-model.trim="crudQuery.account_name"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.risk_type')">
          <el-select
            v-model="crudQuery.risk_control_mark_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.risk_type')"
            clearable
          >
            <el-option
              v-for="item in riskTypeList"
              :key="item.id"
              :label="item.risk_level"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为测试">
          <el-select
            v-model="crudQuery.is_test"
            style="width: 200px"
            popper-class="user-select"
            placeholder="是否为测试"
            clearable
          >
            <el-option
              v-for="item in universal_bool_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.account_type')">
          <el-select
            v-model="crudQuery.account_type"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.account_type')"
          >
            <el-option
              v-for="item in account_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.vip_level')">
          <el-input
            v-model.trim="crudQuery.vip_level_start"
            style="width: 95px"
          />
          -
          <el-input
            v-model.trim="crudQuery.vip_level_end"
            style="width: 95px"
          />
        </el-form-item>
        <el-form-item :label="$t('table.account_status')">
          <el-select
            v-model="crudQuery.status"
            :placeholder="$t('table.account_status')"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in account_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.register_terminal')">
          <el-select
            v-model="crudQuery.register_terminal"
            :placeholder="$t('table.register_terminal')"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in terminal_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.superior_user')">
          <el-input
            v-model.trim="crudQuery.senior_member_username"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.create_time_1')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.login_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="login_time_start"
            endKey="login_time_end"
            :propTime="[crudQuery.login_time_start, crudQuery.login_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.first_deposit_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="first_deposit_start"
            endKey="first_deposit_end"
            :propTime="[
              crudQuery.first_deposit_start,
              crudQuery.first_deposit_end
            ]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="member_id"
          max-height="750px"
          show-summary
          :summary-method="getSummaries"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="account_name"
            :label="$t('table.account_name')"
            min-width="120"
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
            prop="is_test"
            label="是否为测试"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.is_test, universal_bool_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('table.account_status')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <el-tag
                type="info"
                style="margin: 5px"
                effect="dark"
                v-show="scope.row.status_game"
                >{{ getLabel(2, account_status_options) }}</el-tag
              >
              <el-tag
                type="warning"
                style="margin: 5px"
                effect="dark"
                v-show="scope.row.status_login"
                >{{ getLabel(3, account_status_options) }}</el-tag
              >
              <el-tag
                type="danger"
                style="margin: 5px"
                effect="dark"
                v-show="scope.row.status_pay"
                >{{ getLabel(1, account_status_options) }}</el-tag
              >
              <el-tag
                style="margin: 5px"
                effect="dark"
                v-show="
                  !(
                    scope.row.status_game ||
                    scope.row.status_login ||
                    scope.row.status_pay
                  )
                "
                >{{ getLabel(0, account_status_options) }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="risk_control_mark"
            :label="$t('table.danger_status')"
            min-width="100"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="vip_current_level"
            :label="$t('table.vip_level')"
            min-width="120"
            align="center"
            sortable
          >
            <template #default="scope">
              <span>VIP{{ scope.row.vip_current_level }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="senior_member_username"
            :label="$t('table.superior_user')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time_1')"
            min-width="160"
            align="center"
            sortable
          />
          <el-table-column
            prop="first_deposit_time"
            :label="$t('table.first_deposit_time')"
            min-width="160"
            align="center"
            sortable
          >
            <template #default="scope">
              <span v-if="scope.row.first_deposit_time">{{
                scope.row.first_deposit_time
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="first_deposit_amount"
            :label="$t('table.first_deposit_amount')"
            min-width="160"
            align="center"
            sortable
          />

          <el-table-column
            prop="login_time"
            :label="$t('table.login_time')"
            min-width="160"
            align="center"
            sortable
          >
            <template #default="scope">
              <span>{{
                scope.row.login_time ? scope.row.login_time : '--'
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="rmb_wallet"
            :label="$t('table.rmb_wallet')"
            min-width="160"
            align="center"
            sortable
          />
          <el-table-column
            prop="usdt_wallet"
            :label="$t('table.usdt_wallet')"
            min-width="160"
            align="center"
            sortable
          /> -->
          <el-table-column
            prop="no_deposit_days"
            :label="$t('table.days_without_deposit')"
            min-width="120"
            align="center"
            sortable
          />
          <el-table-column
            prop="register_terminal"
            :label="$t('table.register_terminal')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.register_terminal, terminal_type_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="130"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="toPath(scope.row)"
                v-only="otherPermission.editUserInfo"
                >{{ $t('table.see_details') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- <template #form> </template> -->
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/user-manage/user-config';
import {
  defineComponent,
  getCurrentInstance,
  onActivated,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { useRouter } from 'vue-router';
import { getRiskTypeListHook } from '@/hook/getRiskTypeList';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '用户',
  crudOptShow: {
    download: true,
    formSize: '60%'
  },
  crudTableParams: 'data',
  defaultQuery: {
    sort_field: null,
    sort_value: null,
    username: null,
    is_test: null,
    account_name: null,
    account_type: null,
    status: null,
    register_terminal: null,
    senior_member_username: null,
    risk_control_mark_id: null,
    create_time_start: null,
    create_time_end: null,
    login_time_start: null,
    login_time_end: null,
    first_deposit_start: null,
    first_deposit_end: null,
    not_deposited_start: null,
    not_deposited_end: null,
    vip_level_start: null,
    vip_level_end: null,
    export: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    name: null,
    code: null,
    editor: ''
  },
  includeSumColumn: ['first_deposit_amount'],
  crudTag: 'user:config:'
};

export default defineComponent({
  name: 'user-config',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      editUserInfo: 'user:config:edit'
    };

    const { getLabel } = dictionary();

    const dict = reactive({
      universal_bool_options: [],
      account_type_options: [],
      terminal_type_options: [],
      account_status_options: []
    });

    const router = useRouter();

    // 跳转到会员编辑页面
    function toPath(row: any) {
      router.push({
        name: 'user-info-edit',
        query: { member_id: row.id, account_type: row.account_type }
      });
    }

    const { riskTypeList } = getRiskTypeListHook({ risk_type: 1 });

    onMounted(async () => {
      [
        dict.universal_bool_options,
        dict.account_type_options,
        dict.terminal_type_options,
        dict.account_status_options
      ] = await Promise.all([
        getDicts('universal_bool_options'),
        getDicts('account_type_options'),
        getDicts('terminal_type_options'),
        getDicts('account_status_options')
      ]);
    });

    return {
      ...crud,
      toPath,
      otherPermission,
      riskTypeList,
      ...toRefs(dict),
      getLabel
    };
  }
});
</script>

<style lang="scss">
.user-select {
  min-width: 200px !important;
}
</style>
