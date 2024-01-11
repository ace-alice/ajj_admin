<template>
  <div class="layout-columns-aside">
    <div class="user-center">
      <UserCenter />
    </div>
    <el-scrollbar class="aside-scrollbar">
      <ul>
        <li
          v-for="(v, k) in columnsAsideList"
          :key="k"
          @click="onColumnsAsideMenuClick(v, k)"
          :ref="
            (el) => {
              if (el) columnsAsideOffsetTopRefs[k] = el;
            }
          "
          :class="{ 'layout-columns-active': liIndex === k }"
          :title="$t('router.' + v.name)"
        >
          <div
            class="layout-columns-aside-li-box"
            v-if="!v.meta.isLink || (v.meta.isLink && v.meta.isIframe)"
          >
            <svg-icon
              :name="liIndex !== k ? v.meta.icon : `${v.meta.icon}-active`"
            ></svg-icon>
            <div class="layout-columns-aside-li-box-title">
              {{ $t('router.' + v.name) }}
            </div>
          </div>
          <div class="layout-columns-aside-li-box" v-else>
            <a :href="v.meta.isLink" target="_blank">
              <i :class="v.meta.icon"></i>
              <div class="layout-columns-aside-li-box-title">
                {{
                  $t('router.' + v.name) && $t('router.' + v.name).length >= 4
                    ? $t('router.' + v.name).substr(0, 4)
                    : $t('router.' + v.name)
                }}
              </div>
            </a>
          </div>
        </li>
        <div ref="columnsAsideActiveRef" :class="setColumnsAsideStyle"></div>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import {
  reactive,
  toRefs,
  ref,
  computed,
  onMounted,
  nextTick,
  getCurrentInstance,
  watch
} from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
import { useStore } from '@/store/index.ts';
import UserCenter from '../navBars/breadcrumb/userCenter.vue';
export default {
  name: 'layoutColumnsAside',
  emits: ['setSendColumnsChildren'],
  components: { UserCenter },
  setup() {
    const columnsAsideOffsetTopRefs: any = ref([]);
    const columnsAsideActiveRef = ref();
    const { proxy } = getCurrentInstance() as any;
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const state: any = reactive({
      columnsAsideList: [],
      liIndex: 0,
      difference: 0,
      routeSplit: []
    });
    // 设置高亮样式
    const setColumnsAsideStyle = computed(() => {
      return store.state.themeConfig.themeConfig.columnsAsideStyle;
    });
    // 设置菜单高亮位置移动
    const setColumnsAsideMove = (k: number) => {
      if (k === -1) return;
      state.liIndex = k;
      nextTick(() => {
        columnsAsideActiveRef.value.style.top = `${
          columnsAsideOffsetTopRefs.value[k].offsetTop + state.difference
        }px`;
      });
    };

    // 页面刷新获取当前菜单的位置
    function getMenuIndex(): number {
      let ret: number = -1;
      let arr: any = [];
      state.columnsAsideList.map((item: any) => {
        arr.push(...item.children);
      });
      const currentPage: any = arr.filter(
        (item: any) => item.path === route.path
      )[0];
      if (!currentPage) {
        return ret;
      }
      ret = state.columnsAsideList.findIndex(
        (item: any) => item.admin_menu_id === currentPage.menu_pid
      );
      return ret;
    }

    // 菜单高亮点击事件
    const onColumnsAsideMenuClick = (v: any, k: number) => {
      setColumnsAsideMove(k);
      const { path, redirect } = v as any;

      proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(v.path));
      if (redirect) router.push(redirect);
      else router.push(path);
    };
    // 设置高亮动态位置
    const onColumnsAsideDown = (k: number) => {
      nextTick(() => {
        setColumnsAsideMove(k);
      });
    };
    // 设置/过滤路由（非静态路由/是否显示在菜单中）
    const setFilterRoutes = () => {
      state.columnsAsideList = filterRoutesFun(
        store.state.routesList.routesList
      );
      const resData: any = setSendChildren(route.path);
      // onColumnsAsideDown(resData.item[0].k);
      proxy.mittBus.emit('setSendColumnsChildren', resData);
    };
    // 传送当前子级数据到菜单中
    const setSendChildren = (path: string) => {
      console.log('setSendChildren');
      const currentPathSplit = path.split('/');
      const currentData: any = {};
      state.columnsAsideList.map((v: any, k: number) => {
        if (v.path === `/${currentPathSplit[1]}`) {
          v['k'] = k;
          currentData['item'] = [{ ...v }];
          currentData['children'] = [{ ...v }];
          if (v.children) currentData['children'] = v.children;
        }
      });
      return currentData;
    };
    // 路由过滤递归函数
    const filterRoutesFun = (arr: Array<any>) => {
      return arr
        .filter((item: any) => !item.meta.isHide)
        .map((item: any) => {
          item = Object.assign({}, item);
          if (item.children) item.children = filterRoutesFun(item.children);
          return item;
        });
    };
    // tagsView 点击时，根据路由查找下标 columnsAsideList，实现左侧菜单高亮
    const setColumnsMenuHighlight = (path: string) => {
      state.routeSplit = path.split('/');
      state.routeSplit.shift();
      const routeFirst = `/${state.routeSplit[0]}`;
      const currentSplitRoute = state.columnsAsideList.find(
        (v: any) => v.path === routeFirst
      );
      // 延迟拿值，防止取不到
      setTimeout(() => {
        onColumnsAsideDown(currentSplitRoute.k);
      }, 0);
    };
    // 监听路由的变化，动态赋值给菜单中
    watch(
      store.state,
      (val) => {
        val.themeConfig.themeConfig.columnsAsideStyle === 'columnsRound'
          ? (state.difference = 3)
          : (state.difference = 0);
        if (
          val.routesList.routesList.length === state.columnsAsideList.length
        ) {
          return false;
        }
        setFilterRoutes();
      },
      { deep: true }
    );
    // 页面加载时
    onMounted(() => {
      setFilterRoutes();
      setColumnsAsideMove(getMenuIndex());
    });

    const whiteRoute = [
      '/user-info-edit',
      '/profile',
      '/welcome',
      '/task-detail',
      '/recharge-audit-info',
      '/withdraw-audit-info',
      '/user-add-audit-info',
      '/upload-config',
      '/proxy-audit-info',
      '/404',
      '/401',
      '/vip-bind-apply-info',
      '/profile/index'
    ];

    watch(
      () => route.path,
      (newPath) => {
        console.log(newPath);
        if (whiteRoute.includes(newPath)) return;
        setColumnsMenuHighlight(newPath);
        proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(newPath));
      }
    );
    // 路由更新时
    // onBeforeRouteUpdate((to) => {
    //   setColumnsMenuHighlight(to.path);
    //   proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(to.path));
    // });
    return {
      columnsAsideOffsetTopRefs,
      columnsAsideActiveRef,
      onColumnsAsideDown,
      setColumnsAsideStyle,
      onColumnsAsideMenuClick,
      ...toRefs(state)
    };
  }
};
</script>

<style scoped lang="scss">
.layout-columns-aside {
  width: 120px;
  height: 100%;

  background: var(--bg-columnsMenuBar);

  .user-center {
    display: flex;
    height: 80px;
    justify-content: center;
    align-items: center;
  }
  ul {
    position: relative;
    li {
      // color: var(--bg-columnsMenuBarColor);
      color: #9dabc4;
      width: 100%;
      height: 40px;
      text-align: center;
      display: flex;
      cursor: pointer;
      position: relative;
      margin: 20px 0;
      z-index: 1;
      .layout-columns-aside-li-box {
        margin: 0 10px;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .layout-columns-aside-li-box-title {
          overflow: hidden;
          padding-top: 1px;
        }
      }
      a {
        text-decoration: none;
        color: var(--bg-columnsMenuBarColor);
      }
    }
    .layout-columns-active {
      color: #ffffff;
      transition: 0.3s ease-in-out;
    }
    .columns-round {
      // background: var(--color-primary);
      background-color: #ffffff20;
      color: #ffffff;
      position: absolute;
      left: 50%;
      top: 0px;
      height: 40px;
      width: 100%;
      transform: translateX(-50%);
      z-index: 0;
      transition: 0.3s ease-in-out;

      &::after {
        position: absolute;
        content: '';
        height: 100%;
        width: 3px;
        background-color: #18d5c6;
      }
      // border-radius: 5px;
    }
    .columns-card {
      @extend .columns-round;
      top: 0;
      height: 60px;
      width: 100%;
      border-radius: 0;
    }
  }
  .aside-scrollbar {
    height: calc(100% - 80px);
  }
}
</style>
