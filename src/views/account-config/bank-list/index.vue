<template>
  <div class="main-container">
    <crudOperation title="router.bank-list" labelWidth="120px">
      <template #query>
        <el-form-item label="银行名称">
          <el-input
            v-model.trim="crudQuery.bank_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="银行code码">
          <el-input
            v-model.trim="crudQuery.bank_code"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="crudQuery.bank_status"
            style="width: 200px"
            popper-class="user-select"
          >
            <el-option
              v-for="item in bank_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
            prop="bank_name"
            label="银行名称"
            min-width="80"
            align="center"
          />
          <el-table-column
            prop="bank_logo"
            label="银行logo预览"
            min-width="140"
            align="center"
          >
            <template #default="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.bank_logo"
                :preview-src-list="[scope.row.bank_logo]"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="bank_code"
            label="银行code码"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="bank_status"
            label="银行状态"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.bank_status, bank_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_time"
            label="维护时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.start_time) }} 至
              {{ $parseTime(scope.row.end_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            label="创建人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="创建时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="update_name"
            label="最近操作人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            label="最近操作时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="140"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
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
          label-width="100px"
        >
          <el-form-item
            label="银行名称"
            prop="bank_name"
            :rules="[
              {
                required: true,
                message: '银行名称' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.bank_name"
              clearable
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="银行code码"
            prop="bank_code"
            :rules="[
              {
                required: true,
                message: '银行code码' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.bank_code"
              clearable
              style="width: 300px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="状态"
            prop="bank_status"
            :rules="[
              {
                required: true,
                message: '状态' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.bank_status"
              style="width: 300px"
              @change="changeStatus"
              popper-class="user-select"
            >
              <el-option
                v-for="item in bank_status_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="维护时间"
            v-if="proxyForm.bank_status == 2"
            prop="start_time"
            :rules="[
              {
                required: true,
                message: '维护时间' + $t('table.not_empty')
              }
            ]"
          >
            <dateTimePickerQuery
              @setTime="setTheForm"
              :isQueryForm="false"
              :propTime="[proxyForm.start_time, proxyForm.end_time]"
              startKey="start_time"
              endKey="end_time"
            />
          </el-form-item>
          <nomalImageUpload
            @setImage="setTheForm"
            formLabel="上传银行logo"
            :data="proxyForm['bank_logo']"
            imgkey="file_id"
            imgUrlKey="bank_logo"
          />
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/account-config/bank-list';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import nomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '提款银行卡设置',
  crudOptShow: {
    add: true,
    edit: true,
    formSize: '60%'
  },
  crudTableParams: 'data',
  defaultQuery: {
    bank_name: null,
    bank_code: null,
    bank_status: null
  },
  crudMethod: { ...Api },
  defaultForm: {
    bank_name: null,
    bank_code: null,
    bank_status: null,
    file_id: null,
    start_time: null,
    end_time: null,
    bank_logo: null
  },
  crudTag: 'bank:list:'
};

export default defineComponent({
  name: 'bank-list',
  components: {
    crudOperation,
    udOperation,
    nomalImageUpload,
    dateTimePickerQuery
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();

    const dict = reactive({
      bank_status_options: []
    });

    const { proxy } = getCurrentInstance() as any;
    crud.crudHook.beforeToEdit = (form: any) => {
      form.start_time && (form.start_time = proxy.$parseTime(form.start_time));
      form.end_time && (form.end_time = proxy.$parseTime(form.end_time));
      return true;
    };

    function changeStatus() {
      crud.proxyForm.start_time = null
      crud.proxyForm.end_time = null
    }

    onMounted(async () => {
      [dict.bank_status_options] = await Promise.all([
        getDicts('bank_status_options')
      ]);
      console.log(dict);
    });

    return {
      ...crud,
      getLabel,
      changeStatus,
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
