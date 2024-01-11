<template>
  <div class="main-container">
    <el-tabs v-model="crudQuery.currency_id" @tab-click="currencyChange">
      <el-tab-pane label="CNY" name="1"></el-tab-pane>
      <el-tab-pane label="USDT" name="2"></el-tab-pane>
    </el-tabs>
    <crudOperation
      title="router.recharge-account-config"
      :key="crudQuery.currency_id"
      labelWidth="120px"
    >
      <template #query>
        <el-form-item :label="$t('table.account_name_recharge')">
          <el-input v-model.trim="crudQuery.account_name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select v-model="crudQuery.status" popper-class="user-select">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.channel_id')">
          <el-select
            v-model="crudQuery.channel_id"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in rechargeLineList"
              :key="item.value"
              :label="item.channel_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.cash_type_id')">
          <el-select
            v-model="crudQuery.cash_type_id"
            popper-class="user-select"
            clearable
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
          <el-input v-model.trim="crudQuery.create_name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
          <el-input v-model.trim="crudQuery.action_name" clearable></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="deposit_sort"
            :label="$t('table.sort')"
            min-width="80"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            :label="$t('table.account_name_recharge')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="channel_name"
            :label="$t('table.channel_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="deposit_sort"
            :label="$t('table.status')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.deposit_sort"
                inline-prompt
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="2"
              />
              <el-tag
                style="margin-left: 5px"
                :type="scope.row.channel_code == 1 ? 'success' : 'danger'"
                >{{ getStatusLabel(scope.row.deposit_sort) }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="deposit_name"
            :label="$t('table.deposit_name')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ scope.row.deposit_name }}</span>
            </template>
          </el-table-column>

          <template v-if="crudQuery.currency_id == '1'">
            <el-table-column
              prop="bank_account"
              :label="$t('table.bank_account')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="bank_payee_name"
              :label="$t('table.bank_payee_name')"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="bank_payee_address"
              :label="$t('table.bank_payee_address')"
              min-width="120"
              align="center"
            />
          </template>
          <template v-if="crudQuery.currency_id == '2'">
            <el-table-column
              prop="blockchain_address"
              :label="$t('table.blockchain_address')"
              min-width="180"
              align="center"
            />
          </template>
          <el-table-column
            prop="admin_id_create"
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
            prop="admin_id_action"
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
            min-width="200"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_menu_id] })"
                :permission="crudPermission"
              >
                <template #right>
                  <el-button type="text" v-only="otherPermission.top">{{
                    $t('table.top')
                  }}</el-button>
                </template>
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
          <el-form-item
            :label="$t('table.account_name_recharge')"
            prop="account_name"
            :rules="[
              {
                required: true,
                message:
                  $t('table.account_name_recharge') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.account_name"
              :placeholder="$t('table.account_name_recharge')"
              style="width: 206px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.channel_id')"
            prop="channel_id"
            :rules="[
              {
                required: true,
                message: $t('table.channel_id') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="crudQuery.channel_id"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in rechargeLineList"
                :key="item.value"
                :label="item.channel_name"
                :value="item.id"
              />
            </el-select>
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
              v-model="crudQuery.cash_type_id"
              popper-class="user-select"
              clearable
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
            v-if="crudQuery.currency_id == '1'"
            :label="$t('table.bank_account')"
            prop="bank_account"
            :rules="[
              {
                required: true,
                message: $t('table.bank_account') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.bank_account"
              :placeholder="$t('table.bank_account')"
              style="width: 206px"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="crudQuery.currency_id == '1'"
            :label="$t('table.bank_payee_name')"
            prop="bank_payee_name"
            :rules="[
              {
                required: true,
                message: $t('table.bank_payee_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.bank_payee_name"
              :placeholder="$t('table.bank_payee_name')"
              style="width: 206px"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="crudQuery.currency_id == '1'"
            :label="$t('table.bank_id')"
            prop="bank_id"
            :rules="[
              {
                required: true,
                message: $t('table.bank_id') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="crudQuery.bank_id"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in rechargeLineList"
                :key="item.value"
                :label="item.channel_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="crudQuery.currency_id == '1'"
            :label="$t('table.bank_payee_address')"
            prop="bank_payee_address"
            :rules="[
              {
                required: true,
                message: $t('table.bank_payee_address') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.bank_payee_address"
              :placeholder="$t('table.bank_payee_address')"
              style="width: 206px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.blockchain_address')"
            prop="blockchain_address"
            v-if="crudQuery.currency_id == '2'"
            :rules="[
              {
                required: true,
                message: $t('table.blockchain_address') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.blockchain_address"
              :placeholder="$t('table.blockchain_address')"
            ></el-input>
          </el-form-item>
          <nomalImageUpload
            v-if="crudQuery.currency_id == '2'"
            @setImage="setTheForm"
            :formLabel="$t('table.blockchain_image')"
            :data="proxyForm['blockchain_image']"
            imgkey="blockchain_image"
            imgUrlKey="blockchain_image"
          />
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/recharge-account-config';
import { defineComponent, onMounted } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { getRechargeTypeListHook } from '@/hook/getRechargeTypeList';
import { getRechargeLineListHook } from '@/hook/getRechargeLineList';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'CNY',
  crudOptShow: {
    add: true,
    dragAble: false,
    formSize: '60%'
  },
  defaultQuery: {
    currency_id: '1',
    status: 0,
    deposit_name: null,
    create_name: null,
    action_name: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    currency_id: 1,
    bank_id: null,
    bank_account: null,
    bank_payee_name: null,
    channel_id: null,
    cash_type_id: null,
    account_name: null,
    blockchain_address: null,
    blockchain_image: null
  },
  crudTag: 'recharge:account:'
};

export default defineComponent({
  name: 'recharge-account-config',
  components: { crudOperation, udOperation, nomalImageUpload },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      top: 'recharge:account:top'
    };

    const { statusOptions, getStatusLabel } = dictionary();

    const { rechargeTypeList, getRechargeTypeFun } = getRechargeTypeListHook();

    const { rechargeLineList, getRechargeLineFun } = getRechargeLineListHook();

    function currencyChange() {
      getRechargeTypeFun({ currency_id: crud.crudQuery.currency_id });
      getRechargeLineFun({ currency_id: crud.crudQuery.currency_id });
      crud.toQuery();
    }

    crud.crudHook.beforeToAdd = () => {
      Object.assign(crud.proxyForm, {
        currency_id: crud.crudQuery.currency_id
      });
      return true;
    };

    onMounted(() => {});
    return {
      ...crud,
      statusOptions,
      getStatusLabel,
      currencyChange,
      rechargeTypeList,
      rechargeLineList,
      otherPermission
    };
  }
});
</script>
