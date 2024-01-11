<template>
  <div class="main-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <strong>{{ $t('router.vip-bind-audit-info') }}</strong>
          <div>
            <el-button type="info" @click.stop="toPath">{{
              $t('table.back')
            }}</el-button>
            <el-button
              type="success"
              v-if="otherPermission.check && routeQuery.status == 1"
              @click="pass"
              :loading="loading"
              >{{ $t('lib.audit_passed') }}</el-button
            >
            <el-button
              type="danger"
              v-if="otherPermission.check && routeQuery.status == 1"
              @click="reject"
              :loading="loading"
              >{{ $t('lib.audit_reject') }}</el-button
            >
          </div>
        </div>
      </template>
      <!-- 转入代理信息 -->
      <el-descriptions
        direction="vertical"
        :title="$t('table.trans_proxy_info')"
        :column="routeQuery.status == 1 ? 5 : 4"
        border
      >
        <el-descriptions-item
          :label="$t('table.bet_username')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.agentInfo.username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.account_status')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(auditData.agentInfo.status_login, login_status_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.proxy_level')"
          align="center"
          min-width="120px"
        >
          {{ getLabel($emptyData(auditData.agentInfo.hierarchy), agent_level_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_level')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.agentInfo.risk_control_mark) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="routeQuery.status == 1"
          :label="$t('table.proxy_level')"
          align="center"
          min-width="120px"
        >
          {{ getLabel(auditData.agentInfo.hierarchy, account_type_options) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="routeQuery.status == 1"
          :label="$t('table.invite_code')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.agentInfo.invitation_code) }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- 会员信息 -->
      <el-descriptions
        direction="vertical"
        :title="$t('table.vip_info')"
        :column="5"
        border
      >
        <el-descriptions-item
          :label="$t('table.bet_username')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.memberInfo.username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.account_status')"
          align="center"
          min-width="120px"
        >
          {{
            getLabel(auditData.memberInfo.status_login, login_status_options)
          }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.danger_level')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.memberInfo.risk_control_mark) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.vip_level')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.memberInfo.vip_current_level) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.create_time_1')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.memberInfo.create_time) }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- 申请信息 -->
      <el-descriptions
        direction="vertical"
        :title="$t('table.information')"
        :column="routeQuery.status == 2 ? 4 : 3"
        border
      >
        <el-descriptions-item
          :label="$t('table.apply_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.apply_admin_name) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.apply_time')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.create_time) }}
        </el-descriptions-item>
         <el-descriptions-item
          v-if="routeQuery.status == 2"
          :label="$t('table.invite_code')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.agentInfo.invitation_code) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.remark')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.apply_remark) }}
        </el-descriptions-item>
        <el-descriptions-item :label="$t('table.apply_pics')" align="center" min-width="120px">
          <template v-if="imgList.length > 0">
            <el-image
              v-for="(item, index) in imgList"
              :key="item"
              style="width: 100px; height: 100px"
              :src="item"
              :preview-src-list="imgList"
              :initial-index="index"
              fit="cover"
            />
          </template>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 审核信息 -->
      <el-descriptions
        direction="vertical"
        :title="$t('table.verify_remark')"
        :column="3"
        border
      >
        <el-descriptions-item
          :label="$t('table.audit_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.check_admin_name) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.apply_time')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.check_time) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.remark')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.applyInfo.check_remark) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onMounted,
  reactive,
  Ref,
  ref,
  toRefs
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  doAudit,
  toAudit,
  toLookOrder
} from '@/api/user-manage/vip-bind-apply-list';
import { ElMessage, ElMessageBox } from 'element-plus/lib/components';
import { ElNotification } from 'element-plus';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'vip-bind-apply-info',
  setup() {
    const router = useRouter();
    const route = useRoute();

    function toPath() {
      router.go(-1);
    }

    let dict = reactive({
      agent_level_options: [],
      login_status_options: [],
      account_type_options: []
    });

    const auditData: any = ref({
      agentInfo: {},
      memberInfo: {},
      applyInfo: {}
    });

    const imgList: any = ref([]);

    const otherPermission = {
      check: 'vip:bindlist:audit'
    };

    async function getInfo(status: number) {
      switch (status) {
        case 1:
          const { data, code, msg, message } = await (<any>(
            toAudit({ id: route.query.id })
          ));
          code == 1 ? (auditData.value = data) : null;
          imgList.value =
            JSON.parse(auditData.value.applyInfo.pic_json).map(
              (item: any) => item.url
            ) || [];
          break;
        default:
          const res = await (<any>toLookOrder({ id: route.query.id }));
          res.code == 1 ? (auditData.value = res.data) : null;
          imgList.value =
            JSON.parse(auditData.value.applyInfo.pic_json).map(
              (item: any) => item.url
            ) || [];
          break;
      }
    }

    const pass = () => {
      ElMessageBox.prompt('', '通过备注', {
        confirmButtonText: '通过',
        cancelButtonText: '放弃',
        inputPattern: /^.+$/,
        inputErrorMessage: '备注不能为空',
        inputType: 'textarea'
      })
        .then(async ({ value }) => {
          await toAuditFun(2, value);
          toPath();
        })
        .catch(() => {
          ElMessage.info('放弃');
        });
    };

    const reject = () => {
      ElMessageBox.prompt('', '拒绝备注', {
        confirmButtonText: '拒绝',
        cancelButtonText: '放弃',
        inputPattern: /^\S*$/,
        inputErrorMessage: '备注不能为空',
        inputType: 'textarea'
      })
        .then(async ({ value }) => {
          await toAuditFun(3, value);
          toPath();
        })
        .catch(() => {
          ElMessage.info('放弃');
        });
    };

    const loading = ref(false);
    async function toAuditFun(check_status: number, check_remark: string) {
      loading.value = true;
      await doAudit({
        id: route.query.id,
        check_status,
        check_remark
      })
        .then((result: any) => {
          if (result.code == 1) {
            ElNotification.success(result.msg || result.message);
          } else {
            ElMessage.error(result.msg || result.message);
          }
        })
        .catch(() => {
          ElMessage.error('审核失败');
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const { getLabel } = dictionary();

    onMounted(async () => {
      [dict.agent_level_options, dict.login_status_options, dict.account_type_options] =
        await Promise.all([
          getDicts('agent_level_options'),
          getDicts('login_status_options'),
          getDicts('account_type_options')
        ]);
      await getInfo(Number(route.query.status));
    });

    onActivated(async () => {
      await getInfo(Number(route.query.status));
    })

    return {
      toPath,
      auditData,
      getLabel,
      imgList,
      ...toRefs(dict),
      routeQuery: route.query,
      otherPermission,
      toAudit,
      pass,
      reject,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.el-descriptions + .el-descriptions {
  margin-top: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.el-image) {
  margin: 0 10px;
}
</style>
