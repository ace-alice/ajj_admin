<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
        <el-form-item label="邀请人派奖时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="award_time_start"
            endKey="award_time_end"
            :propTime="[crudQuery.award_time_start, crudQuery.award_time_end]"
          />
        </el-form-item>
        <el-form-item label="邀请人账号">
          <el-input
            v-model.trim="crudQuery.invite_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="被邀请人账号">
          <el-input
            v-model.trim="crudQuery.invitees_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="累计存款金额">
          <el-input
            v-model.trim="crudQuery.deposit_min"
            style="width: 98px"
            clearable
          ></el-input>
          -
          <el-input
            v-model.trim="crudQuery.deposit_max"
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
          max-height="600px"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="invitees_name"
            label="被邀请账号"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="invite_name"
            label="邀请账号"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="register_time"
            label="注册时间"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="register_ip"
            label="注册IP"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="deposit_amount"
            label="累计存款金额"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="invite_amount"
            label="邀请人奖励"
            min-width="120"
            align="center"
          />

          <el-table-column
            prop="status"
            label="邀请人派奖状态"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.status, send_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="award_time"
            label="邀请人派奖时间"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.award_time ? scope.row.award_time : '--'
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-invite';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '好友邀请',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'activity:data:invite:'
};

export default defineComponent({
  name: 'activity-data-task',
  components: { crudOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const dict: any = reactive({
      send_status_options: []
    });

    onMounted(async () => {
      [dict.send_status_options] = await Promise.all([
        getDicts('send_status_options')
      ]);
    });

    return {
      ...crud,
      getLabel,
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