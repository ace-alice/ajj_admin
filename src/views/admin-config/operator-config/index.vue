<template>
  <div class="main-container">
    <crudOperation title="router.operator-config">
      <template #query>
        <el-form-item :label="$t('table.username')" prop="username">
          <el-input
            v-model.trim="crudQuery.username"
            :placeholder="$t('table.username')"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.nickname')" prop="nickname">
          <el-input
            v-model.trim="crudQuery.nickname"
            :placeholder="$t('table.nickname')"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input
            v-model.trim="crudQuery.phone"
            :placeholder="$t('table.phone')"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.email')" prop="email">
          <el-input
            v-model.trim="crudQuery.email"
            :placeholder="$t('table.email')"
            style="width: 200px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <el-select
            v-model="crudQuery.is_disable"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isDisableOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="username"
            :label="$t('table.operator_name')"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="phone"
            :label="$t('table.phone')"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="email"
            :label="$t('table.email')"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="is_disable"
            :label="$t('table.is_disable')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.username"
                :initValue="scope.row.is_disable"
                :options="isDisableOptions"
                :defaultParam="{
                  ids: [scope.row.admin_user_id],
                  is_disable: scope.row.is_disable
                }"
                paramKey="is_disable"
                :changeFun="changeStatus"
                emitFunName="isDisable"
                :permission="otherPermission.is_disable"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_super"
            :label="$t('table.is_super')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="Math.random()"
                :initValue="scope.row.is_super"
                :options="isNot"
                :defaultParam="{
                  ids: [scope.row.admin_user_id],
                  is_disable: scope.row.is_super
                }"
                paramKey="is_super"
                :changeFun="changeStatus"
                emitFunName="isSuperAdmin"
                :permission="otherPermission.is_super"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_user_id] })"
                :permission="crudPermission"
              >
                <template #right>
                  <el-button
                    v-only="otherPermission.password"
                    type="text"
                    style="color: #e6a23c"
                    @click="editPassword(scope.row)"
                  >
                    <el-icon><help-filled /></el-icon>
                    {{ $t('table.init_password') }}
                  </el-button>
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
            :label="$t('table.operator_name')"
            prop="username"
            :rules="[
              {
                required: true,
                message: $t('table.operator_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.username"
              :placeholder="$t('table.operator_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.nickname')"
            prop="nickname"
            :rules="[
              {
                required: true,
                message: $t('table.nickname') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.nickname"
              :placeholder="$t('table.nickname')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.admin_role')"
            prop="admin_role_ids"
            :rules="[
              {
                required: true,
                message: $t('table.admin_role') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.admin_role_ids"
              :placeholder="$t('table.admin_role')"
              style="width: 200px"
              multiple
            >
              <el-option
                v-for="role in roleList"
                :key="role.admin_role_id"
                :label="role.role_name"
                :value="role.admin_role_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              :step="1"
              :min="0"
              step-strictly
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item
            v-if="crudStatus.add == 1"
            :label="$t('table.password')"
            prop="password"
            :rules="[
              {
                validator: passwordRule,
                message:
                  '以字母开头，长度在6~16之间，只能包含字母、数字和下划线',
                trigger: 'blur'
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.password"
              type="password"
              show-password
              :placeholder="$t('table.password')"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/admin-config/operator-config';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import RoleListHook from './hook/RoleListHook';
import { verifyPassword } from '@/utils/toolsValidate';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '操作员',
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  defaultQuery: {
    is_disable: -1,
    username: '',
    nickname: '',
    phone: null,
    email: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    admin_user_id: null,
    admin_role_ids: [],
    username: '',
    nickname: '',
    password: '',
    phone: '',
    email: '',
    avatar_id: '',
    remark: '',
    sort: 1,
    is_disable: 0,
    is_super: 0,
    is_delete: 0,
    login_num: 0,
    login_time: null
  },
  crudTag: 'operator:config:'
};

export default defineComponent({
  name: 'operator-config',
  components: { crudOperation, udOperation, PromiseSwitch },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { roleList, setRoleName } = RoleListHook();

    const i18n = useI18n();

    const otherPermission = {
      is_super: 'operator:config:isSuper',
      is_disable: 'operator:config:disable',
      password: 'operator:config:password'
    };

    const { isDisableOptions, isNot, getLabel } = dictionary();

    const passwordRule = (rule: any, value: any, callback: any) => {
      const tag = crud.crudStatus.add;

      if (!value && !tag) return callback();
      if (!verifyPassword(value)) {
        callback(
          new Error(
            '密码必须以字母开头，长度在6~16之间，只能包含字母、数字和下划线'
          )
        );
      } else {
        return callback();
      }
    };

    function editPassword(row: any) {
      ElMessageBox.prompt(
        'Please input password',
        i18n.t('table.init_password'),
        {
          confirmButtonText: i18n.t('crud.submit'),
          cancelButtonText: i18n.t('user.logOutCancel'),
          inputType: 'password',
          inputPattern: /^[a-zA-Z]\w{5,15}$/,
          inputErrorMessage: 'Invalid Password'
        }
      )
        .then(({ value }: any) => {
          Api.initPwd({
            ids: [row.admin_user_id],
            password: value
          }).then((res: any) => {
            if (res.code == 1) {
              crud.submitSuccessNotify();
            }
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Input canceled'
          });
        });
    }

    crud.crudHook.beforeToEdit = (form: any) => {
      form.admin_role_ids = form.admin_role_ids.map(Number);
      console.log(form.admin_role_ids);
      return true;
    };

    return {
      ...crud,
      setRoleName,
      roleList,
      passwordRule,
      otherPermission,
      isDisableOptions,
      getLabel,
      editPassword,
      isNot
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-tag) {
  margin-left: 5px;
}
</style>
