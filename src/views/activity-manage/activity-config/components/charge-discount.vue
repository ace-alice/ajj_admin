<template>
  <h4 class="form-title">{{ $t('table.rule_config') }}</h4>
  <el-form-item
    label="每日最高可享优惠"
    style="width: 500px"
    prop="day_max_amount"
    :rules="[
      {
        required: true,
        message: '每日最高可享优惠' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.day_max_amount"
      clearable
      style="width: 350px"
    />
  </el-form-item>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'charge-discount',
  props: {
    type: {
      type: String,
      default: ''
    },
    proxyForm: {
      type: Object,
      default: () => {
        return {
          day_max_amount: null
        };
      }
    }
  },
  setup(prop) {
    const dict = reactive({
      distribute_type_options: []
    });

    onMounted(async () => {
      [dict.distribute_type_options] = await Promise.all([
        getDicts('distribute_type_options')
      ]);
    });
    return {
      ...toRefs(dict),
      // eslint-disable-next-line vue/no-dupe-keys
      proxyForm: prop.proxyForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form-title {
  width: 149px;
  text-align: left;
  font-size: 16px;
  margin-top: 20px;
  line-height: 40px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
