<template>
  <el-dialog
    v-model="props.visiable"
    title="提交修改"
    left
    width="45%"
    :show-close="false"
    :before-close="handleClose"
  >
    <el-form v-model="form" label-width="120px">
      <el-form-item label="联系方式：">
        <el-select v-model="form.contact" popper-class="user-select" clearable>
          <el-option
            v-for="item in contactList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.connect" />
      </el-form-item>
      <el-form-item label="备注：">
        <el-input v-model="form.remark" />
      </el-form-item>
    </el-form>

    <el-divider content-position="left"></el-divider>
    <div class="item-template">
      <el-select v-model="form.tag_id" popper-class="user-select" clearable>
        <el-option
          v-for="item in proxyTemplateList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <el-table
      :data="tabledata"
      default-expand-all
      highlight-current-row
      :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
      style="width: 100%"
    >
      <el-table-column
        type="index"
        :label="$t('table.sort')"
        width="80"
        align="center"
      />
      <el-table-column
        prop="TValue"
        :label="$t('table.profitLossTotal')"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          ≥
          <el-input
            v-model.trim="scope.row.profitLossTotal"
            style="width: 100px"
            type="text"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="TValue"
        :label="$t('table.monthEActive')"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          ≥
          <el-input
            v-model.trim="scope.row.monthEActive"
            style="width: 100px"
            type="text"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="TValue"
        :label="$t('table.rebateRatio')"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.rebateRatio"
            style="width: 100px"
            type="text"
            disabled
          />
          %
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">{{
          $t('user.logOutCancel')
        }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{
          $t('user.logOutConfirm')
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, computed } from 'vue';
import { userChangeAgent } from '@/api/user-manage/user-config';
import { getProxyTemplateListHook } from '@/hook/getProxyTemplateList';
import { ElNotification } from 'element-plus';
import { ElMessage } from 'element-plus/lib/components';
export default defineComponent({
  props: {
    visiable: {
      type: Boolean,
      default: () => false
    },
    memberId: {
      type: String,
      default: () => null
    }
  },
  emit: ['close'],
  setup(props: any, content: any) {
    const resetForm = {
      tag_id: '',
      contact: '',
      connect: '',
      remark: ''
    };
    const form = reactive({
      tag_id: '',
      contact: '',
      connect: '',
      remark: ''
    });
    const { proxyTemplateList } = getProxyTemplateListHook();
    const tabledata = computed(() => {
      if (form.tag_id) {
        const arr = proxyTemplateList.value.filter((template: any) => {
          return template.id == form.tag_id;
        });
        if (arr.length > 0) {
          return JSON.parse((arr[0] as any).config_json);
        } else {
          return [];
        }
      } else {
        return [];
      }
    });
    const contactList = [
      {
        label: '微信',
        value: 1
      },
      {
        label: 'QQ',
        value: 2
      },
      {
        label: '小飞机',
        value: 3
      }
    ];
    const handleClose = () => {
      content.emit('close');
      resetdata();
    };
    const handleSubmit = () => {
      const param = {
        member_id: props.memberId,
        connect_type: form.contact,
        connect: form.connect,
        remark: form.remark,
        rebate_template_id: form.tag_id
      };
      userChangeAgent(param).then((result: any) => {
        if (result.code == 1) {
          ElNotification.success(result.msg || result.message);
        } else {
          ElMessage.error(result.msg || result.message);
        }
      });
      handleClose();
    };
    /** 数据重置 */
    const resetdata = () => {
      Object.assign(form, resetForm);
    };
    return {
      props,
      form,
      tabledata,
      handleClose,
      handleSubmit,
      proxyTemplateList,
      contactList
    };
  }
});
</script>
<style lang="scss" scoped>
.el-input,
.el-select {
  width: 60% !important;
}
.item-template {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .el-select {
    width: 180px !important;
  }
}
</style>
