<template>
  <div v-loading="pageLoad">
    <el-descriptions
      :title="$t('table.withdrew_flow_info')"
      :column="3"
      border
      direction="vertical"
    >
      <template #extra>
        <el-button
          v-only="otherPermission.clearflow"
          type="primary"
          @click="clearFlow"
          :loading="clearFlowFlag"
        >
          清空流水
        </el-button>
        <el-button type="primary" @click="toQuery">
          <el-icon><refresh /></el-icon>
          {{ $t('tagsView.refresh') }}
        </el-button>
      </template>
      <el-descriptions-item :label="$t('table.need_water')" align="center">
        {{ allData.dwFlow.need_water || 0 }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.completed_water')" align="center">
        {{ allData.dwFlow.completed_water }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.remaining_water')" align="center">
        {{ allData.dwFlow.remaining_water }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      :title="$t('table.money_change_info')"
      :column="4"
      border
      direction="vertical"
    >
      <el-descriptions-item :label="$t('table.total_deposit')" align="center">
        {{ allData.dwInfo.total_deposit }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.total_withdrawal')"
        align="center"
      >
        {{ allData.dwInfo.total_withdrawal }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.count_deposit')" align="center">
        {{ allData.dwInfo.count_deposit }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.count_withdrawal')"
        align="center"
      >
        {{ allData.dwInfo.count_withdrawal }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      :title="$t('table.bet_info')"
      :column="5"
      border
      direction="vertical"
    >
      <el-descriptions-item :label="$t('table.total_bet')" align="center">
        {{ allData.betInfo.total_bet }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.total_profit')" align="center">
        {{ allData.betInfo.total_profit }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.activity')" align="center">
        {{ allData.betInfo.activity }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.rebate')" align="center">
        {{ allData.betInfo.rebate }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.total_c_profit')" align="center">
        {{ allData.betInfo.total_c_profit }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  h,
  nextTick,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue';
import { getCashFlowInfo, cleanBetFlow } from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';

export default defineComponent({
  name: 'cash-flow-info',
  setup() {
    const pageLoad = ref(false);

    const route = useRoute();

    const memberId = computed(() => {
      return route.query.member_id;
    });

    const allData: Ref<any> = ref({
      dwFlow: {
        need_water: 0,
        completed_water: 0,
        remaining_water: 0
      },
      dwInfo: {
        total_deposit: 0,
        total_withdrawal: 0,
        count_deposit: 0,
        count_withdrawal: 0
      },
      betInfo: {
        total_bet: 0,
        total_profit: 0,
        activity: 0,
        rebate: 0,
        total_c_profit: 0
      }
    });

    const otherPermission = {
      clearflow: 'user:config:clearflow'
    };

    const clearFlowFlag = ref(false);
    function clearFlow() {
      ElMessageBox({
        title: '解除流水',
        message: h('div', null, [
          h('h4', { style: 'font-size: 16px' }, '是否解除该用户的剩余流水？'),
          h('p', { style: 'color: red' }, '请谨慎操作！')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        clearFlowFlag.value = true;
        doClearFlow();
      });
    }

    async function doClearFlow() {
      const params = { member_id: memberId.value };
      const { data, code, msg } = await (<any>cleanBetFlow(params));
      clearFlowFlag.value = false;
      if (code === 1) {
        ElMessage.success(msg);
        toQuery();
      } else {
        ElMessage.error(msg);
      }
    }

    function toQuery() {
      pageLoad.value = true;

      getCashFlowInfo({ member_id: memberId.value })
        .then((result: any) => {
          if (result.code == 1) {
            allData.value = result.data;
          }
        })
        .finally(() => {
          pageLoad.value = false;
        });
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
      clearFlow,
      clearFlowFlag,
      otherPermission
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-descriptions) {
  margin: 15px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}
.pagination {
  margin: 20px 0;
  display: flex;
  flex-direction: row-reverse;
}
</style>
