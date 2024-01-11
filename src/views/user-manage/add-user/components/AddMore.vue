<template>
  <div>
    <el-form
      label-position="right"
      label-width="100px"
      :model="form"
      class="add-one"
      style="max-width: 460px"
      ref="ruleFormRef"
    >
      <el-form-item
        :label="$t('table.superior_user')"
        prop="superior_user"
        :rules="[
          {
            required: true,
            message: $t('table.superior_user') + $t('table.not_empty')
          },
          {
            validator: userTypeValidator,
            trigger: 'blur'
          }
        ]"
      >
        <el-input
          v-model.trim="form.superior_user"
          :placeholder="$t('table.superior_user')"
        />
      </el-form-item>
      <el-form-item :label="$t('table.export_file')" prop="file">
        <div class="upload-demo">
          <div>1.{{ $t('other.download_template') }}</div>
          <el-button @click="downLoadExcel">
            <svg-icon name="excel"></svg-icon
            >{{ $t('other.download_template_xls') }}
          </el-button>
        </div>
        <div class="upload-demo">
          <div>2.{{ $t('other.export_table') }}:</div>
          <el-upload
            drag
            ref="uploadRef"
            :action="userAddsApi.fileUploadApi"
            :headers="userAddsApi.headers"
            :auto-upload="false"
            :multiple="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :data="form"
          >
            <div class="upload-box">
              <div style="font-size: 50px">
                <svg-icon name="excel"></svg-icon>
              </div>
              <div class="el-upload__text">
                {{ $t('other.supported_type') }}
              </div>
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">
          {{ $t('crud.submit') }}
        </el-button>
        <el-button @click="resetForm()">
          {{ $t('crud.reset') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { userAddsApi } from '@/api/Global/upload';
import { RuleValidator } from '@/hook/RuleValidator';
import { addMore } from '@/api/user-manage/add-user';
import { ElMessage } from 'element-plus';
import { defineComponent, getCurrentInstance, reactive } from 'vue';
const defaultForm = {
  superior_user: '',
  file: null
};
export default defineComponent({
  setup() {
    let form = reactive({
      superior_user: '',
      file: null
    });

    const { proxy } = getCurrentInstance() as any;

    const { userTypeValidator } = RuleValidator();

    function downLoadExcel() {
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = '/excel/userlist.xlsx';
      link.setAttribute('download', 'user-list');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    const submitForm = () => {
      if (!proxy.$refs['ruleFormRef']) return;
      proxy.$refs['ruleFormRef'].validate((valid: any) => {
        if (valid) {
          proxy.$refs['uploadRef'].submit();
        } else {
          console.log('error submit!');
          return false;
        }
      });
    };

    function uploadSuccess(response: any) {
      if (response.code == 1) {
        ElMessage.success(response.msg);
        resetForm();
        proxy.$refs['uploadRef'].clearFiles();
        return;
      }
      ElMessage.error(response.msg);
    }

    // eslint-disable-next-line handle-callback-err
    function uploadError(error: any) {
      console.log(1111111);
    }

    const resetForm = () => {
      Object.assign(form, defaultForm);
      proxy.$refs['uploadRef'].clearFiles();
      setTimeout(() => {
        if (!proxy.$refs['ruleFormRef']) return;
        proxy.$refs['ruleFormRef'].resetFields();
      });
    };

    return {
      form,
      userTypeValidator,
      downLoadExcel,
      submitForm,
      uploadSuccess,
      uploadError,
      resetForm,
      userAddsApi
    };
  }
});
</script>

<style lang="scss" scoped>
.upload-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.upload-demo {
  width: 100%;
  background-color: antiquewhite;
  padding: 10px;
  border-radius: 10px;
  & + .upload-demo {
    margin-top: 10px;
  }
}
::v-deep(.el-upload-dragger) {
  width: 340px !important;
}
</style>
