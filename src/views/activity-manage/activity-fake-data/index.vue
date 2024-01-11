<template>
  <div class="main-container">
    <crudOperation title="router.activity-fake-data" labelWidth="120px">
      <template #query>
        <el-form-item label="活动ID">
          <el-select
            v-model="crudQuery.activity_id"
            popper-class="user-select"
            clearable
          >
            <template v-for="item in activityList" :key="item.label">
              <el-option :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span
                  style="
                    float: right;
                    color: var(--el-text-color-secondary);
                    font-size: 13px;
                  "
                  >{{ item.value }}</span
                >
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="活动模板">
          <el-select
            v-model="crudQuery.template_id"
            popper-class="user-select"
            clearable
          >
            <template
              v-for="item in activity_template_options"
              :key="item.label"
            >
              <el-option :label="item.label" :value="item.value" />
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="活动标题">
          <el-select
            v-model="crudQuery.activity_name"
            popper-class="user-select"
            clearable
          >
            <template v-for="item in activityList" :key="item.label">
              <el-option :label="item.label" :value="item.label" />
            </template>
          </el-select>
        </el-form-item> -->
        <el-form-item label="创建人">
          <el-input
            v-model.trim="crudQuery.create_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="最近操作人">
          <el-input
            v-model.trim="crudQuery.update_name"
            clearable
            style="width: 220px"
          ></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          :style="{ height: tableHeight }"
          :max-height="tableHeight"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="activity_id"
            label="活动ID"
            min-width="160"
            align="center"
          />

          <!-- <el-table-column
            prop="template_id"
            label="活动模板"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.template_id, activity_template_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="activity_name"
            label="活动标题"
            min-width="140"
            align="center"
          /> -->

          <el-table-column
            prop="member_name"
            label="中奖会员"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="中奖时间"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.create_time) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="prize_name"
            label="发放奖品"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="prize_price"
            label="奖品价格"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_name"
            label="创建人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="creator_time"
            label="创建时间"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.creator_time) }}
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
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.update_time) }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operate')"
            min-width="160"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @del="toDel({ id: scope.row.id })"
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
            label="活动ID"
            prop="activity_id"
            :rules="[
              {
                required: true,
                message: '活动ID' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.activity_id"
              popper-class="user-select"
              @change="changeAct"
              clearable
            >
              <template v-for="item in activityList" :key="item.label">
                <el-option :label="item.label" :value="item.value">
                  <span style="float: left">{{ item.label }}</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                    >{{ item.value }}</span
                  >
                </el-option>
              </template>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            label="活动模板"
            prop="template_id"
            :rules="[
              {
                required: true,
                message: '活动模板' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.template_id"
              style="width: 200px"
              popper-class="user-select"
              clearable
            >
              <template
                v-for="item in activity_template_options"
                :key="item.label"
              >
                <el-option :label="item.label" :value="item.value" />
              </template>
            </el-select>
          </el-form-item>
          <el-form-item
            label="活动标题"
            prop="activity_name"
            :rules="[
              {
                required: true,
                message: '活动标题' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.activity_name"
              style="width: 200px"
              popper-class="user-select"
              clearable
            >
              <template v-for="item in activityList" :key="item.label">
                <el-option :label="item.label" :value="item.label" />
              </template>
            </el-select>
          </el-form-item> -->
          <el-form-item
            label="中奖会员人数"
            prop="member_count"
            :rules="[
              {
                required: true,
                message: '活动中奖会员' + $t('table.not_empty')
              }
            ]"
          >
            <el-input-number
              v-model.number="proxyForm.member_count"
              :precision="0"
              controls-position="right"
              :min="0"
              :max="100"
              placeholder="中奖会员人数"
              style="width: 200px"
              clearable
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="发放奖品"
            prop="prize_name"
            :rules="[
              {
                required: true,
                message: '发放奖品' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.prize_name"
              clearable
              placeholder="发放奖品"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="奖品价格"
            prop="prize_price"
            :rules="[
              {
                required: true,
                message: '奖品价格' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.prize_price"
              clearable
              placeholder="奖品价格"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="中奖时间"
            prop="lottery_start_time"
            :rules="[
              {
                required: true,
                message: '中奖时间' + $t('table.not_empty')
              }
            ]"
          >
            <dateTimePickerQuery
              @setTime="setTheForm"
              unlink-panels
              :isQueryForm="false"
              :propTime="[proxyForm.lottery_start_time, proxyForm.lottery_end_time]"
              startKey="lottery_start_time"
              endKey="lottery_end_time"
            />
            <!-- <el-date-picker
              v-model="proxyForm.create_time"
              type="datetime"
              placeholder="中奖时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            /> -->
          </el-form-item>
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-fake-data';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus/lib/components';
import { ElNotification } from 'element-plus';
import { dateTimePickerQuery } from '@/components/dateComponents';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '活动假数据',
  crudOptShow: {
    add: true,
    dragAble: false
  },
  defaultQuery: {
    activity_id: null,
    // template_id: null,
    // activity_name: null,
    create_name: null,
    update_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    activity_id: null,
    // template_id: null,
    activity_name: null,
    member_count: null,
    prize_name: null,
    prize_price: null,
    lottery_start_time: null,
    lottery_end_time: null,
    create_time: null
  },
  crudTag: 'activity:fake:'
};

export default defineComponent({
  name: 'activity-tab-config',
  components: {
    crudOperation,
    udOperation,
    dateTimePickerQuery,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const otherPermission = {
      change: 'activity:fake:change',
      sort: 'activity:fake:sort'
    };

    const { proxy } = getCurrentInstance() as any;
    crud.crudHook.beforeToEdit = (form: any) => {
      form.create_time &&
        (form.create_time = proxy.$parseTime(form.create_time));
      return true;
    };

    const dict: any = reactive({
      activity_template_options: [],
      universal_status_options: [],
      mark_type_options: []
    });

    async function getActivityTemplate() {
      dict.activity_template_options = [];
      const { data, code, msg } = await (<any>Api.getActivityTemplate());
      if (code === 1) {
        let obj: any = {};
        Object.keys(data).map((key: string) => {
          obj = {
            label: data[key],
            value: Number(key)
          };
          dict.activity_template_options.push(obj);
        });
      } else {
        ElMessage.error(msg);
      }
    }

    const activityList = ref([]);
    function getLotteryActivityList() {
      Api.lotteryActivityList().then((data: any) => {
        activityList.value = data.data;
        crud.refresh();
      });
    }

    const { getLabel } = dictionary();

    function changeAct(val: any) {
      console.log(getLabel(val, activityList.value))
      crud.setTheForm({activity_name: getLabel(val, activityList.value)})
    }

    onMounted(async () => {
      [dict.universal_status_options] = await Promise.all([
        getDicts('universal_status_options')
      ]);
      await getActivityTemplate();
      await getLotteryActivityList();
    });

    return {
      ...crud,
      changeAct,
      activityList,
      ...toRefs(dict),
      getLabel,
      otherPermission
    };
  }
});
</script>
