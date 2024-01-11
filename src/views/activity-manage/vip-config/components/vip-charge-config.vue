<template>
  <div class="main-container">
    <crudOperation title="router.vip-charge-config">
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            :label="$t('table.operate')"
            min-width="100"
            align="center"
            fixed="left"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                :permission="crudPermission"
              >
              </udOperation>
            </template>
          </el-table-column>
          <el-table-column
            prop="level"
            :label="$t('table.vip_level')"
            min-width="120"
            align="center"
          >
            <template #default="scope"> VIP {{ scope.row.level }} </template>
          </el-table-column>
          <el-table-column
            prop="level_name"
            :label="$t('table.level_name')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="min_recharge"
            :label="$t('table.min_recharge')"
            min-width="140"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.min_recharge).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="bonus_cap"
            :label="$t('table.bonus_cap')"
            min-width="140"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.bonus_cap).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="inverse_ratio"
            :label="$t('table.Inverse_ratio')"
            min-width="120"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.inverse_ratio).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="multiple"
            :label="$t('table.multiple')"
            min-width="120"
            align="center"
          />
        </el-table>
      </template>
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="140px"
        >
          <el-form-item
            :label="$t('table.vip_level')"
            prop="level"
            :rules="[
              {
                required: true,
                message: $t('table.vip_level') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.number="proxyForm.level"
              type="number"
              :placeholder="$t('table.vip_level')"
              disabled
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('table.min_recharge')"
            prop="min_recharge"
            :rules="[
              {
                required: true,
                message: $t('table.min_recharge') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.min_recharge"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.min_recharge')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.bonus_cap')"
            prop="bonus_cap"
            :rules="[
              {
                required: true,
                message: $t('table.bonus_cap') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.bonus_cap"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.bonus_cap')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.Inverse_ratio') + '(%)'"
            prop="inverse_ratio"
            :rules="[
              {
                required: true,
                message: $t('table.Inverse_ratio') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.inverse_ratio"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.Inverse_ratio')"
              style="width: 200px"
              clearable
            >
            </el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.multiple')"
            prop="multiple"
            :rules="[
              {
                required: true,
                message: $t('table.multiple') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.multiple"
              :precision="0"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.multiple')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/vip-config/vip-charge-config';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'vip首充',
  crudOptShow: {
    operate: false,
    del: false,
    edit: true,
    query: false
  },
  defaultQuery: {},
  isPageQuery: false,
  crudTableParams: '',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'vip:config:charge:'
};

export default defineComponent({
  name: 'vip-charge-config',
  components: { crudOperation, udOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud };
  }
});
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}
:deep(.el-descriptions) {
  margin: 10px;
}
</style>
