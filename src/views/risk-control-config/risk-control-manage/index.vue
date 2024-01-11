<template>
  <div class="main-container">
    <crudOperation title="router.risk-control-manage">
      <template #query>
        <el-form-item :label="$t('table.risk_type')">
          <el-select
            v-model="crudQuery.risk_type"
            popper-class="user-select"
            style="width: 200px"
            @change="toQuery"
          >
            <el-option
              v-for="item in riskTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
          max-height="600px"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="risk_type"
            :label="$t('table.risk_type')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.risk_type, risk_type_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="risk_level"
            :label="$t('table.risk_level')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="risk_remark"
            :label="$t('table.risk_remark')"
            min-width="180"
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
            :label="$t('table.risk_type')"
            prop="risk_type"
            :rules="[
              {
                required: true,
                message: $t('table.risk_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.risk_type"
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in riskTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.risk_level')"
            prop="risk_level"
            :rules="[
              {
                required: true,
                message: $t('table.risk_level') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.risk_level"
              :placeholder="$t('table.risk_level')"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.risk_remark')"
            prop="risk_remark"
            :rules="[
              {
                required: true,
                message: $t('table.risk_remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.risk_remark"
              :autosize="{ minRows: 2, maxRows: 4 }"
              style="width: 200px"
              type="textarea"
              :maxlength="50"
              show-word-limit
              placeholder="请输入风控层级描述,50字以内"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/risk-control-config/risk-control-manage';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '风控类型',
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  defaultQuery: {
    risk_type: 1,
    create_name: null,
    update_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    risk_type: 1,
    risk_level: null,
    admin_id_create: null,
    admin_id_action: null,
    create_time: null,
    update_time: null,
    risk_remark: null,
    create_name: null,
    update_name: null
  },
  crudTag: 'risk:control:'
};

export default defineComponent({
  name: 'risk-control-manage',
  components: { crudOperation, udOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { riskTypeOptions } = dictionary();

    const { getLabel } = dictionary();
    let dict = reactive({
      risk_type_options: []
    });
    onMounted(async () => {
      [dict.risk_type_options] = await Promise.all([
        getDicts('risk_type_options')
      ]);
    });

    return { ...crud, riskTypeOptions, getLabel, ...toRefs(dict) };
  }
});
</script>
