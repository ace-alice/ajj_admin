<template>
  <crudOperation title="router.log-config">
    <template #query> </template>
    <template #table>
      <el-table
        :data="crudData"
        v-loading="queryLoading"
        stripe
        row-key="admin_user_log_id"
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
          prop="username"
          :label="$t('table.username')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="menu_name"
          :label="$t('table.menu_name')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="menu_url"
          :label="$t('table.menu_url')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="request_ip"
          :label="$t('table.request_ip')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="request_method"
          :label="$t('table.request_method')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="response_msg"
          :label="$t('table.response_msg')"
          min-width="120"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.create_time')"
          min-width="160"
          align="center"
        />
      </el-table>
    </template>
    <template #form> </template>
  </crudOperation>
</template>

<script lang="ts">
import api from '@/api/admin-config/profile';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '会员',
  crudOptShow: {
    operate: false
  },
  defaultQuery: {},
  crudMethod: { ...api },
  defaultForm: {
    name: null,
    code: null,
    editor: ''
  },
  crudTag: 'profile:log:'
};

export default defineComponent({
  name: 'profile-log',
  components: { crudOperation, udOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...toRefs(crud) };
  }
});
</script>
