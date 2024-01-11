<template>
  <div class="main-container">
    <crudOperation title="router.menu-add" labelWidth="120px">
      <template #query>
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
        <el-form-item :label="$t('table.page_url')">
          <el-input
            v-model.trim="crudQuery.page_url"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.is_unauth')">
          <el-select
            v-model="crudQuery.is_unauth"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')">
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
        <el-form-item :label="$t('table.is_unlogin')">
          <el-select
            v-model="crudQuery.is_unlogin"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.button_id')">
          <el-select
            v-model="crudQuery.is_btn"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_cache')">
          <el-select
            v-model="crudQuery.is_cache"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNeedOptions"
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
          max-height="600px"
          row-key="admin_menu_id"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="menu_sort"
            :label="$t('table.sort')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="menu_name"
            :label="$t('table.menu_name')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.is_btn">{{ scope.row.menu_name }}</span>
              <span v-else>{{ $t('router.' + scope.row.menu_name) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="button_id"
            :label="$t('table.button_id')"
            min-width="80"
            align="center"
          >
            <template #default="scope">
              <el-tag type="warning" effect="dark">{{
                scope.row.is_btn ? $t('table.auth') : $t('table.menu')
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="menu_url"
            :label="$t('table.menu_url')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="page_url"
            :label="$t('table.page_url') + '(' + $t('table.is_btn') + ')'"
            min-width="300"
            align="center"
          />
          <el-table-column
            prop="is_unauth"
            :label="$t('table.is_unauth')"
            min-width="130"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.menu_name"
                :initValue="scope.row.is_unauth"
                :options="isNeedOptions"
                :defaultParam="{
                  ids: [scope.row.admin_menu_id],
                  is_disable: scope.row.is_unauth
                }"
                paramKey="is_unauth"
                :changeFun="changeStatus"
                emitFunName="isUnAuth"
                :permission="otherPermission.is_unauth"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_unlogin"
            :label="$t('table.is_unlogin')"
            min-width="130"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.button_id"
                :initValue="scope.row.is_unlogin"
                :options="isNeedOptions"
                :defaultParam="{
                  ids: [scope.row.admin_menu_id],
                  is_disable: scope.row.is_unlogin
                }"
                paramKey="is_unauth"
                :changeFun="changeStatus"
                emitFunName="isUnAuth"
                :permission="otherPermission.is_unlogin"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_cache"
            :label="$t('table.is_cache')"
            min-width="130"
            align="center"
          >
            <template #default="scope">
              <el-tag type="warning" effect="plain">{{
                getLabel(scope.row.is_cache, isNeedOptions)
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="is_disable"
            :label="$t('table.is_disable')"
            min-width="130"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="Math.random()"
                :initValue="scope.row.is_disable"
                :options="isNeedOptions"
                :defaultParam="{
                  ids: [scope.row.admin_menu_id],
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
            :label="$t('table.operate')"
            min-width="180"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_menu_id] })"
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
          <el-form-item :label="$t('table.button_id')" prop="is_btn">
            <el-switch
              v-model="proxyForm.is_btn"
              style="width: 200px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.menu_pid')" prop="menu_pid">
            <el-cascader
              v-model="proxyForm.menu_pid"
              style="width: 200px"
              clearable
              :props="{
                checkStrictly: true,
                value: 'admin_menu_id',
                label: 'menu_name',
                emitPath: false
              }"
              :options="crudData"
            >
              <template #default="{ node, data }">
                <span>{{
                  data.is_btn ? data.menu_name : $t('router.' + data.menu_name)
                }}</span>
                <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
              </template>
            </el-cascader>
          </el-form-item>
          <el-form-item
            :label="$t('table.menu_name')"
            prop="menu_name"
            :rules="[
              {
                required: true,
                message: $t('table.menu_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.menu_name"
              :placeholder="$t('table.menu_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.menu_url')" prop="menu_url">
            <!-- :rules="[
              {
                required: true,
                message: $t('table.menu_url') + $t('table.not_empty')
              }
            ]" -->
            <el-input
              v-model.trim="proxyForm.menu_url"
              :placeholder="$t('table.menu_url')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="
              proxyForm.is_btn ? $t('table.is_btn') : $t('table.page_url')
            "
            prop="page_url"
            :rules="[
              {
                required: true,
                message: $t('table.page_url') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.page_url"
              :placeholder="
                proxyForm.is_btn ? $t('table.is_btn') : $t('table.page_url')
              "
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.is_cache')" prop="is_cache">
            <el-switch
              v-model="proxyForm.is_cache"
              style="width: 200px"
              inline-prompt
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="Y"
              inactive-text="N"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>

          <el-form-item :label="$t('table.sort')" prop="menu_sort">
            <el-input-number
              v-model="proxyForm.menu_sort"
              style="width: 200px"
              :step="1"
              :min="0"
              step-strictly
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import { defineComponent, onActivated, toRefs } from 'vue';
import Api from '@/api/admin-config/menu-config';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dictionary } from '@/hook/lib';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '菜单',
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  defaultQuery: {
    is_unauth: -1,
    menu_name: '',
    menu_url: '',
    page_url: '',
    is_disable: -1,
    is_unlogin: -1,
    is_btn: -1,
    is_cache: -1
  },
  isPageQuery: false,
  crudMethod: { ...Api },
  defaultForm: {
    admin_menu_id: null,
    menu_pid: null,
    menu_name: null,
    menu_url: null,
    page_url: null,
    menu_sort: 1,
    is_btn: 0,
    is_unauth: 0,
    is_unlogin: 0,
    is_disable: 0
    // add_add: true,
    // add_edit: true,
    // add_dele: true
  },
  crudTag: 'menu:config:'
};
export default defineComponent({
  name: 'menu-config',
  components: {
    crudOperation,
    udOperation,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { isNeedOptions, getLabel, isDisableOptions } = dictionary();

    const otherPermission = {
      //是否可以需改需要权限验证
      is_unauth: 'menu:config:unauth',
      is_unlogin: 'menu:config:unlogin',
      is_disable: 'menu:config:disable'
    };

    onActivated(() => {
      console.log('onActivated');
    });

    return {
      ...crud,
      isNeedOptions,
      otherPermission,
      getLabel,
      isDisableOptions
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-tag) {
  margin-left: 5px;
}
</style>
