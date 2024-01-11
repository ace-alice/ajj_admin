<template>
  <div class="main-container">
    <crudOperation title="router.role-config">
      <template #query>
        <el-form-item :label="$t('table.role_name')" prop="role_name">
          <el-input
            v-model.trim="crudQuery.role_name"
            :placeholder="$t('table.role_name')"
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
          row-key="admin_role_id"
          max-height="600px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="role_name"
            :label="$t('table.role_name')"
            min-width="120"
            align="center"
          >
          </el-table-column>
          <!-- <el-table-column
            prop="role_desc"
            :label="$t('table.role_desc')"
            min-width="300"
            align="center"
          /> -->
          <el-table-column
            prop="is_disable"
            :label="$t('table.is_disable')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="Math.random()"
                :initValue="scope.row.is_disable"
                :options="isDisableOptions"
                :defaultParam="{
                  ids: [scope.row.admin_role_id],
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
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
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
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_role_id] })"
                :permission="crudPermission"
              >
                <template #right>
                  <el-button
                    v-only="otherPermission.changeMenu"
                    type="text"
                    style="color: #e6a23c"
                    :loading="menuRoleInfo.toLoading"
                    @click="toOpenMenuRoleDrawer(scope.row)"
                  >
                    <el-icon><folder-opened /></el-icon>
                    {{ $t('table.menu_assign') }}
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
            :label="$t('table.role_name')"
            prop="role_name"
            :rules="[
              {
                required: true,
                message: $t('table.role_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.role_name"
              :placeholder="$t('table.role_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.role_desc')" prop="role_desc">
            <el-input
              v-model.trim="proxyForm.role_desc"
              :placeholder="$t('table.role_desc')"
              :rows="2"
              type="textarea"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="role_sort">
            <el-input-number
              v-model.trim="proxyForm.role_sort"
              :step="1"
              :min="0"
              step-strictly
              style="width: 200px"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
    <el-drawer
      :title="menuRoleInfo.currentTitle + $t('table.menu_assign')"
      v-model="menuRoleInfo.show"
      :size="375"
      direction="rtl"
      :before-close="menuRoleDrawerClose"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-button
              type="primary"
              @click="saveMenu"
              :loading="menuRoleInfo.saveLoading"
            >
              <el-icon><check /></el-icon> {{ $t('crud.save') }}
            </el-button>
          </div>
        </template>
        <el-tree
          ref="menu"
          v-loading="menuRoleInfo.treeLoading"
          :data="menuRoleInfo.menuTree"
          :props="defaultProps"
          show-checkbox
          accordion
          :expand-on-click-node="false"
          :auto-expand-parent="false"
          check-on-click-node
          node-key="admin_menu_id"
          :filter-node-method="filterNode"
        >
          <!-- :default-expanded-keys="expandedKeys" -->
          <!-- :check-strictly="isCascade" -->
          <!-- @check-change="checkChange" -->
          <template #default="{ node, data }">
            <div class="custom-tree-node">
              <svg-icon
                v-show="data.is_btn === 0"
                class="tree-node-icon"
                name="directory"
              />
              <svg-icon
                v-show="data.is_btn === 1"
                class="tree-node-icon"
                name="button"
              />
              <span class="tree-node-label">{{
                !data.is_btn ? $t(`router.${node.label}`) : node.label
              }}</span>
            </div>
          </template>
        </el-tree>
      </el-card>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import Api from '@/api/admin-config/role-config';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
// import { getMenus } from './Hook/getMenus';
import { menuRoleDrawerHandle } from '@/views/admin-config/role-config/Hook/menuRoleDrawerHandle';
import { dictionary } from '@/hook/lib';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '角色',
  crudOptShow: {
    add: true,
    dragAble: false,
    formSize: '60%'
  },
  defaultQuery: {
    role_name: '',
    is_disable: -1
  },
  crudMethod: { ...Api },
  defaultForm: {
    admin_menu_ids: null,
    admin_role_id: null,
    create_time: null,
    is_disable: 0,
    role_desc: null,
    role_name: '',
    role_sort: 1,
    update_time: null
  },
  crudTag: 'role:config:'
};

export default defineComponent({
  name: 'role-config',
  components: { crudOperation, udOperation, PromiseSwitch },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      changeMenu: 'role:config:change:menu',
      is_disable: 'role:config:disable',
      saveMenu: 'role:config:saveMenu'
    };

    const { getLabel, isDisableOptions } = dictionary();

    let changIndexForm: { id: any[]; sort: any[] } = {
      id: [],
      sort: []
    };

    crud.crudHook.dragEnd = (formData: {
      newIndex: number;
      oldIndex: number;
    }) => {
      changIndexForm = {
        id: [],
        sort: []
      };
      if (formData.newIndex > formData.oldIndex) {
        let tempId: any = null;
        crud.crudData.value.forEach((data: any, index: number) => {
          if (index == formData.oldIndex) {
            tempId = data.id;
          }
          if (index >= formData.oldIndex && index <= formData.newIndex) {
            if (index != formData.oldIndex) {
              changIndexForm.id.push(data.id);
            }
            changIndexForm.sort.push(data.role_name);
          }
        });
        changIndexForm.id.push(tempId);
      }
      if (formData.oldIndex > formData.newIndex) {
        crud.crudData.value.forEach((data: any, index: number) => {
          if (index >= formData.newIndex && index <= formData.oldIndex) {
            if (index == formData.oldIndex) {
              changIndexForm.id.unshift(data.id);
            }
            changIndexForm.sort.push(data.role_name);
          }
        });
      }
      console.log(changIndexForm);
    };

    crud.crudHook.beforeToEdit = async (form: any) => {
      const roleInfo = (await Api.getRoleInfo({
        admin_role_id: form.admin_role_id
      })) as any;

      if (roleInfo.code == 1) {
        Object.assign(form, roleInfo.data);
      }

      return true;
    };

    // const { menus } = getMenus();

    const defaultProps = reactive({ children: 'children', label: 'menu_name' });

    // 分配权限
    const {
      saveMenu,
      filterNode,
      menuRoleInfo,
      menuRoleDrawerClose,
      toOpenMenuRoleDrawer
    } = menuRoleDrawerHandle(proxy);

    return {
      ...crud,
      menuRoleInfo,
      toOpenMenuRoleDrawer,
      defaultProps,
      saveMenu,
      filterNode,
      menuRoleDrawerClose,
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
