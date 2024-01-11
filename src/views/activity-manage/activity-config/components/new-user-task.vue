<template>
  <h4 class="form-title">{{ $t('table.rule_config') }}</h4>
  <el-tabs v-model="tabModel" style="margin: 0 20px">
    <el-tab-pane
      v-for="item in tabList"
      :key="item.value"
      :label="item.label"
      :name="item.value"
    >
    </el-tab-pane>
  </el-tabs>
  <!-- 绑卡任务 -->
  <template v-if="tabModel === 'bind_card'">
    <BaseTask :proxyForm="proxyForm.user_task.bind_card" key="bind_card" />
    <el-form-item label="绑定银行卡" style="width: 500px" prop="need_bind_card">
      <el-select
        v-model="proxyForm.user_task.bind_card.need_bind_card"
        style="width: 350px"
        popper-class="user-select"
        clearable
      >
        <el-option label="是" :value="1" />
      </el-select>
    </el-form-item>
    <el-form-item label="赠送金额" style="width: 500px" prop="amount">
      <el-input
        v-model.trim="proxyForm.user_task.bind_card.amount"
        clearable
        style="width: 350px"
      ></el-input>
    </el-form-item>
  </template>
  <!-- 游戏体验 -->
  <template v-if="tabModel === 'game'">
    <BaseTask :proxyForm="proxyForm.user_task.game" key="bind_card" />
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>充值</span>
          <el-button
            type="primary"
            v-if="proxyForm.user_task.game.deposit.length < 1"
            @click="addChargeKey"
          >
            <el-icon><plus /></el-icon
          ></el-button>
        </div>
      </template>
      <el-table
        :data="proxyForm.user_task.game.deposit"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="deposit"
          label="累计充值要求"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <el-input
              v-model.trim="scope.row.deposit"
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
            <el-button type="danger" @click="deleteChargeKey(scope.$index)">{{
              $t('crud.delete')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>投注</span>
          <el-button
            v-if="proxyForm.user_task.game.bet_amount.length < 1"
            type="primary"
            @click="addBetKey"
          >
            <el-icon><plus /></el-icon
          ></el-button>
        </div>
      </template>
      <el-table
        :data="proxyForm.user_task.game.bet_amount"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="bet_amount"
          label="累计投注要求"
          min-width="160"
          align="center"
        >
          <template #default="scope">
            <el-input
              v-model.trim="scope.row.bet_amount"
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
            <el-button type="danger" @click="deleteBetKey(scope.$index)">{{
              $t('crud.delete')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </template>
  <!-- 签到任务 -->
  <template v-if="tabModel === 'sign'">
    <BaseTask :proxyForm="proxyForm.user_task.sign" key="bind_card" />
    <el-form-item label="满签天数" style="width: 500px" prop="full_day">
      <el-input
        v-model.trim="proxyForm.user_task.sign.full_day"
        clearable
        style="width: 350px"
      ></el-input>
    </el-form-item>
    <el-form-item label="满签赠送金额" style="width: 500px" prop="amount">
      <el-input
        v-model.trim="proxyForm.user_task.sign.amount"
        clearable
        style="width: 350px"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="每天最低存款金额"
      style="width: 500px"
      prop="low_deposit"
    >
      <el-input
        v-model.trim="proxyForm.user_task.sign.low_deposit"
        clearable
        style="width: 350px"
      ></el-input>
    </el-form-item>
    <el-form-item label="每天最低投注金额" style="width: 500px" prop="low_bet">
      <el-input
        v-model.trim="proxyForm.user_task.sign.low_bet"
        clearable
        style="width: 350px"
      ></el-input>
    </el-form-item>
  </template>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import BaseTask from './base-task.vue';

export default defineComponent({
  name: 'new-user-task',
  components: {
    BaseTask
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    proxyForm: {
      type: Object,
      default: () => {
        return {
          user_task: {
            bind_card: {
              is_open: 1,
              title: '新手任务绑卡',
              send_type: 1,
              start_time: 1,
              day: 7,
              need_bind_card: 1,
              amount: 5
            },
            game: {
              is_open: 1,
              title: '游戏体验',
              send_type: 1,
              start_time: 1,
              day: 7,
              deposit: [],
              bet_amount: []
            },
            sign: {
              is_open: 1,
              title: '签到任务',
              send_type: 1,
              start_time: 1,
              day: 7,
              full_day: 7,
              amount: 100,
              low_deposit: 1000,
              low_bet: 1000
            }
          }
        };
      }
    }
  },
  setup(prop) {
    const tabList = [
      {
        label: '绑卡任务',
        value: 'bind_card'
      },
      {
        label: '游戏体验',
        value: 'game'
      },
      {
        label: '签到任务',
        value: 'sign'
      }
    ];

    function addChargeKey() {
      if (!prop.proxyForm.user_task.game.deposit) {
        prop.proxyForm.user_task.game.deposit = [];
      }
      prop.proxyForm.user_task.game.deposit.push({
        deposit: 0,
        amount: 0
      });
    }

    function deleteChargeKey(index: number) {
      prop.proxyForm.user_task.game.deposit.splice(index, 1);
    }

    function addBetKey() {
      if (!prop.proxyForm.user_task.game.bet_amount) {
        prop.proxyForm.user_task.game.bet_amount = [];
      }
      prop.proxyForm.user_task.game.bet_amount.push({
        bet_amount: 0,
        amount: 0
      });
    }

    function deleteBetKey(index: number) {
      prop.proxyForm.user_task.game.bet_amount.splice(index, 1);
    }

    const tabModel = ref('bind_card');

    onMounted(async () => {});

    // function addKey() {
    //   if (!prop.proxyForm.template_arr) {
    //     prop.proxyForm.template_arr = [];
    //   }
    //   prop.proxyForm.template_arr.push({
    //     total_recharge: 0,
    //     amount: 0
    //   });
    // }

    // function deleteKey(index: number) {
    //   prop.proxyForm.template_arr.splice(index, 1);
    // }

    return {
      // addKey,
      // deleteKey,
      tabList,
      addChargeKey,
      deleteChargeKey,
      addBetKey,
      tabModel,
      deleteBetKey,
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
