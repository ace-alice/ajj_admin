<template>
  <el-space wrap :size="15">
    <slot name="left" />
    <el-button
      type="text"
      @click="editHandle"
      v-show="show.edit"
      v-only="permission.edit"
      :icon="$iconMap.EditPen"
      >{{ $t('crud.edit') }}</el-button
    >
    <el-popconfirm
      v-if="show.del"
      :title="$t('crud.delete-hint')"
      @confirm="delHandle"
    >
      <template #reference>
        <el-button
          type="text"
          style="color: #f56c6c"
          v-only="permission.delete"
          :icon="$iconMap.Delete"
          >{{ $t('crud.delete') }}</el-button
        >
      </template>
    </el-popconfirm>
    <el-button
      type="text"
      v-if="show.top"
      @click="topHandle"
      v-only="permission.top"
      style="color: #f56c6c"
      >{{ $t('crud.top') }}</el-button
    >
    <el-popconfirm
      v-if="show.recall"
      :title="$t('crud.recall-hint')"
      @confirm="recallHandle"
    >
      <template #reference>
        <el-button
          type="text"
          v-only="permission.recall"
          style="color: #f56c6c"
          >{{ $t('crud.recall') }}</el-button
        >
      </template>
    </el-popconfirm>
    <slot name="right" />
  </el-space>
</template>

<script lang="ts">
import { EditPen, Delete } from '@element-plus/icons-vue';
export default {
  name: 'UdOperation',
  components: { EditPen, Delete },
  props: {
    permission: {
      type: Object,
      default: () => {
        return {
          add: 'add',
          edit: 'edit',
          top: 'top',
          recall: 'recall',
          delete: 'delete'
        };
      }
    },
    rowData: {
      type: Object,
      default: () => {
        return {
          ontop: null
        };
      }
    },
    show: {
      type: Object,
      default: () => {
        return {
          edit: true,
          recall: true,
          top: true,
          del: true
        };
      }
    }
  },
  emits: ['edit', 'del'],
  setup(props: any, { emit }: any) {
    async function editHandle() {
      emit('edit');
    }
    async function delHandle() {
      emit('del');
    }
    async function recallHandle() {
      emit('recall');
    }
    async function topHandle() {
      emit('top');
    }

    return {
      editHandle,
      delHandle,
      recallHandle,
      topHandle,
      // eslint-disable-next-line vue/no-dupe-keys
      rowData: props.rowData,
      deleteType: props.deleteType
    };
  }
};
</script>
