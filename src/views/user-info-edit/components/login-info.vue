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
        :label="$t('table.login_time1')"
        align="center"
      />
      <el-table-column prop="ip" :label="$t('table.IP')" align="center" />
      <el-table-column prop="ip_local" label="IP归属地" align="center" />
      <el-table-column
        prop="device_id"
        :label="$t('table.terminal_type')"
        align="center"
      >
        <template #default="scope">
          <span>{{
            getLabel(scope.row.device_id, terminal_type_options)
          }}</span>
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
  ref,
  toRefs
} from 'vue';
import { getLoginList } from '@/api/user-manage/user-config';
import { useRoute } from 'vue-router';
import { getDicts } from '@/utils/dictApi';
import { dictionary } from '@/hook/lib';

export default defineComponent({
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

    let dict = reactive({
      terminal_type_options: []
    });

    function toQuery(page?: number) {
      if (page) form.page = page;
      tableLoading.value = true;
      getLoginList({
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
    const { getLabel } = dictionary();

    onMounted(async () => {
      [dict.terminal_type_options] = await Promise.all([
        getDicts('terminal_type_options')
      ]);
      nextTick(async () => {
        setTimeout(() => {
          toQuery();
        }, 100);
      });
    });

    return {
      tableLoading,
      tableData,
      form,
      toQuery,
      ...toRefs(dict),
      getLabel
    };
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
