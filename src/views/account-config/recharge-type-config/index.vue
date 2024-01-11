<template>
  <div class="main-container">
    <crudOperation title="router.recharge-type-config" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.deposit_name')">
          <el-input
            v-model.trim="crudQuery.deposit_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            popper-class="user-select"
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
            v-model.trim="crudQuery.action_name"
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
            prop="deposit_sort"
            :label="$t('table.sort')"
            min-width="80"
            align="center"
          />
          <el-table-column
            prop="deposit_name"
            :label="$t('table.deposit_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="deposit_logo"
            :label="$t('table.deposit_logo')"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.deposit_logo"
                :preview-src-list="[scope.row.deposit_logo]"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="deposit_sort"
            :label="$t('table.status')"
            min-width="150"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.deposit_name"
                :initValue="scope.row.deposit_status"
                :activeValue="1"
                :inactiveValue="2"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id,
                  deposit_status: scope.row.deposit_status
                }"
                paramKey="deposit_status"
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
            min-width="250"
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
          label-position="top"
          label-width="90px"
        >
          <el-form-item
            :label="$t('table.deposit_name')"
            prop="deposit_name"
            :rules="[
              { required: true, message: $t('table.deposit_name_empty') }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.deposit_name"
              :placeholder="$t('table.deposit_name')"
            ></el-input>
          </el-form-item>
          <nomalImageUpload
            @setImage="setTheForm"
            formLabel="logo"
            :data="proxyForm['deposit_logo']"
            imgkey="file_id"
            imgUrlKey="deposit_logo"
          />
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/recharge-type-config';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { getDicts } from '@/utils/dictApi';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: 'CNY',
  crudOptShow: {
    add: true,
    dragAble: false,
    formSize: '60%'
  },
  crudTableParams: 'data',
  defaultQuery: {
    status: null,
    deposit_name: null,
    create_name: null,
    action_name: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    deposit_name: null,
    deposit_logo: null
  },
  crudTag: 'recharge:type:'
};

export default defineComponent({
  name: 'recharge-type-config',
  components: { crudOperation, udOperation, nomalImageUpload, PromiseSwitch },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const dict = reactive({
      universal_status_options: []
    });

    const otherPermission = {
      top: 'recharge:type:top',
      change: 'recharge:type:change'
    };

    crud.crudHook.dragEnd = ({
      oldIndex,
      newIndex
    }: {
      oldIndex: number;
      newIndex: number;
    }) => {
      let formData: any = {
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
      Api.sortFun(formData)
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
      otherPermission,
      ...toRefs(dict)
    };
  }
});
</script>

<style>
.user-select {
  min-width: 200px !important;
}
</style>
