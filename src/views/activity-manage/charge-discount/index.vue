<template>
  <div class="main-container">
    <crudOperation title="router.activity-charge-discount" labelWidth="120px">
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
            prop="channel_name"
            label="充值线路名称"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="cash_type_name"
            label="充值类型"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="ratio"
            label="优惠比例"
            min-width="160"
            align="center"
          />
          <!-- <el-table-column
            prop="day_max_amount"
            label="每日最高优惠"
            min-width="160"
            align="center"
          /> -->
          <el-table-column
            prop="channel_status"
            label="状态"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.channel_status, universal_status_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="update_admin_name"
            label="最后操作人"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_time"
            label="最后操作时间"
            min-width="160"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="260"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                :rowData="scope.row"
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
          <el-form-item label="充值线路名称" prop="channel_name">
            <el-input
              v-model.trim="proxyForm.channel_name"
              clearable
              disabled
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="充值类型" prop="cash_type_name">
            <el-input
              v-model.trim="proxyForm.cash_type_name"
              clearable
              disabled
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-descriptions
            title="优惠设置"
            :column="2"
            border
            direction="vertical"
          >
            <el-descriptions-item label="单笔最低充值限额" align="center">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '单笔最低充值限额' + $t('table.not_empty')
                  }
                ]"
                prop="lowest_deposit"
              >
                <el-input
                  v-model.trim="proxyForm.lowest_deposit"
                  clearable
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item label="优惠比例（%）" align="center">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '优惠比例' + $t('table.not_empty')
                  }
                ]"
                prop="ratio"
              >
                <el-input
                  v-model.trim="proxyForm.ratio"
                  clearable
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-descriptions-item>
            <!-- <el-descriptions-item label="每日最高优惠" align="center">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '每日最高优惠' + $t('table.not_empty')
                  }
                ]"
                prop="day_max_amount"
              >
                <el-input
                  v-model.trim="proxyForm.day_max_amount"
                  clearable
                  style="width: 300px"
                ></el-input>
              </el-form-item>
            </el-descriptions-item> -->
          </el-descriptions>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/charge-discount';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '充值优惠',
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    channel_name: null,
    cash_type_name: null,
    lowest_deposit: null,
    // day_max_amount: null,
    ratio: null
  },
  crudTag: 'activity:charge:'
};

export default defineComponent({
  name: '充值优惠',
  components: {
    crudOperation,
    udOperation
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      top: 'activity:charge:edit'
    };

    const dict = reactive({
      universal_status_options: []
    });

    const { getLabel } = dictionary();

    onMounted(async () => {
      [dict.universal_status_options] = await Promise.all([
        getDicts('universal_status_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      ...toRefs(dict),
      getLabel,
      otherPermission
    };
  }
});
</script>
