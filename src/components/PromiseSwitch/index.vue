<template>
  <span class="promise-switch">
    <el-switch
      v-only="permission"
      v-model="statusValue"
      :active-value="activeValue"
      :inactive-value="inactiveValue"
      :loading="loading"
      :before-change="beforeChange"
    />
    <el-tag type="warning" effect="plain">{{
      getLabel(statusValue, options)
    }}</el-tag>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { dictionary } from '@/hook/lib';

function changeName() {}

export default defineComponent({
  props: {
    options: {
      required: true,
      type: Object,
      default: () => []
    },
    initValue: {
      type: [String, Number],
      default: 0
    },
    activeValue: {
      type: [String, Number],
      default: 1
    },
    inactiveValue: {
      type: [String, Number],
      default: 0
    },
    paramKey: { required: true, type: String, default: 'status' },
    defaultParam: {
      required: true,
      type: Object,
      default: () => {}
    },
    emitFunName: { required: true, type: String, default: 'emitFunName' },
    changeFun: {
      required: true,
      type: Function,
      default: changeName
    },
    permission: { type: String, default: '' }
  },
  setup(props) {
    const statusValue = ref(props.initValue);
    const { getLabel } = dictionary();
    const loading = ref(false);

    //获取反值

    function getReverseValue(value: any) {
      return value == props.activeValue
        ? props.inactiveValue
        : props.activeValue;
    }

    async function beforeChange() {
      if (loading.value) return;
      return new Promise(async (resolve, reject) => {
        loading.value = true;
        const isSuccess = await props.changeFun(
          props.emitFunName,
          Object.assign(props.defaultParam, {
            [props.paramKey]: getReverseValue(statusValue.value)
          })
        );
        if (isSuccess) {
          resolve(true);
        } else {
          reject();
        }
        loading.value = false;
      });
    }

    return { statusValue, getLabel, beforeChange, loading };
  }
});
</script>

<style lang="scss" scoped>
.promise-switch {
  position: relative;
  .wimple {
    position: absolute;
    // background-color: #ff000030;
    height: 100%;
    width: 100%;
    // z-index: 100;
    bottom: 0;
  }
}
:deep(.el-tag) {
  margin-left: 5px;
}
</style>
