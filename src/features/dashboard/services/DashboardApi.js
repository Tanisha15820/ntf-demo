import { mockDashboard, toResponse } from "../../../data/mockStore";

const DashboardApi = {
  getOverview: () => toResponse(mockDashboard.getOverview()),
  getOverviewSync: () => mockDashboard.getOverview(),

  getAttendanceConfig: () => mockDashboard.getAttendanceConfig(),
  getAttendanceRows: () => mockDashboard.getAttendanceRows(),
  saveAttendanceRows: (rows) => mockDashboard.saveAttendanceRows(rows),

  getRequirements: () => mockDashboard.getRequirements(),
  addRequirement: (payload) => mockDashboard.addRequirement(payload),
  updateRequirement: (id, payload) => mockDashboard.updateRequirement(id, payload),
};

export default DashboardApi;
