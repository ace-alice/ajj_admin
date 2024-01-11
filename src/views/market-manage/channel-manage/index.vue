<template>
  <div class="main-container">
    <crudOperation title="" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.channel_name2')">
          <el-input
            v-model.trim="crudQuery.name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>

        <el-form-item :label="$t('table.channel_code2')">
          <el-input
            v-model.trim="crudQuery.code"
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
            prop="channel_name"
            :label="$t('table.channel_name2') /**渠道名称*/"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="channel_code"
            :label="$t('table.channel_code2') /**渠道编码 */"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              <div>
                <Clipboard
                  class="Clipboard"
                  :content="`?code=${scope.row.channel_code}`"
                >
                  <template #label>
                    {{ scope.row.channel_code }}
                    <svg-icon name="copy"></svg-icon>
                  </template>
                </Clipboard>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="number_visitor"
            :label="$t('table.access_number') /**访问人数 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="number_register"
            :label="$t('table.register_number') /**注册人数 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_name"
            :label="$t('table.create_name') /**创建人 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time') /**创建时间 */"
            min-width="200"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name') /**最近操作人 */"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time') /**最近操作时间 */"
            min-width="200"
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
            :label="$t('table.channel_name2')"
            prop="channel_name"
            :rules="[
              {
                required: true,
                message: $t('table.channel_name2') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.channel_name"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/market-manage/channel-manage';
import { defineComponent, reactive } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import Clipboard from '@/components/Clipboard/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '渠道管理',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    name: '', //标签id
    code: '' //标签名称
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    name: '', //标签id
    channel_name: ''
  },
  crudTag: 'market:channel:'
};

export default defineComponent({
  components: {
    crudOperation,
    udOperation,
    Clipboard
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    // const otherPermission = reactive({
    //   status: 'market:channel:change'
    // });

    return {
      ...crud
      // otherPermission
    };
  }
});
</script>

<style lang="scss">
// .Clipboard:hover {
//   svg {
//     fill: #409eff!important;
//   }
// }
</style>
