import { mockRoles, mockUsers } from "../../../data/mockStore";

const RolesApi = {
  getRoles: () => mockRoles.getRoles(),
  getRole: (roleId) => mockRoles.getRole(roleId),
  createRole: (roleData) => mockRoles.createRole(roleData),
  deleteRole: (roleId) => mockRoles.deleteRole(roleId),
  getRolePermissions: (roleId) => mockRoles.getRolePermissions(roleId),
  getRolePages: (roleId) => mockRoles.getRolePages(roleId),
  updateRolePermissions: (roleId, permissions) =>
    mockRoles.updateRolePermissions(roleId, permissions),
  updateAllRolePermissions: (roleId, permissions) =>
    mockRoles.updateRolePermissions(roleId, permissions),
  updateRolePagePermission: (roleId, pageId, permissionData) =>
    mockRoles.updateRolePagePermission(roleId, pageId, permissionData),
  deleteRolePagePermission: (roleId, pageId) =>
    mockRoles.deleteRolePagePermission(roleId, pageId),
  assignUserRole: (userId, roleData) =>
    mockUsers.assignUserRole(userId, roleData),
  getUserPermissions: (userId) => mockUsers.getUserPermissions(userId),
  getMyPermissions: () => mockUsers.getMyPermissions(),
};

export default RolesApi;
