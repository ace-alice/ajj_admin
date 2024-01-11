<template>
  <el-form-item label="任务开关" style="width: 500px" prop="is_open">
    <el-switch
      v-model="proxyForm.is_open"
      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
      :active-value="1"
      :inactive-value="0"
    />
  </el-form-item>
  <el-form-item label="任务标题" style="width: 500px" prop="title">
    <el-input
      v-model="proxyForm.title"
      clearable
      style="width: 350px"
    ></el-input>
  </el-form-item>
  <el-form-item label="发放方式" style="width: 500px" prop="send_type">
    <el-select
      v-model="proxyForm.send_type"
      style="width: 350px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in distribute_type_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item label="统计开始时间" style="width: 500px" prop="start_time">
    <el-select
      v-model="proxyForm.start_time"
      style="width: 350px"
      popper-class="user-select"
      clearable
    >
      <el-option label="注册时间" :value="1" />
    </el-select>
  </el-form-item>
  <el-form-item label="任务时长" style="width: 500px" prop="day">
    <el-input v-model.trim="proxyForm.day" clearable style="width: 350px">
      <template #append> 天 </template>
    </el-input>
  </el-form-item>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import { defineComponent, onMounted, reactive, toRefs } from 'vue';

export default defineComponent({
  name: 'base-task',
  props: {
    type: {
      type: String,
      default: ''
    },
    proxyForm: {
      type: Object,
      default: () => {
        return {
          is_open: null,
          title: null,
          send_type: null,
          start_time: null,
          day: null
        };
      }
    }
  },
  setup(prop) {
    const dict = reactive({
      distribute_type_options: []
    });

    onMounted(async () => {
      [dict.distribute_type_options] = await Promise.all([
        getDicts('distribute_type_options')
      ]);
    });
    return {
      ...toRefs(dict),
      // eslint-disable-next-line vue/no-dupe-keys
      proxyForm: prop.proxyForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form-title {
  width: 149px;
  text-align: left;
  font-size: 16px;
  margin-top: 20px;
  line-height: 40px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
