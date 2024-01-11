<template>
  <div class="main-container">
    <crudOperation title="router.site-message-config" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.letter_header')">
          <el-input
            v-model.trim="crudQuery.title"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.send_type')">
          <el-select
            v-model="crudQuery.send_type"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in site_message_send_type_options"
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
            :label="$t('table.letter_header')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="content"
            :label="$t('table.content')"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <el-popover
                placement="top-start"
                :width="200"
                trigger="click"
                :content="scope.row.content"
              >
                <template #reference>
                  <el-button>{{ $t('table.see_details') }}</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="send_type"
            :label="$t('table.send_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{
                getLabel(scope.row.send_type, site_message_send_type_options)
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="send_user"
            label="发送对象详情"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <el-popover
                placement="top-start"
                :width="200"
                trigger="click"
                :content="scope.row.send_user"
              >
                <template #reference>
                  <el-button>{{ $t('table.see_details') }}</el-button>
                </template>
              </el-popover>
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
            :label="$t('table.operate')"
            min-width="120"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @recall="toRecall({ id: scope.row.id })"
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
            :label="$t('table.letter_header')"
            prop="title"
            :rules="[
              {
                required: true,
                message: $t('table.letter_header') + $t('table.not_empty')
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
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in markList"
                :key="item.id"
                :label="item.tag_name"
                :value="item.id"
                :disabled="item.is_disable == 2"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.send_type')" prop="send_type">
            <el-select
              v-model="proxyForm.send_type"
              popper-class="user-select"
              style="width: 200px"
              @change="sendTypeChange"
            >
              <el-option
                v-for="item in site_message_send_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.send_user')"
            prop="send_user"
            v-if="proxyForm.send_type == 1"
            :rules="[
              {
                required: true,
                message: $t('table.send_user') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.send_user"
              maxlength="200"
              style="width: 200px"
              :placeholder="$t('table.user_ids_pl')"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/market-manage/site-message-config';
import { computed, defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { getDicts } from '@/utils/dictApi';
import { getMarkListHook } from '@/hook/getMarkList';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '站内信',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    title: null,
    send_type: null,
    create_name: null,
    update_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    title: null,
    letter_logo_id: null,
    content: null,
    send_type: null,
    send_user: null,
    time_type: null,
    user_ids: ''
  },
  crudTag: 'market:site:'
};

export default defineComponent({
  name: 'site-message-config',
  components: {
    crudOperation,
    dateTimePickerQuery,
    udOperation
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { markList } = getMarkListHook({ tag_type: 2 });

    const { getLabel } = dictionary();

    const dict = reactive({
      site_message_send_type_options: [],
      terminal_type_options: [],
      site_send_user_options: []
    });

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.id;
    });

    onMounted(async () => {
      [
        dict.site_message_send_type_options,
        dict.terminal_type_options,
        dict.site_send_user_options
      ] = await Promise.all([
        getDicts('site_message_send_type_options'),
        getDicts('terminal_type_options'),
        getDicts('site_send_user_options')
      ]);
    });

    function sendTypeChange() {
      crud.proxyForm.user_ids = null;
      crud.proxyForm.send_user = null;
    }

    function sendUserChange() {
      crud.proxyForm.user_ids = null;
    }

    return {
      ...crud,
      operateId,
      ...toRefs(dict),
      sendTypeChange,
      markList,
      getLabel,
      sendUserChange
    };
  }
});
</script>
