import { mockMachines } from "../../../data/mockStore";

const MachinesApi = {
  // Get all machines (supports query params: { plantId, departmentId, subDepartmentId, lineId, machineName })
  getMachines: (params) => mockMachines.getMachines(params),

  // Get machines for a specific line
  getMachinesByLine: (lineId) => mockMachines.getMachinesByLine(lineId),

  // Create machine
  createMachine: (machineData) => mockMachines.createMachine(machineData),

  // Get one machine by ID
  getMachine: (machineId) => mockMachines.getMachine(machineId),

  // Update machine
  updateMachine: (machineId, machineData) =>
    mockMachines.updateMachine(machineId, machineData),

  // Delete machine
  deleteMachine: (machineId) => mockMachines.deleteMachine(machineId),
};

export default MachinesApi;
