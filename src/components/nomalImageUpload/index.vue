<template>
  <!-- 用法 -->
  <!-- <nomalImageUpload
            @setImage="setTheForm"
            formLabel="角色头像"
            :data="proxyForm.headImg"
            imgkey="headImg"
            imgUrlKey="file_path"
          /> -->
  <el-form-item
    :label="formLabel"
    :prop="imgkey"
    class="form-box"
    :rules="[{ required: isRequire, message: $t('other.please_upload_img') }]"
  >
    <el-card
      :body-style="{ padding: '10px', 'min-width': '180px' }"
      shadow="hover"
    >
      <div class="image-box">
        <el-image
          v-if="data || imageData.url"
          :src="imageData.url ? imageData.url : data"
          class="image"
          fit="contain"
          :preview-src-list="[data]"
        >
          <template #error>
            <div class="image-slot">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                style="height: 100px; width: 100px"
              />
            </div>
          </template>
        </el-image>
        <div v-else class="image" @click="openUploadTab">
          <el-icon><plus /></el-icon>
        </div>
        <div>
          <div style="margin-bottom: 5px">
            <el-button type="primary" @click="openUploadTab" circle
              ><el-icon><upload-filled /></el-icon
            ></el-button>
          </div>
          <div style="margin-bottom: 5px">
            <el-button type="danger" @click="removeImage" circle
              ><el-icon><delete /></el-icon
            ></el-button>
          </div>
          <div>
            <el-tooltip effect="dark" placement="bottom">
              <template #content>
                <p>
                  <el-icon><circle-check-filled /></el-icon>支持上传图片类型:{{
                    getTypeName()
                  }}
                </p>
                <p v-if="pxSize">
                  <el-icon><circle-check-filled /></el-icon>图片像素大小:{{
                    pxSize
                  }}
                </p>
                <p>
                  <el-icon><circle-check-filled /></el-icon>支持最大图片:{{
                    maxSize
                  }}k
                </p>
                <p>
                  <el-icon><circle-check-filled /></el-icon>
                  注意:
                  <span v-if="isCompression"
                    >当图片大于{{ compressSize }}k时,图片将压缩到{{
                      compressSize
                    }}k</span
                  >
                </p>
              </template>
              <el-icon><bell-filled /></el-icon>
            </el-tooltip>
          </div>
        </div>
      </div>
    </el-card>
    <el-dialog
      title="图片上传"
      v-model="uploadVisible"
      destroy-on-close
      :key="dialogKey"
      append-to-body
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="imageData" ref="dialogform">
        <el-tabs type="border-card">
          <!-- <el-tab-pane label="网络图片">
            <div class="upload-box">
              <el-image
                :src="imageData.url"
                class="image"
                fit="contain"
                :preview-src-list="[imageData.url]"
              >
                <template #error>
                  <div class="image-slot">
                    <img
                      src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
                      style="height: 150px; width: 150px"
                    />
                  </div>
                </template>
              </el-image>
            </div>
            <el-divider></el-divider>
            <el-form-item
              label="图片地址"
              prop="url"
              :rules="[
                { required: true, message: '请填写图片地址', trigger: 'blur' }
              ]"
            >
              <el-input v-model.trim="imageData.url" style="width: 100%"></el-input>
            </el-form-item>
          </el-tab-pane> -->
          <el-tab-pane label="本地图片">
            <div class="upload-box">
              <el-form-item
                prop="url"
                :rules="[{ required: true, message: '请上传图片地址' }]"
              >
                <el-upload
                  ref="uploader"
                  class="uploader-box"
                  :action="action"
                  :headers="headers"
                  :show-file-list="false"
                  :before-upload="beforeImageUpload"
                  :on-success="successUploaded"
                  :data="{
                    file_name: formLabel,
                    is_front: 0,
                    file_type: 'image',
                    group_id: imageData.group_id
                  }"
                  :disabled="!imageData.group_id"
                >
                  <img
                    v-if="imgCache && imageData.url != null"
                    :src="imgCache"
                    class="image"
                  />
                  <!-- <i v-else class="el-icon-plus image plus" /> -->
                  <el-icon v-else class="el-icon-plus image plus"
                    ><plus
                  /></el-icon>
                </el-upload>
              </el-form-item>
              <el-form-item
                :label="$t('table.group_name')"
                prop="group_id"
                :rules="[{ required: true, message: '请选择图片分组' }]"
              >
                <el-select
                  v-model="imageData.group_id"
                  style="width: 200px"
                  popper-class="user-select"
                >
                  <el-option
                    v-for="item in fileGroupList"
                    :key="item.group_id"
                    :label="item.group_name"
                    :value="item.group_id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <el-divider></el-divider>
            <div>
              <p class="danger">注意：请先选择分组，再上传图片！</p>
              <p>
                <i class="el-icon-warning-outline"></i>支持上传图片类型:{{
                  getTypeName()
                }}
              </p>
              <p v-if="pxSize">
                <i class="el-icon-warning-outline"></i>图片像素大小:{{ pxSize }}
              </p>
              <p>
                <i class="el-icon-warning-outline"></i>支持最大图片:{{
                  maxSize
                }}k
              </p>
              <p>
                <i class="el-icon-warning-outline"></i>
                注意:
                <span v-if="isCompression"
                  >当图片大于{{ compressSize }}k时,图片将压缩到{{
                    compressSize
                  }}k</span
                >
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="toSetImage">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-form-item>
</template>

<script lang="ts">
import { getCurrentInstance, reactive, Ref, ref } from 'vue';
import { uploadApi } from '@/api/Global/upload';
import { ElNotification, ElMessage } from 'element-plus';
import { compressAccurately } from 'image-conversion';
import { Plus } from '@element-plus/icons-vue';
import { getOperatorListHook } from '@/hook/getFileGroupList';

export default {
  name: 'nomalImageUpload',
  props: {
    formLabel: {
      type: String,
      default: '图片上传'
    },
    imgkey: {
      type: String,
      default: 'key'
    },
    isRequire: {
      type: Boolean,
      default: true
    },
    dataKey: {
      type: String,
      default: 'file_url'
    },
    data: {
      type: String
    },
    params: {
      type: String,
      default: 'pathName'
    },
    headers: {
      type: Object,
      default: () => uploadApi.headers
    },
    action: {
      type: String,
      default: () => uploadApi.fileUploadApi
    },
    typeList: {
      type: Array,
      default: () => ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    },
    pxSize: {
      type: String
    },
    isCompression: {
      type: Boolean,
      default: true
    },
    maxSize: {
      type: Number,
      default: 2048
    },
    compressSize: {
      type: Number,
      default: 155
    },
    imgUrlKey: {
      type: String,
      default: 'file_url'
    }
  },
  emits: ['setImage'],
  components: { Plus },
  setup(props: any, { emit }: any) {
    const dialogKey = 'Keys' + new Date().valueOf();

    const { proxy } = getCurrentInstance() as any;

    const imgCache: Ref<any> = ref(null);

    const uploadVisible = ref(false);

    const { fileGroupList } = getOperatorListHook();

    function openUploadTab() {
      uploadVisible.value = true;
    }

    function handleClose() {
      Object.assign(imageData, { url: '', file_id: null });
      imgCache.value = null;
      uploadVisible.value = false;
    }

    function getTypeName() {
      return props.typeList.join('、');
    }

    const imageData = reactive({
      url: null,
      file_id: null,
      group_id: null
    });

    // 上传前回调
    function beforeImageUpload(file: any) {
      return new Promise(async (resolve, reject) => {
        const isImage = props.typeList.includes(file.type);
        const isLtMaxSize = file.size / 1024 < props.maxSize;
        if (!isImage) {
          ElMessage.error(`上传图片只能是${getTypeName()}格式!`);
        }
        if (!isLtMaxSize) {
          ElMessage.error(`上传图片大小不能超过${props.maxSize}k!`);
        }
        if (!isImage || !isLtMaxSize) {
          reject();
        }
        const imageData = { url: '', file_id: null };
        imgCache.value = null;
        imgCache.value = URL.createObjectURL(file);
        if (props.isCompression && file.size / 1024 > props.compressSize) {
          compressAccurately(file, props.compressSize)
            .then((data) => {
              resolve(data);
            })
            .catch(() => {
              ElMessage.error('图片压缩失败,将上传原始图片');
              resolve(true);
            });
        } else {
          resolve(true);
        }

        resolve(true);
      });
    }

    // 上传成功回调
    function successUploaded(response: any, file: any, fileList: any) {
      if (response.code == 1) {
        imageData.url = response.data[props.dataKey];
        imageData.file_id = response.data['file_id'];
        ElNotification({
          type: 'success',
          title: `${props.formLabel}上传成功!`
        });
      } else {
        ElMessage.warning(response.msg || response.message);
      }
    }

    // 确定上传内容
    function toSetImage() {
      proxy.$refs['dialogform'].validate((valid: any) => {
        if (valid) {
          emit('setImage', {
            [props.imgkey]: imageData.file_id,
            [props.imgUrlKey]: imageData.url
          });
          handleClose();
        } else {
          return false;
        }
      });
    }

    function getImgeInfo() {
      return {
        [props.imgkey]: imageData.file_id,
        [props.imgUrlKey]: imageData.url
      };
    }

    function removeImage() {
      emit('setImage', { [props.imgkey]: null, [props.imgUrlKey]: '' });
      Object.assign(imageData, { url: null, file_id: null });
    }

    return {
      imgCache,
      uploadVisible,
      openUploadTab,
      handleClose,
      imageData,
      beforeImageUpload,
      successUploaded,
      getTypeName,
      dialogKey,
      getImgeInfo,
      toSetImage,
      removeImage,
      fileGroupList
    };
  }
};
</script>

<style lang="scss" scoped>
.form-box {
  margin-bottom: 18px !important;
}
.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .image {
    width: 100px;
    height: 100px;
    border: 1px dotted rgb(172, 168, 168);
    border-radius: 10px;
    overflow: hidden;
    margin: 0px 10px 0px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .plus {
      font-size: 28px;
      color: rgb(140, 147, 157);
      width: 100px;
      line-height: 100px;
      text-align: center;
    }
  }
}
.upload-box {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .image {
    height: 150px;
    width: 150px;
    border: 1px dotted rgb(172, 168, 168);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .plus {
    font-size: 28px;
    color: rgb(194, 204, 218);
    width: 150px;
    line-height: 150px;
    text-align: center;
  }
}
.warn {
  color: #fdb00b;
  font-size: 16px;
}
.danger {
  color: red;
}
</style>
