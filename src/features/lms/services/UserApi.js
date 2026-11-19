import { mockUsers } from "../../../data/mockStore";

const UserApi = {
  getUsers: (params) => mockUsers.getUsers(params),
  createUser: (userData) => mockUsers.createUser(userData),
  getUser: (userId) => mockUsers.getUser(userId),
  updateUser: (userId, userData) => mockUsers.updateUser(userId, userData),
  deleteUser: (userId) => mockUsers.deleteUser(userId),
  uploadExcel: (formData) => mockUsers.uploadExcel(formData),
  assignUserRole: (userId, roleData) =>
    mockUsers.assignUserRole(userId, roleData),
  getUserPermissions: (userId) => mockUsers.getUserPermissions(userId),
  getMyPermissions: () => mockUsers.getMyPermissions(),
};

export default UserApi;
