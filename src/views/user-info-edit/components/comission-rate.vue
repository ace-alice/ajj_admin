<template>
  <div>
    <div class="select-wrap">
      <el-select
        v-model="modelKey"
        style="width: 200px"
        popper-class="user-select"
        @change="changeTemplate"
        :placeholder="$t('table.audit_status')"
        clearable
      >
        <el-option
          v-for="item in templateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>

    <el-table :data="currentConfigArr" style="width: 100%" border>
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
            disabled
            type="text"
          />
        </template>
      </el-table-column>
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
            disabled
            type="text"
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
            disabled
            type="text"
          />
          %
        </template>
      </el-table-column>
    </el-table>
    <div class="submit-wrap">
      <el-button @click="submitRebase" v-loading="isSubmitting" type="primary"
        >{{ $t('table.submit') }}</el-button
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import {
  getRebateTemplateList,
  updateRebateRatio,
  getRebateRatio
} from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components';

export default defineComponent({
  name: 'comission-rate',
  setup() {
    const modelKey = ref(null);
    let templateList: any = ref([]);
    let currentConfigArr = ref([]);

    async function getRebateTemplate() {
      const params = {
        page: 1,
        limit: 1000
      };
      const { data, code, msg } = await (<any>getRebateTemplateList(params));
      if (code === 1) {
        templateList.value = data.data;
      }
    }

    function changeTemplate(val: any) {
      currentConfigArr.value = JSON.parse(
        templateList.value.filter((item: any) => item.id === val)[0].config_json
      );
      console.log(templateList.value);
    }

    const route = useRoute();
    async function getUserRebaseInfo() {
      const params = {
        member_id: route.query.member_id
      };
      const { data, code, msg } = await (<any>getRebateRatio(params));
      if (code === 1) {
        modelKey.value = data.id;
        currentConfigArr.value = JSON.parse(data.config_json);
        console.log(data);
      }
    }

    const isSubmitting = ref(false);
    async function submitRebase() {
      isSubmitting.value = true;
      const params = {
        member_id: route.query.member_id,
        template_id: modelKey.value
      };
      const { code, data, msg } = await (<any>updateRebateRatio(params));
      isSubmitting.value = false;
      if (code === 1) {
        ElMessage.success('修改成功！');
      } else {
        ElMessage.error(msg);
      }
    }

    onMounted(async () => {
      await getUserRebaseInfo();
      await getRebateTemplate();
    });

    return {
      templateList,
      currentConfigArr,
      changeTemplate,
      isSubmitting,
      submitRebase,
      modelKey
    };
  }
});
</script>

<style lang="scss" scoped>
.select-wrap {
  margin: 0 0 15px;
  display: flex;
  justify-content: flex-end;
}
.submit-wrap {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style>