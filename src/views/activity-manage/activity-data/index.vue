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
import ActivityDataTask from './components/activity-data-task.vue';
import ActivityDataRebase from './components/activity-data-rebase.vue';
import ActivityDataLottory from './components/activity-data-lottory.vue';
import activityDataInvite from './components/activity-data-invite.vue';
import activityDataLucky from './components/activity-data-lucky.vue';
import activityDataVenue from './components/activity-data-venue.vue';

export default defineComponent({
  name: 'activity-data',
  components: {
    ActivityDataRebase,
    ActivityDataTask,
    activityDataInvite,
    activityDataLucky,
    activityDataVenue,
    ActivityDataLottory
  },
  setup() {
    const store = useStore();
    const itemList = [
      // cache
      {
        label: 'activity-data-task',
        component: 'activity-data-task',
        key: 'activity-data-task',
        permission: 'activity:data:task'
      },
      {
        label: 'activity-data-lottory',
        component: 'activity-data-lottory',
        key: 'activity-data-lottory',
        permission: 'activity:data:lottory'
      },
      {
        label: 'activity-data-invite',
        component: 'activity-data-invite',
        key: 'activity-data-invite',
        permission: 'activity:data:invite'
      },
      {
        label: 'activity-data-lucky',
        component: 'activity-data-lucky',
        key: 'activity-data-lucky',
        permission: 'activity:data:lucky'
      },
      {
        label: 'activity-data-venue',
        component: 'activity-data-venue',
        key: 'activity-data-venue',
        permission: 'activity:data:venue'
      },
      {
        label: 'activity-data-rebase',
        component: 'activity-data-rebase',
        key: 'activity-data-rebase',
        permission: 'activity:data:rebase'
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

    const activeName = ref('activity-data-task');

    onMounted(async () => {
      activeName.value = isValidList.value[0]?.key;
    });

    return {
      activeName,
      itemList,
      isValidList
    };
  }
});
</script>
