<template>
  <el-table
    :data="infoDetail"
    v-loading="queryLoading"
    stripe
    row-key="id"
    max-height="750px"
    highlight-current-row
    :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
  >
    <el-table-column
      prop="account_name"
      :label="$t('table.account_name')"
      min-width="120"
      align="center"
    >
      <template #default="scope">
        <span>{{ getValue(scope.row.account_name) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="vip_level"
      :label="$t('table.vip_level')"
      min-width="80"
      align="center"
    >
      <template #default="scope">
        <span>{{ getValue(scope.row.vip_level, 'vip') }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="days_without_deposit"
      :label="$t('table.rmb_wallet')"
      min-width="150"
      align="center"
    >
      <template #default="scope">
        <span>{{ getValue(scope.row.days_without_deposit) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="risk_level"
      :label="$t('table.risk_level')"
      min-width="80"
      align="center"
    >
      <template #default="scope">
        <span>{{ getValue(scope.row.risk_level) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="risk_user_remark"
      label="风控原因"
      min-width="80"
      align="center"
    >
      <template #default="scope">
        <span>{{ getValue(scope.row.risk_user_remark) }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    }
  },
  setup(prop) {
    const getValue = (value: string, type?: string) => {
      if (value && value!=="") {
        if (type) return `VIP${value}`;
        else return value;
      } else return '--';
    };
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      infoDetail: prop.infoDetail,
      getValue
    };
  }
});
</script>
