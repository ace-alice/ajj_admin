<template>
  <div class="main-container">
    <crudOperation title="router.department-config">
      <template #query> </template>
      <template #table> </template>
      <template #form> </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/admin-config/role-config';
import { defineComponent, toRefs } from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '部门',
  crudOptShow: {
    add: true,
    formSize: '60%'
  },
  defaultQuery: {},
  crudMethod: { ...Api },
  defaultForm: {
    name: null,
    code: null,
    editor: ''
  },
  crudTag: 'account:line'
};

export default defineComponent({
  name: 'department-config',
  components: { crudOperation, udOperation },
  setup() {
    const crud = CRUD(defaultCrudOptions);
    return { ...crud };
  }
});
</script>
