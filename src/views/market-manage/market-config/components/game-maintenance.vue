<template>
  <div>
    <el-card class="main-container animate__animated animate__fadeInUp">
      <template #header>
        <div class="card-header">
          <el-button
            v-only="editPermission.edit"
            type="primary"
            :loading="loading"
            :icon="$iconMap.Check"
            @click="saveHandle"
          >
            {{ $t('crud.save') }}
          </el-button>
          <el-button
            :loading="loading"
            @click="toQuery"
            :icon="$iconMap.RefreshLeft"
            >{{ $t('crud.reset') }}</el-button
          >
          <el-button
            @click="toClose"
            v-only="editPermission.close"
            type="danger"
            :icon="$iconMap.CircleClose"
            :disabled="addressInfo.header == null"
          >
            {{ $t('table.safeguard_close') }}
          </el-button>
        </div>
      </template>
      <el-form
        :model="form"
        label-width="150px"
        ref="ruleFormRef"
        style="width: 500px"
        v-loading="loading"
      >
        <el-form-item
          :label="$t('table.Safeguard_game')"
          prop="game_id"
          :rules="[
            {
              required: true,
              message: $t('table.Safeguard_game') + $t('table.not_empty')
            }
          ]"
        >
          <el-select
            v-model="form.game_id"
            style="width: 350px"
            popper-class="type-select"
            @change="typeChange"
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
          label="维护开始时间"
          prop="start_time"
          :rules="[
            {
              required: true,
              message: '维护开始时间' + $t('table.not_empty')
            }
          ]"
        >
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="维护开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.safeguard_end_time')"
          prop="end_time"
          :rules="[
            {
              required: true,
              message: $t('table.safeguard_end_time') + $t('table.not_empty')
            }
          ]"
        >
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            :placeholder="$t('table.safeguard_end_time')"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.safeguard_header')"
          prop="header"
          :rules="[
            {
              required: true,
              message: $t('table.safeguard_header') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.header"
            :placeholder="$t('table.safeguard_header')"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.safeguard_content')"
          prop="content"
          :rules="[
            {
              required: true,
              message: $t('table.safeguard_content') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.content"
            maxlength="50"
            :placeholder="$t('table.safeguard_content')"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <el-divider content-position="left">{{
        $t('table.current_addr')
      }}</el-divider>
      <el-form
        :model="addressInfo"
        label-width="150px"
        :loading="loading"
        v-if="addressInfo.header != null"
      >
        <el-form-item :label="$t('table.safeguard_header')">{{
          addressInfo.header
        }}</el-form-item>
        <el-form-item :label="$t('table.start_time')">
          <span v-if="addressInfo.start">{{
            $parseTime(Number(String(addressInfo.start).padEnd(13, '0')))
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.end_time')">
          <span v-if="addressInfo.end">{{
            $parseTime(Number(String(addressInfo.end).padEnd(13, '0')))
          }}</span>
        </el-form-item>
        <el-form-item :label="$t('table.safeguard_content')">{{
          addressInfo.content
        }}</el-form-item>
      </el-form>
      <el-result
        style="width: 500px"
        v-else
        icon="warning"
        :title="$t('table.no_safeguard')"
      >
      </el-result>
    </el-card>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  toRefs
} from 'vue';
import {
  getSafeguard,
  addSafeguard,
  cancelSafeguard
} from '@/api/market-manage/market-config';
import { ElNotification } from 'element-plus';
import { getDicts } from '@/utils/dictApi';

const defaultAddr: any = {
  content: '',
  end_time: null,
  start_time: null,
  header: null,
  start: null
};

export default defineComponent({
  name: 'market-address',
  setup(props, { emit }) {
    const loading = ref(false);

    const { proxy } = getCurrentInstance() as any;

    const form: any = reactive({
      game_id: '',
      end_time: null,
      start_time: null,
      header: '',
      content: ''
    });
    const addressInfo: any = reactive({
      content: '',
      end: null,
      header: null,
      start: null
    });
    function toQuery() {
      loading.value = true;
      Object.assign(form, {
        end_time: null,
        header: '',
        content: '',
        start_time: ''
      });

      getSafeguard({ game_id: form.game_id })
        .then((result: any) => {
          if (result.code == 1) {
            Object.keys(addressInfo).map((item: any) => {
              addressInfo[item] = result.data[item] || defaultAddr[item];
            });
          }
        })
        .finally(() => {
          loading.value = false;
          if (proxy.$refs['ruleFormRef']) {
            proxy.$refs['ruleFormRef'].clearValidate();
          }
        });
    }
    function saveHandle() {
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          loading.value = true;
          addSafeguard(form)
            .then((result: any) => {
              if (result.code == 1) {
                toQuery();
                ElNotification.success(result.msg || result.message);
              }
            })
            .finally(() => {
              loading.value = false;
            });
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    const dict = reactive({ venue_options: [] });

    const editPermission = {
      edit: 'market:maintenance:edit',
      close: 'market:maintenance:close'
    };

    async function typeChange() {
      await toQuery();
      proxy.$refs['ruleFormRef'].clearValidate();
    }

    async function toClose() {
      cancelSafeguard({ game_id: form.game_id }).then((res: any) => {
        if (res.code == 1) {
          addressInfo.header = null;
          toQuery();
          ElNotification.success(res.msg || res.message);
        }
      });
    }

    onMounted(async () => {
      [dict.venue_options] = await Promise.all([getDicts('venue_options')]);
      setTimeout(() => {
        if (dict.venue_options.length > 0) {
          form.game_id = (dict.venue_options[0] as any).value;
        }
        toQuery();
      }, 200);
    });

    return {
      loading,
      toQuery,
      saveHandle,
      form,
      editPermission,
      typeChange,
      ...toRefs(dict),
      addressInfo,
      toClose
    };
  }
});
</script>

<style lang="scss">
.type-select {
  min-width: 350px;
}
</style>
