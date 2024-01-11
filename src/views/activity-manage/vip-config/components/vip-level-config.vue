<template>
  <div class="main-container">
    <crudOperation title="router.vip-level-config">
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
            prop="withdrawals"
            :label="$t('table.withdrawals')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="withdrawals_limit"
            :label="$t('table.withdrawals_limit')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.withdrawals_limit).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="upgrade"
            :label="$t('table.upgrade')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.upgrade).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="birthday"
            :label="$t('table.birthday')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.birthday).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="upgrade_conditions"
            :label="$t('table.upgrade_conditions')"
            min-width="180"
          >
            <template #default="scope">
              <div>
                {{ $t('table.total_recharge') }}：{{
                  parseFloat(scope.row.up_recharge).toFixed(4)
                }}
              </div>
              <div>
                {{ $t('table.total_water') }}：{{
                  parseFloat(scope.row.up_water).toFixed(4)
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="protect_conditions"
            :label="$t('table.protect_conditions')"
            min-width="180"
          >
            <template #default="scope">
              <div>
                {{ $t('table.total_recharge') }}：{{
                  parseFloat(scope.row.protect_recharge).toFixed(4)
                }}
              </div>
              <div>
                {{ $t('table.total_water') }}：{{
                  parseFloat(scope.row.protect_water).toFixed(4)
                }}
              </div>
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
              style="width: 200px"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.level_name')"
            prop="level_name"
            :rules="[
              {
                required: true,
                message: $t('table.level_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.level_name"
              :placeholder="$t('table.level_name')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.withdrawals')"
            prop="withdrawals"
            :rules="[
              {
                required: true,
                message: $t('table.withdrawals') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.withdrawals"
              :precision="0"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.withdrawals')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.withdrawals_limit')"
            prop="withdrawals_limit"
            :rules="[
              {
                required: true,
                message: $t('table.withdrawals_limit') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.withdrawals_limit"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.withdrawals_limit')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.upgrade')"
            prop="upgrade"
            :rules="[
              {
                required: true,
                message: $t('table.upgrade') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.upgrade"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.upgrade')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            :label="$t('table.birthday')"
            prop="birthday"
            :rules="[
              {
                required: true,
                message: $t('table.birthday') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.birthday"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.birthday')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <div class="box">
            <el-descriptions
              :title="$t('table.upgrade_conditions')"
              direction="vertical"
              :column="2"
              border
              style="max-width: 460px"
            >
              <el-descriptions-item :label="$t('table.total_recharge')">
                <el-form-item
                  prop="up_recharge"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.total_recharge') + $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.number="proxyForm.up_recharge"
                    type="number"
                    :placeholder="$t('table.total_recharge')"
                    style="width: 200px"
                    :disabled="proxyForm.level === 0"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('table.total_water')">
                <el-form-item
                  prop="up_water"
                  :rules="[
                    {
                      required: true,
                      message: $t('table.total_water') + $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.number="proxyForm.up_water"
                    type="number"
                    :placeholder="$t('table.total_water')"
                    style="width: 200px"
                    :disabled="proxyForm.level === 0"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions
              :title="$t('table.protect_conditions')"
              direction="vertical"
              :column="2"
              border
              style="max-width: 460px"
            >
              <el-descriptions-item :label="$t('table.total_recharge')">
                <el-form-item
                  prop="protect_recharge"
                  :rules="[
                    {
                      required: true,
                      message:
                        $t('table.total_recharge') + $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.number="proxyForm.protect_recharge"
                    type="number"
                    :placeholder="$t('table.total_recharge')"
                    style="width: 200px"
                    :disabled="proxyForm.level === 0"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-descriptions-item>
              <el-descriptions-item :label="$t('table.total_water')">
                <el-form-item
                  prop="protect_water"
                  :rules="[
                    {
                      required: true,
                      message: $t('table.total_water') + $t('table.not_empty')
                    }
                  ]"
                >
                  <el-input
                    v-model.number="proxyForm.protect_water"
                    type="number"
                    :placeholder="$t('table.total_water')"
                    style="width: 200px"
                    :disabled="proxyForm.level === 0"
                    clearable
                  ></el-input>
                </el-form-item>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/vip-config/vip-level-config';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'vip等级',
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
  crudTag: 'vip:config:level:'
};

export default defineComponent({
  name: 'vip-level-config',
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
