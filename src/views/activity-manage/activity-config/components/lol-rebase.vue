<template>
  <h4 class="form-title">规则配置</h4>
  <el-form-item
    label="活动场馆"
    prop="venue_ids"
    :rules="[
      {
        required: true,
        message: '活动场馆' + $t('table.not_empty')
      }
    ]"
  >
    <el-select
      v-model="proxyForm.venue_ids"
      style="width: 500px"
      popper-class="user-select"
      multiple
      clearable
    >
      <template v-for="item in venue_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item
    label="累计投注金额"
    prop="total_bet_amount"
    :rules="[
      {
        required: true,
        message: '累计投注金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.total_bet_amount"
      clearable
      style="width: 500px"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="返水百分比"
    prop="rebate_ratio"
    :rules="[
      {
        required: true,
        message: '返水百分比' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.rebate_ratio"
      clearable
      style="width: 500px"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="最高返水金额"
    prop="max_rebate_amount"
    :rules="[
      {
        required: true,
        message: '最高返水金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.max_rebate_amount"
      clearable
      style="width: 500px"
    ></el-input>
  </el-form-item>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'lol-rebase',
  props: {
    proxyForm: {
      type: Object,
      default: () => {
        return {
          config_arr: []
        };
      }
    }
  },
  setup(prop) {
    const dict = reactive({
      venue_options: []
    });

    onMounted(async () => {
      [dict.venue_options] = await Promise.all([getDicts('venue_options')]);
    });

    function addKey() {
      if (!prop.proxyForm.config_arr) {
        prop.proxyForm.config_arr = [];
      }
      prop.proxyForm.config_arr.push({
        start_time: null,
        total_amount: 0,
        total_num: 0,
        fixed_amount: 0
      });
    }

    function deleteKey(index: number) {
      prop.proxyForm.config_arr.splice(index, 1);
    }

    return {
      ...toRefs(dict),
      addKey,
      deleteKey,
      proxyForm: prop.proxyForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form-title {
  width: 149px;
  text-align: right;
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
