<template>
  <div class="main-container">
    <crudOperation title="" labelWidth="120px">
      <template #query>
        <el-form-item>
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="starter_time_start"
            endKey="starter_time_end"
            :propTime="[
              crudQuery.starter_time_start,
              crudQuery.starter_time_end
            ]"
          />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select
            v-model="crudQuery.verify_status"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in verify_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="调整类型">
          <el-select
            v-model="crudQuery.change_id"
            popper-class="user-select"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in change_id_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            prop="starter_admin_name"
            :label="$t('table.founder_member') /**发起人*/"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="starter_time"
            :label="$t('table.initiation_time') /**发起时间 */"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="starter_remark"
            :label="$t('table.initiate_reason') /**发起原因 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="change_id"
            :label="$t('table.change_type') /**调整类型 */"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.change_id, change_id_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="fix_amount"
            :label="$t('table.cash_adjust') /**调整金额 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="verify_status_name"
            :label="$t('table.audit_status') /**审核状态 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="verify_admin_name"
            :label="$t('table.audit_user') /**审核人 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="220"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="success"
                v-only="otherPermission.verify"
                :disabled="scope.row.verify_status != 1"
                @click.stop="verifyStatus(scope.row.id, 2)"
                >{{ $t('table.check_audit' /**审核通过 */) }}</el-button
              >
              <el-button
                type="danger"
                v-only="otherPermission.verify"
                :disabled="scope.row.verify_status != 1"
                @click="verifyStatus(scope.row.id, 3)"
                >{{ $t('table.check_reject' /**审核拒绝 */) }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 新增 -->
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-form-item
            :label="$t('table.channel_name2')"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t('table.channel_name2') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.name"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/manual-audit';
import { defineComponent, reactive, onMounted, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus/lib/components';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '人工加减额审核',
  defaultQuery: {
    starter_time_start: null, //发起开始时间
    starter_time_end: null, //发起结束时间
    verify_status: '', //审核状态
    change_id: '' //调整类型
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'manual:audit:'
};
const dict = reactive({
  verify_status_options: [],
  change_id_options: []
});

export default defineComponent({
  components: {
    crudOperation,
    udOperation,
    dateTimePickerQuery
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();
    const otherPermission = {
      verify: 'manual:audit:verify'
    };

    const verifyStatus = (id: number, verify_status: number) => {
      Api.verify({
        id,
        verify_status
      })
        .then((res: any) => {
          if (res.code == 1) {
            ElNotification.success(res.msg || res.message);
          } else {
            ElMessage.error(res.msg || res.message);
          }
        })
        .finally(() => {
          crud.refresh();
        });
    };
    onMounted(async () => {
      [dict.verify_status_options, dict.change_id_options] = await Promise.all([
        getDicts('verify_status_options'),
        getDicts('change_id_options')
      ]);
    });
    return {
      ...crud,
      getLabel,
      verifyStatus,
      ...toRefs(dict),
      otherPermission
    };
  }
});
</script>
