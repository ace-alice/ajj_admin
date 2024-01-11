<template>
  <div class="main-container">
    <crudOperation title="router.daily-task-list">
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
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
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
        <el-form-item :label="$t('table.this_name')">
          <el-input
            v-model.trim="crudQuery.this_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.last_name')">
          <el-input
            v-model.trim="crudQuery.last_name"
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
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.bet_username')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="account_name"
            :label="$t('table.name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="register_time"
            :label="$t('table.create_time_1')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="last_name"
            :label="$t('table.last_visitor')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.last_visitor_time')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="status"
            :label="$t('table.status')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.recall_status, task_list_status_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="this_name"
            :label="$t('table.owner_task')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="recall_time"
            :label="$t('table.this_visit_time')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="recall_remark"
            :label="$t('table.remark')"
            min-width="200"
            align="center"
          />
          <el-table-column
            :label="$t('table.see_details')"
            min-width="240"
            fixed="right"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.recall_status === 0"
                type="text"
                @click="handleRecall(scope.row)"
              >
                <el-icon>
                  <View />
                </el-icon>
                回访
              </el-button>
              <el-button
                type="text"
                v-only="otherPermission.detail"
                @click="viewDetail(scope.row)"
              >
                <el-icon>
                  <search />
                </el-icon>
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/tel-maintenance-manage/daily-task-list';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';
import { useRouter } from 'vue-router';
const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.task'),
  crudOptShow: {},
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
  crudTag: 'recall:dailytask:'
};

export default defineComponent({
  name: 'daily-task-list',
  components: { crudOperation, udOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel } = dictionary();

    const otherPermission = {
      detail: 'recall:dailytask:detail'
    };

    const dict = reactive({
      task_list_status_options: []
    });

    const router = useRouter();
    // 跳转到详情页面
    function viewDetail(row: any) {
      router.push({ name: 'task-detail', query: { id: row.id } });
    }

    function handleRecall(row: any) {
      router.push({
        name: 'task-detail',
        query: { id: row.id, type: 'recall', taskName: row.task_name }
      });
    }

    onMounted(async () => {
      [dict.task_list_status_options] = await Promise.all([
        getDicts('task_list_status_options')
      ]);
    });

    return {
      ...crud,
      getLabel,
      handleRecall,
      viewDetail,
      otherPermission,
      ...toRefs(dict)
    };
  }
});
</script>
