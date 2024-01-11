<template>
  <div>
    <el-card class="main-container animate__animated animate__fadeInUp">
      <template #header>
        <div class="card-header">
          <el-button
            v-only="editPermission.edit"
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
            :icon="$iconMap.RefreshRight"
          >
            {{ $t('crud.reset') }}
          </el-button>
        </div>
      </template>
      <el-table :data="form" style="max-width: 700px">
        <el-table-column prop="tKey" label="键" min-width="140" align="center">
          <template #default="scope">
            <el-input
              v-model.trim="scope.row.tKey"
              style="width: 120px"
              clearable
              @blur="changeTKey(scope.row.tKey)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="value" label="值" min-width="140" align="center">
          <template #default="scope">
            <el-input
              v-model.trim="scope.row.value"
              style="width: 120px"
              clearable
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="type"
          label="类型"
          min-width="120"
          align="center"
        >
          <template #default="scope">
            <el-select
              v-model.trim="scope.row.type"
              style="width: 100px"
              @change="scope.row.value = null"
            >
              <el-option label="Number" value="number" />
              <el-option label="String" value="string" />
            </el-select>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="describe"
          label="描述"
          min-width="200"
          align="center"
        >
          <template #default="scope">
            <el-input
              v-model.trim="scope.row.describe"
              style="width: 180px"
              clearable
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="80" align="center">
          <template #header>
            <el-button type="primary" @click.stop="addKey"
              ><el-icon><plus /></el-icon
            ></el-button>
          </template>
          <template #default="scope">
            <!-- <el-button type="primary" circle @click="editValue(scope.row)">
              <el-icon> <edit /></el-icon>
            </el-button> -->
            <el-button type="danger" circle @click="deleteValue(scope.$index)">
              <el-icon> <delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      v-model="itemVisible"
      title="新增数据"
      width="40%"
      :before-close="beforeCloseItem"
    >
      <el-form
        ref="formRef"
        :model="tempData"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item
          prop="tKey"
          label="键"
          :rules="[
            {
              required: true,
              message: '请输入正确的键名',
              pattern: /^([a-zA-Z])[0-9A-Za-z_]{2,32}$/,
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model.trim="tempData.tKey" style="width: 260px" />
        </el-form-item>
        <el-form-item
          prop="value"
          label="值"
          :rules="[
            {
              required: true,
              message: '请输入值',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model.trim="tempData.value" style="width: 260px">
            <!-- <template #prepend>
              <el-select
                v-model="tempData.type"
                style="width: 100px"
                @change="tempData.value = null"
              >
                <el-option label="Number" value="number" />
                <el-option label="String" value="string" />
              </el-select>
            </template> -->
          </el-input>
        </el-form-item>
        <el-form-item
          prop="describe"
          label="描述"
          :rules="[
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur'
            }
          ]"
        >
          <el-input v-model.trim="tempData.describe" style="width: 260px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="beforeCloseItem">{{
            $t('user.logOutCancel')
          }}</el-button>
          <el-button type="primary" @click="setItem">{{
            $t('user.logOutConfirm')
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  Ref,
  ref
} from 'vue';
import { diyInfo, diyEdit } from '@/api/system-manage/client-config';
import { ElNotification } from 'element-plus';
import { dictionary } from '@/hook/lib';
import { ElMessage } from 'element-plus/lib/components';
const defaultForm = {
  tKey: '',
  value: null,
  type: 'string',
  describe: ''
};

export default defineComponent({
  name: 'log-config',
  setup(props, { emit }) {
    const loading = ref(false);

    let form: Ref<any> = ref([]);

    let tempData = reactive({
      tKey: '',
      value: '',
      describe: ''
    });

    function toQuery() {
      loading.value = true;
      diyInfo()
        .then((result: any) => {
          if (result.code == 1) {
            let temp: any = [];
            for (const tKey of Object.keys(result.data.diy_config)) {
              const tempObj: any = {};
              tempObj['tKey'] = tKey;
              tempObj['value'] = result.data.diy_config[tKey].value;
              tempObj['describe'] = result.data.diy_config[tKey].describe;

              temp.push(tempObj);
            }
            form.value = temp;
            console.log(form.value);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }
    function saveHandle() {
      loading.value = true;

      let formData: any = { diy_config: {} };

      console.log(form.value);

      for (const item of form.value) {
        formData.diy_config[item.tKey] = {
          value: item.value,
          describe: item.describe
        };
      }

      console.log(JSON.stringify(formData));

      diyEdit(JSON.stringify(formData))
        .then((result: any) => {
          if (result.code == 1) {
            toQuery();
            ElNotification.success(result.msg);
          }
        })
        .finally(() => {
          loading.value = false;
        });
    }

    const { captchaTypeOptions } = dictionary();

    const editPermission = {
      edit: 'client:self:edit'
    };

    const itemVisible = ref(false);

    const addKey = () => {
      Object.assign(tempData, defaultForm);

      itemVisible.value = true;
    };

    function beforeCloseItem() {
      Object.assign(tempData, defaultForm);
      proxy.$refs['formRef'].resetFields();
      itemVisible.value = false;
    }

    const { proxy } = getCurrentInstance() as any;

    function setItem() {
      proxy.$refs['formRef'].validate((valid: any) => {
        if (valid) {
          form.value.push(Object.assign({}, tempData));
          itemVisible.value = false;
          saveHandle();
        } else {
          console.log('error submit!');
          return false;
        }
      });
    }

    function editValue(row: any) {
      Object.assign(tempData, defaultForm, row);
      itemVisible.value = true;
    }

    function deleteValue(idx: number) {
      form.value.splice(idx, 1);
    }

    function changeTKey(tKey: string) {
      const isYes = /^([a-zA-Z])[0-9A-Za-z_]{2,32}$/.test(tKey);
      if (!isYes) {
        toQuery();
        ElMessage.warning('请输入正确的键名');
      }
    }

    onMounted(() => {
      toQuery();
    });
    return {
      loading,
      toQuery,
      saveHandle,
      form,
      captchaTypeOptions,
      editPermission,
      addKey,
      itemVisible,
      tempData,
      beforeCloseItem,
      setItem,
      editValue,
      deleteValue,
      changeTKey
    };
  }
});
</script>

<style lang="scss" scoped>
.cell-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
