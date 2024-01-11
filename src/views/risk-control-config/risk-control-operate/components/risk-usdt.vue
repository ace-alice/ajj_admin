<template>
  <el-descriptions title="详细信息" border direction="vertical" :column="2">
    <el-descriptions-item label="虚拟币地址" :min-width="120" align="center">
      {{ infoDetail.protocol_address }}
    </el-descriptions-item>
    <el-descriptions-item label="虚拟币种类" :min-width="120" align="center">
      {{ infoDetail.protocol }}
    </el-descriptions-item>
    <el-descriptions-item label="协议类型" :min-width="120" align="center">
      {{ infoDetail.protocol_type }}
    </el-descriptions-item>
    <el-descriptions-item
      label="人民币提款总额"
      :min-width="120"
      align="center"
    >
      <el-tag v-if="infoDetail.total_withdraw">{{ infoDetail.total_withdraw }}</el-tag>
      <span v-else>--</span>
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
