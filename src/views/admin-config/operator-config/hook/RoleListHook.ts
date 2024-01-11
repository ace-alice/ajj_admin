import { ElMessage } from 'element-plus';
import { ref, onMounted } from 'vue';
import { list } from '@/api/admin-config/role-config';

export default function RoleListHook() {
  const roleList = ref([]);

  function getRoleList() {
    list({ page: 1, limit: 10000 })
      .then((result: any) => {
        if (result.code == 1) {
          roleList.value = result.data.list;
        } else {
          ElMessage({
            type: 'warning',
            message: '角色列表获取失败'
          });
        }
      })
      .catch(() => {
        ElMessage({
          type: 'warning',
          message: '角色列表获取失败'
        });
      });
  }

  function setRoleName(id: number) {
    let name = '未分配';
    if (id == 0) {
      return 'superAdmin';
    }
    if (roleList.value.length > 0) {
      roleList.value.forEach((role: any) => {
        if (role.admin_role_id == id) {
          name = role.role_name;
        }
      });
    }
    return name;
  }

  onMounted(() => {
    getRoleList();
  });

  return { roleList, setRoleName };
}
