<template>
  <div class="main-container">
    <crudOperation title="router.vip-rebate-config">
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
            prop="ia_rebate"
            :label="$t('table.ia_rebate')"
            min-width="140"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.ia_rebate).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="sb_rebate"
            :label="$t('table.sb_rebate')"
            min-width="140"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.sb_rebate).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="pb_rebate"
            :label="$t('table.pb_rebate')"
            min-width="120"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.pb_rebate).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="xj_rebate"
            label="小金返水"
            min-width="120"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.xj_rebate).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="xj_rebate"
            label="AG返水"
            min-width="120"
            align="center"
          >
            <template #default="scope"
              >{{ parseFloat(scope.row.ag_rebate).toFixed(4) }} %</template
            >
          </el-table-column>
          <el-table-column
            prop="upper_limit"
            :label="$t('table.upper_limit')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.upper_limit).toFixed(4) }}
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
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item
            :label="$t('table.upper_limit')"
            prop="upper_limit"
            :rules="[
              {
                required: true,
                message: $t('table.upper_limit') + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.upper_limit"
              :precision="2"
              controls-position="right"
              :min="0"
              :placeholder="$t('table.upper_limit')"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>

          <el-descriptions
            :title="$t('table.upgrade_conditions')"
            direction="vertical"
            :column="6"
            border
            style="max-width: 960px"
          >
            <el-descriptions-item :label="$t('table.ia_rebate') + '(%)'">
              <el-form-item
                prop="ia_rebate"
                :rules="[
                  {
                    required: true,
                    message: $t('table.ia_rebate') + $t('table.not_empty')
                  }
                ]"
              >
                <el-input-number
                  v-model.number="proxyForm.ia_rebate"
                  :precision="2"
                  controls-position="right"
                  :min="0"
                  :placeholder="$t('table.ia_rebate')"
                  style="width: 200px"
                  clearable
                >
                </el-input-number>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('table.sb_rebate') + '(%)'">
              <el-form-item
                prop="sb_rebate"
                :rules="[
                  {
                    required: true,
                    message: $t('table.sb_rebate') + $t('table.not_empty')
                  }
                ]"
              >
                <el-input-number
                  v-model.number="proxyForm.sb_rebate"
                  :precision="2"
                  controls-position="right"
                  :min="0"
                  :placeholder="$t('table.sb_rebate')"
                  style="width: 200px"
                  clearable
                >
                </el-input-number>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('table.pb_rebate') + '(%)'">
              <el-form-item
                prop="pb_rebate"
                :rules="[
                  {
                    required: true,
                    message: $t('table.pb_rebate') + $t('table.not_empty')
                  }
                ]"
              >
                <el-input-number
                  v-model.number="proxyForm.pb_rebate"
                  :precision="2"
                  controls-position="right"
                  :min="0"
                  :placeholder="$t('table.pb_rebate')"
                  style="width: 200px"
                  clearable
                >
                </el-input-number>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="小金返水(%)">
              <el-form-item
                prop="xj_rebate"
                :rules="[
                  {
                    required: true,
                    message: '小金返水' + $t('table.not_empty')
                  }
                ]"
              >
                <el-input-number
                  v-model.number="proxyForm.xj_rebate"
                  :precision="2"
                  controls-position="right"
                  :min="0"
                  placeholder="小金返水"
                  style="width: 200px"
                  clearable
                >
                </el-input-number>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="AG返水(%)">
              <el-form-item
                prop="ag_rebate"
                :rules="[
                  {
                    required: true,
                    message: 'AG返水' + $t('table.not_empty')
                  }
                ]"
              >
                <el-input-number
                  v-model.number="proxyForm.ag_rebate"
                  :precision="2"
                  controls-position="right"
                  :min="0"
                  placeholder="AG返水"
                  style="width: 200px"
                  clearable
                >
                </el-input-number>
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/vip-config/vip-rebate-config';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'vip返水',
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
  crudTag: 'vip:config:rebate:'
};

export default defineComponent({
  name: 'vip-rebate-config',
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
