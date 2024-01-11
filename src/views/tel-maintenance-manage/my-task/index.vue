<template>
  <div class="main-container">
    <crudOperation title="router.my-task">
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
        <el-form-item :label="$t('table.last_visitor')">
          <el-input
            v-model.trim="crudQuery.last_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.owner_task')">
          <el-input
            v-model.trim="crudQuery.this_name"
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
            min-width="120"
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
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="email"
            :label="$t('table.contact_no')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.email ? `${scope.row.email},` : ''
              }}{{ scope.row.phone || '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="last_name"
            :label="$t('table.last_visitor')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.last_visitor_time')"
            min-width="120"
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
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="recall_remark"
            :label="$t('table.remark')"
            min-width="200"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
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
              <el-button type="text" @click="viewDetail(scope.row)">
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
import Api from '@/api/tel-maintenance-manage/my-task';
import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { i18n } from '@/i18n';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import { useRouter } from 'vue-router';
import { dictionary } from '@/hook/lib';
const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('table.task'),
  crudOptShow: {
    add: true,
    formSize: '60%',
    hideFooter: false
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
  crudTag: 'recall:mytask:'
};

export default defineComponent({
  name: 'my-task',
  components: { crudOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();
    const dict = reactive({
      task_list_status_options: []
    });

    function handleRecall(row: any) {
      router.push({
        name: 'task-detail',
        query: { id: row.id, type: 'recall', taskName: row.task_name }
      });
    }

    const router = useRouter();
    // 跳转到详情页面
    function viewDetail(row: any) {
      router.push({ name: 'task-detail', query: { id: row.id } });
    }

    onMounted(async () => {
      [dict.task_list_status_options] = await Promise.all([
        getDicts('task_list_status_options')
      ]);
    });

    return { ...crud, ...toRefs(dict), handleRecall, viewDetail, getLabel };
  }
});
</script>
