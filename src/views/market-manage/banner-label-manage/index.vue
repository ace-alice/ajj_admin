<template>
  <div class="main-container">
    <crudOperation title="" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.banner_title')">
          <el-input
            v-model.trim="crudQuery.banner_tag_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.banner_tag_status"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in statusList"
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
            prop="banner_tag_name"
            :label="$t('table.banner_label') /**banner标签 */"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="banner_tag_desc"
            :label="$t('table.remark') /**备注 */"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="banner_tag_status"
            :label="$t('table.status') /**状态 */"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.banner_tag_status"
                :activeValue="1"
                :inactiveValue="2"
                :initValue="scope.row.banner_tag_status"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id
                }"
                paramKey="banner_tag_status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.status"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.task_founder') /**创建人 */"
            min-width="120"
            align="center"
          />

          <el-table-column
            prop="create_time"
            :label="$t('table.create_time') /**创建时间 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name') /**最近操作人 */"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time') /**最近操作时间 */"
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
      <!-- 新增 -->
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-form-item
            :label="$t('table.banner_title')"
            prop="banner_tag_name"
            :rules="[
              {
                required: true,
                message: $t('table.banner_title') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.banner_tag_name"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.remark')"
            prop="banner_tag_desc"
            :rules="[
              {
                required: true,
                message: $t('table.remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.banner_tag_desc"
              maxlength="200"
              style="width: 200px"
              :placeholder="$t('table.remark')"
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
import Api from '@/api/market-manage/banner-label-manage';
import { defineComponent, reactive, toRefs, onMounted } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'banner标签',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    id: '', // 标签id
    banner_tag_name: '', // 标签名称
    banner_tag_status: 1, // 标签状态
    create_name: '', // 创建人
    update_name: '' // 操作人
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: '', // 标签id
    banner_tag_name: '', // 标签名称
    banner_tag_status: 1, // 标签状态
    create_name: '', // 创建人
    update_name: '', // 操作人
    banner_tag_desc: ''
  },
  crudTag: 'market:bannerLabel:'
};

export default defineComponent({
  components: {
    crudOperation,
    udOperation,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const statusList = [
      {
        label: '开启中',
        value: 1
      },
      {
        label: '已禁用',
        value: 2
      }
    ];

    const otherPermission = reactive({
      status: 'market:bannerLabel:change'
    });
    const dict = reactive({
      universal_status_options: []
    });
    onMounted(async () => {
      [dict.universal_status_options] = await Promise.all([
        getDicts('universal_status_options')
      ]);
    });

    return {
      ...crud,
      ...toRefs(dict),
      otherPermission,
      statusList
    };
  }
});
</script>
