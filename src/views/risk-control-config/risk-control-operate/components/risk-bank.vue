<template>
  <el-descriptions  title="详细信息" border direction="vertical" :column="2">
    <el-descriptions-item label="银行卡号" :min-width="120" align="center">
      <el-tag>{{ infoDetail.bank_account }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="银行名称" :min-width="120" align="center">
      <el-tag v-if="infoDetail.bank_address">{{
        infoDetail.bank_address
      }}</el-tag>
      <span v-else>--</span>
    </el-descriptions-item>
    <el-descriptions-item
      label="人民币提款金额"
      :min-width="120"
      align="center"
    >
      {{ infoDetail.total_withdraw }}
    </el-descriptions-item>
    <el-descriptions-item label="风控层级" :min-width="120" align="center">
      <el-tag v-if="infoDetail.risk_level">{{ infoDetail.risk_level }}</el-tag>
      <span v-else>--</span>
    </el-descriptions-item>
    <el-descriptions-item label="风控原因" :min-width="120" align="center">
      <el-tag
        v-if="
          infoDetail.risk_bank_remark && infoDetail.risk_bank_remark != 'none'
        "
        >{{ infoDetail.risk_bank_remark }}</el-tag
      >
      <span v-else>--</span>
    </el-descriptions-item>
  </el-descriptions>
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
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      infoDetail: prop.infoDetail
    };
  }
});
</script>
