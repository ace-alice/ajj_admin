<template>
  <div
    :ref="setRef"
    class="card"
    :style="{ opacity }"
    :data-handler-id="handlerId"
  >
    <span>{{ text }}</span>
    <el-tag
      :type="acStatus == 1 ? '' : 'danger'"
      class="mx-1"
      effect="dark"
    >
    {{ acStatus == 1 ? "开启中" : "禁用中" }}
    </el-tag>
    
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref, toRefs } from 'vue';
import { useDrag, useDrop } from 'vue3-dnd';
import type { XYCoord, Identifier } from 'dnd-core';

interface DragItem {
  index: number;
  id: string;
  type: string;
  status: number;
}
export default defineComponent({
  props: {
    id: {
      type: Number
    },
    text: {
      type: String
    },
    index: {
      type: Number
    },
    status: {
      type: Number
    }
  },
  emits: ['move-card'],
  setup(prop, { emit }) {
    const card = ref<HTMLDivElement>();
    const [dropCollect, drop] = useDrop<
      DragItem,
      void,
      { handlerId: Identifier | null }
    >({
      accept: 'card',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId()
        };
      },
      hover(item: any, monitor) {
        if (!card.value) {
          return;
        }
        const dragIndex = item.index;
        const hoverIndex: any = prop.index;
        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
          return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = card.value?.getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY =
          (clientOffset as XYCoord).y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }
        emit('move-card', dragIndex, hoverIndex);

        item.index = hoverIndex;
      }
    });

    const [collect, drag] = useDrag({
      type: 'card',
      item: () => {
        return { id: prop.id, index: prop.index };
      },
      collect: (monitor: any) => ({
        isDragging: monitor.isDragging()
      })
    });

    const { handlerId }: any = toRefs(dropCollect);
    const { isDragging }: any = toRefs(collect);
    const opacity = computed(() => (unref(isDragging) ? 0 : 1));

    const setRef = (el: HTMLDivElement) => {
      card.value = drag(drop(el)) as HTMLDivElement;
    };

    return {
      setRef,
      opacity,
      handlerId,
      acStatus: prop.status
    };
  }
});
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px dashed gray;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 47%;
  float: left;
  margin: 1% 1.5%;
}
</style>
