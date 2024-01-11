<template>
  <div class="main-container">
    <crudOperation title="router.proxy-application-audit">
      <template #query>
        <el-form-item :label="$t('table.application_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="create_time_start"
            endKey="create_time_end"
            :propTime="[crudQuery.create_time_start, crudQuery.create_time_end]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.audit_time')">
          <dateTimePickerQuery
            @setTime="crudSetQueryKey"
            startKey="check_finish_time_start"
            endKey="check_finish_time_end"
            :propTime="[
              crudQuery.check_finish_time_start,
              crudQuery.check_finish_time_end
            ]"
          />
        </el-form-item>
        <el-form-item :label="$t('table.audit_status')">
          <el-select
            v-model="crudQuery.check_status"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.audit_status')"
            clearable
          >
            <el-option
              v-for="item in audit_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_lock')">
          <el-select
            v-model="crudQuery.is_lock"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('table.is_lock')"
            clearable
          >
            <el-option
              v-for="item in is_lock_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input
            style="width: 200px"
            v-model.trim="crudQuery.username"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.audit_user')">
          <el-input
            style="width: 200px"
            v-model.trim="crudQuery.reviewer_name"
            clearable
          ></el-input>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="750px"
          default-expand-all
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="is_lock"
            :label="$t('table.is_lock')"
            min-width="80"
            align="center"
          >
            <template #default="scope">
              <el-switch
                :permission="otherPermission.lock"
                v-model="scope.row.is_lock"
                :active-value="1"
                @change="changeOrderStatus(scope.row)"
                :inactive-value="0"
                :disabled="
                  btnStatus(
                    scope.row.lock_admin_id,
                    userId,
                    scope.row.is_lock,
                    scope.row.check_status
                  )[1]
                "
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="申请人"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{
                scope.row.information == '管理员添加总代'
                  ? scope.row.reviewer_name
                  : scope.row.username
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.application_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="connect"
            :label="$t('table.contact_no')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="member_name"
            label="申请账号"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="information"
            :label="$t('table.remark')"
            min-width="220"
            align="center"
          />
          <el-table-column
            prop="check_status"
            :label="$t('table.audit_status')"
            min-width="100"
            align="center"
          >
            <template #default="scope">
              <el-tag
                :type="
                  scope.row.check_status == 1
                    ? ''
                    : scope.row.check_status == 2
                    ? 'warning'
                    : 'danger'
                "
                effect="dark"
                >{{
                  getLabel(scope.row.check_status, audit_status_options)
                }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="reviewer_name"
            :label="$t('table.audit_user')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ scope.row.check_status == 1 ? '-' : scope.row.reviewer_name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="audit_time"
            :label="$t('table.audit_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <span>{{
                scope.row.check_status == 1
                  ? '-'
                  : parseTime(
                      String(scope.row.check_finish_time).padEnd(13, '0'),
                      '{y}-{m}-{d} {h}:{i}:{s}'
                    )
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('table.operate')"
            min-width="140"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                :type="
                  btnStatus(
                    scope.row.lock_admin_id,
                    userId,
                    scope.row.is_lock,
                    scope.row.check_status
                  )[0]
                "
                v-if="scope.row.check_status == 1"
                v-only="otherPermission.audit"
                :disabled="
                  btnStatus(
                    scope.row.lock_admin_id,
                    userId,
                    scope.row.is_lock,
                    scope.row.check_status
                  )[2]
                "
                size="small"
                @click="toPath(scope.row)"
                >{{ $t('table.audit') }}</el-button
              >
              <el-button
                type="primary"
                @click="toPath(scope.row)"
                v-only="otherPermission.view"
                size="small"
                v-else
                >{{ $t('table.end_audit') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/user-manage/proxy-application-audit';
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { getDicts } from '@/utils/dictApi';
import { useStore } from '@/store';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '审核',
  crudOptShow: {
    operate: false
  },
  crudTableParams: 'data',
  defaultQuery: {
    username: null,
    code: null,
    agent_type: 0,
    date_value_create: []
  },
  crudMethod: { ...Api },
  defaultForm: {},
  crudTag: 'proxy:apply:'
};

export default defineComponent({
  name: 'proxy-application-audit',
  components: { crudOperation, udOperation, dateTimePickerQuery },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const dict = reactive({
      is_lock_options: [],
      audit_status_options: []
    });

    const otherPermission = {
      view: 'proxy:apply:view',
      lock: 'proxy:apply:lock',
      audit: 'proxy:apply:audit'
    };

    const store = useStore();

    const router = useRouter();

    const userId = computed(() => {
      return store.getters.user.admin_user_id;
    });

    const { getLabel } = dictionary();

    function toPath(row: any) {
      router.push({
        name: 'proxy-audit-info',
        query: {
          status: row.check_status,
          id: row.id,
          agent_type: 0,
          user_id: row.user_id,
          username: row.username
        }
      });
    }

    function changeOrderStatus(row: any) {
      const params = { id: row.id };
      Api.toLockOrder(params)
        .then((res: any) => {
          if (res.code !== 1) {
            ElMessage.error(res.msg);
          }
          crud.toQuery();
        })
        .catch(() => {
          crud.toQuery();
        });
    }

    function btnStatus(lId: any, oId: any, lStatus: any, check_status: any) {
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
        if (lStatus == 1) {
          result = ['primary', false, false];
        } else {
          result = ['info', false, true];
        }
      } else {
        if (lStatus == 1) {
          if (lId == oId) {
            result = ['primary', false, false];
          } else {
            result = ['info', true, true];
          }
        } else {
          result = ['info', false, true];
        }
      }
      if (check_status === 2) {
        result = ['info', true, true];
      }
      return result;
    }

    onMounted(async () => {
      [dict.is_lock_options, dict.audit_status_options] = await Promise.all([
        getDicts('is_lock_options'),
        getDicts('audit_status_options')
      ]);
    });

    return {
      ...crud,
      btnStatus,
      getLabel,
      ...toRefs(dict),
      userId,
      toPath,
      changeOrderStatus,
      otherPermission
    };
  }
});
</script>
