import { mockDepartments, mockSubDepartments } from "../../../data/mockStore";

const DepartmentApi = {
  // Get all departments
  getDepartments: (params) => mockDepartments.getDepartments(params),

  // Get departments belonging to a specific plant
  getDepartmentsByPlant: (plantId) =>
    mockDepartments.getDepartmentsByPlant(plantId),

  // Create department
  createDepartment: (departmentData) =>
    mockDepartments.createDepartment(departmentData),

  // Get one department
  getDepartment: (departmentId) => mockDepartments.getDepartment(departmentId),

  // Update department
  updateDepartment: (departmentId, departmentData) =>
    mockDepartments.updateDepartment(departmentId, departmentData),

  // Delete department
  deleteDepartment: (departmentId) =>
    mockDepartments.deleteDepartment(departmentId),

  // Get sub-departments
  getSubDepartments: (departmentId) =>
    mockSubDepartments.getSubDepartmentsByDepartment(departmentId),
};

export default DepartmentApi;
