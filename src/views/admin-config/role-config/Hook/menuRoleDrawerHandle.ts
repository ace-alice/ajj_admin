import { getSession } from '@/utils/storage';
import { ElMessage, ElNotification } from 'element-plus';
import { reactive, computed } from 'vue';
import {
  grantedMenu,
  getMenuTree,
  getRoleInfo
} from '@/api/admin-config/role-config';
import { useI18n } from 'vue-i18n';
interface MenuRoleInfoType {
  currentId: null | number;
  currentTitle: string;
  toLoading: boolean;
  show: boolean;
  treeLoading: boolean;
  saveLoading: boolean;
  menuIds: Array<number>;
  menuTree: Array<any>;
}
interface RoleType<T> {
  admin_role_id: number | null;
  admin_menu_ids: Array<number | string>;
  role_name: string;
}
type MenuListType = {
  menuId: number | null | undefined;
  halfId: number | null | undefined;
};
export function menuRoleDrawerHandle(proxy: any): any {
  const i18n = useI18n();

  const menuRoleInfo = reactive<MenuRoleInfoType>({
    currentId: null,
    currentTitle: '',
    toLoading: false,
    show: false,
    treeLoading: false,
    saveLoading: false,
    menuIds: [],
    menuTree: []
  });

  // 初始化角色的菜单与权限
  async function initMenuRole(row: any) {
    return new Promise(async (resolve, reject) => {
      const [menuTree, roleInfo] = await Promise.all([
        getMenuTree(),
        getRoleInfo({ admin_role_id: row.admin_role_id })
      ]);

      if ((roleInfo as any).code == 1) {
        menuRoleInfo.menuIds = roleInfo.data.admin_menu_ids;
      } else {
        menuRoleInfo.menuIds = [];
      }
      if ((menuTree as any).code == 1) {
        menuRoleInfo.menuTree = menuTree.data.list;
      } else {
        menuRoleInfo.menuTree = [];
      }

      resolve(true);
    });
  }

  // 重置菜单与权限
  function resetMenuRole() {
    proxy.$refs.menu.setCheckedKeys([]);
    menuRoleInfo.menuIds = [];
    menuRoleInfo.saveLoading = false;
    menuRoleInfo.treeLoading = false;
    menuRoleInfo.currentId = null;
    menuRoleInfo.currentTitle = '';
    menuRoleInfo.show = false;
    proxy.toQuery();
  }

  // 开启抽屉时的回调
  async function toOpenMenuRoleDrawer(row: {
    admin_role_id: number;
    [key: string]: any;
  }) {
    if (!row.admin_role_id)
      return ElMessage({ type: 'error', message: '角色选择无效' });

    menuRoleInfo.toLoading = false;
    menuRoleInfo.show = true;
    menuRoleInfo.treeLoading = true;
    menuRoleInfo.currentId = row.admin_role_id;
    await initMenuRole(row);
    setTimeout(() => {
      // 解决el-tree组件setCheckedKeys设置一旦选中父级子级也被选中
      menuRoleInfo.menuIds.forEach((value) => {
        proxy.$refs.menu.setChecked(value, true, false);
      });
      menuRoleInfo.currentTitle = row.role_name;
      menuRoleInfo.treeLoading = false;
    }, 500);
  }

  // 不保存关闭抽屉是回调
  function menuRoleDrawerClose() {
    proxy
      .$confirm('需要保存本次做的修改吗?', '提示', {
        confirmButtonText: '保存',
        cancelButtonText: '放弃',
        type: 'warning'
      })
      .then(() => {
        saveMenu();
      })
      .catch(() => {
        ElMessage({ type: 'warning', message: '您放弃了本次修改！' });
        resetMenuRole();
      });
  }

  // 筛选菜单列表
  function filterNode(value: any, data: { label: string | any[] }) {
    if (!value) return true;
    return data.label.indexOf(value) !== -1;
  }

  // 保存菜单
  function saveMenu() {
    menuRoleInfo.saveLoading = true;
    menuRoleInfo.treeLoading = true;
    const role: RoleType<MenuListType> = {
      admin_role_id: menuRoleInfo.currentId,
      admin_menu_ids: [],
      role_name: menuRoleInfo.currentTitle
    };
    let menuList: number[] = [];
    // 得到已选中的 key 值
    proxy.$refs.menu.getCheckedKeys().forEach(function (data: any, index: any) {
      menuList.push(data);
    });
    proxy.$refs.menu
      .getHalfCheckedKeys()
      .forEach(function (data: any, index: any) {
        menuList.push(data);
      });
    if (menuList.length > 0) {
      role.admin_menu_ids = menuList;
    }
    console.log(role);
    grantedMenu(role)
      .then((res: any) => {
        if (res.code == 1) {
          ElNotification({
            type: 'success',
            title: i18n.t('crud.saveSuccessfully')
          });
          resetMenuRole();
        }
      })
      .catch(() => {
        menuRoleInfo.saveLoading = false;
        menuRoleInfo.treeLoading = false;
      });
  }

  return {
    initMenuRole,
    resetMenuRole,
    menuRoleInfo,
    toOpenMenuRoleDrawer,
    menuRoleDrawerClose,
    filterNode,
    saveMenu
  };
}
