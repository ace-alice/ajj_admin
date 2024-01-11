import { store } from '@/store';

export default function permission(el: Node, binding: { value: any }) {
  const { value } = binding;
  const roles = store.getters && store.getters.roles;
  // return true;
  if (value && value instanceof String) {
    const permissionRoles = value;

    const hasPermission = roles.includes(permissionRoles);

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
