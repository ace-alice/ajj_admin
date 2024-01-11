<template>
  <div>
    <el-card class="main-container animate__animated animate__fadeInUp">
      <template #header>
        <div class="card-header">
          <el-button
            type="primary"
            :loading="loading"
            :icon="$iconMap.Check"
            @click="saveHandle"
          >
            {{ $t('crud.save') }}
          </el-button>
          <el-button
            :loading="loading"
            @click="toQuery"
            :icon="$iconMap.RefreshLeft"
            >{{ $t('crud.reset') }}</el-button
          >
        </div>
      </template>
      <el-form
        :model="form"
        label-width="150px"
        ref="ruleFormRef"
        v-loading="loading"
      >
        <el-form-item
          label="用户名"
          prop="username"
          :rules="[
            {
              required: true,
              message: `用户名${$t('table.not_empty')}`
            }
          ]"
        >
          <el-input
            v-model.trim="form.username"
            placeholder="用户名"
            @keyup.enter="searchUser"
            style="width: 350px"
          />
          <el-button type="primary" @click="searchUser" class="search-btn"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item label="当前上级" prop="senior_member_username">
          <el-input
            v-model.trim="form.senior_member_username"
            placeholder="当前上级"
            style="width: 350px"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="转入代理"
          prop="agent_name"
          :rules="[
            {
              required: true,
              message: `转入代理${$t('table.not_empty')}`
            }
          ]"
        >
          <el-input
            v-model.trim="form.agent_name"
            placeholder="转入代理"
            style="width: 350px"
          />
          <el-button type="primary" @click="searchCode" class="search-btn"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item label="推广码" prop="invitation_code">
          <el-input
            v-model.trim="form.invitation_code"
            placeholder="推广码"
            style="width: 350px"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="上传图片"
          prop="fileList"
          :rules="[
            {
              required: true,
              message: `请上传图片`
            }
          ]"
        >
          <el-upload
            limit="6"
            list-type="picture-card"
            :http-request="handleUpload"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="form.fileList"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          :rules="[
            {
              required: true,
              message: `备注${$t('table.not_empty')}`
            }
          ]"
        >
          <el-input
            show-word-limit
            maxlength="50"
            rows="3"
            type="textarea"
            v-model.trim="form.remark"
            placeholder="备注"
            style="width: 350px"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue';
import {
  getInfoByName,
  getUserInviteCode,
  changeSuperior
} from '@/api/user-manage/vip-bind-apply';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { upload } from '@/api/Global/upload';

import { ElNotification } from 'element-plus';
import { getLocal } from '@/utils/storage';
export default defineComponent({
  name: 'vip-bind-apply',
  components: { NomalImageUpload },
  setup() {
    let form: any = reactive({
      username: null,
      agent_name: null,
      invitation_code: null,
      remark: null,
      senior_member_username: null,
      pic_json: '',
      fileList: []
    });
    const loading = ref(false);
    const { proxy } = getCurrentInstance() as any;

    function setTheForm(value: any) {
      Object.assign(form, value);
    }

    const dialogImageUrl = ref('');
    const dialogVisible = ref(false);
    const baseApi = getLocal('baseApi');

    const handleRemove: any = (uploadFile: any, uploadFiles: any) => {
      console.log(uploadFile, uploadFiles);
    };

    const handlePictureCardPreview: any = (uploadFile: any) => {
      dialogImageUrl.value = uploadFile.url!;
      dialogVisible.value = true;
    };

    async function searchUser() {
      if (!form.username) {
        ElNotification.error('请输入用户名！');
        return;
      }
      const params = { username: form.username };
      const { data, code, msg } = await (<any>getInfoByName(params));
      if (code === 1) {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
          ElNotification.error('没有查到该用户的信息');
        } else {
          // form.invitation_code = data.invitation_code;
          form.senior_member_username = data.senior_member_username;
        }
      } else {
        ElNotification.error(msg);
      }
    }

    async function searchCode() {
      if (!form.agent_name) {
        ElNotification.error('请输入转入代理！');
        return;
      }
      const params = { agent_name: form.agent_name };
      const { data, code, msg } = await (<any>getUserInviteCode(params));
      if (code === 1) {
        if (JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]') {
          ElNotification.error('没有查到该代理的信息');
        } else {
          form.invitation_code = data.invitation_code;
          // form.senior_member_username = data.senior_member_username;
        }
      } else {
        ElNotification.error(msg);
      }
    }

    function handleUpload(val: any) {
      let fd = new FormData();
      fd.append('file', val.file);
      upload('', fd)
        .then((data: any) => {
          form.fileList[form.fileList.length - 1].name = data.data.file_name;
          form.fileList[form.fileList.length - 1].url = data.data.file_url;
        })
        .catch(() => {
          form.fileList = form.fileList.slice(0, form.fileList.length - 1);
          ElNotification.error('上传失败！');
        });
    }

    function saveHandle() {
      if (loading.value) {
        return
      }
      proxy.$refs['ruleFormRef'].validate(async (valid: any) => {
        if (valid) {
          form.pic_json = JSON.stringify(form.fileList);
          loading.value = true
          const { data, code, msg } = await (<any>changeSuperior(form));
          loading.value = false
          if (code === 1) {
            ElNotification.success(msg);
            return;
          }
          ElNotification.error(msg);
        }
        console.log(valid);
      });
      const params = {};
    }

    return {
      form,
      dialogImageUrl,
      dialogVisible,
      handleRemove,
      handlePictureCardPreview,
      setTheForm,
      searchCode,
      baseApi,
      handleUpload,
      searchUser,
      saveHandle,
      loading
    };
  }
});
</script>

<style lang="scss" scoped>
.search-btn {
  margin-left: 15px;
}
</style>
