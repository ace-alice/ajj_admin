<template>
  <div class="main-container">
    <crudOperation title="router.activity-config">
      <template #query>
        <el-form-item :label="$t('table.activity_id')">
          <el-input
            v-model.trim="crudQuery.id"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.event_title')">
          <el-input
            v-model.trim="crudQuery.activity_title"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.activity_tab')">
          <el-select
            v-model="crudQuery.activity_tab_id"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in activityTabList"
              :key="item.tab"
              :label="item.tab"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.shuffle_rate')">
          <el-input
            v-model.trim="crudQuery.shuffle_rate"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.activity_terminal')">
          <el-select
            v-model="crudQuery.terminal"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in terminal_type_options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.event_time')">
          <el-select
            v-model="crudQuery.is_time_limit"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in envt_time_options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.activity_status')">
          <el-select
            v-model="crudQuery.status"
            style="width: 200px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in activity_status_options"
              :key="item.label"
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
      <template #left-right>
        <el-button type="primary" @click="openSortDialog"> 活动排序</el-button>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          border
          max-height="600px"
          :default-expand-all="false"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="id"
            :label="$t('table.activity_id')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="activity_title"
            :label="$t('table.event_title')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="activity_tab_id"
            :label="$t('table.activity_tab')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{
                getLabel(
                  scope.row.activity_tab_id,
                  activityTabList,
                  'id',
                  'tab'
                )
              }}
            </template>
          </el-table-column>

          <el-table-column
            prop="activity_template_id"
            :label="$t('table.event_temp')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{
                getLabel(
                  scope.row.activity_template_id,
                  activity_template_options
                )
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="shuffle_rate"
            :label="$t('table.shuffle_rate')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="terminal"
            :label="$t('table.activity_terminal')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getTerminal(scope.row.terminal) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="is_time_limit"
            :label="$t('table.event_time')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.is_time_limit, envt_time_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('table.status')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.id"
                :activeValue="1"
                :inactiveValue="2"
                :initValue="scope.row.status"
                :options="activity_status_options"
                :defaultParam="{
                  id: scope.row.id
                }"
                paramKey="status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.change"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="show_start_time"
            :label="$t('table.show_time')"
            min-width="320"
            align="center"
          >
            <template #default="scope">
              <div>
                {{ scope.row.show_start_time
                }}{{
                  scope.row.is_time_limit === 2
                    ? ''
                    : `至${scope.row.show_end_time}`
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="start_time"
            :label="$t('table.activity_time')"
            min-width="320"
            align="center"
          >
            <template #default="scope">
              <div>
                {{ scope.row.start_time
                }}{{
                  scope.row.is_time_limit === 2 ? '' : `至${scope.row.end_time}`
                }}
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="app_img"
            :label="$t('table.entrance_img')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <div style="display: flex; justify-content: center">
                <div v-if="scope.row.app_img">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.app_img"
                    :preview-src-list="[scope.row.app_img]"
                    :initial-index="0"
                    fit="cover"
                  />
                </div>
                &nbsp;
                <div v-if="scope.row.pc_img">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="scope.row.pc_img"
                    :preview-src-list="[scope.row.pc_img]"
                    :initial-index="0"
                    fit="cover"
                  />
                </div>
                <div v-if="!scope.row.app_img && !scope.row.pc_img">--</div>
              </div>
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
                <template #left>
                  <el-button
                    type="text"
                    v-if="scope.row.book === 0"
                    v-only="otherPermission.book"
                    @click="tagHot({ id: scope.row.id })"
                    >{{ $t('table.mark_popular') }}</el-button
                  >
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
          label-width="160px"
        >
          <el-form-item
            :label="$t('table.event_title')"
            prop="activity_title"
            :rules="[
              {
                required: true,
                message: $t('table.event_title') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.activity_title"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.activity_tab')"
            prop="activity_tab_id"
            :rules="[
              {
                required: true,
                message: $t('table.activity_tab') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.activity_tab_id"
              style="width: 200px"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in activityTabList"
                :key="item.tab"
                :label="item.tab"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <!-- 活动标签 -->
          <el-form-item
            :label="$t('table.activity_label')"
            prop="activity_label_id"
            :rules="[
              {
                required: true,
                message: $t('table.activity_label') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.activity_label_id"
              style="width: 200px"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in activityLabelList"
                :key="item.header"
                :label="item.header"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.event_temp')"
            prop="activity_template_id"
            :rules="[
              {
                required: true,
                message: $t('table.event_temp') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.activity_template_id"
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
            :label="$t('table.activity_terminal')"
            prop="terminal_arr"
            :rules="[
              {
                required: true,
                message: $t('table.activity_terminal') + $t('table.not_empty'),
                trigger: ['change']
              }
            ]"
          >
            <el-select
              v-model="proxyForm.terminal_arr"
              style="width: 200px"
              popper-class="user-select"
              multiple
              clearable
            >
              <el-option
                v-for="item in terminal_type_options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.event_time')"
            prop="is_time_limit"
            :rules="[
              {
                required: true,
                message: $t('table.event_time') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.is_time_limit"
              style="width: 200px"
              popper-class="user-select"
              @change="timeLimitChange"
              clearable
            >
              <el-option
                v-for="item in envt_time_options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.show_time')"
            prop="show_start_time"
            :rules="[
              {
                required: true,
                message: $t('table.show_time') + $t('table.not_empty')
              },
              { validator: validateShowTimeRange, trigger: 'change' }
            ]"
          >
            <el-date-picker
              v-if="proxyForm.is_time_limit === 2"
              v-model="proxyForm.show_start_time"
              type="datetime"
              :disabled-date="disabledShowDate"
              :placeholder="$t('table.start_time')"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <dateTimePickerQuery
              v-if="proxyForm.is_time_limit !== 2"
              @setTime="setTheForm"
              unlink-panels
              :isQueryForm="false"
              :disabled-date="disabledShowDate"
              :propTime="[proxyForm.show_start_time, proxyForm.show_end_time]"
              startKey="show_start_time"
              endKey="show_end_time"
            />
          </el-form-item>
          <br />
          <el-form-item
            :label="$t('table.activity_time')"
            prop="start_time"
            :rules="[
              {
                required: true,
                message: $t('table.activity_time') + $t('table.not_empty')
              },
              { validator: validateACtivityTimeRange, trigger: 'change' }
            ]"
          >
            <el-date-picker
              v-if="proxyForm.is_time_limit === 2"
              v-model="proxyForm.start_time"
              type="datetime"
              :disabled-date="disabledActivityDate"
              :placeholder="$t('table.start_time')"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
            <dateTimePickerQuery
              :disabled-date="disabledActivityDate"
              v-if="proxyForm.is_time_limit !== 2"
              @setTime="setTheForm"
              :isQueryForm="false"
              :propTime="[proxyForm.start_time, proxyForm.end_time]"
              startKey="start_time"
              endKey="end_time"
            />
          </el-form-item>
          <br />
          <NomalImageUpload
            @setImage="setTheForm"
            :formLabel="`APP${$t('table.entrance_image_upload')}`"
            :data="proxyForm.app_img"
            imgkey="app_img_id"
            imgUrlKey="app_img"
          />
          <NomalImageUpload
            @setImage="setTheForm"
            :formLabel="`PC${$t('table.entrance_image_upload')}`"
            :data="proxyForm.pc_img"
            imgkey="pc_img_id"
            imgUrlKey="pc_img"
          />
          <el-form-item
            :label="$t('table.activity_target_url')"
            prop="target_url"
            :rules="[
              {
                required: true,
                message: $t('table.activity_target_url') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.target_url"
              clearable
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="proxyForm.activity_template_id != 9"
            :label="$t('table.shuffle_rate')"
            prop="shuffle_rate"
            :rules="[
              {
                required: true,
                message: $t('table.shuffle_rate') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.shuffle_rate"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="活动ID"
            v-if="crudStatus.add"
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
              style="width: 200px"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in activityIdList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <component
            :is="templateComponentConfig[proxyForm.activity_template_id + '']"
            :proxyForm="proxyForm"
          ></component>
        </el-form>
      </template>
    </crudOperation>
    <el-dialog v-model="dialogSortVisible" title="活动排序">
      <dragList ref="dragList" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeSortDialog">关闭</el-button>
          <el-button type="primary" @click="confirmSortDialog"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-config';
import { defineComponent, getCurrentInstance, onMounted, reactive, ref, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { ElMessage } from 'element-plus/lib/components';
import { getActivityLabelListHook } from '@/hook/getActivityLabelList';
import { getActivityTabListHook } from '@/hook/getActivityTabList';
import { getActivityIdListHook } from '@/hook/getActivityIdList';
import newUserCharge from './components/new-user-charge.vue';
import firstChargeBonus from './components/first-charge-bonus.vue';
import newUserTask from './components/new-user-task.vue';
import LolRebase from './components/lol-rebase.vue';
import lottoryConfig from './components/lottory-config.vue';
import inviteMember from './components/invite-member.vue';
import chargeDiscount from './components/charge-discount.vue';
import luckyManeyBonus from './components/lucky-maney-bonus.vue';
import betInproveBonus from './components/bet-inprove-bonus.vue';
import venueCompensation from './components/venue-compensation.vue';
import dragList from './components/drag-list.vue';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '活动配置',
  crudOptShow: {
    add: true
  },
  defaultQuery: {},
  crudTableParams: 'data',
  isPageQuery: true,
  crudMethod: { ...Api },
  defaultForm: {
    activity_title: null,
    activity_tab_id: null,
    activity_label_id: null,
    activity_template_id: null,
    is_time_limit: null,
    show_start_time: null,
    show_end_time: null,
    start_time: null,
    end_time: null,
    app_img: null,
    app_img_id: null,
    pc_img: null,
    target_url: null,
    pc_img_id: null,
    shuffle_rate: 0,
    send_type: null,
    config_arr: [],
    activity_template_content: '',
    terminal_arr: [],
    activity_id: null,
    exclusion_active: null,
    need_low_bet: null, // 抽奖最低投注
    max_lottery_time: null, // 每天最多抽奖次数
    register_url: null,
    bind_card: null,
    signle_min_amount: null,
    signle_max_amount: null,
    day_max_amount: null,
    total_bet_amount: null,
    rebate_ratio: null,
    max_rebate_amount: null,
    venue_ids: null,
    user_task: {
      bind_card: {
        is_open: 1,
        title: null,
        send_type: null,
        start_time: null,
        day: null,
        need_bind_card: null,
        amount: null
      },
      game: {
        is_open: 1,
        title: null,
        send_type: null,
        start_time: null,
        day: null,
        deposit: [],
        bet_amount: []
      },
      sign: {
        is_open: 1,
        title: null,
        send_type: null,
        start_time: null,
        day: null,
        full_day: null,
        amount: null,
        low_deposit: null,
        low_bet: null
      }
    }
  },
  crudTag: 'activity:config:'
};

export default defineComponent({
  name: 'activity-config',
  components: {
    crudOperation,
    newUserCharge,
    firstChargeBonus,
    dateTimePickerQuery,
    inviteMember,
    betInproveBonus,
    NomalImageUpload,
    PromiseSwitch,
    newUserTask,
    chargeDiscount,
    venueCompensation,
    lottoryConfig,
    luckyManeyBonus,
    dragList,
    LolRebase,
    udOperation
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel } = dictionary();

    const templateComponentConfig = {
      '1': 'betInproveBonus', // 累计投注晋级大奖
      '2': 'inviteMember', // 邀请好友
      '3': 'newUserCharge', // 新人首充
      '4': 'newUserTask', // 新手任务
      '5': 'venueCompensation', // 场馆包赔
      '6': 'lottoryConfig', // 实物抽奖
      '7': 'luckyManeyBonus', // 红包雨
      '8': 'firstChargeBonus', // 首充返现
      '10': 'chargeDiscount', // 充值优惠
      '14': 'LolRebase' // 投注返水
    };

    const { activityLabelList } = getActivityLabelListHook();
    const { activityTabList } = getActivityTabListHook();
    const { activityIdList } = getActivityIdListHook();

    const otherPermission = {
      change: 'activity:config:change',
      book: 'activity:config:book'
    };

    const dict: any = reactive({
      activity_template_options: [],
      activity_status_options: [],
      envt_time_options: [],
      terminal_type_options: []
    });

    async function tagHot(params: Object) {
      const { data, code, msg } = await (<any>Api.book(params));
      if (code === 1) {
        crud.toQuery();
      } else {
        ElMessage.error(msg);
      }
    }

    crud.crudHook.beforeValidateCU = (form: any) => {
      if (form.exclusion_active && form.exclusion_active.length > 0) {
        form.exclusion_active = form.exclusion_active.join(',');
      } else {
        form.exclusion_active = '';
      }
      let obj: any = {};
      if (
        crud.proxyForm.activity_template_id == 1 ||
        crud.proxyForm.activity_template_id == 3
      ) {
        // 新人首充 || 累计投注晋级大奖
        obj = {
          config_arr: form.config_arr,
          send_type: form.send_type
        };
      } else if (crud.proxyForm.activity_template_id == 4) {
        // 新人任务
        obj = form.user_task;
      } else if (crud.proxyForm.activity_template_id == 2) {
        // 新人任务
        obj = {
          config_arr: form.config_arr,
          bind_card: form.bind_card,
          register_url: form.register_url,
          send_type: form.send_type
        };
      } else if (crud.proxyForm.activity_template_id == 5) {
        // 场馆包赔
        obj = {
          send_type: form.send_type,
          single_bet_amount: form.single_bet_amount,
          min_deposit_amount: form.min_deposit_amount,
          vip_arr: form.vip_arr,
          event_arr: form.event_arr
        };
      } else if (crud.proxyForm.activity_template_id == 6) {
        // 实物抽奖
        obj = {
          config_arr: form.config_arr,
          need_low_bet: form.need_low_bet,
          max_lottery_time: form.max_lottery_time,
          send_type: form.send_type
        };
      } else if (crud.proxyForm.activity_template_id == 7) {
        // 红包雨
        obj = {
          config_arr: form.config_arr,
          signle_min_amount: form.signle_min_amount,
          signle_max_amount: form.signle_max_amount,
          send_type: form.send_type
        };
      } else if (crud.proxyForm.activity_template_id == 8) {
        // 首充返现
        obj = {
          send_type: form.send_type,
          low_deposit_money: form.low_deposit_money,
          ratio: form.ratio,
          bonus_cap: form.bonus_cap,
          num: form.num
        };
      } else if (crud.proxyForm.activity_template_id == 10) {
        // 充值优惠
        obj = {
          day_max_amount: form.day_max_amount
        };
      } else if (crud.proxyForm.activity_template_id == 14){
        obj = {
          total_bet_amount: form.total_bet_amount,
          rebate_ratio: form.rebate_ratio,
          max_rebate_amount: form.max_rebate_amount,
          venue_ids: form.venue_ids.join(',')
        };
      }

      Object.assign(form, {
        activity_template_content: JSON.stringify(obj),
        terminal: form.terminal_arr.join(',')
      });
      return true;
    };

    const { proxy } = getCurrentInstance() as any;
    crud.crudHook.beforeToEdit = (form: any) => {
      form.show_start_time && (form.show_start_time = proxy.$parseTime(form.show_start_time))
      form.show_end_time && (form.show_end_time = proxy.$parseTime(form.show_end_time))
      form.start_time && (form.start_time = proxy.$parseTime(form.start_time))
      form.end_time && (form.end_time = proxy.$parseTime(form.end_time))

      const obj = JSON.parse(form.activity_template_content);
      const t_arr = form.terminal.split(',').map((item: any) => Number(item));
      if (form.exclusion_active && form.exclusion_active.length > 0) {
        form.exclusion_active = form.exclusion_active
          .split(',')
          .map((item: any) => Number(item));
      } else {
        form.exclusion_active = [];
      }
      Object.assign(form, {
        terminal_arr: t_arr
      });
      if (
        crud.proxyForm.activity_template_id == 1 ||
        crud.proxyForm.activity_template_id == 3
      ) {
        // 新人首充 || 累计投注晋级大奖
        Object.assign(form, {
          config_arr: obj.config_arr,
          send_type: obj.send_type
        });
      } else if (crud.proxyForm.activity_template_id == 4) {
        // 新人任务
        Object.assign(form, {
          user_task: { ...obj }
        });
      } else if (crud.proxyForm.activity_template_id == 2) {
        // 好友邀请
        Object.assign(form, {
          config_arr: obj.config_arr,
          register_url: obj.register_url,
          bind_card: obj.bind_card,
          send_type: Number(obj.send_type)
        });
      } else if (crud.proxyForm.activity_template_id == 5) {
        // 场馆包赔
        Object.assign(form, {
          send_type: obj.send_type,
          single_bet_amount: obj.single_bet_amount,
          min_deposit_amount: obj.min_deposit_amount,
          vip_arr: obj.vip_arr,
          event_arr: obj.event_arr
        });
      } else if (crud.proxyForm.activity_template_id == 6) {
        // 实物抽奖
        Object.assign(form, {
          config_arr: obj.config_arr,
          need_low_bet: obj.need_low_bet,
          max_lottery_time: obj.max_lottery_time,
          send_type: obj.send_type
        });
      } else if (crud.proxyForm.activity_template_id == 7) {
        // 实物抽奖
        Object.assign(form, {
          config_arr: obj.config_arr,
          signle_min_amount: obj.signle_min_amount,
          signle_max_amount: obj.signle_max_amount,
          send_type: obj.send_type
        });
      } else if (crud.proxyForm.activity_template_id == 8) {
        // 首充返现
        Object.assign(form, {
          send_type: obj.send_type,
          low_deposit_money: obj.low_deposit_money,
          ratio: obj.ratio,
          bonus_cap: obj.bonus_cap,
          num: obj.num
        });
      } else if (crud.proxyForm.activity_template_id == 10) {
        // 充值优惠
        Object.assign(form, {
          day_max_amount: obj.day_max_amount
        });
      } else if (crud.proxyForm.activity_template_id == 14) {
        // 
        Object.assign(form, {
          total_bet_amount: obj.total_bet_amount,
          rebate_ratio: obj.rebate_ratio,
          max_rebate_amount: obj.max_rebate_amount,
          venue_ids: obj.venue_ids.split(',').map((item: any) => Number(item))
        });
      }
      return true;
    };

    // 校验活动时间
    const validateACtivityTimeRange = (
      rule: any,
      value: any,
      callback: any
    ) => {
      if (crud.proxyForm.show_start_time && crud.proxyForm.start_time) {
        let showTime = new Date(crud.proxyForm.show_start_time).getTime();
        let startTime = new Date(crud.proxyForm.start_time).getTime();
        if (startTime < showTime) {
          callback('活动时间须在展示时间范围内');
          return;
        }
        callback();
      } else {
        callback();
      }
    };

    // 校验展示时间
    const validateShowTimeRange = (rule: any, value: any, callback: any) => {
      if (crud.proxyForm.show_start_time && crud.proxyForm.start_time) {
        let showTime = new Date(crud.proxyForm.show_start_time).getTime();
        let startTime = new Date(crud.proxyForm.start_time).getTime();
        if (startTime < showTime) {
          callback('活动时间须在展示时间范围内');
          return;
        }
        callback();
      } else {
        callback();
      }
    };

    const dayMs = 24 * 60 * 60 * 1000;
    // 限制展示时间的选择范围
    function disabledShowDate(time: Date) {
      if (crud.proxyForm.start_time) {
        if (crud.proxyForm.is_time_limit === 2) {
          return time.getTime() > new Date(crud.proxyForm.start_time).getTime();
        } else {
          return time.getTime() < new Date(crud.proxyForm.start_time).getTime();
        }
      }
      return time.getTime() < Date.now() - dayMs;
    }

    // 限制活动时间的选择范围
    function disabledActivityDate(time: Date) {
      if (crud.proxyForm.show_start_time) {
        if (crud.proxyForm.is_time_limit === 2) {
          return (
            time.getTime() <
            new Date(crud.proxyForm.show_start_time).getTime() - 1
          );
        } else {
          return (
            time.getTime() <
              new Date(crud.proxyForm.show_start_time).getTime() ||
            time.getTime() > new Date(crud.proxyForm.show_end_time).getTime()
          );
        }
      }

      return time.getTime() < Date.now() - dayMs;
    }

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

    function getTerminal(terminal: string) {
      const arr = terminal.split(',');
      let strArr: any = [];
      arr.map((k: string) => {
        strArr.push(getLabel(k, dict.terminal_type_options));
      });
      return strArr.length > 0 ? strArr.join(',') : '-';
    }

    function timeLimitChange() {
      crud.proxyForm.show_start_time = null;
      crud.proxyForm.show_end_time = null;
      crud.proxyForm.start_time = null;
      crud.proxyForm.end_time = null;
    }

    // 排序弹窗
    const dialogSortVisible = ref(false);

    function closeSortDialog() {
      dialogSortVisible.value = false
    }

    async function confirmSortDialog() {
      console.log(proxy.$refs['dragList'].activityList)
      const obj = {
        config_arr: proxy.$refs['dragList'].activityList
      }
      dialogSortVisible.value = false
      const { data, code } = await <any>Api.updateSort(obj)
      console.log(data)
      console.log(code)
    }

    function openSortDialog() {
      dialogSortVisible.value = true
    }

    onMounted(async () => {
      [
        dict.activity_status_options,
        dict.terminal_type_options,
        dict.envt_time_options
      ] = await Promise.all([
        getDicts('activity_status_options'),
        getDicts('terminal_type_options'),
        getDicts('envt_time_options')
      ]);
      await getActivityTemplate();
    });

    return {
      ...toRefs(dict),
      getLabel,
      ...crud,
      tagHot,
      dialogSortVisible,
      closeSortDialog,
      confirmSortDialog,
      openSortDialog,
      disabledActivityDate,
      disabledShowDate,
      getTerminal,
      validateACtivityTimeRange,
      validateShowTimeRange,
      timeLimitChange,
      activityIdList,
      templateComponentConfig,
      otherPermission,
      activityLabelList,
      activityTabList
    };
  }
});
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-wrap: wrap;
}
:deep(.el-descriptions) {
  margin: 10px;
}
</style>
