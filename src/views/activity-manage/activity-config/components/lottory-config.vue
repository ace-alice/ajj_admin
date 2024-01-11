<template>
  <h4 class="form-title">规则配置</h4>
  <el-form-item
    :label="$t('table.distribute_type')"
    prop="send_type"
    :rules="[
      {
        required: true,
        message: $t('table.distribute_type') + $t('table.not_empty')
      }
    ]"
  >
    <el-select
      v-model="proxyForm.send_type"
      style="width: 200px"
      popper-class="user-select"
      clearable
    >
      <template v-for="item in distribute_type_options" :key="item.label">
        <el-option :label="item.label" :value="item.value" />
      </template>
    </el-select>
  </el-form-item>
  <el-form-item
    label="抽奖最低投注"
    prop="need_low_bet"
    :rules="[
      {
        required: true,
        message: '抽奖最低投注' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.need_low_bet"
      clearable
      style="width: 300px"
    ></el-input>
  </el-form-item>
  <el-form-item
    label="每天最多抽奖次数"
    prop="max_lottery_time"
    :rules="[
      {
        required: true,
        message: '每天最多抽奖次数' + $t('table.not_empty')
      }
    ]"
  >
    <el-input
      v-model.trim="proxyForm.max_lottery_time"
      clearable
      style="width: 300px"
    ></el-input>
  </el-form-item>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>奖品列表</span>
        <el-button type="primary" @click="addKey">
          <el-icon><plus /></el-icon
        ></el-button>
      </div>
    </template>
    <el-table
      :data="proxyForm.config_arr"
      max-height="500px"
      style="width: 100%"
      border
    >
      <el-table-column prop="id" label="奖品ID" min-width="160" align="center">
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.id"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="奖品类型"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-select
            v-model="scope.row.type"
            style="width: 80px"
            popper-class="user-select"
            clearable
          >
            <el-option
              v-for="item in bunus_type_options"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="奖品名称"
        min-width="240"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.name"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="img_url"
        label="实物图片"
        min-width="200"
        align="center"
      >
        <template #default="scope">
          <NomalImageUpload
            @setImage="setAwayLogo(scope.$index)"
            formLabel=""
            :isRequire="false"
            :ref="`awayTeam${scope.$index}`"
            :data="scope.row.img_url"
            imgkey="img_url_id"
            imgUrlKey="img_url"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="实物价格"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.price"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="front_show_num"
        label="前台显示实物数量"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.front_show_num"
            style="width: 100px"
            type="text"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        label="实际实物数量"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input v-model.trim="scope.row.num" type="text" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="probability"
        label="中奖概率"
        min-width="160"
        align="center"
      >
        <template #default="scope">
          <el-input
            v-model.trim="scope.row.probability"
            style="width: 140px"
            type="text"
          >
            <template #append> % </template>
          </el-input>
        </template>
      </el-table-column> -->
      <el-table-column
        :label="$t('table.operate')"
        min-width="120"
        align="center"
      >
        <template #default="scope">
          <el-button type="danger" @click="deleteKey(scope.$index)">{{
            $t('crud.delete')
          }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { getDicts } from '@/utils/dictApi';
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  toRefs
} from 'vue';
import NomalImageUpload from '@/components/nomalImageUpload/index.vue';
import { dictionary } from '@/hook/lib';

export default defineComponent({
  name: 'lottory-config',
  components: { NomalImageUpload },
  props: {
    proxyForm: {
      type: Object,
      default: () => {
        return {
          config_arr: []
        };
      }
    }
  },
  setup(prop) {
    const { proxy } = getCurrentInstance() as any;
    const dict = reactive({
      distribute_type_options: [],
      bunus_type_options: []
    });

    onMounted(async () => {
      [
        dict.distribute_type_options,
        dict.bunus_type_options
      ] = await Promise.all([
        getDicts('distribute_type_options'),
        getDicts('bunus_type_options')
      ]);
    });

    function addKey() {
      if (!prop.proxyForm.config_arr) {
        prop.proxyForm.config_arr = [];
      }
      prop.proxyForm.config_arr.push({
        id: null,
        type: null,
        name: null,
        img_url: null,
        price: null,
        num: null,
        front_show_num: null,
        probability: null
      });
    }

    function deleteKey(index: number) {
      prop.proxyForm.config_arr.splice(index, 1);
    }

    function setTheForm(index: number) {
      const img = proxy.$refs[`lottory${index}`].getImgeInfo();
      prop.proxyForm.config_arr[index].img_url = img.img_url;
    }

    function setAwayLogo(index: number) {
      const img = proxy.$refs[`awayTeam${index}`].getImgeInfo();
      console.log(img);
      prop.proxyForm.config_arr[index].img_url = img.img_url;
      prop.proxyForm.config_arr[index].img_url_id = img.img_url_id;
    }

    const { getLabel } = dictionary();

    return {
      ...toRefs(dict),
      addKey,
      deleteKey,
      setTheForm,
      setAwayLogo,
      getLabel,
      proxyForm: prop.proxyForm
    };
  }
});
</script>

<style lang="scss" scoped>
.form-title {
  width: 149px;
  text-align: right;
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
