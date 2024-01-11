<template>
  <div class="main-container">
    <crudOperation title="router.login-device-black-list">
      <template #query>
        <el-form-item :label="$t('table.terminal_num')">
          <el-input v-model.trim="crudQuery.terminal" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.create_name')">
          <el-input v-model.trim="crudQuery.create_name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.create_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
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
            type="index"
            :label="$t('table.sort')"
            width="80"
            align="center"
          />
          <el-table-column
            prop="terminal"
            :label="$t('table.terminal_num')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="terminal_login_number"
            :label="$t('table.ip_login_number')"
            min-width="120"
            align="center"
          />
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
            min-width="200"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ id: scope.row.id })"
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
          <el-form-item
            :label="$t('table.terminal_num')"
            prop="terminal"
            :rules="[
              {
                required: true,
                message: $t('table.terminal_num') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.terminal"
              :placeholder="$t('table.terminal_num')"
              style="width: 206px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.terminal_remark')"
            prop="terminal_remark"
            :rules="[
              {
                required: true,
                message: $t('table.terminal_remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.terminal_remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              :maxlength="50"
              show-word-limit
              placeholder="请输入黑名单描述,50字以内"
            />
          </el-form-item>
        </el-form>
        <el-card
          class="box-card"
          v-if="
            crudFindRole.only(otherPermission.getLoginList) &&
            crudStatus.edit == 1
          "
        >
          <template #header>
            <div class="card-header">
              <el-form :model="form" :inline="true">
                <el-form-item :label="$t('table.username')">
                  <el-input v-model.trim="form.username" />
                </el-form-item>
                <el-form-item style="min-width: 40px">
                  <el-button>
                    <el-icon><Search /></el-icon>
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <el-table :data="userData" style="width: 100%">
            <!-- <el-table-column
              type="index"
              :label="$t('table.sort')"
              min-width="100"
            /> -->
            <el-table-column
              prop="username"
              :label="$t('table.username')"
              min-width="100"
            />
            <el-table-column
              prop="login_time"
              :label="$t('table.login_time')"
              min-width="100"
            />
            <el-table-column :label="$t('table.login_lock')" min-width="100" />
          </el-table>
        </el-card>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/risk-control-config/login-device-black-list';
import { defineComponent, reactive, ref } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { Search } from '@element-plus/icons-vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '登录设备黑名单',
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  crudTableParams: 'data',
  defaultQuery: {
    start_time: null,
    end_time: null,
    create_name: null,
    terminal: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    terminal: null,
    terminal_remark: null
  },
  crudTag: 'risk:login:device:'
};

export default defineComponent({
  name: 'login-device-black-list',
  components: { crudOperation, udOperation, dateTimePickerQuery, Search },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    let form = reactive({
      ip: null,
      username: null
    });

    let userData = ref([]);

    function getUserList() {
      Api.getLoginList(form).then((result: any) => {
        if (result.code == 1) {
          userData.value = result.data.list;
        }
      });
    }

    crud.crudHook.beforeToEdit = (F: any) => {
      Object.assign(form, {
        username: null,
        terminal: F.terminal
      });

      if (crud.crudFindRole.only(otherPermission.getLoginList)) {
        getUserList();
      }
      return true;
    };

    const otherPermission = {
      // 是否可以需改需要权限验证
      getLoginList: 'risk:login:device:getLoginList',
      forbid: 'risk:login:device:forbid'
    };

    return { ...crud, otherPermission, form, userData };
  }
});
</script>

<style lang="scss" scoped></style>
