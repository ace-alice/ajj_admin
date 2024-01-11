<template>
  <el-descriptions title="详细信息" border direction="vertical" :column="4">
    <el-descriptions-item label="终端设备号" :min-width="120" align="center">
      <el-tag>{{ infoDetail.risk_terminal }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="风控层级" :min-width="120" align="center">
      <el-tag v-if="infoDetail.risk_level">{{ infoDetail.risk_level }}</el-tag>
      <span v-else>--</span>
    </el-descriptions-item>
    <el-descriptions-item label="风控原因" :min-width="120" align="center">
      <el-tag
        v-if="infoDetail.risk_remark && infoDetail.risk_remark != 'none'"
        >{{ infoDetail.risk_remark }}</el-tag
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
