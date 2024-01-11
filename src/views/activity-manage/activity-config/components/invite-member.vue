<template>
  <h4 class="form-title">规则配置</h4>
  <el-form-item
    label="绑定银行卡"
    prop="bind_card"
    :rules="[
      {
        required: true,
        message: '绑定银行卡' + $t('table.not_empty')
      }
    ]"
  >
    <el-select
      v-model="proxyForm.bind_card"
      style="width: 200px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in bindCardOptions" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
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
      style="width: 200px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in distribute_type_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item
    label="邀请地址"
    prop="register_url"
    :rules="[
      {
        required: true,
        message: '邀请地址' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.register_url"
      clearable
      style="width: 500px"
    ></el-input>
  </el-form-item>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>{{ $t('table.tmeplate') }}</span>
        <el-button type="primary" @click="addKey">
          <el-icon><plus /></el-icon
        ></el-button>
      </div>
    </template>
    <el-table :data="proxyForm.config_arr" style="width: 100%" border>
      <el-table-column
        prop="total_deposit"
        label="被邀请人累计充值要求"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.total_deposit"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="赠送金额"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.amount"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operate')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <el-button type="danger" @click="deleteKey(scope.$index)">{{
            $t('crud.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'invite-member',
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
      distribute_type_options: []
    });

    onMounted(async () => {
      [dict.distribute_type_options] = await Promise.all([
        getDicts('distribute_type_options')
      ]);
    });

    function addKey() {
      if (!prop.proxyForm.config_arr) {
        prop.proxyForm.config_arr = [];
      }
      prop.proxyForm.config_arr.push({
        total_deposit: 0,
        amount: 0
      });
    }

    const bindCardOptions = [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ];

    function deleteKey(index: number) {
      prop.proxyForm.config_arr.splice(index, 1);
    }

    return {
      ...toRefs(dict),
      addKey,
      deleteKey,
      bindCardOptions,
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
