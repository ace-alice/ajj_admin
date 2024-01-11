<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
        <el-form-item label="申请时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item label="派奖时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="reward_time_start"
            endKey="reward_time_end"
            :propTime="[crudQuery.reward_time_start, crudQuery.reward_time_end]"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="crudQuery.member_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="注单号">
          <el-input
            v-model.trim="crudQuery.order_id"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="派奖人">
          <el-input
            v-model.trim="crudQuery.reward_admin_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="crudQuery.reward_status"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in reward_status_options"
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
          border
          show-summary
          max-height="750px"
          :summary-method="getSummaries"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="order_lockup"
            label="锁单"
            min-width="80"
            align="center"
            fixed="left"
            ><template #default="scope">
              <el-checkbox
                v-model="scope.row.order_lockup"
                :true-label="2"
                :false-label="1"
                size="large"
                @change="changeLockupStatus(scope.row)"
                :disabled="
                  btnStatus(
                    scope.row.lockup_name,
                    operateId,
                    scope.row.order_lockup,
                    scope.row.reward_status
                  )[1]
                "
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="member_name"
            :label="$t('table.bet_username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="vip_current_level"
            label="VIP等级"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              VIP{{ scope.row.vip_current_level }}
            </template>
          </el-table-column>
          <el-table-column
            prop="venue_id"
            label="场馆"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{ getLabel(scope.row.venue_id, venue_options) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bet_time"
            label="投注时间"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.bet_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="order_id"
            label="注单号"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            label="申请时间"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="verify_admin_name"
            label="审核人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="verify_time"
            label="审核时间"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.verify_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reward_actual_amount"
            label="派奖金额"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ parseFloat(scope.row.reward_actual_amount).toFixed(4) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reward_admin_name"
            label="派奖人"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="reward_time"
            label="派奖时间"
            min-width="180"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.reward_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="reward_status"
            label="状态"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.reward_status, reward_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            min-width="140"
            fixed="right"
            align="center"
          >
            <template #default="scope">
              <el-button
                v-if="scope.row.reward_status == 1"
                v-only="otherPermission.check"
                :type="
                  btnStatus(
                    scope.row.lockup_name,
                    operateId,
                    scope.row.order_lockup,
                    scope.row.reward_status
                  )[0]
                "
                style="color: #008dff"
                :disabled="
                  btnStatus(
                    scope.row.lockup_name,
                    operateId,
                    scope.row.order_lockup,
                    scope.row.reward_status
                  )[2]
                "
                @click="checkBonus(scope.row)"
                >审核</el-button
              >
              <el-button
                v-if="scope.row.reward_status == 2"
                v-only="otherPermission.send"
                :type="
                  btnStatus(
                    scope.row.lockup_name,
                    operateId,
                    scope.row.order_lockup,
                    scope.row.reward_status
                  )[0]
                "
                :disabled="
                  btnStatus(
                    scope.row.lockup_name,
                    operateId,
                    scope.row.order_lockup,
                    scope.row.reward_status
                  )[2]
                "
                style="color: #008dff"
                @click="sendBonus(scope.row)"
                >派奖</el-button
              >
              <el-button
                v-if="
                  scope.row.reward_status == 3 ||
                  scope.row.reward_status == 4 ||
                  scope.row.reward_status == 5
                "
                v-only="otherPermission.view"
                type="text"
                style="color: #008dff"
                @click="viewBonus(scope.row)"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
    <el-dialog
      :title="'详情'"
      v-model="detailDialog"
      destroy-on-close
      custom-class="activity-data-dialog"
      append-to-body
      width="50%"
    >
      <el-form
        ref="crudDefaultForm"
        :inline="true"
        :model="dialogForm"
        v-loading="dialogLoading"
        label-width="160px"
      >
        <template v-if="dialogType !== 'view'">
          <el-form-item label="场馆：" prop="venue_id">
            {{ getLabel(dialogForm.venue_id, venue_options) }}
          </el-form-item>
          <el-form-item label="投注时间：" prop="bet_time">
            <span>{{ $parseTime(dialogForm.bet_time) }}</span>
          </el-form-item>
          <el-form-item label="注单号：" prop="order_id">
            {{ dialogForm.order_id }}
          </el-form-item>
        </template>
        <template v-if="dialogType === 'check'">
          <el-form-item
            label="应发奖励金额："
            prop="reward_amount"
            :rules="[
              {
                required: true,
                message: '应发奖励金额' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.reward_amount"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注："
            prop="verify_remark"
            :rules="[
              {
                required: true,
                message: '备注' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              style="width: 300px"
              v-model.trim="dialogForm.verify_remark"
            ></el-input>
          </el-form-item>
          <br />
          <NomalImageUpload
            @setImage="setImgId"
            formLabel="上传图片："
            :data="dialogForm.verify_url"
            imgkey="img_id"
            imgUrlKey="verify_url"
          />
        </template>
        <template v-if="dialogType === 'send'">
          <el-form-item label="应发奖励金额：" prop="reward_amount">
            {{ dialogForm.reward_amount }}
          </el-form-item>
          <br />
          <el-form-item
            label="实发奖励金额："
            prop="reward_actual_amount"
            :rules="[
              {
                required: true,
                message: '实发奖励金额' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.reward_actual_amount"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item
            label="备注："
            prop="reward_remark"
            :rules="[
              {
                required: true,
                message: '备注' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              style="width: 300px"
              v-model.trim="dialogForm.reward_remark"
            ></el-input>
          </el-form-item>
          <br />
          <NomalImageUpload
            @setImage="setSendImgId"
            formLabel="上传图片："
            :data="dialogForm.reward_url"
            imgkey="img_id"
            imgUrlKey="reward_url"
          />
        </template>
        <template v-if="dialogType === 'view'">
          <h4 style="padding-left: 40px">基本信息</h4>
          <el-form-item label="场馆：">
            {{ dialogForm?.basic_info.venue_name || '' }}
          </el-form-item>
          <br />
          <el-form-item label="投注时间：">
            <span>{{ $parseTime(dialogForm?.basic_info.bet_time) || '' }}</span>
          </el-form-item>
          <br />
          <el-form-item label="注单号：">
            {{ dialogForm?.basic_info.order_id || '' }}
          </el-form-item>
          <h4 style="padding-left: 40px">审核信息</h4>
          <el-form-item label="审核状态：">
            {{ dialogForm?.verify_info.reward_status_name || '' }}
          </el-form-item>
          <br />
          <el-form-item label="应发奖励金额：">
            <span>{{ dialogForm?.verify_info.reward_amount || '' }}</span>
          </el-form-item>
          <br />
          <el-form-item label="备注：">
            {{ dialogForm?.verify_info.verify_remark || '' }}
          </el-form-item>
          <br />
          <el-form-item label="上传图片：">
            <el-image
              style="width: 60px; height: 60px"
              :src="dialogForm?.verify_info.verify_url"
              :preview-src-list="[dialogForm?.verify_info.verify_url]"
              fit="cover"
            />
          </el-form-item>
          <template v-if="Object.keys(dialogForm?.bonus_info).length > 0">
            <h4 style="padding-left: 40px">派奖信息</h4>
            <el-form-item label="派奖状态：">
              {{ dialogForm?.bonus_info.reward_status_name || '' }}
            </el-form-item>
            <br />
            <el-form-item label="实发奖励金额：">
              <span>{{
                dialogForm?.bonus_info.reward_actual_amount || ''
              }}</span>
            </el-form-item>
            <br />
            <el-form-item label="备注：">
              {{ dialogForm?.bonus_info.reward_remark || '' }}
            </el-form-item>
            <br />
            <el-form-item label="上传图片：">
              <el-image
                style="width: 60px; height: 60px"
                :src="dialogForm?.bonus_info.reward_url"
                :preview-src-list="[dialogForm?.bonus_info.reward_url]"
                fit="cover"
              />
            </el-form-item>
          </template>
        </template>
      </el-form>

      <template #footer>
        <span class="dialog-footer" v-if="dialogType === 'check'">
          <el-button @click="checkEven(2)">审核通过</el-button>
          <el-button primary @click="checkEven(3)">审核拒绝</el-button>
        </span>
        <span class="dialog-footer" v-if="dialogType === 'send'">
          <el-button @click="sendEven(4)">派奖通过</el-button>
          <el-button primary @click="sendEven(5)">派奖拒绝</el-button>
        </span>
        <span class="dialog-footer" v-if="dialogType === 'view'">
          <el-button @click="closeDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-venue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { CRUD, crudOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { ElMessage } from 'element-plus/lib/components';
import { store } from '@/store';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '实物抽奖',
  crudOptShow: {},
  defaultQuery: {},
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    venue_id: null,
    reward_status: null,
    verify_remark: null,
    reward_remark: null,
    img_id: null,
    verify_url: null,
    reward_url: null,
    reward_actual_amount: null,
    reward_amount: null,
    basic_info: {},
    verify_info: {},
    bonus_info: {}
  },
  includeSumColumn: ['reward_actual_amount'],
  crudTag: 'activity:data:venue:'
};

export default defineComponent({
  name: 'activity-data-venue',
  components: { crudOperation, dateTimePickerQuery, NomalImageUpload },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();
    const { proxy } = getCurrentInstance() as any;

    const detailDialog = ref(false);
    const dialogLoading = ref(false);
    const defaulSendForm = {
      id: null,
      venue_id: null,
      reward_status: null,
      verify_remark: null,
      reward_remark: null,
      img_id: null,
      verify_url: null,
      reward_url: null,
      reward_actual_amount: null,
      reward_amount: null,
      basic_info: {},
      verify_info: {},
      bonus_info: {}
    };

    const otherPermission = {
      lock: 'activity:data:venue:lock',
      check: 'activity:data:venue:check',
      send: 'activity:data:venue:send',
      view: 'activity:data:venue:view'
    };

    const state = reactive({
      dialogForm: Object.assign({}, defaulSendForm)
    });

    const dict: any = reactive({
      bunus_type_options: [],
      venue_options: [],
      reward_status_options: []
    });
    let dialogData: any = ref([]);

    let dialogType = ref('send');
    function sendBonus(row: any) {
      dialogType.value = 'send';
      detailDialog.value = true;
      Object.assign(state.dialogForm, row);
    }

    function changeLockupStatus(row: any) {
      const params = {
        id: row.id,
        order_lockup: row.order_lockup
      };
      Api.sportsLockOrder(params)
        .then((res: any) => {
          if (res.code == 1) {
            ElMessage.success(res.msg || res.message);
          } else {
            ElMessage.error(res.msg || res.message);
          }
        })
        .finally(() => {
          crud.refresh();
        });
    }

    async function checkBonus(row: any) {
      dialogType.value = 'check';
      detailDialog.value = true;
      Object.assign(state.dialogForm, row);
    }

    function checkEven(status: any) {
      proxy.$refs['crudDefaultForm'].validate((valid: any) => {
        if (valid) {
          const params = {
            ...state.dialogForm,
            reward_status: status
          };
          Api.sportsOrderVerify(params).then((data: any) => {
            console.log(data);
            if (data.code == 1) {
              dialogType.value = '';
              detailDialog.value = false;
              crud.refresh();
            }
            ElMessage.success(data.msg || data.message);
          });
        }
      });
    }

    function sendEven(status: any) {
      proxy.$refs['crudDefaultForm'].validate((valid: any) => {
        if (valid) {
          const params = {
            ...state.dialogForm,
            reward_status: status
          };
          Api.sportsSendBonus(params).then((data: any) => {
            if (data.code == 1) {
              dialogType.value = '';
              detailDialog.value = false;
              crud.refresh();
            }
            ElMessage.success(data.msg || data.message);
          });
        }
      });
    }

    async function viewBonus(row: any) {
      dialogType.value = 'view';
      detailDialog.value = true;
      const params = {
        id: row.id
      };
      state.dialogForm.basic_info = {};
      state.dialogForm.verify_info = {};
      state.dialogForm.bonus_info = {};
      const { code, data, msg } = await (<any>Api.sportsDetail(params));
      dialogLoading.value = false;
      if (code === 1) {
        state.dialogForm.basic_info = {};
        state.dialogForm.verify_info = {};
        state.dialogForm.bonus_info = {};
        Object.assign(state.dialogForm, data);
      }
    }

    function setImgId(form: any) {
      state.dialogForm.img_id = form.img_id;
      state.dialogForm.verify_url = form.verify_url;
    }

    function setSendImgId(form: any) {
      state.dialogForm.img_id = form.img_id;
      state.dialogForm.reward_url = form.reward_url;
    }

    function closeDialog() {
      detailDialog.value = false;
      state.dialogForm = Object.assign({}, defaulSendForm);
    }

    const operateId = computed(() => {
      return store.getters.user.username;
    });

    function btnStatus(lId: any, oId: any, lStatus: any, rewardStatus: any) {
      // 账号没有解除锁单权限
      // 1.自己账号锁单后才可审核该笔订单
      // 2.自己账号锁单后可解锁自己账号锁定的订单

      // 账号有解除锁单权限
      // 1.自己账号锁单后才可审核该笔订单
      // 2.自己账号锁单后可解锁自己账号锁定的订单
      // 3.1）可解锁别人账号锁单的订单，解锁后，重新锁定，才可审核。
      // 2）别人账号中该笔订单为锁定状态，如果没有解锁权限，则不可解除锁单
      let result = ['info', true, true];
      if (crud.crudFindRole.only(otherPermission.lock)) {
        if (lStatus == 2) {
          result = ['primary', false, false];
        } else {
          result = ['info', false, true];
        }
      } else {
        if (lStatus == 2) {
          if (lId == oId) {
            result = ['primary', false, false];
          } else {
            result = ['info', true, true];
          }
        } else {
          result = ['info', false, true];
        }
      }
      if (rewardStatus == 3 || rewardStatus == 4 || rewardStatus == 5) {
        result = ['info', true, true];
      }
      return result;
    }

    onMounted(async () => {
      [
        dict.bunus_type_options,
        dict.venue_options,
        dict.reward_status_options
      ] = await Promise.all([
        getDicts('bunus_type_options'),
        getDicts('venue_options'),
        getDicts('reward_status_options')
      ]);
    });

    return {
      ...crud,
      detailDialog,
      dialogData,
      setImgId,
      btnStatus,
      operateId,
      setSendImgId,
      getLabel,
      otherPermission,
      changeLockupStatus,
      checkBonus,
      sendBonus,
      viewBonus,
      sendEven,
      dialogType,
      checkEven,
      closeDialog,
      ...toRefs(dict),
      ...toRefs(state),
      dialogLoading
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
<style lang="scss">
.activity-data-dialog {
  .el-dialog__headerbtn {
    width: 41px;
    height: 41px;
    &:focus .el-dialog__close {
      color: #fff;
    }
    &:hover .el-dialog__close {
      color: #fff;
    }
  }
}
</style>
