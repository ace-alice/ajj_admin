<template>
  <h4 class="form-title">{{ $t('table.rule_config') }}</h4>
  <el-form-item
    :label="$t('table.distribute_type')"
    prop="send_type"
    :rules="[
      {
        required: true,
        message: $t('table.distribute_type') + $t('table.not_empty')
      }
    ]"
  >
    <el-select
      v-model="proxyForm.send_type"
      style="width: 300px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in distribute_type_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item
    label="优惠最低首存金额"
    prop="low_deposit_money"
    :rules="[
      {
        required: true,
        message: '优惠最低首存金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.low_deposit_money"
      clearable
      style="width: 300px"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="优惠百分比"
    prop="ratio"
    :rules="[
      {
        required: true,
        message: '优惠百分比' + $t('table.not_empty')
      }
    ]"
  >
    <el-input v-model.trim="proxyForm.ratio" clearable style="width: 300px">
      <template #append> % </template>
    </el-input>
  </el-form-item>
  <el-form-item
    label="最高优惠金额"
    prop="bonus_cap"
    :rules="[
      {
        required: true,
        message: '最高优惠金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.bonus_cap"
      clearable
      style="width: 300px"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="优惠发放人数"
    prop="num"
    :rules="[
      {
        required: true,
        message: '优惠发放人数' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.num"
      clearable
      style="width: 300px"
    ></el-input>
  </el-form-item>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'new-user-charge',
  props: {
    proxyForm: {
      type: Object,
      default: () => {
        return {
          send_type: null,
          low_deposit_money: null,
          ratio: null,
          bonus_cap: null,
          num: null
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

    function addKey() {
      if (!prop.proxyForm.template_arr) {
        prop.proxyForm.template_arr = [];
      }
      prop.proxyForm.template_arr.push({
        total_recharge: 0,
        amount: 0
      });
    }

    function deleteKey(index: number) {
      prop.proxyForm.template_arr.splice(index, 1);
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
