<template>
  <div class="main-container">
    <crudOperation title="router.log-config">
      <template #query>
        <el-form-item :label="$t('table.username')">
          <el-select
            v-model="crudQuery.username"
            style="width: 200px"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="item in operatorList"
              :key="item.admin_user_id"
              :label="item.username"
              :value="item.username"
            >
              <span style="float: left">{{ item.username }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >{{ item.admin_user_id }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.menu_name')">
          <el-input
            v-model.trim="crudQuery.menu_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.menu_url')">
          <el-input
            v-model.trim="crudQuery.menu_url"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.request_ip')">
          <el-input
            v-model.trim="crudQuery.request_ip"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.request_param')">
          <el-input
            v-model.trim="crudQuery.request_param"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.response_msg')">
          <el-input
            v-model.trim="crudQuery.response_msg"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.response_code')">
          <el-input
            v-model.trim="crudQuery.response_code"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.log_type')">
          <el-select
            v-model="crudQuery.log_type"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in logTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.log_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #left-right>
        <el-popconfirm :title="$t('table.log_clear')" @confirm="doLogClear">
          <template #reference>
            <el-button
              type="primary"
              v-only="otherPermission.clear"
              :disabled="!crudQuery.username"
              :loading="logClearLoading"
              ><el-icon><delete /></el-icon
              >{{ $t('table.log_clear') }}</el-button
            >
          </template>
        </el-popconfirm>
        <el-checkbox
          v-model="clean"
          v-only="otherPermission.clear"
          label="清理全部"
          class="left-right-checkbox"
        />
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          max-height="600px"
          row-key="admin_user_log_id"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="menu_name"
            :label="$t('table.menu_name')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="menu_url"
            :label="$t('table.menu_url')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="request_ip"
            :label="$t('table.request_ip')"
            min-width="120"
            align="center"
          />

          <el-table-column
            prop="request_method"
            :label="$t('table.request_method')"
            min-width="90"
            align="center"
          />
          <el-table-column
            prop="response_code"
            :label="$t('table.response_code')"
            min-width="80"
            align="center"
          />
          <el-table-column
            prop="response_msg"
            :label="$t('table.response_msg')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
            align="center"
          />
        </el-table>
      </template>
      <template #form> </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/admin-config/log-config';
import { defineComponent, ref } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getOperatorListHook } from '@/hook/getOperatorList';
import { dictionary } from '@/hook/lib';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '日志',
  crudOptShow: {
    moreDel: true
  },
  crudPrimarykey: 'admin_user_log_id',
  defaultQuery: {
    admin_user_log_id: null,
    admin_user_id: null,
    admin_menu_id: null,
    username: null,
    menu_url: null,
    menu_name: null,
    request_ip: null,
    request_param: null,
    response_msg: null,
    response_code: null,
    start_time: null,
    end_time: null,
    log_type: null
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'log:config:'
};

export default defineComponent({
  name: 'log-config',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { operatorList } = getOperatorListHook();

    const { logTypeOptions } = dictionary();

    const logClearLoading = ref(false);

    const otherPermission = {
      //是否可以需改需要权限验证
      clear: 'log:config:clear'
    };

    const clean = ref(true);

    function doLogClear() {
      logClearLoading.value = true;
      Api.clear(Object.assign({}, crud.crudQuery, { clean: !clean.value }))
        .then((result: any) => {
          if (result.code == 1) {
            crud.editSuccessNotify();
            crud.toQuery();
          }
        })
        .finally(() => {
          logClearLoading.value = false;
        });
    }

    return {
      ...crud,
      operatorList,
      logTypeOptions,
      doLogClear,
      logClearLoading,
      clean,
      otherPermission
    };
  }
});
</script>

<style lang="scss" scoped>
.left-right-checkbox {
  margin: 0 10px;
}
</style>
