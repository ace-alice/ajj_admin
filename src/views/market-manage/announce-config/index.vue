<template>
  <div class="main-container">
    <crudOperation title="router.announce-config" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.announcement_title')">
          <el-input
            v-model.trim="crudQuery.title"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.header_name')">
          <el-select
            v-model="crudQuery.tag_id"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in markList"
              :key="item.id"
              :label="item.tag_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.terminal_type')">
          <el-select
            v-model="crudQuery.terminal_id"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in terminal_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.time_type')">
          <el-select
            v-model="crudQuery.time_limit"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in is_time_limit_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            v-model.trim="crudQuery.create_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
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
            prop="title"
            :label="$t('table.title')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="content"
            :label="$t('table.content')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="tag_name"
            :label="$t('table.header_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="terminal_id"
            :label="$t('table.terminal_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getTerminal(scope.row.terminal_id) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="time_limit"
            :label="$t('table.time_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.time_limit, is_time_limit_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="launch_time"
            :label="$t('table.up_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="finish_time"
            :label="$t('table.down_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.time_limit === 1 ? '-' : scope.row.finish_time }}
            </template>
          </el-table-column>
          <el-table-column
            prop="is_disable"
            :label="$t('table.status')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.title"
                :activeValue="1"
                :inactiveValue="2"
                :initValue="scope.row.is_disable"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id
                }"
                paramKey="is_disable"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.status"
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
            min-width="220"
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
            :label="$t('table.announcement_title')"
            prop="title"
            :rules="[
              {
                required: true,
                message: $t('table.announcement_title') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.title"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.content')"
            prop="content"
            :rules="[
              {
                required: true,
                message: $t('table.content') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.content"
              maxlength="200"
              style="width: 200px"
              :placeholder="$t('table.content')"
              show-word-limit
              type="textarea"
            />
          </el-form-item>

          <el-form-item
            :label="$t('table.header_name')"
            prop="tag_id"
            :rules="[
              {
                required: true,
                message: $t('table.header_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.tag_id"
              @change="selectTag"
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in markList"
                :key="item.id"
                :label="item.tag_name"
                :disabled="item.is_disable == 2"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('table.send_app')"
            prop="terminal_arr"
            :rules="[
              {
                required: true,
                message: $t('table.send_app') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.terminal_arr"
              popper-class="user-select"
              style="width: 200px"
              multiple
            >
              <el-option
                v-for="item in terminal_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('table.time_type')"
            prop="time_limit"
            :rules="[
              {
                required: true,
                message: $t('table.time_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.time_limit"
              clearable
              popper-class="user-select"
              style="width: 200px"
              @change="changeTimeType"
            >
              <el-option
                v-for="item in is_time_limit_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_effective_time')"
            prop="launch_time"
            v-if="proxyForm.time_limit == 1"
            :rules="[
              {
                required: true,
                message: $t('table.time') + $t('table.not_empty')
              }
            ]"
          >
            <el-date-picker
              v-model="proxyForm.launch_time"
              type="datetime"
              value-format="YYYY-MM-DD hh:mm:ss"
              :placeholder="$t('table.up_time')"
              style="width: 200px"
            />
          </el-form-item>
          <!-- v-if="proxyForm.time_limit == 2" -->
          <el-form-item
            :label="$t('table.banner_effective_time')"
            prop="launch_time"
            v-if="proxyForm.time_limit == 2"
            :rules="[
              {
                required: true,
                message: $t('table.time') + $t('table.not_empty')
              }
            ]"
          >
            <dateTimePickerQuery
              :propTime="[proxyForm.launch_time, proxyForm.finish_time]"
              @setTime="setTheForm"
              :isQueryForm="false"
              startKey="launch_time"
              endKey="finish_time"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/market-manage/announce-config';
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { getDicts } from '@/utils/dictApi';
import { getMarkListHook } from '@/hook/getMarkList';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '公告',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    announcement_title: null,
    tag_id: null,
    terminal_id: null,
    time_limit: null,
    status: null,
    create_name: null,
    update_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    announcement_title: null,
    content: null,
    tag_id: null,
    tag_name: null,
    terminal_arr: [],
    time_limit: null,
    launch_time: null,
    finish_time: null
  },
  crudTag: 'market:announce:'
};

export default defineComponent({
  name: 'announce-config',
  components: {
    crudOperation,
    dateTimePickerQuery,
    udOperation,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { markList } = getMarkListHook({ type: 1 });

    const { getLabel } = dictionary();

    const dict = reactive({
      is_time_limit_options: [],
      universal_status_options: [],
      terminal_type_options: []
    });

    const otherPermission = reactive({
      status: 'market:announce:change'
    });

    crud.crudHook.beforeToEdit = (form: any) => {
      form.mark_id = form.bid;
      return true;
    };

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.id;
    });

    let proxySelectedTag = { tag_name: null, tag_id: null };
    function selectTag(val: any) {
      proxySelectedTag = markList.value.filter(
        (item: any) => item.id === val
      )[0];
    }

    crud.crudHook.beforeValidateCU = (form: any) => {
      debugger
      Object.assign(form, {
        terminal_id: form.terminal_arr.join(','),
        tag_name: proxySelectedTag.tag_name
      });
      return true;
    };

    crud.crudHook.beforeToEdit = (form: any) => {
      const t_arr = (form.terminal_id + '').split(',').map((item: any) => Number(item));
      Object.assign(form, {
        terminal_arr: t_arr
      });
      return true;
    };

    function getTerminal(terminal: string) {
      const arr = (terminal + '').split(',');
      let strArr: any = [];
      arr.map((k: string) => {
        strArr.push(getLabel(k, dict.terminal_type_options));
      });
      return strArr.length > 0 ? strArr.join(',') : '-';
    }

    onMounted(async () => {
      [
        dict.is_time_limit_options,
        dict.universal_status_options,
        dict.terminal_type_options
      ] = await Promise.all([
        getDicts('is_time_limit_options'),
        getDicts('universal_status_options'),
        getDicts('terminal_type_options')
      ]);
      console.log(dict);
    });

    function changeTimeType() {
      crud.proxyForm.launch_time = null;
      crud.proxyForm.finish_time = null;
    }

    return {
      ...crud,
      operateId,
      ...toRefs(dict),
      changeTimeType,
      markList,
      selectTag,
      getTerminal,
      getLabel,
      otherPermission
    };
  }
});
</script>
