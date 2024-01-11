<template>
  <div class="main-container">
    <crudOperation title="router.proxy-template">
      <template #query>
        <el-form-item :label="$t('table.create_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.update_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="update_time_start"
            endKey="update_time_end"
            :propTime="[crudQuery.update_time_start, crudQuery.update_time_end]"
          />
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
          max-height="750px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="name"
            :label="$t('table.template_name')"
            min-width="150"
            align="center"
          />
          <el-table-column
            prop="describe"
            :label="$t('table.template_describe')"
            min-width="260"
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
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ template_id: scope.row.id })"
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
            :label="$t('table.template_name')"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t('table.template_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.name"
              :placeholder="$t('table.template_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.template_describe')"
            prop="describe"
            :rules="[
              {
                required: true,
                message: $t('table.template_describe') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.describe"
              :placeholder="$t('table.template_describe')"
              style="width: 200px"
              type="textarea"
            ></el-input>
          </el-form-item>
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span>模板</span>
                <el-button type="primary" @click="addKey">
                  <el-icon><plus /></el-icon
                ></el-button>
              </div>
            </template>
            <el-table :data="proxyForm.config_arr" style="width: 100%" border>
              <el-table-column
                type="index"
                :label="$t('table.sort')"
                width="100"
                align="center"
              />
              <el-table-column
                prop="TValue"
                :label="$t('table.profitLossTotal')"
                min-width="160"
                align="center"
              >
                <template #default="scope">
                  ≥
                  <el-input
                    v-model.trim="scope.row.profitLossTotal"
                    style="width: 100px"
                    type="text"
                  />
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="TValue"
                :label="$t('table.gameFlow')"
                min-width="160"
                align="center"
              >
                <template #default="scope">
                  ≥
                  <el-input
                    v-model.trim="scope.row.gameFlow"
                    style="width: 100px"
                    type="text"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="TValue"
                :label="$t('table.monthActive')"
                min-width="160"
                align="center"
              >
                <template #default="scope">
                  ≥
                  <el-input
                    v-model.trim="scope.row.monthActive"
                    style="width: 100px"
                    type="text"
                  />
                </template>
              </el-table-column> -->
              <el-table-column
                prop="TValue"
                :label="$t('table.monthEActive')"
                min-width="160"
                align="center"
              >
                <template #default="scope">
                  ≥
                  <el-input
                    v-model.trim="scope.row.monthEActive"
                    style="width: 100px"
                    type="text"
                  />
                </template>
              </el-table-column>
              <el-table-column
                prop="TValue"
                :label="$t('table.rebateRatio')"
                min-width="160"
                align="center"
              >
                <template #default="scope">
                  <el-input
                    v-model.trim="scope.row.rebateRatio"
                    style="width: 100px"
                    type="text"
                  />
                  %
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('table.operate')"
                min-width="120"
                align="center"
              >
                <template #default="scope">
                  <el-button type="danger" @click="deleteKey(scope.$index)">{{
                    $t('crud.delete')
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/user-manage/proxy-template';
import { defineComponent } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { useI18n } from 'vue-i18n';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { ElMessage } from 'element-plus/lib/components';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '返佣比例模板',
  crudOptShow: {
    add: true,
    formSize: '80%'
  },
  defaultQuery: {
    create_name: null,
    update_name: null,
    update_time_start: null,
    update_time_end: null,
    create_time_start: null,
    create_time_end: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    template_id: null,
    name: null,
    describe: null,
    config_json: '[]',
    config_arr: []
  },
  crudTag: 'proxy:template:'
};

export default defineComponent({
  name: 'proxy-template',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const i18n = useI18n();

    const otherPermission = {};

    crud.crudHook.beforeToAdd = (form: any) => {
      form.config_arr = [];
      return true;
    };

    crud.crudHook.beforeToEdit = (form: any) => {
      try {
        form.config_arr = JSON.parse(form.config_json);
        form.template_id = form.id;
        console.log(form);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    crud.crudHook.beforeValidateCU = (form: any) => {
      try {
        if (form.config_arr.length < 1) return false;
        let validFlag = true;
        let validText = '';
        if (form.config_arr.length > 1) {
          for (let i = 0; i < form.config_arr.length - 1; i++) {
            if (
              form.config_arr[i].profitLossTotal >
              form.config_arr[i + 1].profitLossTotal
            ) {
              validFlag = false;
              validText = '盈亏比例后面不能小于前面';
              break;
            }
            if (
              form.config_arr[i].monthEActive >
              form.config_arr[i + 1].monthEActive
            ) {
              validFlag = false;
              validText = '本月有效活跃人数后面不能小于前面';
              break;
            }
          }
        }
        if (!validFlag) {
          ElMessage.error(validText);
          return false;
        }
        form.config_json = JSON.stringify(form.config_arr);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    function addKey() {
      crud.proxyForm.config_arr.push({
        profitLossTotal: 0,
        // gameFlow: 0,
        // monthActive: 0,
        monthEActive: 0,
        rebateRatio: 0
      });
    }

    function deleteKey(index: number) {
      crud.proxyForm.config_arr.splice(index, 1);
    }

    return {
      ...crud,
      otherPermission,
      addKey,
      deleteKey
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
