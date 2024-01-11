<template>
  <div class="main-container">
    <crudOperation title="router.venue-rate" labelWidth="120px">
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
            prop="game_id"
            :label="$t('table.venue_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.game_id, venue_options) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="rate"
            :label="$t('table.venue_rate')"
            min-width="120"
            align="center"
          >
           <template #default="scope">
              {{ `${scope.row.rate}%` }}
            </template>
          </el-table-column>

          <el-table-column
            prop="remark"
            :label="$t('table.remark')"
            min-width="120"
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
                @del="toDel({ delete_id: scope.row.id })"
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
          <el-form-item :label="$t('table.venue_type')" prop="game_id">
            <el-select
              v-model="proxyForm.game_id"
              popper-class="user-select"
              style="width: 200px"
              disabled
            >
              <el-option
                v-for="item in venue_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.venue_rate')"
            prop="rate"
            :rules="[
              {
                required: true,
                message: $t('table.venue_rate') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.rate"
              type="number"
              :min="0"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.remark')"
            prop="remark"
            :rules="[
              {
                required: true,
                message: $t('table.remark') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.remark"
              type="textarea"
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import {
  getVenueRate as list,
  editVenueRate as edit
} from '@/api/market-manage/market-config';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '费率',
  crudOptShow: {
    operate: false
  },
  defaultQuery: {},
  crudTableParams: '',
  crudMethod: { list, edit },
  defaultForm: {},
  crudTag: 'market:venue:'
};

export default defineComponent({
  name: 'venue-rate',
  components: {
    crudOperation,
    udOperation
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const dict = reactive({
      venue_options: []
    });

    const { getLabel } = dictionary();

    crud.crudHook.beforeValidateCU = (form: any) => {
      form.type_id = form.type;
      return true;
    };

    onMounted(async () => {
      [dict.venue_options] = await Promise.all([getDicts('venue_options')]);
      console.log(dict);
    });

    return {
      ...crud,
      ...toRefs(dict),
      getLabel
    };
  }
});
</script>
