<template>
  <div
    v-loading="queryLoading"
    stripe
    element-loading-spinner="el-icon-position"
    element-loading-background="rgba(255,255,255, 0.1)"
  >
    <el-collapse accordion v-model="activeName" v-if="showflag.query">
      <el-collapse-item name="1">
        <template #title>
          <div class="flex-between border-bottom width-right-30">
            <h3 class="col-mar10">{{ $t(title) }}</h3>
            <div>
              <el-button
                type="primary"
                icon="FirstAidKit"
                v-if="showflag.pullOrder"
                @click.stop="pullOrder"
              >
                {{ $t('crud.pullOrder') }}
              </el-button>
              <el-button
                type="primary"
                v-if="showflag.query"
                :icon="$iconMap.Search"
                @click.stop="search"
              >
                {{ $t('crud.search') }}
              </el-button>
              <el-button
                v-if="showflag.reset"
                @click.stop="reset"
                :icon="$iconMap.Refresh"
                style="background-color: #ccd5e4"
              >
                {{ $t('crud.reset') }}</el-button
              >
              <!-- <el-button v-if="showflag.reset" @click.stop="reset" type="info">
                <el-icon><refresh /></el-icon>
              </el-button> -->
            </div>
          </div>
        </template>
        <el-form
          ref="form"
          :inline="true"
          label-position="right"
          :label-width="labelWidth"
        >
          <slot name="query" />
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-scrollbar height="40px" style="padding: 10px 0" v-if="showflag.operate">
      <div class="flex-between h40 card-box min-vw-1000">
        <div>
          <slot name="left-left" />
          <el-button
            type="primary"
            v-if="showflag.add"
            v-only="crudPermission.add"
            :icon="$iconMap.Plus"
            @click.stop="handleAdd"
            >{{ $t('crud.add') }}</el-button
          >
          <el-popconfirm
            v-if="showflag.moreDel"
            title="Are you sure to delete this?"
            :confirm-button-text="$t('crud.delete')"
            :cancel-button-text="$t('crud.no-thank')"
            icon="el-icon-info"
            icon-color="green"
            @confirm="handleMoreDel"
          >
            <template #reference>
              <el-button v-only="crudPermission.delete" type="primary"
                ><el-icon><delete /></el-icon
                >{{ $t('crud.batch-delete') }}</el-button
              >
            </template>
          </el-popconfirm>
          <!-- <el-button
            type="success"
            v-if="showflag.moreSet"
            icon="el-icon-edit-outline"
            >批量编辑</el-button
          > -->
          <el-popconfirm
            v-if="showflag.download"
            :title="$t('crud.export-hint')"
            :confirm-button-text="$t('crud.export')"
            :cancel-button-text="$t('crud.no-thank')"
            icon="el-icon-info"
            icon-color="green"
            @confirm="toDownLoad"
          >
            <template #reference>
              <el-button type="primary" :loading="downloadLoading">
                <el-icon><download /></el-icon>
                {{ $t('crud.export') }}</el-button
              >
            </template>
          </el-popconfirm>

          <el-button type="primary" v-if="showflag.import" plain
            ><el-icon><upload-filled /></el-icon
            >{{ $t('crud.upload') }}</el-button
          >
          <slot name="left-right" />
        </div>
        <div>
          <slot name="right-left" />
          <el-radio-group
            v-model.number="autoRefreshTime"
            @change="autoRefreshTimeChange"
            :disabled="queryLoading"
            fill="#1b273d"
            v-if="showflag.autoRefresh"
          >
            <el-radio-button
              v-for="auto in autoRefreshOptions"
              :key="auto.value"
              :label="auto.value"
              >{{ auto.label }}</el-radio-button
            >
          </el-radio-group>
          <slot name="right-right" />
        </div>
      </div>
    </el-scrollbar>
    <slot name="table" />
    <!-- style="margin: 10px" -->
    <div :class="{ pageStyle: true }" v-if="isPageQuery">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        @page-size="handleCurrentChange"
        v-model:current-page="currentPage.page"
        :page-sizes="pageSizes"
        v-model:page-size="currentPage.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="currentPage.count"
      >
      </el-pagination>
    </div>
    <!-- :title="dialogTitle" -->
    <!-- destroy-on-close -->
    <!-- 新增/编辑 弹窗 -->
    <!-- custom-class="dialogAnimate" -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="showflag.formSize"
      :fullscreen="showflag.fullscreen"
      :close-on-click-modal="false"
      :show-close="false"
      destroy-on-close
      :before-close="handleClose"
      append-to-body
      @open="openDialogHandle"
    >
      <el-scrollbar
        :max-height="maxHeight"
        v-loading="addEditLoading"
        class="form-box"
      >
        <slot name="form" />
      </el-scrollbar>
      <template #footer v-if="!showflag.hideFooter">
        <span class="dialog-footer">
          <el-divider><i class="el-icon-s-tools"></i></el-divider>
          <slot name="form-footer-left" />
          <el-button :disabled="addEditLoading" @click="handleClose">{{
            $t('crud.cancel')
          }}</el-button>
          <el-button
            type="primary"
            :loading="addEditLoading"
            :icon="$iconMap.Finished"
            @click="submitHandle"
            >{{ $t('crud.sure') }}</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ref,
  getCurrentInstance,
  Ref,
  nextTick,
  defineComponent,
  onMounted,
  onUnmounted,
  watch,
  h
} from 'vue';

import { i18n } from '@/i18n';

import { DocumentAdd, Refresh, Finished } from '@element-plus/icons';
import { ElMessage } from 'element-plus/lib/components';
import { useRouter } from 'vue-router';

// 默认自动刷新数据
const autoRefreshOptions = [
  { label: i18n.global.t('crud.closure'), value: 0 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: i18n.global.t('crud.one-minute'), value: 60 },
  { label: i18n.global.t('crud.three-minute'), value: 180 }
  // { label: "五分钟", value: 300 },
];
// page-sizes默认数据
const pageSizes = [10, 20, 50, 100, 200, 300, 400];
export default defineComponent({
  name: 'crudOperation',
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    selfSetQuery: {
      type: Object,
      default: () => {}
    },
    autoRefreshOptions: {
      type: Array,
      default: () => autoRefreshOptions
    },
    pageSizes: {
      type: Array,
      default: () => pageSizes
    },
    maxHeight: {
      type: String,
      default: '500px'
    },
    hideFooter: {
      type: Boolean,
      default: true
    }
  },
  // emits: [],
  components: { DocumentAdd, Refresh, Finished },
  setup() {
    const { proxy } = <any>getCurrentInstance();
    const router = useRouter();
    const activeName = ref('1');
    const {
      setCrudPageNum,
      setCrudPageSize,
      refresh,
      toQuery,
      resetQuery,
      resetForm,
      resetCrudStatus,
      getTitleStatus,
      toAdd,
      getAddStatus,
      getEditStatus,
      doAdd,
      doEdit,
      doPullOrder,
      getCrudDefaultFormRefs,
      crudFormRefsKey,
      isPageQuery,
      doDownLoad,
      doMoreDel
    } = proxy.$parent;

    // crudOptShow控制按钮功能显示
    const showflag = computed(() => {
      return proxy.$parent.crudOptShow;
    });

    const crudPermission = computed(() => {
      return proxy.$parent.crudPermission;
    });

    // 请求数据的loading
    const queryLoading = computed(() => {
      return proxy.$parent.queryLoading;
    });

    // 查询
    async function search() {
      toQuery();
    }

    // 重置
    async function reset() {
      resetQuery();
      toQuery();
    }

    // 自动更新功能
    const autoRefreshTime: Ref<number> = ref(0);
    let autoRefreshTimer: any = null;

    async function autoRefreshTimeChange(time: number) {
      try {
        clearTimeout(autoRefreshTimer);
        autoRefreshTimer = null;
        await refresh();
        if (time) {
          autoRefreshTimer = setTimeout(async () => {
            await autoRefreshTimeChange(autoRefreshTime.value);
          }, time * 1000);
        } else {
          clearTimeout(autoRefreshTimer);
          autoRefreshTimer = null;
        }
      } catch {}
    }

    // pagination功能模块
    const currentPage = computed(() => {
      return proxy.$parent.crudPage;
    });

    function handleSizeChange(val: number) {
      setCrudPageSize(val);
    }

    function handleCurrentChange(val: number) {
      setCrudPageNum(val);
    }

    // 新增功能模块
    async function handleAdd() {
      try {
        const openDialog = await toAdd();
        if (!openDialog) return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    async function handleMoreDel() {
      try {
        const openDialog = await doMoreDel();
        if (!openDialog) return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    // form对话框
    const addEditLoading = ref(false);
    const dialogTitle: Ref<string> = ref('标题');
    const dialogVisible = ref(false);

    async function openDialogHandle() {
      dialogTitle.value =
        getTitleStatus() || (pullOrderFlag.value ? '补单' : '');
      await nextTick(() => {
        getCrudDefaultFormRefs(proxy.$parent.$refs[crudFormRefsKey]);
      });
    }

    // 关闭对话框，并初始化所有与对话框相关的数据
    async function handleClose() {
      getCrudDefaultFormRefs(
        proxy.$parent.$refs[crudFormRefsKey]
      ).resetFields();
      resetForm();
      resetCrudStatus();
      addEditLoading.value = false;
      dialogVisible.value = false;
    }

    async function submitHandle() {
      addEditLoading.value = true;
      try {
        if (getAddStatus()) {
          const result = await doAdd();
          if (result) {
            await handleClose();
          } else {
            addEditLoading.value = false;
          }
        } else if (getEditStatus()) {
          const result = await doEdit();
          if (result) {
            await handleClose();
          } else {
            addEditLoading.value = false;
          }
        } else if (pullOrderFlag.value) {
          const result = await doPullOrder();
          if (result) {
            ElMessage({
              type: 'success',
              message: '操作成功！'
            })
            await handleClose();
            await refresh();
          } else {
            addEditLoading.value = false;
          }
        } else {
          return;
        }
      } catch (error) {
        addEditLoading.value = false;
      }
    }

    //  拉单
    const pullOrderFlag = ref(false);
    function pullOrder() {
      pullOrderFlag.value = true;
      dialogVisible.value = true;
    }

    //  下载loading
    const downloadLoading = computed(() => {
      return proxy.$parent.downloadLoading;
    });

    //  下载时调用方法
    async function toDownLoad() {
      const data = await doDownLoad();
      if (data.code === 1) {
        ElMessage({
          type: 'success',
          duration: 5000,
          message: h('div', null, [
            h('p', null, `${data.massage},`),
            h('p', null, `文件名：${data.file_name},`),
            h(
              'p',
              {
                style: 'color: teal; cursor: pointer',
                onClick: () => {
                  router.push('/file-manage/data-export-file');
                }
              },
              '前往下载'
            )
          ])
        });
      } else {
        ElMessage.error(data.massage);
      }
    }

    watch(
      () => proxy.$parent.crudStatus.cu,
      (newVal) => {
        dialogVisible.value = newVal > 0;
      }
    );

    onMounted(() => {
      // 自定义弹窗脚部关闭弹窗方法
      proxy.mittBus.on(
        'closeCrudDialog',
        (resetDialogForm: Function | undefined) => {
          resetDialogForm && resetDialogForm();
          resetForm();
          resetCrudStatus();
          addEditLoading.value = false;
          dialogVisible.value = false;
        }
      );
    });

    onUnmounted(() => {
      proxy.mittBus.off('closeCrudDialog');
    });

    return {
      activeName,
      pullOrderFlag,
      pullOrder,
      currentPage,
      search,
      reset,
      showflag,
      handleSizeChange,
      handleCurrentChange,
      autoRefreshTime,
      autoRefreshTimeChange,
      queryLoading,
      openDialogHandle,
      handleClose,
      handleAdd,
      dialogTitle,
      addEditLoading,
      submitHandle,
      isPageQuery,
      downloadLoading,
      toDownLoad,
      dialogVisible,
      crudPermission,
      handleMoreDel
    };
  }
});
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__header) {
  .el-collapse-item__arrow {
    height: 32px;
    width: 32px;
    background-color: #ccd5e4;
    color: #1b273d;
    margin-left: 15px;
    border-radius: 6px;
    margin-top: 2px;
  }
}
.el-collapse-item__content {
  padding-bottom: 10px !important;
  padding-top: 10px !important;
}
.col-mar10 {
  display: inline-block;
  margin: 0 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.border-bottom {
  border-bottom: 1px solid rgb(228, 228, 223);
}
.width-right-30 {
  width: calc(100% - 30px);
}

.h40 {
  height: 40px;
}
.card-box {
  padding: 10px;
  border-left: 5px solid #1b273d;
  border-right: 5px solid #1b273d;
  border-radius: 5px;
}
.min-vw-1000 {
  min-width: 1000px;
}
.min-vw-400 {
  min-width: 400px;
}
.pageStyle {
  position: fixed;
  background-color: #1b273d;
  border-radius: 5px;
  // margin: 10px 0px;
  right: 80px;
  bottom: 20px;
  z-index: 20;
}
</style>
<style lang="scss">
.form-box {
  .el-form-item {
    min-width: 30%;
    // .el-form-item__content {
    //   max-width: 240px;
    // }
  }
}
</style>
