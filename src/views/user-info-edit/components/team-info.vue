<template>
  <div>
    <el-descriptions
      :title="$t('table.team_proxy_info')"
      :column="3"
      border
      direction="vertical"
    >
      <template #extra>
        <el-button type="primary" @click="toQuery">
          <el-icon><refresh /></el-icon>
          {{ $t('tagsView.refresh') }}
        </el-button>
      </template>
      <el-descriptions-item :label="$t('table.sub_agent_count')" align="center">
        {{ allData.all_agent_count || 0 }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.direct_agent_count')"
        align="center"
      >
        {{ allData.direct_agent_count }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      :title="$t('table.team_member_info')"
      :column="4"
      border
      direction="vertical"
    >
      <el-descriptions-item
        :label="$t('table.sub_member_count')"
        align="center"
      >
        {{ allData.all_member_count }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.direct_member_count')"
        align="center"
      >
        {{ allData.direct_member_count }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.first_diposit_count')"
        align="center"
      >
        {{ allData.deposit_count }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.first_diposit_momey')"
        align="center"
      >
        {{ allData.deposit_total }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('table.month_increase')" align="center">
        {{ allData.add_count }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.month_active_member')"
        align="center"
      >
        {{ allData.active_count }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.month_active_member_effer')"
        align="center"
      >
        {{ allData.count_deposit }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions
      :title="$t('table.team_bet_info')"
      :column="3"
      border
      direction="vertical"
    >
      <el-descriptions-item :label="$t('table.month_discount')" align="center">
        {{ allData.total_discount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.month_rebase')" align="center">
        {{ allData.total_rebate }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.month_win_pure')" align="center">
        {{ allData.net_win }}
      </el-descriptions-item>

      <el-descriptions-item :label="$t('table.month_total_bet')" align="center">
        {{ allData.total_bet }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.month_bet_effer')" align="center">
        {{ allData.valid_bet }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.month_win')" align="center">
        {{ allData.total_profit }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue';
import { getAgentTeamInfo } from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'team-info',
  setup() {
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

    function toQuery() {
      getAgentTeamInfo({ member_id: memberId.value }).then((result: any) => {
        if (result.code == 1) {
          allData.value = result.data;
        }
      });
    }

    onMounted(() => {
      nextTick(async () => {
        setTimeout(() => {
          toQuery();
        }, 100);
      });
    });

    return { toQuery, allData };
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
