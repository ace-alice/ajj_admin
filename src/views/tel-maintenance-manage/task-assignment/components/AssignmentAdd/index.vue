<template>
  <div>
    <el-steps
      class="task-step"
      :active="assignmentActive"
      align-center
      finish-status="success"
    >
      <el-step title="设置任务信息" />
      <el-step title="分配任务人员" />
    </el-steps>
    <el-form
      ref="crudDefaultForm"
      :model="proxyForm"
      label-width="140px"
      :rules="rules"
    >
      <!-- 设置任务信息 -->
      <div v-if="assignmentActive === StepEnum.PRIMARY">
        <el-row>
          <el-col :span="23">
            <el-form-item
              :label="$t('table.task_mission_name')"
              prop="task_name"
            >
              <el-input
                v-model.trim="proxyForm.task_name"
                :placeholder="$t('table.task_mission_name')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item
              :label="$t('table.task_allocation_information')"
              prop="import_user"
            >
              <el-input
                v-model.trim="proxyForm.import_user"
                :autosize="{ minRows: 3, maxRows: 4 }"
                type="textarea"
                show-word-limit
                placeholder="每个用户之间用回车隔开"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 分配任务人员 -->
      <div v-if="assignmentActive === StepEnum.CONFIRM">
        <el-row>
          <el-col :span="23">
            <el-form-item
              :label="$t('table.user_count_total')"
              prop="user_member"
            >
              <el-input
                v-model.trim="proxyForm.user_member"
                :placeholder="$t('table.user_count_total')"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23">
            <el-form-item label="分配任务">
              <el-tag class="average-button" effect="dark" @click="averageDuty">
                {{ proxyForm.distributeType }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item, key) in proxyForm.userMap" :key="key">
          <el-col :span="23">
            <el-form-item
              :label="operatorList.filter(c => c.admin_user_id == key)[0].username"
              :prop="`userMap.${key}`"
              :rules="[
                {
                  required: true,
                  message: operatorList.filter(c => c.admin_user_id == key)[0].username + $t('table.not_empty'),
                  trigger: 'blur'
                }
              ]"
            >
              <el-input
                type="number"
                v-model.trim="proxyForm.userMap[key]"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <el-row>
      <el-col :span="23" class="buttons-col" style="margin-top: 12px">
        <el-button
          v-if="assignmentActive === StepEnum.PRIMARY"
          @click="concelHandle"
        >
          取消
        </el-button>
        <el-button
          v-if="assignmentActive === StepEnum.PRIMARY"
          @click="assignmentNext"
        >
          下一步
        </el-button>
        <el-button
          v-if="assignmentActive === StepEnum.CONFIRM"
          @click="assignmentPrev"
        >
          上一步
        </el-button>
        <el-button
          v-if="assignmentActive === StepEnum.CONFIRM"
          @click="assignmentConfirm"
        >
          确定
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { available, add } from '@/api/tel-maintenance-manage/task-assignment';
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted
} from 'vue';
import { ElMessage } from 'element-plus/lib/components';
import { getOperatorListHook } from '@/hook/getOperatorList';

enum StepEnum {
  PRIMARY, // 设置任务信息
  CONFIRM // 分配任务人员
}

export default defineComponent({
  props: {
    proxyForm: {
      type: Object,
      default: () => {}
    }
  },
  setup(props: any, { emit }) {
    const { proxy } = <any>getCurrentInstance();
    const { $t } = proxy.$parent;
    const { operatorList } = getOperatorListHook();

    const rules: any = reactive({
      task_name: [
        {
          required: true,
          message: $t('table.task_mission_name') + $t('table.not_empty'),
          trigger: 'blur'
        }
      ],
      import_user: [
        {
          required: true,
          message:
            $t('table.task_allocation_information') + $t('table.not_empty'),
          trigger: 'blur'
        }
      ]
    });

    const state = reactive({
      proxyForm: {
        task_name: '',
        import_user: '',
        user_member: 0,
        distributeType: '平均分配',
        userMap: <any>{}
      }
    });
    const assignmentActive = ref(StepEnum.PRIMARY);

    function concelHandle() {
      proxy.mittBus.emit('closeCrudDialog', () => {
        assignmentActive.value = StepEnum.PRIMARY;
        proxy.$refs['crudDefaultForm'].resetFields();
      });
    }

    //  上一步
    const assignmentPrev = () => {
      if (assignmentActive.value > StepEnum.PRIMARY) {
        assignmentActive.value = StepEnum.PRIMARY;
      }
      return;
    };

    function averageDuty() {
      const rest = state.proxyForm.user_member % operatorList.value.length;
      const aver =
        (state.proxyForm.user_member - rest) / operatorList.value.length;
      Object.keys(state.proxyForm.userMap).map((item, index) => {
        state.proxyForm.userMap[item] = aver;
        if (index + 1 <= rest) {
          state.proxyForm.userMap[item] = aver + 1;
        } else {
          state.proxyForm.userMap[item] = aver;
        }
      });
    }

    // 下一步
    function assignmentNext() {
      if (operatorList.value.length === 0) {
        ElMessage.error('没有可分配的操作员，请先添加操作员！');
        return;
      } else {
        state.proxyForm.userMap = {};
        operatorList.value.forEach((item: any) => {
          state.proxyForm.userMap[item.admin_user_id] = null;
        });
      }
      proxy.$refs.crudDefaultForm.validate(async (valid: Boolean) => {
        if (valid) {
          await checkAvailable();
        }
      });
      return;
    }

    async function checkAvailable() {
      const { code, msg, data, message } = await (<any>available({
        import_user: state.proxyForm.import_user
      }));
      if (code === 1) {
        state.proxyForm.user_member = data.user_number;
        if (data.user_number === 0) {
          ElMessage.error('当前没有可分配的用户数！');
          return;
        }
        if (assignmentActive.value < StepEnum.CONFIRM) {
          assignmentActive.value = StepEnum.CONFIRM;
        }
      } else {
        ElMessage.error(msg || message);
      }
    }

    function assignmentConfirm() {
      proxy.$refs.crudDefaultForm.validate(async (valid: Boolean) => {
        if (valid) {
          let sum = 0;
          Object.keys(state.proxyForm.userMap).forEach((item) => {
            sum += Number(state.proxyForm.userMap[item]) || 0;
          });
          if (sum === state.proxyForm.user_member) {
            await doCommit();
          } else {
            ElMessage.error('可用用户数量与分配任务数总和不相等！');
          }
        }
      });
    }

    async function doCommit() {
      const params = {
        task_name: state.proxyForm.task_name,
        import_user: state.proxyForm.import_user,
        distribute_info: JSON.stringify(state.proxyForm.userMap),
        user_member: state.proxyForm.user_member
      };
      const { data, code, msg } = await (<any>add(params));
      if (code === 1) {
        proxy.$refs['crudDefaultForm'].resetFields();
        proxy.mittBus.emit('refreshList');
        concelHandle();
      } else {
        ElMessage.error(msg);
      }
    }

    onMounted(async () => {
      // 非新增初始化数据
      if (props.proxyForm.import_user) {
        state.proxyForm.task_name = props.proxyForm.task_name;
        let import_user = JSON.parse(props.proxyForm.import_user);
        import_user.map((item: any, index: number) => {
          if (index < import_user.length - 1) {
            state.proxyForm.import_user += `${item.username}\n`;
          } else {
            state.proxyForm.import_user += item.username;
          }
        });
        state.proxyForm.user_member = props.proxyForm.user_member;
        state.proxyForm.userMap = JSON.parse(props.proxyForm.distribute_info);
      }
    })

    return {
      ...toRefs(state),
      assignmentActive,
      concelHandle,
      StepEnum,
      rules,
      operatorList,
      averageDuty,
      assignmentPrev,
      assignmentConfirm,
      assignmentNext
    };
  }
});
</script>

<style lang="scss" scoped>
.task-step {
  :deep(.el-step__icon-inner) {
    font-size: 18px !important;
    svg {
      font-size: 18px;
    }
  }
}
:deep(.el-form-item) {
  width: 100%;
}
.buttons-col {
  display: flex;
  justify-content: flex-end;
}
.average-button {
  cursor: pointer;
}
</style>
