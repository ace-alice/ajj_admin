<template>
  <div class="main-container">
    <crudOperation
      title="router.announcement-manage"
      labelWidth="120px"
      ref="crudOperation"
    >
      <template #query>
        <el-form-item :label="$t('table.username')">
          <el-select
            v-model="crudQuery.username"
            style="width: 200px"
            popper-class="user-select"
            filterable
            clearable
          >
            <el-option
              v-for="item in operatorList"
              :key="item.admin_user_id"
              :label="item.username"
              :value="item.username"
            >
              <span style="float: left">{{ item.username }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >{{ item.admin_user_id }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_open')">
          <el-select
            v-model="crudQuery.is_open"
            clearable
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.title')">
          <el-input v-model.trim="crudQuery.title" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.announcement_type')">
          <el-select
            v-model="crudQuery.type"
            clearable
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in announcementType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.intro')">
          <el-input
            v-model.trim="crudQuery.intro"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.content')">
          <el-input
            v-model.trim="crudQuery.content"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.create_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="start_time"
            endKey="end_time"
            :propTime="[crudQuery.start_time, crudQuery.end_time]"
          />
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="member_id"
          max-height="600px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="is_open"
            :label="$t('table.is_open')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.title"
                :initValue="scope.row.is_open"
                :options="isNot"
                :defaultParam="{
                  ids: [scope.row.admin_notice_id],
                  is_open: scope.row.is_open
                }"
                paramKey="is_open"
                :changeFun="changeStatus"
                emitFunName="isOpen"
                :permission="otherPermission.isOpen"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            :label="$t('table.title')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <span :style="{ color: scope.row.color }">{{
                scope.row.title
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="$t('table.announcement_type')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="intro"
            :label="$t('table.intro')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="content"
            :label="$t('table.content')"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="username"
            :label="$t('table.username')"
            min-width="100"
            align="center"
          />
          <el-table-column
            prop="open_time_start"
            :label="$t('table.start_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="open_time_end"
            :label="$t('table.end_time')"
            min-width="160"
            align="center"
          />

          <el-table-column
            :label="$t('table.operate')"
            min-width="180"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @del="toDel({ ids: [scope.row.admin_notice_id] })"
                :permission="crudPermission"
              >
                <template #right>
                  <el-button type="text" v-only="otherPermission.top">{{
                    $t('table.top')
                  }}</el-button>
                </template>
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
            :label="$t('table.title')"
            prop="title"
            :rules="[
              {
                required: true,
                message: $t('table.title') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.title"
              :placeholder="$t('table.title')"
              style="width: 200px"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.title_color')" prop="color">
            <el-color-picker
              v-model="proxyForm.color"
              style="width: 200px"
            ></el-color-picker>
          </el-form-item>
          <el-form-item :label="$t('table.announcement_type')" prop="type">
            <el-select
              v-model="proxyForm.type"
              clearable
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in announcementType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.intro')" prop="intro">
            <el-input
              type="textarea"
              style="width: 200px"
              clearable
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model.trim="proxyForm.intro"
            >
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('table.content')" prop="content">
            <el-input
              type="textarea"
              style="width: 200px"
              clearable
              :autosize="{ minRows: 2, maxRows: 4 }"
              v-model.trim="proxyForm.content"
            >
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('table.is_open')" prop="is_open">
            <el-switch
              v-model="proxyForm.is_open"
              style="width: 200px"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.sort')" prop="sort">
            <el-input-number
              v-model="proxyForm.sort"
              style="width: 200px"
              :step="1"
              step-strictly
              :min="0"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.announcement_time')"
            prop="announcement_time"
          >
            <dateTimePickerQuery
              @setTime="crudSetProxyFormKey"
              :isQueryForm="false"
              :propTime="[proxyForm.open_time_start, proxyForm.open_time_end]"
              startKey="open_time_start"
              endKey="open_time_end"
            />
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/system-manage/announcement-manage';
import { defineComponent, getCurrentInstance, onActivated, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { useRouter } from 'vue-router';
import { getOperatorListHook } from '@/hook/getOperatorList';
import { dictionary } from '@/hook/lib';
import { i18n } from '@/i18n';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: i18n.global.t('router.announcement-manage'),
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  defaultQuery: {
    admin_notice_id: null,
    admin_user_id: null,
    username: null,
    is_open: null,
    title: null,
    intro: null,
    type: null,
    content: null,
    start_time: null,
    end_time: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    admin_notice_id: null,
    color: null,
    username: null,
    is_open: null,
    title: null,
    intro: null,
    type: null,
    content: null,
    open_time_start: null,
    open_time_end: null,
    sort: null
  },
  crudTag: 'announcement:manage:'
};

export default defineComponent({
  name: 'announcement-manage',
  components: {
    crudOperation,
    udOperation,
    dateTimePickerQuery,
    PromiseSwitch
  },
  setup() {
    const { proxy } = getCurrentInstance() as any;
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      editUserInfo: 'user:info:edit',
      isOpen: 'announcement:manage:isOpen'
    };

    const router = useRouter();

    const { operatorList } = getOperatorListHook();

    const { isNot, announcementType, getLabel } = dictionary();

    // 跳转到会员编辑页面
    function toPath(row: any) {
      router.push({ name: 'user-info-edit' });
    }

    onActivated(() => {
      console.log('onActivated');
      proxy.$refs['crudOperation'].$forceUpdate();
    });

    return {
      ...crud,
      toPath,
      otherPermission,
      operatorList,
      isNot,
      announcementType
    };
  }
});
</script>

<style lang="scss">
.user-select {
  min-width: 200px !important;
}
</style>
