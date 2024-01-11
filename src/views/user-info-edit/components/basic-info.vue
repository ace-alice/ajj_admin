<template>
  <div v-loading="pageLoad">
    <!-- <el-page-header @back="goBack">
      <template #content>
        <el-button type="primary">
          <el-icon><refresh /></el-icon>
          {{ $t('tagsView.refresh') }}
        </el-button>
      </template>
    </el-page-header> -->
    <!-- <template #extra> -->
    <div class="botton-wrap">
      <div class="el-descriptions__title botton-wrap__title">
        {{ $t('table.summary_info') }}
      </div>
      <div class="botton-wrap__list">
        <el-button type="primary" @click="toQuery(1)">
          <el-icon><refresh /></el-icon>
          {{ $t('tagsView.refresh') }}
        </el-button>
        <el-button
          type="primary"
          @click="toEdit('status')"
          v-only="otherPermission.changeStatus"
        >
          {{ $t('table.account_status') }}
        </el-button>
        <el-button
          type="primary"
          @click="toEdit('birthday')"
          v-only="otherPermission.changeBirthday"
        >
          {{ $t('table.birthday1') }}
        </el-button>
        <el-button
          type="primary"
          @click="toEdit('password')"
          v-only="otherPermission.changePassword"
          >{{ $t('table.login_password') }}</el-button
        >
        <el-popconfirm
          :title="$t(`table.unbind_charge_confirm_sentence`)"
          @confirm="liftDepositLimitHandle"
        >
          <template #reference>
            <el-button type="primary" v-only="otherPermission.liftDepositLimit">
              {{ $t('table.remove_limit') }}
            </el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" @click="toEdit('payType')">{{
          $t('table.pay_type_manage') /**支付类型管理 */
        }}</el-button>
        <!-- 不是总代，且没有上级代理的会员才能被设为总代 -->
        <el-button
          v-if="
            allData.memberInfo.account_type != 2 &&
            !allData.memberInfo.senior_member_username
          "
          type="primary"
          @click="visiable = !visiable"
          >{{ $t('table.setting_total_agent' /**设置总代 */) }}
          {{ allData.memberInfo.senior_member_username }}</el-button
        >
      </div>
    </div>
    <el-descriptions :column="5" border direction="vertical">
      <el-descriptions-item :label="$t('table.bet_username')" align="center">
        {{ allData.memberInfo.username }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.account_type')" align="center">
        {{ getLabel(allData.memberInfo.account_type, account_type_options) }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.account_status')" align="center">
        <el-tag
          type="info"
          style="margin: 5px"
          v-show="allData.memberInfo.status_game"
          >{{ getLabel(2, account_status_options) }}</el-tag
        >
        <el-tag
          type="warning"
          style="margin: 5px"
          v-show="allData.memberInfo.status_login"
          >{{ getLabel(3, account_status_options) }}</el-tag
        >
        <el-tag
          type="danger"
          style="margin: 5px"
          v-show="allData.memberInfo.status_pay"
          >{{ getLabel(1, account_status_options) }}</el-tag
        >
        <el-tag
          type="success"
          style="margin: 5px"
          v-show="
            !(
              allData.memberInfo.status_game ||
              allData.memberInfo.status_login ||
              allData.memberInfo.status_pay
            )
          "
          >{{ getLabel(0, account_status_options) }}</el-tag
        >
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.danger_level')" align="center">
        {{ allData.memberInfo.risk_control_mark }}
      </el-descriptions-item>
      <el-descriptions-item
        v-if="allData.memberInfo.account_type != 0"
        :label="$t('table.proxy_level')"
        align="center"
        min-width="120px"
      >
        {{ getLabel(allData.memberInfo.hierarchy, agent_level_options) }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.days_without_deposit')"
        align="center"
      >
        {{ allData.memberInfo.no_login_days }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.superior_user')" align="center">
        {{ allData.memberInfo.senior_member_username }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.first_deposit_time')"
        align="center"
      >
        {{ allData.memberInfo.first_deposit_time }}
      </el-descriptions-item>
      <el-descriptions-item
        :label="$t('table.first_deposit_amount')"
        align="center"
      >
        {{ allData.memberInfo.first_deposit_amount }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.login_time')" align="center">
        {{ allData.memberInfo.login_time }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.create_time_1')" align="center">
        {{ allData.memberInfo.create_time }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.register_ip')" align="center">
        {{ allData.memberInfo.register_ip }}
      </el-descriptions-item>
      <el-descriptions-item label="IP归属地" align="center">
        {{ allData.memberInfo.ip_local }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.register_device')" align="center">
        {{
          getLabel(allData.memberInfo.register_terminal, terminal_type_options)
        }}
      </el-descriptions-item>
    </el-descriptions>

    <el-descriptions
      :title="$t('table.user_detail')"
      :column="3"
      border
      direction="vertical"
    >
      <el-descriptions-item :label="$t('table.account_name')" align="center">
        {{ allData.memberInfo.account_name }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.birthday1')" align="center">
        {{ allData.memberInfo.birthday }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.phone')" align="center">
        {{ allData.memberInfo.phone }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.email')" align="center">
        {{ allData.memberInfo.email }}
      </el-descriptions-item>
      <el-descriptions-item label="推广码" align="center">
        {{ allData.memberInfo.invitation_code || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="推广链接" align="center">
        {{ allData.memberInfo.invitation_url || '-' }}
      </el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="VIP信息" :column="4" border direction="vertical">
      <el-descriptions-item :label="$t('table.vip_level')" align="center">
        VIP {{ allData.memberInfo.vip_current_level }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('table.vip_experience')" align="center">
        {{ allData.memberInfo.vip_experience }}
      </el-descriptions-item>
    </el-descriptions>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>{{ $t('table.remark') }}</span>
          <el-button
            class="button"
            type="primary"
            @click="addRemarkHandle"
            v-only="otherPermission.addRemark"
            >{{ $t('table.add_remark') }}</el-button
          >
        </div>
      </template>
      <el-table :data="allData.remarkInfo.data" border style="width: 100%">
        <el-table-column
          type="index"
          width="80"
          :label="$t('table.sort')"
          align="center"
        />
        <el-table-column
          prop="create_time"
          :label="$t('table.update_time1')"
          width="160"
          align="center"
        />
        <el-table-column
          prop="remark_info"
          :label="$t('table.remark')"
          align="center"
        />
        <el-table-column
          prop="create_name"
          :label="$t('table.remark_role')"
          align="center"
          width="120"
        />
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:currentPage="fromData.page"
          v-model:page-size="fromData.limit"
          :page-sizes="[10, 100, 200, 300, 400]"
          :small="false"
          layout="total, sizes, prev, pager, next"
          :total="allData.remarkInfo.total"
          @size-change="toQuery"
          @current-change="toQuery"
        />
      </div>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
    >
      <el-form
        ref="ruleFormRef"
        :model="form"
        status-icon
        :rules="rules"
        label-width="120px"
      >
        <template v-if="editType == 'password'">
          <el-form-item :label="$t('table.password')" prop="password">
            <el-input
              v-model.trim="form.password"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.password_repeat')"
            prop="password_repeat"
          >
            <el-input
              v-model.trim="form.password_repeat"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
        </template>
        <template v-if="editType == 'status'">
          <el-form-item :label="$t('table.status_pay')" prop="status_pay">
            <el-switch
              v-model="form.status_pay"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.status_game')" prop="status_game">
            <el-switch
              v-model="form.status_game"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item :label="$t('table.status_login')" prop="status_login">
            <el-switch
              v-model="form.status_login"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </template>
        <template v-if="editType == 'birthday'">
          <el-form-item :label="$t('table.birthday1')" prop="member_birthday">
            <el-date-picker
              v-model="form.member_birthday"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :placeholder="$t('table.birthday1')"
            />
          </el-form-item>
        </template>
        <!-- 支付类型 -->
        <template v-if="editType == 'payType'">
          <el-form-item
            v-for="item in payTypeChannel.riskChannelList"
            :key="item.channel_name"
            :label="item.channel_name"
          >
            <div class="risk-channel-row">
              <el-switch
                v-model="item.disable"
                :active-value="1"
                :inactive-value="2"
                @change="updataChannelStatus(item)"
              />
              <span class="color-warning">{{
                item.disable === 1 ? '正常' : '禁用'
              }}</span>
            </div>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{
            $t('user.logOutCancel')
          }}</el-button>
          <el-button
            v-if="editType != 'payType'"
            type="primary"
            @click="handleSure"
            >{{ $t('user.logOutConfirm') }}</el-button
          >
        </span>
      </template>
    </el-dialog>
    <total-agent-modal
      :visiable="visiable"
      :memberId="memberId"
      @close="visiable = false"
    >
    </total-agent-modal>
  </div>
</template>

<script lang="ts">
import {
  getMemberBaseInfo,
  changeStatus,
  changePassword,
  addRemark,
  changeBirthday,
  liftDepositLimit,
  getRiskChannel,
  riskChannelSet
} from '@/api/user-manage/user-config';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { ElNotification } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus/lib/components';
import totalAgentModal from '../modal/totalAgentModal.vue';
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  Ref,
  ref,
  toRefs
} from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default defineComponent({
  name: 'basic-info',
  components: { totalAgentModal },
  setup() {
    const router = useRouter();
    function goBack() {
      router.push({ name: 'user-config' });
    }

    const allData: any = reactive({
      memberInfo: {
        username: ''
      },
      remarkInfo: {
        total: 0,
        per_page: 0,
        current_page: 1,
        last_page: 0,
        data: []
      }
    });

    const otherPermission = {
      changeStatus: 'user:config:changeStatus',
      changeBirthday: 'user:config:changeBirthday',
      addRemark: 'user:config:addRemark',
      changePassword: 'user:config:changePassword',
      liftDepositLimit: 'user:config:liftDepositLimit'
    };

    const route = useRoute();
    const visiable = ref(false);
    const agent = reactive({
      name: ''
    });
    const memberId = computed(() => {
      return route.query.member_id;
    });

    const fromData: any = reactive({
      page: 1,
      limit: 10,
      member_id: null
    });

    const pageLoad = ref(false);

    function toQuery(page?: number) {
      if (page) fromData.page = page;
      pageLoad.value = true;
      getMemberBaseInfo(fromData)
        .then((result: any) => {
          if (result.code == 1) {
            Object.assign(allData, result.data);
          }
        })
        .finally(() => {
          pageLoad.value = false;
        });
    }

    // 会员详情->解除充值限制
    function liftDepositLimitHandle() {
      liftDepositLimit({ member_id: memberId.value }).then((result: any) => {
        if (result.code == 1) {
          ElNotification.success(result.msg || result.message);
          toQuery(1);
        } else {
          ElMessage.error(result.msg || result.message);
        }
      });
    }

    // 添加备注
    function addRemarkHandle() {
      ElMessageBox.prompt('请输入备注信息', '添加备注', {
        confirmButtonText: '添加',
        cancelButtonText: '取消',
        inputPattern: /^.+$/,
        inputErrorMessage: '备注不能为空',
        inputType: 'textarea'
      })
        .then(({ value }) => {
          addRemark({ member_id: memberId.value, remark_info: value }).then(
            (result: any) => {
              if (result.code == 1) {
                ElNotification.success(result.msg || result.message);
                toQuery(1);
              } else {
                ElMessage.error(result.msg || result.message);
              }
            }
          );
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '暂不添加'
          });
        });
    }

    const form = reactive({
      status_pay: null,
      status_game: null,
      status_login: null,
      member_birthday: null,
      password: null,
      password_repeat: null
    });

    //支付渠道管理列表
    const payTypeChannel = reactive({
      riskChannelList: []
    });

    const dialogVisible = ref(false);

    const editType: Ref<
      'birthday' | 'password' | 'status' | 'payType' | ''
    > = ref('');

    function toEdit(type: 'birthday' | 'password' | 'status' | 'payType') {
      editType.value = type;
      switch (type) {
        case 'birthday':
          Object.assign(form, { member_birthday: allData.memberInfo.birthday });
          break;
        case 'password':
          break;
        case 'status':
          Object.assign(form, {
            status_login: allData.memberInfo.status_login,
            status_pay: allData.memberInfo.status_pay,
            status_game: allData.memberInfo.status_game
          });
          break;
        case 'payType':
          getRiskChannelList();
          break;
      }
      dialogVisible.value = true;
    }

    const { proxy } = getCurrentInstance() as any;
    //获取用户支付渠道列表
    const getRiskChannelList = () => {
      getRiskChannel({ member_id: memberId.value }).then((result: any) => {
        console.log(result);
        if (result.code == 1) {
          payTypeChannel.riskChannelList = result.data;
          console.log('riskChannelList', payTypeChannel.riskChannelList);
        } else {
          payTypeChannel.riskChannelList = [] as never;
        }
      });
    };

    //修改用户支付渠道状态
    const updataChannelStatus = (item: any) => {
      console.log('item', item);
      const { id, disable } = item;
      riskChannelSet({
        channel_id: id,
        disable,
        member_id: memberId.value
      }).then((result: any) => {
        if (result.code == 1) {
          ElNotification.success(result.msg || result.message);
        } else {
          ElMessage.error(result.msg || result.message);
        }
      });
    };

    function handleSure() {
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          switch (editType.value) {
            case 'birthday':
              changeBirthday({
                member_id: memberId.value,
                member_birthday: form.member_birthday
              }).then((result: any) => {
                if (result.code == 1) {
                  ElNotification.success(result.msg || result.message);
                  dialogVisible.value = false;
                  toQuery(1);
                } else {
                  ElMessage.error(result.msg || result.message);
                }
              });
              break;
            case 'password':
              changePassword({
                member_id: memberId.value,
                password: form.password,
                password_repeat: form.password_repeat
              }).then((result: any) => {
                if (result.code == 1) {
                  ElNotification.success(result.msg || result.message);
                  dialogVisible.value = false;
                  toQuery(1);
                } else {
                  ElMessage.error(result.msg || result.message);
                }
              });
              break;
            case 'status':
              changeStatus({
                member_id: memberId.value,
                status_pay: form.status_pay,
                status_game: form.status_game,
                status_login: form.status_login
              }).then((result: any) => {
                if (result.code == 1) {
                  ElNotification.success(result.msg || result.message);
                  dialogVisible.value = false;
                  toQuery(1);
                } else {
                  ElMessage.error(result.msg || result.message);
                }
              });
              break;
          }
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    const validatePass = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('Please input the password'));
      } else {
        if (form.password) {
          if (!proxy.$refs['ruleFormRef']) return;
          proxy.$refs['ruleFormRef'].validateField('checkPass', () => null);
        }
        callback();
      }
    };
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (!value) {
        callback(new Error('Please input the password again'));
      } else if (value !== form.password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };

    const rules = reactive({
      password: [{ validator: validatePass, trigger: 'blur' }],
      password_repeat: [{ validator: validatePass2, trigger: 'blur' }],
      member_birthday: [
        { require: true, message: '请选择生日', trigger: 'blur' }
      ]
    });

    function handleClose() {
      Object.assign(form, {
        status_pay: 1,
        status_game: 1,
        status_login: 1,
        member_birthday: null,
        password: null,
        password_repeat: null
      });
      editType.value = '';
      dialogVisible.value = false;
    }

    const dict = reactive({
      agent_level_options: [],
      account_type_options: [],
      terminal_type_options: [],
      account_status_options: []
    });

    const { getLabel } = dictionary();

    onMounted(() => {
      console.log('allData', allData);
      nextTick(async () => {
        setTimeout(() => {
          fromData.member_id = memberId.value;
          toQuery();
        }, 100);
        [
          dict.agent_level_options,
          dict.account_type_options,
          dict.terminal_type_options,
          dict.account_status_options
        ] = await Promise.all([
          getDicts('agent_level_options'),
          getDicts('account_type_options'),
          getDicts('terminal_type_options'),
          getDicts('account_status_options')
        ]);
      });
    });

    onActivated(() => {
      nextTick(async () => {
        setTimeout(() => {
          fromData.member_id = memberId.value;
          toQuery();
        }, 100);
        [
          dict.account_type_options,
          dict.terminal_type_options,
          dict.account_status_options
        ] = await Promise.all([
          getDicts('account_type_options'),
          getDicts('terminal_type_options'),
          getDicts('account_status_options')
        ]);
      });
    });

    return {
      goBack,
      allData,
      toQuery,
      pageLoad,
      fromData,
      liftDepositLimitHandle,
      addRemarkHandle,
      dialogVisible,
      visiable,
      form,
      agent,
      handleSure,
      handleClose,
      toEdit,
      rules,
      editType,
      memberId,
      getLabel,
      ...toRefs(dict),
      otherPermission,
      getRiskChannel,
      payTypeChannel,
      updataChannelStatus
    };
  }
});
</script>

<style lang="scss" scoped>
.botton-wrap {
  display: flex;
  justify-content: space-between;
  line-height: 32px;
}
:deep(.el-descriptions) {
  margin: 15px 0;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}
.pagination {
  margin: 20px 0;
  display: flex;
  flex-direction: row-reverse;
}
.el-input {
  width: 60% !important;
}
.risk-channel-row {
  margin-left: 35px;
  > span {
    margin-left: 15px;
    display: inline-block;
    width: 44px;
    line-height: 22px;
    text-align: center;
    color: #f48d11;
    border: 1px solid #f48d11;
    border-radius: 4px;
  }
}
</style>
