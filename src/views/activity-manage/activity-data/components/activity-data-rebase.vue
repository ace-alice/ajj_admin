<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
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
        <el-form-item label="活动名称">
          <el-input
            v-model.trim="crudQuery.activity_title"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="风控层级">
          <el-select
            v-model="crudQuery.risk_control_mark_id"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in riskTypeList"
              :key="item.id"
              :label="item.risk_level"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="场馆">
          <el-select
            v-model="crudQuery.venue_id"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in venue_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="累计投注金额">
          <el-input
            v-model.trim="crudQuery.total_bet_amount_min"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.total_bet_amount_max"
            style="width: 98px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="返水金额">
          <el-input
            v-model.trim="crudQuery.rebate_amount_min"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.rebate_amount_max"
            style="width: 98px"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="参与活动时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="join_date_start"
            endKey="join_date_end"
            :propTime="[crudQuery.join_date_start, crudQuery.join_date_end]"
          />
        </el-form-item>
        <el-form-item label="返水发放时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="rebate_time_start"
            endKey="rebate_time_end"
            :propTime="[crudQuery.rebate_time_start, crudQuery.rebate_time_end]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          border
          max-height="600px"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="activity_title"
            label="活动名称"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="member_name"
            label="用户名"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="risk_control_mark"
            label="风控层级"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="join_date"
            label="参与活动时间"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="venue_id"
            label="场馆"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.venue_id, venue_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="total_bet_amount"
            label="累计投注金额"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.total_bet_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="rebate_amount"
            label="返水金额"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.rebate_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="rebate_time"
            label="返水发放时间"
            min-width="120"
            align="center"
          />
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-rebase';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { getRiskTypeListHook } from '@/hook/getRiskTypeList';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '投注返水',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'activity:data:rebase:'
};

export default defineComponent({
  name: 'activity-data-rebase',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const dict: any = reactive({
      venue_options: [],
      activity_sign_status: []
    });

    const { riskTypeList } = getRiskTypeListHook({
      risk_type: 1
    });

    onMounted(async () => {
      [dict.venue_options, dict.activity_sign_status] = await Promise.all([
        getDicts('venue_options'),
        getDicts('activity_sign_status')
      ]);
      console.log(riskTypeList);
    });

    return {
      ...crud,
      getLabel,
      riskTypeList,
      ...toRefs(dict)
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
