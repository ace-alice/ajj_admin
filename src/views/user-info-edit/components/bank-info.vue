<template>
  <div>
    <div style="margin: 0 0 15px">
      <el-button type="primary" @click="toQuery(1)">
        <el-icon><refresh /></el-icon>
        {{ $t('tagsView.refresh') }}
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      v-loading="tableLoading"
    >
      <el-table-column
        prop="create_time"
        :label="$t('table.bank_time')"
        align="center"
      />
      <el-table-column
        prop="bank_name"
        :label="$t('table.user_bank_name')"
        align="center"
      />
      <el-table-column
        prop="owner_name"
        :label="$t('table.card_owner_name')"
        align="center"
      />
      <el-table-column
        prop="bank_account"
        :label="$t('table.user_bank_account')"
        align="center"
      />
      <el-table-column
        prop="bank_address"
        :label="$t('table.user_bank_address')"
        align="center"
      />
      <el-table-column
        :label="$t('table.operate')"
        min-width="80"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="text"
            @click="handleDelete(scope.row)"
            >{{ scope.row.status === 1 ? $t('table.turn_off') : $t('table.turn_on') }}</el-button
                  >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:currentPage="form.page"
        v-model:page-size="form.limit"
        :page-sizes="[10, 100, 200, 300, 400]"
        :small="false"
        layout="total, sizes, prev, pager, next"
        :total="form.total"
        @size-change="toQuery"
        @current-change="toQuery"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref
} from 'vue';
import { getBankList, userBankStateChange } from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus/lib/components';

export default defineComponent({
  name: 'bank-info',
  setup() {
    const tableLoading = ref(false);
    const tableData = ref([]);

    const route = useRoute();

    const memberId = computed(() => {
      return route.query.member_id;
    });

    let form = reactive({
      page: 1,
      limit: 10,
      total: 0
    });

    function toQuery(page?: number) {
      if (page) form.page = page;
      tableLoading.value = true;
      getBankList({
        member_id: memberId.value,
        page: form.page,
        limit: form.limit
      })
        .then((result: any) => {
          if (result.code == 1) {
            tableData.value = result.data.data;
            form.total = result.data.total;
          }
        })
        .finally(() => {
          tableLoading.value = false;
        });
    }

    async function handleDelete(row: any) {
      let params = {
        card_id: row.id,
        status: row.status === 0 ? 1 : 0
      }
      const { code, msg } = await <any>userBankStateChange(params)
      if (code === 1) {
        toQuery()
      } else {
        ElMessage.error(msg);
      }
    }

    onMounted(() => {
      nextTick(async () => {
        setTimeout(() => {
          toQuery();
        }, 100);
      });
    });

    return { tableLoading, tableData, form, toQuery, handleDelete };
  }
});
</script>

<style lang="scss" scoped>
.pagination {
  margin: 20px 0;
  display: flex;
  flex-direction: row-reverse;
}
</style>
