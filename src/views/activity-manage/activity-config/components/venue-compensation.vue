<template>
  <h4 class="form-title">{{ $t('table.rule_config') }}</h4>
  <el-form-item label="发放方式" style="width: 500px" prop="send_type">
    <el-select
      v-model="proxyForm.send_type"
      style="width: 350px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in distribute_type_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item
    label="优惠单笔投注金额"
    style="width: 500px"
    prop="single_bet_amount"
    :rules="[
      {
        required: true,
        message: '优惠单笔投注金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.single_bet_amount"
      clearable
      style="width: 350px"
    />
  </el-form-item>
  <el-form-item
    label="优惠最低充值金额"
    style="width: 500px"
    prop="min_deposit_amount"
    :rules="[
      {
        required: true,
        message: '优惠最低充值金额' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.min_deposit_amount"
      clearable
      style="width: 350px"
    />
  </el-form-item>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>各VIP等级包赔返利</span>
        <el-button type="primary" @click="addKey">
          <el-icon><plus /></el-icon
        ></el-button>
      </div>
    </template>
    <el-table :data="proxyForm.vip_arr" style="width: 100%" border>
      <el-table-column
        prop="level_name"
        label="VIP等级"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.level_name"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="cashback_percentage"
        label="包赔返利"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.cashback_percentage"
            style="width: 100px"
            type="text"
          >
            <template #append> % </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="limit_amount"
        label="包赔上限金额"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.limit_amount"
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
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span style="font-size: 12px; color: red">*赛事时间不能是同一天</span>
        <el-button type="primary" @click="addEventKey">
          <el-icon><plus /></el-icon
        ></el-button>
      </div>
    </template>
    <el-table :data="proxyForm.event_arr" style="width: 100%" border>
      <el-table-column prop="id" label="序号" min-width="160" align="center">
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.id"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="event_name"
        label="赛事名称"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.event_name"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="event_time"
        label="赛事时间"
        min-width="200"
        align="center"
      >
        <template #default="scope">
          <el-date-picker
            v-model="scope.row.event_time"
            type="datetime"
            style="width: 200px"
            :placeholder="$t('table.start_time')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="home_team_name"
        label="主队名称"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.home_team_name"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="home_team_logo"
        label="主队LOGO"
        min-width="200"
        align="center"
      >
        <template #default="scope">
          <NomalImageUpload
            @setImage="setHomeLogo(scope.$index)"
            formLabel=""
            :ref="`homeTeam${scope.$index}`"
            :data="scope.row.home_team_logo"
            imgkey="home_team_logo_id"
            :isRequire="false"
            imgUrlKey="home_team_logo"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="away_team_name"
        label="客队名称"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.away_team_name"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="away_team_logo"
        label="客队LOGO"
        min-width="200"
        align="center"
      >
        <template #default="scope">
          <NomalImageUpload
            @setImage="setAwayLogo(scope.$index)"
            formLabel=""
            :isRequire="false"
            :ref="`awayTeam${scope.$index}`"
            :data="scope.row.away_team_logo"
            imgkey="away_team_logo_id"
            imgUrlKey="away_team_logo"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.operate')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <el-button type="danger" @click="deleteEventKey(scope.$index)">{{
            $t('crud.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';

export default defineComponent({
  name: 'venue-compensation',
  components: {
    NomalImageUpload
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
          day_max_amount: null
        };
      }
    }
  },
  setup(prop) {
    const { proxy } = getCurrentInstance() as any;
    const dict = reactive({
      distribute_type_options: []
    });

    function addKey() {
      if (!prop.proxyForm.vip_arr) {
        prop.proxyForm.vip_arr = [];
      }
      prop.proxyForm.vip_arr.push({
        level_name: 0,
        total_valid: 0,
        amount: 0
      });
    }

    function deleteKey(index: number) {
      prop.proxyForm.vip_arr.splice(index, 1);
    }

    function addEventKey() {
      if (!prop.proxyForm.event_arr) {
        prop.proxyForm.event_arr = [];
      }
      const obj = Object.assign(
        { id: prop.proxyForm.event_arr.length + 1 },
        {
          event_name: null,
          event_time: null,
          home_team_name: null,
          home_team_logo: null,
          home_team_logo_id: null,
          away_team_name: null,
          away_team_logo: null,
          away_team_logo_id: null
        }
      );
      prop.proxyForm.event_arr.push(obj);
    }

    function deleteEventKey(index: number) {
      prop.proxyForm.event_arr.splice(index, 1);
    }

    function setHomeLogo(index: number) {
      const img = proxy.$refs[`homeTeam${index}`].getImgeInfo();
      console.log(img);
      console.log(index);
      console.log(prop.proxyForm.event_arr);
      prop.proxyForm.event_arr[index].home_team_logo = img.home_team_logo;
      prop.proxyForm.event_arr[index].home_team_logo_id = img.home_team_logo_id;
    }

    function setAwayLogo(index: number) {
      const img = proxy.$refs[`awayTeam${index}`].getImgeInfo();
      prop.proxyForm.event_arr[index].away_team_logo = img.away_team_logo;
      prop.proxyForm.event_arr[index].away_team_logo_id = img.away_team_logo_id;
    }

    onMounted(async () => {
      [dict.distribute_type_options] = await Promise.all([
        getDicts('distribute_type_options')
      ]);
    });
    return {
      ...toRefs(dict),
      addKey,
      deleteKey,
      setAwayLogo,
      addEventKey,
      setHomeLogo,
      deleteEventKey,
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
