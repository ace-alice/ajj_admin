<template>
  <div class="main-container">
    <el-tabs v-model="crudQuery.tag_type" class="demo-tabs" @tab-click="changeTag">
      <el-tab-pane label="公告标识配置" :name="1"></el-tab-pane>
      <el-tab-pane label="站内信标识配置" :name="2"></el-tab-pane>
    </el-tabs>
    <crudOperation title=" " labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.header_name')">
          <el-input
            v-model.trim="crudQuery.tag_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.is_disable"
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
            v-model.trim="crudQuery.create_admin_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
          <el-input
            v-model.trim="crudQuery.update_admin_name"
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
            prop="tag_name"
            :label="$t('table.header_name')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="tag_logo"
            :label="$t('table.img_path_id')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <el-avatar
                shape="square"
                size="large"
                :src="scope.row.tag_logo"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="tag_name"
            :label="$t('table.header_remark')"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="is_disable"
            :label="$t('table.status')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.tag_name"
                :activeValue="1"
                :inactiveValue="2"
                :initValue="scope.row.is_disable"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id,
                  is_disable: scope.row.is_disable
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
            min-width="200"
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
            :label="$t('table.header_name')"
            prop="tag_name"
            :rules="[
              {
                required: true,
                message: $t('table.header_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.tag_name"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.header_remark')"
            prop="tag_remark"
            :rules="[
              {
                required: true,
                message: $t('table.header_remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.tag_remark"
              type="textarea"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <NomalImageUpload
            @setImage="setTheForm"
            formLabel="标识图标"
            :data="proxyForm.tag_logo"
            imgkey="file_id"
            imgUrlKey="tag_logo"
          />
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/market-manage/mark-manage';
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { dictionary } from '@/hook/lib';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '标识',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    tag_type: 1,
    tag_name: null,
    status: null,
    create_admin_name: null,
    update_admin_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    header_name: null,
    img_path_id: null,
    header_remark: null,
    tag_name: null,
    tag_remark: null,
    tag_logo: null,
    is_delete: 1,
    tag_type: 1,
    file_path: null
  },
  crudTag: 'market:mark:'
};

export default defineComponent({
  name: 'mark-manage',
  components: {
    crudOperation,
    udOperation,
    NomalImageUpload,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { proxy } = <any>getCurrentInstance();

    const dict = reactive({
      universal_status_options: [],
      mark_type_options: []
    });

    const { getLabel } = dictionary();

    const otherPermission = reactive({
      status: 'market:mark:disable'
    });

    const changeTag = (tab: any) => {
      crud.crudSetQueryKey({
        tag_type: tab.paneName,
        tag_name: null,
        status: null,
        create_admin_name: null,
        update_admin_name: null
      })
      crud.crudHook.beforeToAdd = (form: any) => {
        Object.assign(form, {
          tag_type: tab.paneName
        });
        return true;
      };
      
      crud.crudHook.beforeToEdit = (form: any) => {
        Object.assign(form, {
          tag_type: tab.paneName
        });
        return true;
      };
      crud.toQuery();
    };

    crud.crudHook.beforeValidateCU = (form: any) => {
      form.type_id = form.tag_type;
      return true;
    };

    onMounted(async () => {
      [dict.mark_type_options, dict.universal_status_options] =
        await Promise.all([
          getDicts('mark_type_options'),
          getDicts('universal_status_options')
        ]);
      console.log(dict);
    });

    return {
      ...crud,
      ...toRefs(dict),
      getLabel,
      changeTag,
      otherPermission
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>
