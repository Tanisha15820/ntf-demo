import { mockLines, mockMachines } from "../../../data/mockStore";

const LinesApi = {
  // Get all lines (supports optional query params: { plantId, departmentId, subDepartmentId, lineName })
  getLines: (params) => mockLines.getLines(params),

  // Get lines by sub-department
  getLinesBySubDepartment: (subDepartmentId) =>
    mockLines.getLinesBySubDepartment(subDepartmentId),

  // Create a line
  createLine: (lineData) => mockLines.createLine(lineData),

  // Get one line by ID
  getLine: (lineId) => mockLines.getLine(lineId),

  // Update a line
  updateLine: (lineId, lineData) => mockLines.updateLine(lineId, lineData),

  // Delete a line
  deleteLine: (lineId) => mockLines.deleteLine(lineId),

  // Get all machines for a line
  getMachinesByLine: (lineId) => mockMachines.getMachinesByLine(lineId),

  // Alias helper for machines
  getMachines: (lineId) => mockMachines.getMachinesByLine(lineId),
};

export default LinesApi;
