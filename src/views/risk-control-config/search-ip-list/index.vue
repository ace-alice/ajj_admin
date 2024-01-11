<template>
  <div class="main-container">
    <crudOperation title="router.search-ip-list">
      <template #query>
        <el-form-item label="IP地址">
          <el-input v-model.trim="crudQuery.ip" clearable></el-input>
        </el-form-item>
        <el-form-item label="会员账号">
          <el-input v-model.trim="crudQuery.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="最后登录时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          :style="{ height: tableHeight }"
          :max-height="tableHeight"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="ip"
            label="IP地址"
            width="140"
            align="center"
          />
          <el-table-column
            prop="username"
            label="会员账号"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="最后登录时间"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="count"
            label="登录次数"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="ip_local"
            label="IP归属地"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="device_id"
            label="登录终端"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.device_id, terminal_type_options)
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/risk-control-config/search-ip-list';
import { defineComponent, reactive, ref, onMounted, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { Search } from '@element-plus/icons-vue';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'IP查询',
  crudOptShow: {
    add: false,
    formSize: '60%'
  },
  crudTableParams: 'data',
  defaultQuery: {
    start_time: null,
    end_time: null,
    ip: null,
    username: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    terminal: null,
    terminal_remark: null
  },
  crudTag: 'risk:search:ip:'
};

export default defineComponent({
  name: 'search-ip-list',
  components: { crudOperation, udOperation, dateTimePickerQuery, Search },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const dict = reactive({
      terminal_type_options: []
    });
    const { getLabel } = dictionary();

    onMounted(async () => {
      [dict.terminal_type_options] = await Promise.all([
        getDicts('terminal_type_options')
      ]);
    });
    return { ...crud, getLabel, ...toRefs(dict) };
  }
});
</script>

<style lang="scss" scoped></style>
