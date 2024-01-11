<template>
  <div class="main-container">
    <el-carousel
      v-if="noticeList.length > 0"
      height="44px"
      direction="vertical"
      indicator-position="none"
      :loop="true"
      :pause-on-hover="true"
      :autoplay="true"
    >
      <el-carousel-item v-for="item in noticeList" :key="item.admin_notice_id">
        <p class="info-wrap" justify="center">
          <img
            width="18px"
            class="info-wrap__icon"
            src="../../assets/icons/voice-icon.svg"
            alt=""
          />
          系统通知：<span>{{ item.title }}</span>
        </p>
      </el-carousel-item>
    </el-carousel>
    <el-form
      ref="queryForm"
      class="query-form"
      :inline="true"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="数据总览:">
        <el-date-picker
          v-model="timeRange"
          @change="crudSetQueryKey"
          type="datetimerange"
          range-separator="到"
          value-format="YYYY-MM-DD HH:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <el-button type="primary" @click="crudSetQueryKey">查询</el-button>
    </el-form>
    <br />
    <h4>今日数据统计</h4>
    <!-- 统计 -->
    <div class="count-list clearfix">
      <div
        v-for="item in countList"
        :key="item.key"
        :class="`count-list__unit ${item.color}`"
      >
        <div class="count-list__unit-info">
          <p class="count">{{ item.value }}</p>
          <p>{{ item.name }}</p>
        </div>
        <div class="count-list__unit-icon">
          <el-icon
            v-if="item.iconType === 'el-icon'"
            style="vertical-align: middle"
          >
            <component :is="item.icon"></component>
          </el-icon>
          <svg-icon v-if="item.iconType === 'svg'" :name="item.icon"></svg-icon>
        </div>
      </div>
    </div>
    <!-- echart -->
    <div class="chart">
      <h1 class="chart__title">图表数据总览</h1>
      <div class="chart-list">
        <LineChart
          chartTitle="投注人数"
          v-loading="chartLoading"
          :chartData="betUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="betUser"
        />
        <LineChart
          chartTitle="首存人数"
          v-loading="chartLoading"
          :chartData="firstDepositUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="firstDepositUser"
        />
        <LineChart
          chartTitle="活跃用户"
          v-loading="chartLoading"
          :chartData="activeUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="activeUser"
        />
        <LineChart
          chartTitle="新增会员"
          v-loading="chartLoading"
          :chartData="registerUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="registerUser"
        />
        <LineChart
          chartTitle="存款会员"
          v-loading="chartLoading"
          :chartData="depositUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="depositUser"
        />
        <LineChart
          chartTitle="新增注册且存款会员"
          v-loading="chartLoading"
          :chartData="registerAndDepositUser"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="registerAndDepositUser"
        />
        <LineChart
          chartTitle="总存款"
          v-loading="chartLoading"
          :chartData="depositAmount"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="depositAmount"
        />
        <LineChart
          chartTitle="总提款"
          v-loading="chartLoading"
          :chartData="withdrawAmount"
          :chartAxis="chartAxis"
          class="chart__unit"
          chartId="withdrawAmount"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { datePickerQuery } from '@/components/dateComponents';
import LineChart from '@/components/Echart/lineChart/index.vue';
import { list as getNoticeData } from '@/api/system-manage/announcement-manage';
import { statisticsDay } from '@/api/welcome';
import { ElMessage } from 'element-plus/lib/components';
import { parseTime } from '@/utils/formatTime';

const _countList = [
  {
    name: '投注人数',
    key: 'activeVIP',
    value: 0,
    color: 'blue',
    iconType: 'svg',
    icon: 'betCount'
  },
  {
    name: '首存人数',
    key: 'activeVIP',
    value: 0,
    color: 'purple',
    iconType: 'svg',
    icon: 'firstSaveCount'
  },
  {
    name: '活跃用户',
    key: 'activeVIP',
    value: 0,
    color: 'primary',
    iconType: 'el-icon',
    icon: 'PieChart'
  },
  {
    name: '新增会员',
    key: 'increaseVIP',
    value: 0,
    color: 'success',
    iconType: 'el-icon',
    icon: 'Avatar'
  },
  {
    name: '存款会员',
    key: 'savingVIP',
    value: 0,
    color: 'info',
    iconType: 'el-icon',
    icon: 'Histogram'
  },
  {
    name: '新注册且存款会员',
    key: 'savingVIP',
    value: 0,
    color: 'success',
    iconType: 'el-icon',
    icon: 'Avatar'
  },
  {
    name: '总存款',
    key: 'savingTotal',
    value: 0,
    color: 'danger',
    iconType: 'el-icon',
    icon: 'CreditCard'
  },
  {
    name: '总提款',
    key: 'withdraw',
    value: 0,
    color: 'warning',
    iconType: 'el-icon',
    icon: 'CreditCard'
  }
];

export default defineComponent({
  name: 'welcome',
  components: {
    datePickerQuery,
    LineChart
  },
  setup() {
    let timeRange: any = ref('');
    let chartLoading: any = ref(false);
    const { proxy } = getCurrentInstance() as any;

    let countList: any = reactive(_countList);

    function crudSetQueryKey(obj: any) {
      getStatisticsDay();
    }

    let state: any = reactive({
      noticeList: [],
      betUser: [],
      firstDepositUser: [],
      activeUser: [],
      registerUser: [],
      depositUser: [],
      registerAndDepositUser: [],
      depositAmount: [],
      withdrawAmount: [],
      chartAxis: []
    });
    async function getNoticeList() {
      let params = {
        page: 1,
        limit: 10
      };
      const { data, code, msg } = await (<any>getNoticeData(params));
      if (code === 1) {
        state.noticeList = data.list;
      } else {
        ElMessage.error(msg);
      }
    }

    async function getStatisticsDay() {
      let params = {
        start_time: timeRange.value[0],
        end_time: timeRange.value[1]
      };
      state.betUser = [];
      state.firstDepositUser = [];
      state.activeUser = [];
      state.registerUser = [];
      state.depositUser = [];
      state.depositAmount = [];
      state.registerAndDepositUser = [];
      state.withdrawAmount = [];
      state.chartAxis = [];

      chartLoading.value = true;
      const { data, code, msg } = await (<any>statisticsDay(params));
      chartLoading.value = false;
      if (code === 1) {
        countList[0].value = data.total.bet_user;
        countList[1].value = data.total.first_deposit_user;
        countList[2].value = data.total.active_user;
        countList[3].value = data.total.register_user;
        countList[4].value = data.total.deposit_user;
        countList[5].value = data.total.today_deposit_user;
        countList[6].value = parseFloat(data.total.deposit_amount).toFixed(4);
        countList[7].value = parseFloat(data.total.withdraw_amount).toFixed(4);

        data.history.map((item: any) => {
          state.betUser.push(item.bet_user);
          state.firstDepositUser.push(item.first_deposit_user);
          state.activeUser.push(item.active_user);
          state.registerUser.push(item.register_user);
          state.depositUser.push(item.deposit_user);
          state.depositAmount.push(item.deposit_amount);
          state.registerAndDepositUser.push(item.today_deposit_user)
          state.withdrawAmount.push(item.withdraw_amount);
          state.chartAxis.push(item.date);
        });
      } else {
        ElMessage.error(msg);
      }
    }

    onMounted(async () => {
      timeRange.value = [
        parseTime(new Date().getTime())?.slice(0, 10) + ' 00:00:00',
        parseTime(new Date())?.slice(0, 10) + ' 23:59:59'
      ];
      await getNoticeList();
      await getStatisticsDay();
    });

    return {
      crudSetQueryKey,
      timeRange,
      chartLoading,
      ...toRefs(state),
      countList
    };
  }
});
</script>

<style lang="scss" scoped>
.info-wrap {
  color: #475669;
  line-height: 44px;
  margin: 0;
  text-align: left;
  cursor: pointer;
  &__icon {
    width: 18px;
    height: 18px;
    display: inline-block;
    position: relative;
    top: 4px;
  }
}
:deep(.el-carousel) {
  background-color: #ecf4ff;
  padding: 0 12px;
}
.query-form {
  padding-top: 10px;
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}
.count-list {
  margin-top: 20px;
}
.count-list__unit {
  min-width: 200px;
  float: left;
  width: calc(20% - 10px);
  background-color: #f2f2f2;
  border-radius: 5px;
  margin-right: 10px;
  padding: 10px 15px;
  font-size: 16px;
  line-height: 32px;
  margin-bottom: 20px;
  display: flex;
  transition: box-shadow 0.35s;
  cursor: pointer;
  p {
    height: 32px;
  }
  &:hover {
    box-shadow: 0px 0 10px #ccc;
  }
  .count {
    font-weight: bold;
    font-size: 22px;
  }
  &-info {
    flex: 1;
    width: 100%;
  }
  &-icon {
    padding-left: 15px;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 34px;
  }
  &.blue {
    .count {
      color: #1372ee;
    }
    .count-list__unit-icon {
      color: #1372ee;
    }
  }
  &.purple {
    .count {
      color: #ba17d4;
    }
    .count-list__unit-icon {
      color: #ba17d4;
    }
  }
  &.primary {
    .count {
      color: #409eff;
    }
    .count-list__unit-icon {
      color: #409eff;
    }
  }
  &.success {
    .count {
      color: #67c23a;
    }
    .count-list__unit-icon {
      color: #67c23a;
    }
  }
  &.warning {
    .count {
      color: #e6a23c;
    }
    .count-list__unit-icon {
      color: #e6a23c;
    }
  }
  &.info {
    .count {
      color: #909399;
    }
    .count-list__unit-icon {
      color: #909399;
    }
  }
  &.danger {
    .count {
      color: #f56c6c;
    }
    .count-list__unit-icon {
      color: #f56c6c;
    }
  }
}
.chart-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.chart__title {
  line-height: 44px;
  font-size: 16px;
  padding-top: 10px;
}
.chart__unit {
  width: calc(50% - 20px);
  height: 340px;
  border: 1px solid #eee;
  border-radius: 3px;
  margin-bottom: 20px;
}
</style>
