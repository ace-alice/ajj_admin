<template>
  <div class="assignment-details">
    <el-dialog
      v-model="assignmentDetailsDialog"
      :show-close="false"
      title="查看任务11"
    >
      <div class="assignment-details-main">
        <el-tabs v-model="assignmentDetailsActiveName" class="demo-tabs">
          <el-tab-pane label="任务信息" name="1">
            <div class="assignment-details-main-row row-one">
              <el-row>
                <el-col :span="5" class="title">任务名称</el-col>
                <el-col :span="7">
                  {{ assignmentDetailsObjTask.task_name }}
                </el-col>
                <el-col :span="5" class="title">输入用户总数</el-col>
                <el-col :span="7">
                  {{ assignmentDetailsObjTask.input_user }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="title">满足条件用户总数</el-col>
                <el-col :span="7">
                  {{ assignmentDetailsObjTask.good_user }}
                </el-col>
                <el-col :span="5"></el-col>
                <el-col :span="7"></el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="title">
                  <span>维护用户详情</span>
                  <span>（用户名标红表示该用户查询不到）</span>
                </el-col>
                <el-col
                  :span="19"
                  v-html="dealUserInfo(assignmentDetailsObjTask.user_info)"
                ></el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="指派详情" name="2">
            <div class="assignment-details-main-row row-two">
              <el-row>
                <el-col :span="24" class="title">
                  <div class="row-two-header">
                    <span>任务总数</span>
                    <span class="num">
                      {{ assignmentDetailsObjInfo.task_all }}
                    </span>
                    <span class="title-margin">已分配给</span>
                    <span class="num">
                      {{ assignmentDetailsObjInfo.distribute }}名
                    </span>
                    <span>售后人员</span>
                    <span class="title-margin">人均</span>
                    <span class="num">
                      {{ assignmentDetailsObjInfo.average }}个
                    </span>
                    <span>任务数</span>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">职员账号</el-col>
                <el-col :span="12">分配任务数</el-col>
              </el-row>
              <el-row
                v-for="(item, index) in assignmentDetailsObjInfo.admin"
                :key="index"
              >
                <el-col :span="12">{{ item.admin_name }}</el-col>
                <el-col :span="12">{{ item.distribute }}</el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="assignmentDetailsDialog = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  onUnmounted,
  reactive,
  toRefs
} from 'vue';
import Api from '@/api/tel-maintenance-manage/task-assignment';

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const state = reactive({
      /**
       * 查看详情弹窗状态
       */
      assignmentDetailsDialog: false,
      /**
       * 查看详情弹窗tabs默认选中
       */
      assignmentDetailsActiveName: '1',
      /**
       * 查看详情数据（任务信息）
       */
      assignmentDetailsObjTask: {},
      /**
       * 查看详情数据（指派详情）
       */
      assignmentDetailsObjInfo: {}
    });
    /**
     * 查看详情（任务分配）
     */
    const assignmentDetails = (id: number) => {
      Api.getInfo({ id: id })
        .then((res) => {
          state.assignmentDetailsObjInfo = res.data.data.detail;
          state.assignmentDetailsObjTask = res.data.data.task;
          console.warn('查看详情任务信息', state.assignmentDetailsObjTask);
          console.warn('查看详情指派详情', state.assignmentDetailsObjInfo);
        })
        .catch((err) => {
          console.log(err);
        });
      state.assignmentDetailsActiveName = '1';
      state.assignmentDetailsDialog = true;
    };
    /**
     * 处理查看详情=>任务信息=>维护用户详情（任务分配）
     */
    const dealUserInfo = (row: string) => {
      // eslint-disable-next-line no-eval
      const arr = eval(row);
      const newArr = [] as any;
      for (const i in arr) {
        if (arr[i].status === 1) {
          newArr.push(arr[i].username);
        } else {
          newArr.push(
            '<span style="color: #e03838;">' + arr[i].username + '</span>'
          );
        }
      }
      return newArr.join(',');
    };
    onMounted(() => {
      proxy.mittBus.on('openAssignmentDetails', (val: number) => {
        assignmentDetails(val);
      });
    });
    onUnmounted(() => {
      proxy.mittBus.off('openAssignmentDetails');
    });
    return {
      ...toRefs(state),
      dealUserInfo,
      assignmentDetails
    };
  }
});
</script>

<style lang="scss" scoped>
.assignment-details {
  &-main {
    :deep(.el-tabs__nav) {
      width: 100%;
    }
    :deep(.el-tabs__item) {
      width: 50%;
      text-align: center;
    }
    &-row {
      .title {
        flex-direction: column;
        font-size: 12px;
        font-weight: 500;
        color: #000;
        text-align: center;
      }
      :deep(.el-row:nth-child(1)) {
        .el-col {
          border-top: 1px solid #d7d1d1;
        }
      }
      :deep(.el-col) {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 40px;
        border-left: 1px solid #d7d1d1;
        border-bottom: 1px solid #d7d1d1;
      }
      :deep(.el-col:last-child) {
        border-right: 1px solid #d7d1d1;
      }
    }
    .row-one {
      :deep(.el-row:nth-child(3)) {
        .el-col {
          min-height: 80px;
        }
        span:nth-child(2) {
          color: #e03838;
        }
      }
    }
    .row-two {
      &-header {
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        line-height: 38px;
        .num {
          color: #e03838;
        }
        .title-margin {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
