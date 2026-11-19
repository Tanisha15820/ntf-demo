import {
  mockAuth,
  mockPlants,
  mockDepartments,
  mockSubDepartments,
  mockLines,
  mockMachines,
  mockUsers,
  mockRoles,
  mockPages,
  toResponse,
} from "../data/mockStore";

const cleanUrl = (url = "") =>
  String(url)
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/api(\/v1)?/i, "")
    .replace(/\/+$/, "") || "/";

/**
 * Local static JSON API adapter replacing live backend HTTP calls.
 * Mirrors the Axios instance interface (.get, .post, .put, .delete).
 */
const api = {
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },

  get: (url, config = {}) => {
    const path = cleanUrl(url);
    const params = config?.params || {};

    if (path === "/lms/plants") return mockPlants.getPlants();
    const plantDeptsMatch = path.match(/^\/lms\/plants\/([^/]+)\/departments$/);
    if (plantDeptsMatch) return mockDepartments.getDepartmentsByPlant(plantDeptsMatch[1]);
    const plantMatch = path.match(/^\/lms\/plants\/([^/]+)$/);
    if (plantMatch) return mockPlants.getPlant(plantMatch[1]);

    if (path === "/lms/departments") return mockDepartments.getDepartments(params);
    const deptSubMatch = path.match(/^\/lms\/departments\/([^/]+)\/sub-departments$/);
    if (deptSubMatch) return mockSubDepartments.getSubDepartmentsByDepartment(deptSubMatch[1]);
    const deptMatch = path.match(/^\/lms\/departments\/([^/]+)$/);
    if (deptMatch) return mockDepartments.getDepartment(deptMatch[1]);

    if (path === "/lms/sub-departments") return mockSubDepartments.getSubDepartments(params);
    const subLinesMatch = path.match(/^\/lms\/sub-departments\/([^/]+)\/lines$/);
    if (subLinesMatch) return mockLines.getLinesBySubDepartment(subLinesMatch[1]);
    const subMatch = path.match(/^\/lms\/sub-departments\/([^/]+)$/);
    if (subMatch) return mockSubDepartments.getSubDepartment(subMatch[1]);

    if (path === "/lms/lines") return mockLines.getLines(params);
    const lineMachMatch = path.match(/^\/lms\/lines\/([^/]+)\/machines$/);
    if (lineMachMatch) return mockMachines.getMachinesByLine(lineMachMatch[1]);
    const lineMatch = path.match(/^\/lms\/lines\/([^/]+)$/);
    if (lineMatch) return mockLines.getLine(lineMatch[1]);

    if (path === "/lms/machines") return mockMachines.getMachines(params);
    const machMatch = path.match(/^\/lms\/machines\/([^/]+)$/);
    if (machMatch) return mockMachines.getMachine(machMatch[1]);

    if (path === "/lms/users") return mockUsers.getUsers(params);
    const userPermMatch = path.match(/^\/lms\/users\/([^/]+)\/permissions$/);
    if (userPermMatch) return mockUsers.getUserPermissions(userPermMatch[1]);
    const userMatch = path.match(/^\/lms\/users\/([^/]+)$/);
    if (userMatch) return mockUsers.getUser(userMatch[1]);

    if (path === "/lms/me/permissions") return mockUsers.getMyPermissions();

    if (path === "/lms/pages") return mockPages.getPages(params);
    if (path === "/lms/pages/assigned")
      return mockPages.getAssignedPages(params.roleId);

    if (path === "/lms/roles") return mockRoles.getRoles();
    const rolePermsMatch = path.match(/^\/lms\/roles\/([^/]+)\/(permissions|pages)$/);
    if (rolePermsMatch) return mockRoles.getRolePermissions(rolePermsMatch[1]);
    const roleMatch = path.match(/^\/lms\/roles\/([^/]+)$/);
    if (roleMatch) return mockRoles.getRole(roleMatch[1]);

    return toResponse([]);
  },

  post: (url, data = {}) => {
    const path = cleanUrl(url);
    if (path === "/auth/login") return mockAuth.login(data);
    if (path === "/auth/logout") return mockAuth.logout();
    if (path === "/lms/plants") return mockPlants.createPlant(data);
    if (path === "/lms/departments") return mockDepartments.createDepartment(data);
    if (path === "/lms/sub-departments")
      return mockSubDepartments.createSubDepartment(data);
    if (path === "/lms/lines") return mockLines.createLine(data);
    if (path === "/lms/machines") return mockMachines.createMachine(data);
    if (path === "/lms/users/upload-excel") return mockUsers.uploadExcel(data);
    if (path === "/lms/users") return mockUsers.createUser(data);
    if (path === "/lms/pages") return mockPages.createPage(data);
    if (path === "/lms/roles") return mockRoles.createRole(data);
    return toResponse(data, 201);
  },

  put: (url, data = {}) => {
    const path = cleanUrl(url);
    const plantMatch = path.match(/^\/lms\/plants\/([^/]+)$/);
    if (plantMatch) return mockPlants.updatePlant(plantMatch[1], data);

    const deptMatch = path.match(/^\/lms\/departments\/([^/]+)$/);
    if (deptMatch) return mockDepartments.updateDepartment(deptMatch[1], data);

    const subMatch = path.match(/^\/lms\/sub-departments\/([^/]+)$/);
    if (subMatch) return mockSubDepartments.updateSubDepartment(subMatch[1], data);

    const lineMatch = path.match(/^\/lms\/lines\/([^/]+)$/);
    if (lineMatch) return mockLines.updateLine(lineMatch[1], data);

    const machMatch = path.match(/^\/lms\/machines\/([^/]+)$/);
    if (machMatch) return mockMachines.updateMachine(machMatch[1], data);

    const userRoleMatch = path.match(/^\/lms\/users\/([^/]+)\/role$/);
    if (userRoleMatch) return mockUsers.assignUserRole(userRoleMatch[1], data);

    const userMatch = path.match(/^\/lms\/users\/([^/]+)$/);
    if (userMatch) return mockUsers.updateUser(userMatch[1], data);

    const pageMatch = path.match(/^\/lms\/pages\/([^/]+)$/);
    if (pageMatch) return mockPages.updatePage(pageMatch[1], data);

    const rolePagePermMatch = path.match(
      /^\/lms\/roles\/([^/]+)\/permissions\/([^/]+)$/
    );
    if (rolePagePermMatch)
      return mockRoles.updateRolePagePermission(
        rolePagePermMatch[1],
        rolePagePermMatch[2],
        data
      );

    const rolePermsMatch = path.match(/^\/lms\/roles\/([^/]+)\/permissions$/);
    if (rolePermsMatch)
      return mockRoles.updateRolePermissions(rolePermsMatch[1], data);

    return toResponse(data);
  },

  delete: (url) => {
    const path = cleanUrl(url);
    const plantMatch = path.match(/^\/lms\/plants\/([^/]+)$/);
    if (plantMatch) return mockPlants.deletePlant(plantMatch[1]);

    const deptMatch = path.match(/^\/lms\/departments\/([^/]+)$/);
    if (deptMatch) return mockDepartments.deleteDepartment(deptMatch[1]);

    const subMatch = path.match(/^\/lms\/sub-departments\/([^/]+)$/);
    if (subMatch) return mockSubDepartments.deleteSubDepartment(subMatch[1]);

    const lineMatch = path.match(/^\/lms\/lines\/([^/]+)$/);
    if (lineMatch) return mockLines.deleteLine(lineMatch[1]);

    const machMatch = path.match(/^\/lms\/machines\/([^/]+)$/);
    if (machMatch) return mockMachines.deleteMachine(machMatch[1]);

    const userMatch = path.match(/^\/lms\/users\/([^/]+)$/);
    if (userMatch) return mockUsers.deleteUser(userMatch[1]);

    const pageMatch = path.match(/^\/lms\/pages\/([^/]+)$/);
    if (pageMatch) return mockPages.deletePage(pageMatch[1]);

    const rolePagePermMatch = path.match(
      /^\/lms\/roles\/([^/]+)\/permissions\/([^/]+)$/
    );
    if (rolePagePermMatch)
      return mockRoles.deleteRolePagePermission(
        rolePagePermMatch[1],
        rolePagePermMatch[2]
      );

    const roleMatch = path.match(/^\/lms\/roles\/([^/]+)$/);
    if (roleMatch) return mockRoles.deleteRole(roleMatch[1]);

    return toResponse({ message: "Deleted" });
  },
};

export default api;
