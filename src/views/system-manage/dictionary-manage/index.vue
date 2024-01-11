<template>
  <div class="main-container">
    <crudOperation title="router.dictionary-manage">
      <template #query>
        <el-form-item :label="$t('table.config_type')" prop="config_type">
          <el-input
            v-model.trim="crudQuery.config_type"
            :placeholder="$t('table.config_type')"
            style="width: 200px"
            clearable
          ></el-input>
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
            prop="config_type"
            :label="$t('table.config_type')"
            min-width="160"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="primary_key"
            :label="$t('table.primary_key')"
            min-width="160"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <el-popover placement="top" :width="360" trigger="click">
                <div>
                  {{ scope.row.data }}
                </div>
                <template #reference>
                  <el-button type="primary">{{
                    $t('table.see_details')
                  }}</el-button>
                </template>
              </el-popover>
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
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_role_id] })"
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
            :label="$t('table.config_type')"
            prop="config_type"
            :rules="[
              {
                required: true,
                message: $t('table.config_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.config_type"
              :placeholder="$t('table.config_type')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.primary_key')"
            prop="primary_key"
            :rules="[
              {
                required: true,
                message: $t('table.primary_key') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.primary_key"
              :placeholder="$t('table.primary_key')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item :label="$t('table.dict_type')" prop="dict_type">
            <el-select
              v-model="proxyForm.dict_type"
              popper-class="user-select"
              :disabled="!!crudStatus.edit"
              style="width: 200px"
            >
              <el-option label="Map" :value="1" />
              <el-option label="Array" :value="2" />
            </el-select>
          </el-form-item>

          <template v-if="proxyForm.dict_type == 1">
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span>Add Map</span>
                  <el-button type="primary" @click="addKey">
                    <el-icon><plus /></el-icon
                  ></el-button>
                </div>
              </template>
              <el-table :data="proxyForm.data" style="width: 100%">
                <el-table-column prop="tKey" label="Key" min-width="140px" />
                <el-table-column prop="TValue" label="Value" min-width="200px">
                  <template #default="scope">
                    <el-input v-model.trim="scope.row.tValue" type="text">
                      <template #prepend>
                        <el-select
                          v-model="scope.row.tType"
                          style="width: 100px"
                          @change="scope.row.tValue = null"
                        >
                          <el-option label="Number" value="number" />
                          <el-option label="String" value="string" />
                        </el-select>
                      </template>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="address" :label="$t('table.operate')">
                  <template #default="scope">
                    <el-button type="danger" @click="deleteKey(scope.$index)">{{
                      $t('crud.delete')
                    }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
          <template v-if="proxyForm.dict_type == 2">
            <el-card shadow="never">
              <template #header>
                <div class="card-header">
                  <span>Add Array</span>
                  <el-button
                    type="primary"
                    @click="addArrayKey"
                    v-show="proxyForm.data.length == 0"
                  >
                    <el-icon><plus /></el-icon
                  ></el-button>
                </div>
              </template>
              <template v-if="proxyForm.data.length > 0">
                <el-table :data="proxyForm.data" style="width: 100%">
                  <template v-if="Object.keys(proxyForm.data[0]).length > 0">
                    <el-table-column
                      v-for="item of Object.keys(proxyForm.data[0])"
                      :key="item"
                      :prop="item"
                      :label="item"
                      min-width="140px"
                    />
                  </template>
                  <el-table-column
                    prop="address"
                    :label="$t('table.operate')"
                    min-width="200px"
                  >
                    <template #default="scope">
                      <el-button
                        type="danger"
                        @click="deleteItem(scope.$index)"
                        >{{ $t('crud.delete') }}</el-button
                      ><el-button type="danger" @click="copyItem(scope.row)">{{
                        $t('table.copy')
                      }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-card>
          </template>
        </el-form>
      </template>
    </crudOperation>
    <el-dialog
      v-model="itemVisible"
      title="新增数据"
      width="40%"
      :before-close="beforeCloseItem"
    >
      <el-table :data="itemForm" style="width: 100%">
        <el-table-column prop="tKey" label="Key" min-width="140px" />
        <el-table-column prop="TValue" label="Value" min-width="200px">
          <template #default="scope">
            <el-input v-model.trim="scope.row.tValue" :type="scope.type">
              <template #prepend>
                <el-select
                  v-model="scope.row.tType"
                  style="width: 100px"
                  @change="scope.row.tValue = null"
                >
                  <el-option label="Number" value="number" />
                  <el-option label="String" value="string" />
                </el-select>
              </template>
            </el-input>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeCloseItem">Cancel</el-button>
          <el-button type="primary" @click="setItem">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/system-manage/dictionary-manage';
import { defineComponent, Ref, ref } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus';
import { i18n } from '@/i18n';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.dictionary'),
  crudOptShow: {
    add: true,
    del: false,
    formSize: '60%'
  },
  defaultQuery: {
    role_name: '',
    is_disable: -1
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    dict_type: 1,
    data: [],
    primary_key: '',
    config_type: ''
  },
  crudTag: 'system:dict:'
};

export default defineComponent({
  name: 'role-config',
  components: { crudOperation, udOperation, PromiseSwitch, Plus },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const addKey = () => {
      ElMessageBox.prompt('输入需要新增的key', '新增字段', {
        confirmButtonText: '增加',
        cancelButtonText: '取消',
        inputPattern: /^([a-zA-Z])[0-9A-Za-z_]{2,32}$/,
        inputErrorMessage: '无效字段',
        showInput: true
      }).then(({ value }: any) => {
        if (crud.proxyForm.dict_type == 1) {
          (crud.proxyForm.data as any).push({
            tKey: value,
            tValue: null,
            tType: 'string'
          });
        }
        console.log(crud.proxyForm.data);
      });
    };

    const itemForm: Ref<any[]> = ref([]);

    const addArrayKey = () => {
      ElMessageBox.prompt('单条数据的key,多个用‘,’隔开', '新增数据', {
        confirmButtonText: '增加',
        cancelButtonText: '取消',
        showInput: true
      }).then(({ value }: any) => {
        if (crud.proxyForm.dict_type == 2) {
          const keyArr = value.split(',');
          keyArr.forEach((item: string) => {
            itemForm.value.push({
              tKey: item,
              tValue: null,
              tType: 'string'
            });
          });
        }
        itemVisible.value = true;
      });
    };

    function deleteKey(idx: number) {
      console.log(idx);
      crud.proxyForm.data.splice(idx, 1);
    }

    function deleteItem(idx: number) {
      console.log(idx);
      crud.proxyForm.data.splice(idx, 1);
    }

    function copyItem(row: any) {
      console.log(row);
      Object.keys(row).forEach((item: string) => {
        itemForm.value.push({
          tKey: item,
          tValue: null,
          tType: 'string'
        });
      });
      itemVisible.value = true;
    }

    crud.crudHook.beforeToEdit = (form: any) => {
      if (form.dict_type == 1) {
        let data: any[] = [];
        for (const keyL of Object.keys(form.data)) {
          data.push({
            tKey: keyL,
            tValue: form.data[keyL],
            tType: typeof form.data[keyL]
          });
        }
        form.data = data;
      }
      return true;
    };

    crud.crudHook.beforeValidateCU = (form: any) => {
      if (form.dict_type == 1) {
        let data: any = {};
        for (const item of form.data) {
          data[item.tKey] =
            item.tType == 'number' ? Number(item.tValue) : item.tValue;
        }
        form.data = JSON.stringify(data);
        console.log(form);
      } else {
        form.data = JSON.stringify(form.data);
        console.log(form);
      }

      return true;
    };

    const itemVisible = ref(false);
    function beforeCloseItem() {
      itemVisible.value = false;
      itemForm.value = [];
    }
    function setItem() {
      let data: any = {};
      for (const item of itemForm.value) {
        data[item.tKey] =
          item.tType == 'number' ? Number(item.tValue) : item.tValue;
      }
      crud.proxyForm.data.push(data);
      beforeCloseItem();
    }

    crud.crudHook.beforeToCU = () => {
      // crud.proxyForm.data = [];
      itemForm.value = [];
      return true;
    };

    return {
      ...crud,
      addKey,
      deleteKey,
      deleteItem,
      copyItem,
      addArrayKey,
      itemForm,
      beforeCloseItem,
      itemVisible,
      setItem
    };
  }
});
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
