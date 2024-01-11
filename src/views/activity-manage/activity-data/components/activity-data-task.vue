<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
        <el-form-item label="领取时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="receive_time_start"
            endKey="receive_time_end"
            :propTime="[
              crudQuery.receive_time_start,
              crudQuery.receive_time_end
            ]"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="crudQuery.member_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input
            v-model.trim="crudQuery.task_name"
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
            prop="member_name"
            :label="$t('table.bet_username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="task_name"
            label="任务名称"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="amount"
            label="奖励金额"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="condition"
            label="奖励条件"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="receive_status"
            label="奖励领取状态"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.receive_status, receive_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="receive_time"
            label="领取时间"
            min-width="120"
            align="center"
          />
          <el-table-column label="活动详情" min-width="160"  align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.task_type == 4"
                type="text"
                style="color: #008dff"
                @click="toDetail(scope.row)"
                >查看详情</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      title="详情"
      v-model="detailDialog"
      destroy-on-close
      custom-class="activity-data-dialog"
      append-to-body
      width="50%"
    >
      <el-table
        :data="dialogData"
        v-loading="dialogLoading"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="日期"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="deposit"
          label="存款"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="bet_amount"
          label="投注"
          min-width="160"
          align="center"
        />
        <el-table-column
          prop="status"
          label="签到状态"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <span>{{ getLabel(scope.row.status, activity_sign_status) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-task';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '新手任务',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'activity:data:task:'
};

export default defineComponent({
  name: 'activity-data-task',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const detailDialog = ref(false);
    const dialogLoading = ref(false);

    let dialogData: any = ref([]);
    async function toDetail(row: any) {
      detailDialog.value = true;
      dialogLoading.value = true;
      const params = {
        member_id: row.member_id
      };
      dialogData.value = [];
      const { data, code } = await (<any>Api.newPeopleTaskSignList(params));
      dialogLoading.value = false;
      if (code === 1) {
        dialogData.value = data;
        console.log(dialogData);
      }
    }

    const dict: any = reactive({
      receive_status_options: [],
      activity_sign_status: []
    });

    onMounted(async () => {
      [dict.receive_status_options, dict.activity_sign_status] =
        await Promise.all([
          getDicts('receive_status_options'),
          getDicts('activity_sign_status')
        ]);
    });

    return {
      ...crud,
      toDetail,
      detailDialog,
      dialogData,
      getLabel,
      ...toRefs(dict),
      dialogLoading
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