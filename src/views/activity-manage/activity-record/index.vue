<template>
  <div class="main-container">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in isValidList"
        :key="item.key"
        :label="$t('router.' + item.label)"
        :name="item.component"
      >
      </el-tab-pane>
    </el-tabs>
    <component :is="activeName" :key="activeName" />
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { defineComponent, ref, onMounted, computed } from 'vue';
import activityRecordDiscount from './components/activity-record-discount.vue';
import activityRecordRebate from './components/activity-record-rebate.vue';
import activityRecordVip from './components/activity-record-vip.vue';

export default defineComponent({
  name: 'activity-record',
  components: {
    activityRecordDiscount,
    activityRecordRebate,
    activityRecordVip
  },
  setup() {
    const store = useStore();
    const itemList = [
      // cache
      {
        label: 'activity-record-discount',
        component: 'activity-record-discount',
        key: 'activity-record-discount',
        permission: 'activity:record:discount'
      },
      {
        label: 'activity-record-rebate',
        component: 'activity-record-rebate',
        key: 'activity-record-rebate',
        permission: 'activity:record:rebate'
      },
      {
        label: 'activity-record-vip',
        component: 'activity-record-vip',
        key: 'activity-record-vip',
        permission: 'activity:record:vip'
      }
    ];

    const roles = computed(() => {
      return store.getters.roles;
    });

    const isValidList = computed(() => {
      return itemList.filter((item: any) => {
        return roles.value.includes(item.permission);
      });
    });

    const activeName = ref('activity-record-discount');

    onMounted(() => {
      activeName.value = isValidList.value[0]?.label;
    });

    return {
      activeName,
      itemList,
      isValidList
    };
  }
});
</script>
