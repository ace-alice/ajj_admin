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
          :label="$t('table.type')"
          prop="identity"
          :rules="[
            {
              required: true,
              message: $t('table.type') + $t('table.not_empty')
            }
          ]"
        >
          <el-select
            v-model="form.identity"
            style="width: 350px"
            popper-class="type-select"
            @change="typeChange"
          >
            <el-option
              v-for="item in market_address_type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.address')"
          prop="address"
          :rules="[
            {
              required: true,
              message: $t('table.address') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.address"
            :placeholder="$t('table.address')"
            style="width: 350px"
          />
        </el-form-item>
        <el-form-item
          :label="$t('table.remark')"
          prop="content"
          :rules="[
            {
              required: true,
              message: $t('table.remark') + $t('table.not_empty')
            }
          ]"
        >
          <el-input
            v-model.trim="form.content"
            maxlength="50"
            :placeholder="$t('table.remark')"
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
        v-if="addressInfo.address != null"
        :loading="loading"
      >
        <el-form-item :label="$t('table.address')">{{
          addressInfo.address
        }}</el-form-item>
        <el-form-item :label="$t('table.remark')">{{
          addressInfo.content
        }}</el-form-item>
        <el-form-item :label="$t('table.action_name')">{{
          addressInfo.update_name
        }}</el-form-item>
        <el-form-item :label="$t('table.update_time')">
          <span v-if="addressInfo.update_time">{{
            $parseTime(Number(String(addressInfo.update_time).padEnd(13, '0')))
          }}</span>
        </el-form-item>
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
import { getAddressInfo, addAddress } from '@/api/market-manage/market-config';
import { ElNotification } from 'element-plus';
import { getDicts } from '@/utils/dictApi';

const defaultAddr: any = {
  address: null,
  admin_id: null,
  admin_name: null,
  update_name: null,
  content: null,
  id: null,
  identity: null,
  identity_str: null,
  update_time: null
};

export default defineComponent({
  name: 'market-address',
  setup(props, { emit }) {
    const loading = ref(false);

    const { proxy } = getCurrentInstance() as any;

    let form: any = reactive({
      identity: 1,
      address: '',
      content: ''
    });
    let addressInfo: any = reactive({
      address: '',
      admin_id: null,
      admin_name: null,
      update_name: null,
      content: null,
      id: null,
      identity: null,
      identity_str: null,
      update_time: null
    });
    function toQuery() {
      loading.value = true;
      Object.assign(form, { address: '', content: '' });

      getAddressInfo({ identity: form.identity })
        .then((result: any) => {
          if (result.code == 1) {
            Object.keys(addressInfo).map((item: any) => {
              addressInfo[item] = result.data[item] || defaultAddr[item];
            });
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          loading.value = true;
          addAddress(form)
            .then((result: any) => {
              if (result.code == 1) {
                toQuery();
                ElNotification.success(result.msg);
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

    const dict = reactive({ market_address_type_options: [] });

    const editPermission = {
      edit: 'market:address:edit'
    };

    async function typeChange() {
      await toQuery();
      proxy.$refs['ruleFormRef'].clearValidate();
    }

    onMounted(async () => {
      [dict.market_address_type_options] = await Promise.all([
        getDicts('market_address_type_options')
      ]);
      setTimeout(() => {
        if (dict.market_address_type_options.length > 0) {
          form.id = (dict.market_address_type_options[0] as any).value;
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
      addressInfo
    };
  }
});
</script>

<style lang="scss">
.type-select {
  min-width: 350px;
}
</style>
