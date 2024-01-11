import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 定义静态路由
const staticRoutes: Array<any> = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: 'login',
      isHide: true
    }
  },
  // 欢迎页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layout/index.vue'),
    hidden: true,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        hidden: true,
        component: () => import('@/views/welcome/index.vue'),
        meta: {
          title: 'welcome',
          isHide: true
        }
      },
      {
        path: '/task-detail',
        name: 'task-detail',
        hidden: true,
        component: () =>
          import('@/views/tel-maintenance-manage/task-detail/index.vue'),
        meta: {
          title: 'task-detail',
          isHide: true
        }
      },
      {
        path: '/user-info-edit',
        name: 'user-info-edit',
        hidden: true,
        component: () => import('@/views/user-info-edit/index.vue'),
        meta: {
          title: 'userInfoEdit',
          isHide: true
        }
      },
      {
        path: '/recharge-audit-info',
        name: 'recharge-audit-info',
        hidden: true,
        component: () => import('@/views/recharge-audit-info/index.vue'),
        meta: {
          title: 'rechargeAuditInfo',
          isHide: true
        }
      },
      {
        path: '/withdraw-audit-info',
        name: 'withdraw-audit-info',
        hidden: true,
        component: () => import('@/views/withdraw-audit-info/index.vue'),
        meta: {
          title: 'withdrawAuditInfo',
          isHide: true
        }
      },
      {
        path: '/user-add-audit-info',
        name: 'user-add-audit-info',
        hidden: true,
        component: () => import('@/views/user-add-audit-info/index.vue'),
        meta: {
          title: 'userAddAuditInfo',
          isHide: true
        }
      },
      {
        path: '/upload-config',
        name: 'upload-config',
        hidden: true,
        component: () => import('@/views/file-manage/upload-config/index.vue'),
        meta: {
          title: 'uploadConfig',
          isHide: true
        }
      },
      {
        path: '/proxy-audit-info',
        name: 'proxy-audit-info',
        hidden: true,
        component: () => import('@/views/proxy-audit-info/index.vue'),
        meta: {
          title: 'proxyAuditInfo',
          isHide: true
        }
      },
      {
        path: '/vip-bind-apply-info',
        name: 'vip-bind-apply-info',
        hidden: true,
        component: () => import('@/views/vip-bind-apply-info/index.vue'),
        meta: {
          title: 'vipBindApplyInfo',
          isHide: true
        }
      }
    ]
  },
  {
    // 个人中心
    path: '/profile',
    name: 'profile',
    component: () => import('@/layout/index.vue'),
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index.vue'),
        name: 'profile',
        meta: { title: 'profile', icon: 'user', noCache: true, isHide: true }
      }
    ]
  },
  {
    path: '/404',
    name: 'notFound',
    hidden: true,
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '找不到此页面'
    }
  },
  {
    path: '/401',
    name: 'noPower',
    hidden: true,
    component: () => import('@/views/error/401.vue'),
    meta: {
      title: '没有权限'
    }
  }
];

// 定义动态路由
export const manageRoutes = [];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [...staticRoutes, ...manageRoutes]
});

export default router;
