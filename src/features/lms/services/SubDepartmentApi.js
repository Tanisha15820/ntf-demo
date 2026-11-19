import { mockSubDepartments, mockLines } from "../../../data/mockStore";

const SubDepartmentApi = {
  // Get all sub-departments belonging to a specific department
  getSubDepartmentsByDepartment: (departmentId) =>
    mockSubDepartments.getSubDepartmentsByDepartment(departmentId),

  // Get all sub-departments (supports optional query params: { plantId, departmentId, subDepartmentName })
  getSubDepartments: (params) => mockSubDepartments.getSubDepartments(params),

  // Create sub-department
  createSubDepartment: (subDepartmentData) =>
    mockSubDepartments.createSubDepartment(subDepartmentData),

  // Get one sub-department
  getSubDepartment: (subDepartmentId) =>
    mockSubDepartments.getSubDepartment(subDepartmentId),

  // Update sub-department
  updateSubDepartment: (subDepartmentId, subDepartmentData) =>
    mockSubDepartments.updateSubDepartment(subDepartmentId, subDepartmentData),

  // Delete sub-department
  deleteSubDepartment: (subDepartmentId) =>
    mockSubDepartments.deleteSubDepartment(subDepartmentId),

  // Get lines belonging to a specific sub-department
  getLinesBySubDepartment: (subDepartmentId) =>
    mockLines.getLinesBySubDepartment(subDepartmentId),

  // Alias for getLinesBySubDepartment
  getLines: (subDepartmentId) =>
    mockLines.getLinesBySubDepartment(subDepartmentId),
};

export default SubDepartmentApi;
