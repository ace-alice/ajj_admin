import { store } from '@/store';

export default function permission(el: Node, binding: { value: any }) {
  const { value } = binding;
  const roles = store.getters && store.getters.roles;
  if (value && value instanceof Array && value.length > 0) {
    const permissionRoles = value;

    const hasPermission = roles.some((role: string) => {
      return permissionRoles.includes(role);
    });

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  } else {
    // throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    if (!roles.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
}
