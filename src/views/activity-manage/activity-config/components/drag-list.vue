<template>
  <div>
    <el-form :model="form" label-width="120px">
      <el-form-item label="活动页签">
        <el-select
          clearable
          v-model="form.tab"
          @change="changeTab"
          placeholder="请选择页签"
        >
          <el-option
            v-for="(item, index) in tabList"
            :label="item.tab"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <DndProvider :backend="HTML5Backend">
      <DragItem
        v-for="(card, index) in activityList"
        :id="card.id"
        :key="card.id"
        :text="card.activity_title"
        :index="index"
        :status="card.status"
        @move-card="moveCard"
      />
    </DndProvider>
  </div>
</template>

<script lang="ts">
import TabApi from '@/api/activity-manage/activity-tab-config';
import configApi from '@/api/activity-manage/activity-config';
import { ref, defineComponent, onMounted } from 'vue';
import DragItem from './drag-item.vue';
import { DndProvider } from 'vue3-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default defineComponent({
  components: { DragItem, DndProvider },
  setup() {
    const moveCard = (dragIndex: number, hoverIndex: number) => {
      const item = activityList.value[dragIndex];
      activityList.value.splice(dragIndex, 1);
      activityList.value.splice(hoverIndex, 0, item);
    };

    const cards = ref<any>([
      {
        id: 1,
        text: 'Write a cool JS library'
      }
    ]);

    const form = ref({
      tab: null
    });

    const tabList = ref([]);
    async function getTabList() {
      const { data, code, msg } = await (<any>TabApi.list({ limit: 1000 }));
      if (code === 1) {
        tabList.value = data.data;
      }
    }

    // const acti
    const activityList = ref([]);
    async function getSortList(val?: any) {
      const { data, code, msg } = await (<any>(
        configApi.sortList({ tab_id: val })
      ));
      if (code === 1) {
        activityList.value = data.data;
      }
    }

    function changeTab(val: any) {
      getSortList(val);
      console.log(val);
    }

    onMounted(() => {
      getTabList();
      getSortList();
    });

    return {
      moveCard,
      form,
      changeTab,
      activityList,
      getSortList,
      tabList,
      HTML5Backend,
      cards
    };
  }
});
</script>
