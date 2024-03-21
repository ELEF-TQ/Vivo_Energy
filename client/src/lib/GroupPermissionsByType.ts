import { Permission } from "../types/Permission";

export function groupPermissionsByType(permissions: Permission[]) {
    const groupedPermissions: Record<string, Permission[]> = {};
  
    permissions.forEach(permission => {
      const type = permission.key.split('_')[1].toLowerCase(); 
      if (!groupedPermissions[type]) {
        groupedPermissions[type] = [];
      }
      groupedPermissions[type].push(permission);
    });
  
    return groupedPermissions;
}
