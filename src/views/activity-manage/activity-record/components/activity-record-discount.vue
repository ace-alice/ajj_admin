<template>
  <div class="main-container">
    <crudOperation title="router.activity-record-discount">
      <template #query>
        <el-form-item :label="$t('table.order_generate_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.get_money_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="get_time_start"
            endKey="get_time_end"
            :propTime="[crudQuery.get_time_start, crudQuery.get_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.bet_username')">
          <el-input
            v-model.trim="crudQuery.username"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.event_title')">
          <el-input
            v-model.trim="crudQuery.activity_title"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </template>
      <template #left-left>
        <el-button
          :permission="otherPermission.count"
          type="primary"
          @click="openDialog"
          >参与人数</el-button
        >
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          border
          show-summary
          max-height="750px"
          :summary-method="getSummaries"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="member_name"
            :label="$t('table.bet_username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="activity_title"
            :label="$t('table.event_title')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="reward_amount"
            :label="$t('table.incentive_bonus')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.reward_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="get_time"
            :label="$t('table.get_money_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.get_time">{{
                $parseTime(String(scope.row.get_time).padEnd(13, '0'))
              }}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.order_generate_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="event_time"
            :label="$t('table.remark')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span v-if="scope.row.activity_title != '场馆包赔'">/</span>
              <template v-if="scope.row.activity_title == '场馆包赔'">
                <span
                  >{{ scope.row.event_name }}/{{ scope.row.event_time }}</span
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      title="参与人数"
      v-model="dialogModel"
      destroy-on-close
      custom-class="activity-data-dialog"
      append-to-body
      width="50%"
    >
      <el-table
        :data="dialogTable"
        style="width: 100%"
        v-loading="detailLoading"
        border
      >
        <el-table-column
          prop="name"
          label="活动名称"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="value"
          label="参与人数"
          min-width="160"
          align="center"
        />
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-record/activity-record-discount';
import { defineComponent, ref, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '优惠活动记录',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['reward_amount'],
  crudTag: 'activity:record:discount:'
};

export default defineComponent({
  name: 'activity-record-discount',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const dialogModel = ref(false);
    const detailLoading = ref(false);

    const otherPermission = {
      count: 'activity:record:discount:count'
    };

    function openDialog() {
      dialogModel.value = true;
      getApplyCount();
    }

    const dialogTable: any = ref([]);
    async function getApplyCount() {
      detailLoading.value = true;
      dialogTable.value = [];
      const { code, data, msg } = await (<any>Api.applyCount());
      detailLoading.value = false;
      let obj = {};
      if (code === 1) {
        Object.keys(data).map((key: any) => {
          dialogTable.value.push({
            name: key,
            value: data[key]
          });
        });
      }
    }

    return {
      ...crud,
      dialogModel,
      openDialog,
      detailLoading,
      otherPermission,
      dialogTable
    };
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
