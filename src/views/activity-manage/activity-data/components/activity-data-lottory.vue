<template>
  <div class="main-container">
    <crudOperation title="">
      <template #query>
        <el-form-item label="活动名称">
          <el-select
            v-model="crudQuery.activity_name"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in activityList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="领取时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="receive_time_start"
            endKey="receive_time_end"
            :propTime="[
              crudQuery.receive_time_start,
              crudQuery.receive_time_end
            ]"
          />
        </el-form-item>
        <el-form-item label="派奖时间">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="send_time_start"
            endKey="send_time_end"
            :propTime="[
              crudQuery.send_time_start,
              crudQuery.send_time_end
            ]"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model.trim="crudQuery.member_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务名称">
          <el-input
            v-model.trim="crudQuery.task_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="领取状态">
          <el-select
            v-model="crudQuery.receive_status"
            popper-class="user-select"
            style="width: 200px"
            clearable
          >
            <el-option
              v-for="item in bonus_send_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="tableData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          :span-method="arraySpanMethod"
          border
          max-height="600px"
          :cell-style="{ border: '1px solid rgba(27, 39, 61, .5)' }"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="activity_id"
            label="活动ID"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="activity_name"
            label="活动名称"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="member_name"
            :label="$t('table.bet_username')"
            min-width="140"
            align="center"
          />
          <el-table-column
            prop="nick_name"
            label="昵称"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="already_lottery_time"
            label="已抽奖次数"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="prize_name"
            label="中奖奖品"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="receive_status"
            label="领取状态"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <span>{{
                getLabel(scope.row.receive_status, bonus_send_status_options)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="领取时间"
            min-width="180"
            align="center"
          />
          <el-table-column
            prop="send_time"
            label="派奖时间"
            min-width="180"
            align="center"
          />
          <el-table-column label="操作" min-width="160" align="center">
            <template #default="scope">
              <el-button
                v-if="scope.row.receive_status == 0"
                v-only="otherPermission.send"
                type="text"
                style="color: #008dff"
                @click="sendBonus(scope.row)"
                >派奖</el-button
              >
              <el-button
                v-if="scope.row.receive_status == 1"
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
      :title="dialogType === 'send' ? '派发奖励' : '详情'"
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
        <template v-if="dialogType === 'send'">
          <el-form-item label="奖品" prop="prize_name">
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.prize_name"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="奖品金额" prop="prize_price">
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.prize_price"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="派发方式"
            prop="send_type"
            :rules="[
              {
                required: true,
                message: '派发方式' + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="dialogForm.send_type"
              style="width: 300px"
              popper-class="user-select"
              clearable
            >
              <el-option
                v-for="item in bunus_type_options"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="派发地址"
            prop="address"
            v-if="dialogForm.send_type == 1"
            :rules="[
              {
                required: true,
                message: '派发地址' + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="dialogForm.address"
              :autosize="{ minRows: 3, maxRows: 4 }"
              type="textarea"
              style="width: 300px"
              :maxlength="100"
              show-word-limit
              :placeholder="$t('table.apply_remark_placeholder')"
            />
          </el-form-item>
          <br />
          <NomalImageUpload
            @setImage="setImgId"
            formLabel="上传图片`"
            :data="dialogForm.img_url"
            imgkey="img_id"
            imgUrlKey="img_url"
          />
        </template>
        <template v-if="dialogType === 'view'">
          <el-form-item label="奖品" prop="prize_name">
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.prize_name"
              disabled
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item label="奖品金额" prop="prize_price">
            <el-input
              style="width: 300px"
              v-model.trim="dialogForm.prize_price"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item
            label="派发地址"
            prop="address"
            v-if="dialogForm.send_type == 1"
          >
            <el-input
              v-model.trim="dialogForm.address"
              :autosize="{ minRows: 3, maxRows: 4 }"
              type="textarea"
              style="width: 300px"
              :maxlength="100"
              show-word-limit
              disabled
            />
          </el-form-item>
          <br />
          <el-form-item label="派发方式" prop="send_type">
            <p>{{ getLabel(dialogForm.send_type, bunus_type_options) }}</p>
          </el-form-item>
          <br />
          <el-form-item label="奖品图片" prop="img_url">
            <el-image
              style="width: 60px; height: 60px"
              :src="dialogForm.img_url"
              :preview-src-list="[dialogForm.img_url]"
              fit="cover"
            />
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <span class="dialog-footer" v-if="dialogType === 'send'">
          <el-button @click="closeDialog">取消</el-button>
          <el-button primary @click="saveSendBonus">保存</el-button>
        </span>
        <span class="dialog-footer" v-if="dialogType === 'view'">
          <el-button @click="closeDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Api from '@/api/activity-manage/activity-data/activity-data-lottory';
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

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '实物抽奖',
  crudOptShow: {},
  defaultQuery: {
    activity_name: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'activity:data:lottory:'
};

export default defineComponent({
  name: 'activity-data-lottory',
  components: { crudOperation, dateTimePickerQuery, NomalImageUpload },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    const { getLabel } = dictionary();
    const { proxy } = getCurrentInstance() as any;

    const detailDialog = ref(false);
    const dialogLoading = ref(false);
    const defaulSendForm = {
      prize_name: null,
      prize_price: null,
      id: null,
      send_type: null,
      address: null,
      img_id: null,
      img_url: null
    };

    const otherPermission = {
      send: 'activity:data:lottory:send',
      view: 'activity:data:lottory:view'
    };

    const state = reactive({
      dialogForm: Object.assign({}, defaulSendForm)
    });

    const dict: any = reactive({
      bunus_type_options: [],
      bonus_send_status_options: []
    });
    let dialogData: any = ref([]);

    let tableData = computed(() => {
      if (!crud.crudData.value) {
        return [];
      }
      let ret: any = (<any>crud.crudData.value).sort((a: any, b: any) => {
        return a.member_name.localeCompare(b.member_name, 'zh-CN', {
          numeric: true
        });
      });
      return ret;
    });

    let dialogType = ref('send');
    function sendBonus(row: any) {
      dialogType.value = 'send';
      state.dialogForm = Object.assign({}, defaulSendForm);
      state.dialogForm.prize_name = row.prize_name;
      state.dialogForm.prize_price = row.prize_price;
      state.dialogForm.id = row.id;
      detailDialog.value = true;
    }

    async function viewBonus(row: any) {
      dialogType.value = 'view';
      detailDialog.value = true;
      dialogLoading.value = true;
      const params = {
        id: row.id
      };
      const { code, data, msg } = await (<any>Api.lotteryInfo(params));
      dialogLoading.value = false;
      if (code === 1) {
        state.dialogForm = Object.assign({}, data);
      }
    }

    function setImgId(form: any) {
      state.dialogForm.img_id = form.img_id;
      state.dialogForm.img_url = form.img_url;
    }

    function closeDialog() {
      detailDialog.value = false;
      state.dialogForm = Object.assign({}, defaulSendForm);
    }

    function saveSendBonus() {
      proxy.$refs.crudDefaultForm.validate(async (valid: Boolean) => {
        if (valid) {
          const { data, code, msg } = await (<any>(
            Api.sendLottery(state.dialogForm)
          ));
          if (code === 1) {
            ElMessage.success('派发成功！');
            closeDialog();
            crud.toQuery();
          }
        }
      });
    }

    function arraySpanMethod({ row, column, rowIndex, columnIndex }: any) {
      if (columnIndex < 5) {
        // column.property
        const rowSpan: number = tableData.value.filter(
          (item: any) => item.member_name === row.member_name
        ).length;
        if (rowIndex === 0) {
          return {
            rowspan: rowSpan,
            colspan: 1
          };
        } else {
          if (
            (<any>tableData.value[rowIndex - 1]).member_name == row.member_name
          ) {
            return {
              rowspan: 0,
              colspan: 0
            };
          } else {
            const rowSpan: number = tableData.value.filter(
              (item: any) => item.member_name === row.member_name
            ).length;
            return {
              rowspan: rowSpan,
              colspan: 1
            };
          }
        }
      }
    }

    const activityList = ref([])
    function getLotteryActivityList() {
      Api.lotteryActivityList().then((data: any) => {
        activityList.value = data.data
        crud.crudQuery.activity_name = data.data[0].value
        crud.refresh()
      })
    }

    onMounted(async () => {
      await getLotteryActivityList();
      [dict.bunus_type_options, dict.bonus_send_status_options] =
        await Promise.all([
          getDicts('bunus_type_options'),
          getDicts('bonus_send_status_options')
        ]);
    });

    return {
      ...crud,
      activityList,
      detailDialog,
      dialogData,
      setImgId,
      getLabel,
      arraySpanMethod,
      otherPermission,
      sendBonus,
      viewBonus,
      tableData,
      dialogType,
      closeDialog,
      saveSendBonus,
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