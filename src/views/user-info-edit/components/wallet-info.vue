<template>
  <div v-loading="pageLoad">
    <el-descriptions title="钱包信息" :column="2" border direction="vertical">
      <template #extra>
        <el-button type="primary" @click="toQuery">
          <el-icon><refresh /></el-icon>
          {{ $t('tagsView.refresh') }}
        </el-button>
        <el-button
          type="primary"
          @click="backAllMoney"
          v-only="otherPermission.all"
        >
          一键回收
        </el-button>
      </template>
      <p>{{ $t('table.center_money_rest') }}：</p>
      <el-descriptions-item :label="$t('table.ia_money')" align="center">
        {{ allData.iaMoney }}
        <el-button
          type="primary"
          @click="transferOut(1, allData.iaMoney, $t('table.ia_money'))"
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.saba_money')" align="center">
        {{ allData.sabaMoney }}
        <el-button
          type="primary"
          @click="transferOut(2, allData.sabaMoney, $t('table.saba_money'))"
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.pinnacle_money')" align="center">
        {{ allData.pinnacleMoney }}
        <el-button
          type="primary"
          @click="
            transferOut(3, allData.pinnacleMoney, $t('table.pinnacle_money'))
          "
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.xj_money')" align="center">
        {{ allData.xjMoney }}
        <el-button
          type="primary"
          @click="transferOut(4, allData.xjMoney, $t('table.xj_money'))"
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.ag_money')" align="center">
        {{ allData.agMoney }}
        <el-button
          type="primary"
          @click="transferOut(5, allData.agMoney, $t('table.ag_money'))"
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item>
      <!-- <el-descriptions-item :label="$t('table.ag_money')" align="center">
        {{ allData.agMoney }}
        <el-button
          type="primary"
          @click="transferOut(5, allData.xjMoney)"
          v-only="otherPermission.out"
        >
          转出
        </el-button>
      </el-descriptions-item> -->
      <el-descriptions-item
        :label="$t('table.center_money_rest')"
        align="center"
      >
        {{ allData.available_balance }}
      </el-descriptions-item>
    </el-descriptions>
    <el-dialog
      v-model="dialogVisible"
      title="转出金额"
      width="40%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form ref="ruleFormRef" :model="form" status-icon label-width="124px">
        <p style="line-height: 40px">
          {{ form.name }}钱包余额: {{ form.balance }}
        </p>
        <el-form-item label="转账金额" prop="amount">
          <el-input v-model.trim="form.amount" placeholder="请输入转账金额">
            <template #append>
              <el-button type="primary" @click="allMoney">全部金额</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSure">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref
} from 'vue';
import {
  getWalletInfo,
  getBackAllMoney,
  moneyTransferOut
} from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components';

export default defineComponent({
  name: 'cash-flow-info',
  setup() {
    const pageLoad = ref(false);

    const route = useRoute();

    const memberId = computed(() => {
      return route.query.member_id;
    });

    const allData = reactive({
      iaMoney: null,
      name: null,
      pinnacleMoney: null,
      sabaMoney: null,
      xjMoney: null,
      agMoney: null,
      available_balance: null
    });

    const otherPermission = {
      all: 'user:config:wallet:all',
      out: 'user:config:wallet:out'
    };

    function toQuery() {
      pageLoad.value = true;
      getWalletInfo({ member_id: memberId.value })
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(allData, result.data);
          }
        })
        .finally(() => {
          pageLoad.value = false;
        });
    }

    function backAllMoney() {
      getBackAllMoney({ member_id: memberId.value }).then((result: any) => {
        if (result.code == 1) {
          toQuery();
          ElMessage.success(result.msg);
        } else {
          ElMessage.error(result.msg);
        }
      });
    }

    const form = reactive({
      member_id: memberId.value,
      name: null,
      game_id: null,
      balance: null,
      amount: null
    });
    const dialogVisible = ref(false);
    function transferOut(type: any, balance: any, name: any) {
      form.game_id = type;
      form.name = name;
      form.balance = balance;
      dialogVisible.value = true;
    }

    function handleClose() {
      form.amount = null;
      dialogVisible.value = false;
    }

    function handleSure() {
      moneyTransferOut(form).then((result: any) => {
        if (result.code == 1) {
          ElMessage.success(result.msg);
          toQuery();
          handleClose();
        } else {
          ElMessage.error(result.msg);
        }
      });
    }

    function allMoney() {
      form.amount = form.balance;
    }

    onMounted(() => {
      nextTick(async () => {
        setTimeout(() => {
          toQuery();
        }, 100);
      });
    });

    return {
      toQuery,
      pageLoad,
      allData,
      form,
      handleClose,
      handleSure,
      allMoney,
      otherPermission,
      backAllMoney,
      dialogVisible,
      transferOut
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-descriptions) {
  margin: 15px 0;
}
</style>
