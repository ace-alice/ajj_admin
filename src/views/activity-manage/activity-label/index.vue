<template>
  <div class="main-container">
    <crudOperation title="router.activity-label" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.event_title')">
          <el-input
            v-model.trim="crudQuery.header"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in universal_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.create_name')">
          <el-input
            v-model.trim="crudQuery.createName"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
          <el-input
            v-model.trim="crudQuery.updateName"
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
            prop="header"
            :label="$t('table.event_title')"
            min-width="160"
            align="center"
          />

          <el-table-column
            prop="remark"
            :label="$t('table.activity_tab_remark')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="status"
            :label="$t('table.status')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.header"
                :initValue="scope.row.status"
                :activeValue="1"
                :inactiveValue="2"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id,
                  status: scope.row.status
                }"
                paramKey="status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.change"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.create_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time')"
            min-width="160"
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
                @top="toTop(scope.row)"
                :rowData="scope.row"
                :permission="crudPermission"
              >
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-form-item
            :label="$t('table.event_title')"
            prop="header"
            :rules="[
              {
                required: true,
                message: $t('table.event_title') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.header"
              clearable
              :placeholder="$t('table.event_title')"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.activity_tab_remark')"
            prop="remark"
            :rules="[
              {
                required: true,
                message: $t('table.activity_tab_remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.remark"
              clearable
              :placeholder="$t('table.activity_tab_remark')"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-label';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus/lib/components';
import { ElNotification } from 'element-plus';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '标识',
  crudOptShow: {
    add: true,
    dragAble: false 
  },
  defaultQuery: {
    tag: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    tab: null,
    remark: null,
    status: 2
  },
  crudTag: 'activity:label:'
};

export default defineComponent({
  name: 'activity-tab-config',
  components: {
    crudOperation,
    udOperation,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      top: 'activity:tab:top',
      change: 'activity:tab:change',
      sort: 'activity:tab:sort'
    };

    const dict = reactive({
      universal_status_options: [],
      mark_type_options: []
    });

    const { getLabel } = dictionary();

    crud.crudHook.dragEnd = ({
      oldIndex,
      newIndex
    }: {
      oldIndex: number;
      newIndex: number;
    }) => {
      const formData: any = {
        p_value: 0,
        n_value: 0,
        m_value: (crud.crudData.value[oldIndex] as any)?.id
      };

      if (oldIndex == newIndex) return;

      if (newIndex > oldIndex) {
        formData.p_value = (crud.crudData.value[newIndex] as any)?.id;
        if (newIndex != crud.crudData.value.length - 1) {
          formData.n_value = (crud.crudData.value[newIndex + 1] as any)?.id;
        }
      } else {
        formData.n_value = (crud.crudData.value[newIndex] as any)?.id;
        if (newIndex != 0) {
          formData.p_value = (crud.crudData.value[newIndex - 1] as any)?.id;
        }
      }
      Api.sort(formData)
        .then((result: any) => {
          if (result.code == 1) {
            ElNotification.success(result.msg || result.message);
          } else {
            ElMessage.error(result.msg || result.message);
          }
        })
        .finally(() => {
          crud.toQuery();
        });
    };

    onMounted(async () => {
      [dict.universal_status_options] = await Promise.all([
        getDicts('universal_status_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      ...toRefs(dict),
      getLabel,
      otherPermission
    };
  }
});
</script>
