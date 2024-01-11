<template>
  <div class="main-container">
    <crudOperation title="router.task-assignment">
      <template #query>
        <el-form-item :label="$t('table.task_id')">
          <el-input
            v-model.trim="crudQuery.task_order"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.task_mission_name')">
          <el-input
            v-model.trim="crudQuery.task_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.task_founder')">
          <el-input
            v-model.trim="crudQuery.create_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.task_last_operator')">
          <el-input
            v-model.trim="crudQuery.update_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="task_order"
            :label="$t('table.task_id')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="task_name"
            :label="$t('table.task_mission_name')"
            min-width="120"
            align="center"
          />
           <el-table-column
            prop="task_status"
            :label="$t('table.bet_state')"
            min-width="150"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.task_name"
                :initValue="scope.row.task_status"
                :activeValue="1"
                :inactiveValue="2"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id,
                  task_status: scope.row.task_status
                }"
                paramKey="task_status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.change"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.task_founder')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.task_creation_time')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.task_last_operator')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.task_last_operator_time')"
            min-width="180"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="260"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ id: scope.row.id })"
                :permission="crudPermission"
              >
              </udOperation>
              <el-button type="text" @click="assignmentDetails(scope.row.id)">
                <el-icon>
                  <search />
                </el-icon>
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #form>
        <AssignmentAdd v-if="dialogVisible" :proxyForm="proxyForm" />
      </template>
    </crudOperation>
    <!--查看详情开始-->
    <AssignmentDetails />
    <!--查看详情结束-->
  </div>
</template>

<script lang="ts">
import Api from '@/api/tel-maintenance-manage/task-assignment';
import { defineComponent, getCurrentInstance, onMounted, onUnmounted, reactive, ref, toRefs, watch } from 'vue';
import { Search, Close, Check } from '@element-plus/icons-vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import AssignmentDetails from './components/AssignmentDetails/index.vue';
import AssignmentAdd from './components/AssignmentAdd/index.vue';
import { ElMessage } from 'element-plus/lib/components';
import { getDicts } from '@/utils/dictApi';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.task'),
  crudOptShow: {
    add: true,
    formSize: '880px',
    hideFooter: true
  },
  defaultQuery: {
    task_order: null,
    task_name: null,
    create_name: null,
    action_name: null
  },
  crudMethod: { ...Api },
  crudTableParams: 'data',
  defaultForm: {
    task_order: null,
    task_name: null,
    create_name: null,
    action_name: null,
    import_user: null,
    distribute_info: null,
    sort: 1
  },
  crudTag: 'recall:assignment:'
};

export default defineComponent({
  name: 'task-assignment',
  components: {
    crudOperation,
    udOperation,
    Search,
    Close,
    Check,
    AssignmentDetails,
    PromiseSwitch,
    AssignmentAdd
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { proxy } = getCurrentInstance() as any;
    const dialogVisible = ref(false)
    /**
     * 查看详情（任务分配）
     */
    const assignmentDetails = (id: number) => {
      proxy.mittBus.emit('openAssignmentDetails', id);
    };

    const dict = reactive({
      universal_status_options: []
    });

    const otherPermission = {
      change: 'recall:assignment:change'
    };

    watch(
      () => crud.crudStatus.cu,
      (newVal) => {
        dialogVisible.value = newVal > 0;
      }
    );

    onMounted(async() => {
      [dict.universal_status_options] = await Promise.all([
        getDicts('universal_status_options')
      ]);
      proxy.mittBus.on('refreshList', () => {
        crud.refresh();
      })
    })

    onUnmounted(() => {
      proxy.mittBus.off('refreshList')
    })

    return {
      ...crud,
      ...toRefs(dict),
      dialogVisible,
      otherPermission,
      assignmentDetails
    };
  }
});
</script>
<style lang="scss" scoped>
:deep(.btn-margin) {
  margin-right: 20px;
}
</style>
