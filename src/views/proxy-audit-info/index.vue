<template>
  <div class="main-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <strong>{{ $t('router.proxy-audit-info') }}</strong>
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
      <!-- 申请人信息 -->
      <el-descriptions direction="vertical" :column="4" border>
        <el-descriptions-item
          :label="$t('table.account_type')"
          align="center"
          min-width="120px"
        >
          {{
            getLabel(
              $emptyData(auditData.member_account_type),
              account_type_options
            )
          }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.username')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.member_name) }}
        </el-descriptions-item>
        <!-- <el-descriptions-item
          :label="$t('table.login_password')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.password) }}
        </el-descriptions-item> -->
        <el-descriptions-item
          v-if="routeQuery.agent_type == 0"
          :label="$t('table.superior_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.senior_member_username) }}
        </el-descriptions-item>
      </el-descriptions>

      <el-card style="margin: 30px 0">
        <template #header>
          <div class="card-header">
            <strong>{{ $t('table.rebateRatio') }}</strong>
            <el-select
              v-if="routeQuery.status == 1"
              v-model="template_info.id"
              :placeholder="$t('table.export_template')"
              style="width: 200px"
              popper-class="user-select"
            >
              <el-option
                v-for="item in auditData.templateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%; margin-top: 20px"
            border
          >
            <el-table-column
              type="index"
              :label="$t('table.sort')"
              width="100"
              align="center"
            />
            <el-table-column
              prop="TValue"
              :label="$t('table.profitLossTotal')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.profitLossTotal"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column>
            <!-- <el-table-column
              prop="TValue"
              :label="$t('table.gameFlow')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.gameFlow"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column> -->
            <!-- <el-table-column
              prop="TValue"
              :label="$t('table.monthActive')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.monthActive"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column> -->
            <el-table-column
              prop="TValue"
              :label="$t('table.monthEActive')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                ≥
                <el-input
                  v-model.trim="scope.row.monthEActive"
                  style="width: 100px"
                  type="text"
                  disabled
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="TValue"
              :label="$t('table.rebateRatio')"
              min-width="160"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model.trim="scope.row.rebateRatio"
                  style="width: 100px"
                  type="text"
                  disabled
                />
                %
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>

      <!-- 代理申请信息 -->
      <el-descriptions
        direction="vertical"
        :column="routeQuery.agent_type == 1 ? 4: 3"
        border
        :title="$t('table.information')"
      >
        <el-descriptions-item
          :label="$t('table.apply_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.username) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.apply_time')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(auditData.create_time) }}
        </el-descriptions-item>
        <el-descriptions-item
          v-if="routeQuery.agent_type == 1"
          label="联系方式"
          align="center"
          min-width="160px"
        >
          {{ getLabel($emptyData(auditData.connect_type), connectTypeOptions) }}
          &nbsp;&nbsp;
          {{ $emptyData($parseTime(auditData.connect)) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.information')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.information) }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 审核信息 -->
      <el-descriptions :column="3" border :title="$t('table.audit_info')">
        <el-descriptions-item
          :label="$t('table.audit_user')"
          align="center"
          min-width="120px"
        >
          {{ $emptyData(auditData.reviewer_name) }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.audit_time')"
          align="center"
          min-width="160px"
        >
          {{
            $emptyData(
              auditData.check_finish_time
                ? $parseTime(
                    String(auditData.check_finish_time).padEnd(13, '0')
                  )
                : null
            )
          }}
        </el-descriptions-item>
        <el-descriptions-item
          :label="$t('table.audit_remark')"
          align="center"
          min-width="160px"
        >
          {{ $emptyData(auditData.check_remark) }}
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
} from '@/api/user-manage/proxy-application-audit';
import { ElMessage, ElMessageBox } from 'element-plus/lib/components';
import { ElNotification } from 'element-plus';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'proxy-audit-info',
  setup() {
    const router = useRouter();
    const route = useRoute();
    function toPath() {
      router.back();
    }

    let template_info = reactive({
      id: null,
      config_json: '[]'
    });

    const routeQuery: any = computed(() => {
      return route.query;
    });

    const auditData: any =
      routeQuery.status == 1
        ? ref({
            templateList: []
          })
        : ref({
            templateList: {
              config_json: '[]'
            }
          });

    const otherPermission = {
      check: 'proxy:apply:audit'
    };

    const tableData = computed(() => {
      let ret = [];
      if (Number(route.query.status) === 1) {
        if (auditData.value.templateList.length > 0) {
          ret = JSON.parse(
            auditData.value.templateList.filter(
              (item: any) => item.id === template_info.id
            )[0].config_json || '[]'
          );
        } else {
          ret = [];
        }
      } else {
        ret = JSON.parse(auditData.value.templateList.config_json);
      }
      return ret;
    });

    async function getInfo(status: number) {
      const params = { id: routeQuery.value.id };
      switch (status) {
        case 1:
          const { data, code, msg } = await (<any>toAudit(params));
          if (code == 1) {
            auditData.value = data;
          } else {
            ElMessage.error(msg);
          }
          if (auditData.value.templateList.length > 0) {
            template_info.id = auditData.value.templateList[0].id;
          }
          break;
        default:
          const result = await (<any>toLookOrder(params));
          if (result.code == 1) {
            auditData.value = result.data;
          } else {
            ElMessage.error(result.msg);
          }
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
        id: routeQuery.value.id,
        check_status,
        template_id: template_info.id,
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
    const dict = reactive({
      account_type_options: []
    });

    const connectTypeOptions = [
      { label: '微信', value: 1 },
      { label: 'QQ', value: 2 },
      { label: 'Telegram', value: 3 }
    ]

    onMounted(async () => {
      [dict.account_type_options] = await Promise.all([
        getDicts('account_type_options')
      ]);
      nextTick(async () => {
        await getInfo(Number(routeQuery.value.status));
      });
    });

    onActivated(async () => {
      nextTick(async () => {
        await getInfo(Number(routeQuery.value.status));
      });
    });

    return {
      connectTypeOptions,
      toPath,
      auditData,
      template_info,
      routeQuery,
      otherPermission,
      toAudit,
      pass,
      reject,
      ...toRefs(dict),
      getLabel,
      tableData,
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
</style>
