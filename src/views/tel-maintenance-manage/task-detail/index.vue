<template>
  <div class="recall main-container">
    <div class="recall-info">
      <h2 class="recall__title">会员账号信息</h2>
      <div class="recall-info__content">
        <div class="member-info__unit">
          <h4>{{ $t('table.bet_username') }}</h4>
          <p>{{ taskDetail.user.account_name }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.name') }}</h4>
          <p>{{ taskDetail.user.username }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.account_type') }}</h4>
          <p>{{ getLabel(taskDetail.user.is_agent, account_type_options) }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.account_status') }}</h4>
          <p>{{ taskDetail.user.status }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.vip_level') }}</h4>
          <p>{{ taskDetail.user.vip_level }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.danger_level') }}</h4>
          <p>{{ taskDetail.user.risk }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.days_without_deposit') }}</h4>
          <p>{{ taskDetail.user.not_save }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.superior_username') }}</h4>
          <p>{{ taskDetail.user.agent_name }}</p>
        </div>
        <div class="member-info__unit col-2">
          <h4>{{ $t('table.first_deposit_time') }}</h4>
          <p>{{ taskDetail.user.first_deposit_time }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.first_deposit_amount') }}</h4>
          <p>{{ taskDetail.user.first_deposit_amount }}</p>
        </div>
        <div class="member-info__unit col-2">
          <h4>{{ $t('table.login_time') }}</h4>
          <p>{{ taskDetail.user.login_time }}</p>
        </div>
        <div class="member-info__unit col-2">
          <h4>{{ $t('table.create_time_1') }}</h4>
          <p>{{ taskDetail.user.create_time }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.register_ip') }}</h4>
          <p>{{ taskDetail.user.reg_ip }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.register_device') }}</h4>
          <p>
            {{ getLabel(taskDetail.user.reg_terminal, terminal_type_options) }}
          </p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.phone') }}</h4>
          <p>{{ taskDetail.user.phone }}</p>
        </div>
        <div class="member-info__unit">
          <h4>{{ $t('table.email') }}</h4>
          <p>{{ taskDetail.user.email }}</p>
        </div>
      </div>
    </div>
    <div class="recall-list" v-if="taskType !== 'recall'">
      <h2 class="recall__title">回访信息</h2>
      <el-table
        :data="taskDetail.history.data"
        v-loading="queryLoading"
        stripe
        row-key="id"
        highlight-current-row
        :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
      >
        <el-table-column
          prop="create_time"
          :label="$t('table.recall_time')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="task_name"
          :label="$t('table.recall_task_name')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="admin_name"
          :label="$t('table.recall_visitor')"
          min-width="140"
          align="center"
        />
        <el-table-column
          prop="recall_status"
          :label="$t('table.recall_status')"
          min-width="140"
          align="center"
        >
          <template #default="scope">
            {{ getLabel(scope.row.recall_status, task_list_status_options) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="recall_remark"
          :label="$t('table.remark')"
          min-width="140"
          align="center"
        />
      </el-table>
    </div>
    <div class="recall-form" v-if="taskType === 'recall'">
      <h2 class="recall__title">回访</h2>
      <el-form
        ref="crudDefaultForm"
        :inline="true"
        :model="proxyForm"
        label-width="160px"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('table.task_mission_name')"
            >
              <el-input disabled v-model.trim="proxyForm.task_name" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('table.recall_status')"
              prop="recall_status"
              :rules="[
                {
                  required: true,
                  message: $t('table.event_time') + $t('table.not_empty')
                }
              ]"
            >
              <el-select
                v-model="proxyForm.recall_status"
                popper-class="user-select"
                clearable
              >
                <el-option
                  v-for="item in task_list_status_options"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item
              :label="$t('table.remark')"
              prop="recall_remark"
              :rules="[
                {
                  required: true,
                  message: $t('table.remark') + $t('table.not_empty')
                }
              ]"
            >
              <el-input
                v-model.trim="proxyForm.recall_remark"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                show-word-limit
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="submit-wrap">
          <el-button type="primary" @click="doSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { getDayTaskInfo } from '@/api/tel-maintenance-manage/daily-task-list';
import { myTaskVisit } from '@/api/tel-maintenance-manage/my-task';

import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { ElMessage } from 'element-plus/lib/components';
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  reactive,
  toRefs,
  getCurrentInstance,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'task-detail',
  components: {},
  setup(props, { emit }) {
    const route = useRoute();
    const router = useRouter();
    const { proxy } = <any>getCurrentInstance();
    const { getLabel } = dictionary();

    let taskDetail = reactive({
      user: {},
      history: []
    });

    let proxyForm = reactive({
      id: route.query.id,
      task_name: route.query.taskName,
      recall_status: 0,
      recall_remark: ''
    });

    let dict = reactive({
      terminal_type_options: [],
      account_type_options: [], // 会员账号类型
      task_list_status_options: [] // 任务列表状态
    });

    let taskType = ref(route.query.type);

    async function getDetail() {
      const params = { id: route.query.id };
      const { data, code, msg } = await (<any>getDayTaskInfo(params));
      if (code === 1) {
        taskDetail.user = data.user;
        taskDetail.history = data.history;
      } else {
        ElMessage.error(msg);
      }
    }

    function doSubmit() {
        proxy.$refs.crudDefaultForm.validate(async (valid: Boolean) => {
           if (valid) {
               const { data, code, msg } = await <any>myTaskVisit(proxyForm)
               if (code === 1) {
                   ElMessage.success(msg);
                   router.back()
               } else {
                   ElMessage.error(msg);
               }
           }
        })
    }

    onMounted(async () => {
      getDetail();
      [
        dict.account_type_options,
        dict.terminal_type_options,
        dict.task_list_status_options
      ] = await Promise.all([
        getDicts('account_type_options'),
        getDicts('terminal_type_options'),
        getDicts('task_list_status_options')
      ]);
    });

    return {
      ...toRefs(dict),
      proxyForm,
      taskType,
      getLabel,
      doSubmit,
      taskDetail
    };
  }
});
</script>

<style lang="scss" scoped>
.recall {
  height: calc(100vh - 124px);
  padding: 20px;
}
.recall__title {
  font-size: 20px;
  line-height: 44px;
  margin-top: 6px;
}
.member-info__unit {
  text-align: center;
  width: 140px;
  border: 1px solid #d9d9d9;
  &.col-2 {
    width: 280px;
  }
  h4 {
    margin: 0;
    font-size: 15px;
    height: 36px;
    line-height: 36px;
    background-color: #f2f2f2;
    border-bottom: 1px solid #d9d9d9;
  }
  p {
    height: 40px;
    font-size: 15px;
    line-height: 40px;
  }
}
.recall-info__content {
  display: flex;
  flex-wrap: wrap;
  width: max-content;
  max-width: 100%;
}
:deep(.el-form-item) {
    width: 100%;
}
.submit-wrap {
    padding-left: 160px;
}
</style>


