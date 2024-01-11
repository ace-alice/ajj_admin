<template>
  <div class="main-container">
    <el-tabs
      v-model="crudQuery.terminal_id"
      class="demo-tabs"
      @tab-click="changeTag"
    >
      <el-tab-pane label="PC端" :name="1"></el-tab-pane>
      <el-tab-pane label="H5端" :name="2"></el-tab-pane>
      <el-tab-pane label="APP端" :name="3"></el-tab-pane>
    </el-tabs>
    <crudOperation title="router.banner-manage" labelWidth="120px">
      <template #query>
        <el-form-item :label="$t('table.banner_name')">
          <el-input
            v-model.trim="crudQuery.banner_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.banner_type')">
          <el-select
            v-model="crudQuery.type"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in is_time_limit_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.target_type')">
          <el-select
            v-model="crudQuery.target_type"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in is_jump_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.banner_target')">
          <el-select
            v-model="crudQuery.target_url"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in banner_target_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.status')">
          <el-select
            v-model="crudQuery.status"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in universal_status_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.create_name')">
          <el-input
            v-model.trim="crudQuery.create_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.action_name')">
          <el-input
            v-model.trim="crudQuery.update_name"
            clearable
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.banner_sub_label')">
          <el-select
            v-model="crudQuery.tag_id"
            clearable
            popper-class="user-select"
            style="width: 200px"
          >
            <el-option
              v-for="item in bannerList"
              :key="item.id"
              :label="item.banner_tag_name"
              :value="+item.id"
            />
          </el-select>
        </el-form-item>
      </template>
      <template #table>
        <el-table
          :data="crudData"
          v-loading="queryLoading"
          stripe
          row-key="id"
          max-height="600px"
          highlight-current-row
          :header-cell-style="{ background: '#1b273d', color: '#FFFFFF' }"
          @select="crudSelectHandle"
          @select-all="crudSelectAllhandle"
          @selection-change="crudSelectionChangeHandle"
        >
          <el-table-column
            prop="sort"
            :label="$t('table.sort')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="name"
            :label="$t('table.banner_name')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="desc"
            label="轮播图副标题"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              <el-popover
                placement="top-start"
                :width="200"
                trigger="click"
                :content="scope.row.desc"
              >
                <template #reference>
                  <el-button>{{ $t('table.see_details') }}</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="banner_tag_name"
            label="轮播图标签"
            min-width="160"
            align="center"
          />

          <el-table-column
            prop="type"
            :label="$t('table.banner_type')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.type, is_time_limit_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="file_url"
            :label="$t('table.banner_img')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <el-image
                style="width: 60px; height: 60px"
                :src="scope.row.file_url"
                :preview-src-list="[scope.row.file_url]"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="terminal_id"
            :label="$t('table.terminal_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.terminal_id, terminal_type_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            :label="$t('table.status')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              <PromiseSwitch
                :key="scope.row.name"
                :activeValue="1"
                :inactiveValue="2"
                :initValue="scope.row.status"
                :options="universal_status_options"
                :defaultParam="{
                  id: scope.row.id
                }"
                paramKey="status"
                :changeFun="changeStatus"
                emitFunName="changeStatus"
                :permission="otherPermission.status"
              ></PromiseSwitch>
            </template>
          </el-table-column>
          <el-table-column
            prop="target_type"
            :label="$t('table.target_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.target_type, is_jump_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="target_url"
            :label="$t('table.banner_target')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.target_url, banner_target_options) }}
            </template>
          </el-table-column>

          <el-table-column
            prop="target_content"
            :label="$t('table.target_content')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="type"
            :label="$t('table.banner_type')"
            min-width="120"
            align="center"
          >
            <template #default="scope">
              {{ getLabel(scope.row.type, is_time_limit_options) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="publish_time"
            :label="$t('table.banner_up_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.publish_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="finish_time"
            :label="$t('table.banner_down_time')"
            min-width="160"
            align="center"
          >
            <template #default="scope">
              {{ $parseTime(scope.row.finish_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="create_name"
            :label="$t('table.create_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="create_time"
            :label="$t('table.create_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            prop="update_name"
            :label="$t('table.action_name')"
            min-width="120"
            align="center"
          />
          <el-table-column
            prop="update_time"
            :label="$t('table.update_time')"
            min-width="160"
            align="center"
          />
          <el-table-column
            :label="$t('table.operate')"
            min-width="250"
            align="center"
            fixed="right"
          >
            <template #default="scope">
              <udOperation
                @edit="toEdit(scope.row)"
                @top="toTop(scope.row)"
                :rowData="scope.row"
                @del="toDel({ delete_id: scope.row.id })"
                :permission="crudPermission"
              >
              </udOperation>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!--新增、编辑-->
      <template #form>
        <el-form
          ref="crudDefaultForm"
          :inline="true"
          :model="proxyForm"
          label-width="120px"
        >
          <el-form-item
            :label="$t('table.banner_name') /**banner名称 */"
            prop="name"
            :rules="[
              {
                required: true,
                message: $t('table.banner_name') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.name"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_subtitle') /**轮播图副标题 */"
            prop="desc"
            :rules="[
              {
                required: true,
                message: $t('table.banner_subtitle') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.desc"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_sub_label') /**轮播图标签 */"
            prop="tag_id"
            :rules="[
              {
                required: true,
                message: $t('table.banner_sub_label') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.tag_id"
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in bannerList"
                :key="item.id"
                :label="item.banner_tag_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_type')"
            prop="type"
            :rules="[
              {
                required: true,
                message: $t('table.banner_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.type"
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in is_time_limit_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            :label="$t('table.target_type')"
            prop="target_type"
            :rules="[
              {
                required: true,
                message: $t('table.target_type') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.target_type"
              popper-class="user-select"
              style="width: 200px"
              @change="targetTypeChange"
            >
              <el-option
                v-for="item in is_jump_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_target')"
            v-if="proxyForm.target_type == 1"
            prop="target_url"
            :rules="[
              {
                required: true,
                message: $t('table.target') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.target_url"
              popper-class="user-select"
              style="width: 200px"
              @change="targetChange"
            >
              <el-option
                v-for="item in banner_target_options"
                :key="item.value"
                :label="item.label"
                :value="item.value + ''"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.target_content_b')"
            v-if="proxyForm.target_type == 1 && proxyForm.target_url == 1"
            prop="target_content"
            :rules="[
              {
                required: true,
                message: $t('table.target_content_b') + $t('table.not_empty')
              }
            ]"
          >
            <el-select
              v-model="proxyForm.target_content"
              clearable
              popper-class="user-select"
              style="width: 200px"
            >
              <el-option
                v-for="item in b_lists"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.target_content_url')"
            v-if="proxyForm.target_type == 1 && proxyForm.target_url == 2"
            prop="target_content"
            :rules="[
              {
                required: true,
                message: $t('table.target_content_url') + $t('table.not_empty')
              }
            ]"
          >
            <el-input
              v-model.trim="proxyForm.target_content"
              clearable
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_effective_time')"
            prop="publish_time"
            v-if="proxyForm.type == 2"
            :rules="[
              {
                required: true,
                message: $t('table.time') + $t('table.not_empty')
              }
            ]"
          >
            <dateTimePickerQuery
              @setTime="setTheForm"
              startKey="publish_time"
              endKey="finish_time"
              :isQueryForm="false"
              :propTime="[proxyForm.publish_time, proxyForm.finish_time]"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.banner_up_time')"
            prop="publish_time"
            v-if="proxyForm.type == 1"
            :rules="[
              {
                required: true,
                message: $t('table.banner_up_time') + $t('table.not_empty')
              }
            ]"
          >
            <el-date-picker
              v-model="proxyForm.publish_time"
              type="datetime"
              :placeholder="$t('table.banner_up_time')"
              format="YYYY-MM-DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
            />
          </el-form-item>
          <NomalImageUpload
            @setImage="setTheForm"
            :formLabel="$t('table.banner_img')"
            :data="proxyForm.file_url"
            imgkey="file_id"
            imgUrlKey="file_url"
          />
        </el-form>
      </template>
    </crudOperation>
  </div>
</template>

<script lang="ts">
import Api from '@/api/market-manage/banner-manage';
import { list } from '@/api/market-manage/banner-label-manage';
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  ref,
  getCurrentInstance
} from 'vue';
import { CRUD, crudOperation, udOperation } from '@/components/crud';
import { CrudOptionsType } from '@/components/crud/lib/interface';
import { dateTimePickerQuery } from '@/components/dateComponents';
import { dictionary } from '@/hook/lib';
import { useStore } from '@/store';
import { getDicts } from '@/utils/dictApi';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import PromiseSwitch from '@/components/PromiseSwitch/index.vue';

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '首页banner',
  crudOptShow: {
    add: true
  },
  defaultQuery: {
    terminal_id: 1,
    banner_name: null,
    type: null,
    target_type: null,
    target_url: null,
    status: null,
    create_name: null,
    update_name: null,
    sort_field: null,
    sort_value: null
  },
  crudTableParams: 'data',
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    terminal_id: 1,
    name: null,
    type: 1,
    target_type: 1,
    target_url: 1,
    target_content: null,
    publish_time: null,
    finish_time: null,
    file_id: null,
    file_url: null,
    file_path: null
  },
  crudTag: 'market:banner:'
};

export default defineComponent({
  name: 'banner-manage',
  components: {
    crudOperation,
    dateTimePickerQuery,
    udOperation,
    NomalImageUpload,
    PromiseSwitch
  },
  setup() {
    const crud = CRUD(defaultCrudOptions);

    const { getLabel } = dictionary();

    const dict = reactive({
      is_time_limit_options: [],
      is_jump_options: [],
      banner_target_options: [],
      universal_status_options: [],
      terminal_type_options: [],
      b_lists: []
    });
    const bannerList = ref([]); // banner标签
    const getBannerLabel = (tag_id: string) => {
      const find: any = bannerList.value.find(
        (item: any) =>
          item.banner_tag_desc != '' && item?.banner_tag_desc == tag_id
      );
      if (find) return find.banner_tag_name;
      else return null;
    };

    const otherPermission = reactive({
      status: 'market:banner:change',
      top: 'market:banner:top'
    });

    const store = useStore();

    const operateId = computed(() => {
      return store.getters.user.id;
    });

    const changeTag = (tab: any) => {
      crud.crudHook.beforeToAdd = (form: any) => {
        Object.assign(form, {
          terminal_id: tab.paneName
        });
        return true;
      };
      crud.setTheForm({ terminal_id: tab.paneName });
      crud.toQuery();
    };

    const { proxy } = getCurrentInstance() as any;
    crud.crudHook.beforeToEdit = (form: any) => {
      form.create_time &&
        (form.create_time = proxy.$parseTime(form.create_time));
      form.finish_time &&
        (form.finish_time = proxy.$parseTime(form.finish_time));
      form.publish_time &&
        (form.publish_time = proxy.$parseTime(form.publish_time));
      form.update_time &&
        (form.update_time = proxy.$parseTime(form.update_time));

      return true;
    };

    const getBannerList = () => {
      list({}).then((result: any) => {
        if (result) {
          bannerList.value = result.data.data;
        } else {
          bannerList.value = [];
        }
      });
    };

    onMounted(async () => {
      [
        dict.is_time_limit_options,
        dict.is_jump_options,
        dict.banner_target_options,
        dict.universal_status_options,
        dict.terminal_type_options,
        dict.b_lists
      ] = await Promise.all([
        getDicts('is_time_limit_options'),
        getDicts('is_jump_options'),
        getDicts('banner_target_options'),
        getDicts('universal_status_options'),
        getDicts('terminal_type_options'),
        getDicts('b_lists')
      ]);
      getBannerList();
    });

    function targetTypeChange() {
      crud.proxyForm.target_url = crud.proxyForm.target_type == 1 ? 1 : 0;
      crud.proxyForm.target_content = null;
    }

    function targetChange() {
      crud.proxyForm.target_content = null;
    }

    return {
      ...crud,
      operateId,
      ...toRefs(dict),
      targetTypeChange,
      targetChange,
      changeTag,
      otherPermission,
      getLabel,
      bannerList,
      getBannerLabel,
      getBannerList
    };
  }
});
</script>
