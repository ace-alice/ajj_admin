<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
        <el-form-item label="场次" prop="event_time">
          <el-date-picker
            v-model="crudQuery.event_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="中奖时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="get_start_time"
            endKey="get_end_time"
            :propTime="[crudQuery.get_start_time, crudQuery.get_end_time]"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="crudQuery.member_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model.trim="crudQuery.nickname"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="中奖金额">
          <el-input
            v-model.trim="crudQuery.min_reward_amount"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.max_reward_amount"
            style="width: 98px"
            clearable
          ></el-input>
        </el-form-item>
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
            prop="event_time"
            label="场次"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="member_name"
            label="用户名"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="status"
            label="预约状态"
            min-width="140"
            align="center"
            >已预约</el-table-column
          >
          <el-table-column
            prop="reward_amount"
            label="中奖金额"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.reward_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="get_time"
            label="中奖时间"
            min-width="140"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-lucky';
import { defineComponent, onMounted } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '红包雨数据',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  includeSumColumn: ['reward_amount'],
  crudTag: 'activity:data:lucky:'
};

export default defineComponent({
  name: 'activity-data-lucky',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    onMounted(async () => {});

    return {
      ...crud
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
<style lang="scss">
.activity-data-dialog {
  .el-dialog__headerbtn {
    width: 41px;
    height: 41px;
    &:focus .el-dialog__close {
      color: #fff;
    }
    &:hover .el-dialog__close {
      color: #fff;
    }
  }
}
</style>