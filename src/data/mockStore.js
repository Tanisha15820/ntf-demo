import * as XLSX from "xlsx";
import authSeed from "./auth.json";
import plantsSeed from "./plants.json";
import departmentsSeed from "./departments.json";
import subDepartmentsSeed from "./subDepartments.json";
import linesSeed from "./lines.json";
import machinesSeed from "./machines.json";
import usersSeed from "./users.json";
import rolesSeed from "./roles.json";
import pagesSeed from "./pages.json";
import dashboardSeed from "./dashboard.json";
import lmsSeed from "./lms.json";
import cmsSeed from "./cms.json";

const STORAGE_KEYS = {
  plants: "ntf_static_plants_v1",
  departments: "ntf_static_departments_v1",
  subDepartments: "ntf_static_subdepartments_v1",
  lines: "ntf_static_lines_v1",
  machines: "ntf_static_machines_v1",
  users: "ntf_static_users_v1",
  roles: "ntf_static_roles_v1",
  rolePermissions: "ntf_static_role_perms_v1",
  pages: "ntf_static_pages_v1",
  attendance: "ntf_static_attendance_v1",
  requirements: "ntf_static_requirements_v1",
  cmsContents: "ntf_static_cms_contents_v1",
};

const clone = (val) => JSON.parse(JSON.stringify(val));

const readStore = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return clone(fallback);
    const parsed = JSON.parse(raw);
    return parsed ?? clone(fallback);
  } catch {
    return clone(fallback);
  }
};

const writeStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
  return value;
};

export const toResponse = (data, status = 200) =>
  Promise.resolve({
    data: clone(data),
    status,
    statusText: "OK",
    headers: {},
    config: {},
  });

export const toError = (detail = "Not found", status = 404) => {
  const err = new Error(detail);
  err.response = {
    status,
    data: { detail, message: detail },
  };
  return Promise.reject(err);
};

const nextNumericId = (items) => {
  const max = (items || []).reduce((acc, item) => {
    const num = Number(item?.id);
    return Number.isFinite(num) && num > acc ? num : acc;
  }, 0);
  return max + 1;
};

/* ============================================================================
   AUTH SERVICE OPERATIONS
============================================================================ */
export const mockAuth = {
  getDefaultAuth: () => clone(authSeed),

  login: ({ email = "", password = "" } = {}) => {
    const trimmedEmail = String(email || "").trim().toLowerCase();
    if (!trimmedEmail || !password) {
      return toError("Please enter your email and password.", 400);
    }

    const users = mockUsers.listRaw();
    const matchedUser = users.find(
      (u) =>
        String(u.email || "").toLowerCase() === trimmedEmail ||
        String(u.payCode || "").toLowerCase() === trimmedEmail ||
        String(u.empName || "").toLowerCase() === trimmedEmail
    );

    const baseUser = matchedUser
      ? {
          id: matchedUser.id,
          sno: matchedUser.sno,
          payCode: matchedUser.payCode,
          cardNo: matchedUser.cardNo,
          empName: matchedUser.empName,
          name: matchedUser.empName,
          username: matchedUser.email?.split("@")[0] || matchedUser.empName,
          email: matchedUser.email || trimmedEmail,
          role: matchedUser.roleName || matchedUser.role || "SUPER_ADMIN",
          roleId: matchedUser.roleId || 1,
          department: matchedUser.departmentName || matchedUser.department || "ASSEMBLY",
          departmentName: matchedUser.departmentName || matchedUser.department || "ASSEMBLY",
          designation: matchedUser.designation || "OPERATIONS MANAGER",
          plant: matchedUser.plant || "1",
          plantLocation: matchedUser.plantLocation || "Unit-V Manesar",
          active: true,
        }
      : {
          ...authSeed.defaultUser,
          email: trimmedEmail,
          empName:
            trimmedEmail === "admin@ntf.com"
              ? authSeed.defaultUser.empName
              : trimmedEmail
                  .split("@")[0]
                  .replace(/[._-]+/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
        };

    return toResponse({
      access_token: authSeed.defaultToken,
      token: authSeed.defaultToken,
      token_type: "bearer",
      user: baseUser,
    });
  },

  logout: () => toResponse({ message: "Logged out successfully" }),
};

/* ============================================================================
   PLANTS OPERATIONS
============================================================================ */
export const mockPlants = {
  listRaw: () => readStore(STORAGE_KEYS.plants, plantsSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.plants, list),

  getPlants: () => toResponse(mockPlants.listRaw()),

  getPlant: (plantId) => {
    const plant = mockPlants
      .listRaw()
      .find((p) => String(p.id) === String(plantId));
    if (!plant) return toError(`Plant #${plantId} not found`, 404);
    return toResponse(plant);
  },

  createPlant: (payload = {}) => {
    const list = mockPlants.listRaw();
    const name = String(payload.plantName || payload.name || "").trim();
    if (!name) return toError("Plant name is required", 400);

    const id = nextNumericId(list);
    const created = {
      id,
      plantName: name,
      name,
      plantLocation: payload.plantLocation || name,
      code: payload.code || `PLT-0${id}`,
    };
    mockPlants.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updatePlant: (plantId, payload = {}) => {
    const list = mockPlants.listRaw();
    const index = list.findIndex((p) => String(p.id) === String(plantId));
    if (index === -1) return toError(`Plant #${plantId} not found`, 404);

    const name = String(
      payload.plantName ?? payload.name ?? list[index].plantName
    ).trim();
    const updated = {
      ...list[index],
      ...payload,
      id: list[index].id,
      plantName: name,
      name,
      plantLocation: payload.plantLocation || name,
    };
    list[index] = updated;
    mockPlants.saveRaw(list);
    return toResponse(updated);
  },

  deletePlant: (plantId) => {
    const list = mockPlants.listRaw();
    const next = list.filter((p) => String(p.id) !== String(plantId));
    mockPlants.saveRaw(next);
    return toResponse({ message: "Plant deleted successfully" });
  },
};

/* ============================================================================
   DEPARTMENTS OPERATIONS
============================================================================ */
export const mockDepartments = {
  listRaw: () => readStore(STORAGE_KEYS.departments, departmentsSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.departments, list),

  getDepartments: (params = {}) => {
    let list = mockDepartments.listRaw();
    if (params?.plantId) {
      list = list.filter((d) => String(d.plantId) === String(params.plantId));
    }
    return toResponse(list);
  },

  getDepartmentsByPlant: (plantId) => {
    const list = mockDepartments
      .listRaw()
      .filter((d) => String(d.plantId) === String(plantId));
    return toResponse(list);
  },

  getDepartment: (departmentId) => {
    const dept = mockDepartments
      .listRaw()
      .find((d) => String(d.id) === String(departmentId));
    if (!dept) return toError(`Department #${departmentId} not found`, 404);
    return toResponse(dept);
  },

  createDepartment: (payload = {}) => {
    const list = mockDepartments.listRaw();
    const name = String(
      payload.departmentName || payload.name || ""
    ).trim();
    if (!name) return toError("Department name is required", 400);

    const id = nextNumericId(list);
    const created = {
      id,
      plantId: payload.plantId ? Number(payload.plantId) || payload.plantId : 1,
      departmentName: name,
      name,
    };
    mockDepartments.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updateDepartment: (departmentId, payload = {}) => {
    const list = mockDepartments.listRaw();
    const index = list.findIndex((d) => String(d.id) === String(departmentId));
    if (index === -1) return toError(`Department #${departmentId} not found`, 404);

    const name = String(
      payload.departmentName ?? payload.name ?? list[index].departmentName
    ).trim();
    const updated = {
      ...list[index],
      ...payload,
      id: list[index].id,
      departmentName: name,
      name,
    };
    list[index] = updated;
    mockDepartments.saveRaw(list);
    return toResponse(updated);
  },

  deleteDepartment: (departmentId) => {
    const list = mockDepartments.listRaw();
    const next = list.filter((d) => String(d.id) !== String(departmentId));
    mockDepartments.saveRaw(next);
    return toResponse({ message: "Department deleted successfully" });
  },
};

/* ============================================================================
   SUB-DEPARTMENTS OPERATIONS
============================================================================ */
export const mockSubDepartments = {
  listRaw: () => readStore(STORAGE_KEYS.subDepartments, subDepartmentsSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.subDepartments, list),

  getSubDepartments: (params = {}) => {
    let list = mockSubDepartments.listRaw();
    if (params?.departmentId) {
      list = list.filter(
        (sd) => String(sd.departmentId) === String(params.departmentId)
      );
    }
    if (params?.plantId) {
      const plantDeptIds = new Set(
        mockDepartments
          .listRaw()
          .filter((d) => String(d.plantId) === String(params.plantId))
          .map((d) => String(d.id))
      );
      list = list.filter(
        (sd) =>
          String(sd.plantId) === String(params.plantId) ||
          plantDeptIds.has(String(sd.departmentId))
      );
    }
    if (params?.subDepartmentName) {
      const q = String(params.subDepartmentName).toLowerCase();
      list = list.filter((sd) =>
        String(sd.subDepartmentName || sd.name)
          .toLowerCase()
          .includes(q)
      );
    }
    return toResponse(list);
  },

  getSubDepartmentsByDepartment: (departmentId) => {
    const list = mockSubDepartments
      .listRaw()
      .filter((sd) => String(sd.departmentId) === String(departmentId));
    return toResponse(list);
  },

  getSubDepartment: (subDepartmentId) => {
    const sd = mockSubDepartments
      .listRaw()
      .find((item) => String(item.id) === String(subDepartmentId));
    if (!sd) return toError(`Sub-department #${subDepartmentId} not found`, 404);
    return toResponse(sd);
  },

  createSubDepartment: (payload = {}) => {
    const list = mockSubDepartments.listRaw();
    const name = String(
      payload.subDepartmentName || payload.name || ""
    ).trim();
    if (!name) return toError("Sub-department name is required", 400);

    const parentDept = mockDepartments
      .listRaw()
      .find((d) => String(d.id) === String(payload.departmentId));

    const id = nextNumericId(list);
    const created = {
      id,
      plantId: payload.plantId ?? parentDept?.plantId ?? 1,
      departmentId: payload.departmentId
        ? Number(payload.departmentId) || payload.departmentId
        : parentDept?.id ?? 1,
      subDepartmentName: name,
      name,
    };
    mockSubDepartments.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updateSubDepartment: (subDepartmentId, payload = {}) => {
    const list = mockSubDepartments.listRaw();
    const index = list.findIndex(
      (sd) => String(sd.id) === String(subDepartmentId)
    );
    if (index === -1)
      return toError(`Sub-department #${subDepartmentId} not found`, 404);

    const name = String(
      payload.subDepartmentName ?? payload.name ?? list[index].subDepartmentName
    ).trim();
    const updated = {
      ...list[index],
      ...payload,
      id: list[index].id,
      subDepartmentName: name,
      name,
    };
    list[index] = updated;
    mockSubDepartments.saveRaw(list);
    return toResponse(updated);
  },

  deleteSubDepartment: (subDepartmentId) => {
    const list = mockSubDepartments.listRaw();
    const next = list.filter(
      (sd) => String(sd.id) !== String(subDepartmentId)
    );
    mockSubDepartments.saveRaw(next);
    return toResponse({ message: "Sub-department deleted successfully" });
  },
};

/* ============================================================================
   LINES OPERATIONS
============================================================================ */
export const mockLines = {
  listRaw: () => readStore(STORAGE_KEYS.lines, linesSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.lines, list),

  getLines: (params = {}) => {
    let list = mockLines.listRaw();
    if (params?.subDepartmentId) {
      list = list.filter(
        (l) => String(l.subDepartmentId) === String(params.subDepartmentId)
      );
    }
    if (params?.departmentId) {
      list = list.filter(
        (l) => String(l.departmentId) === String(params.departmentId)
      );
    }
    if (params?.plantId) {
      list = list.filter(
        (l) => String(l.plantId) === String(params.plantId)
      );
    }
    if (params?.lineName) {
      const q = String(params.lineName).toLowerCase();
      list = list.filter((l) =>
        String(l.lineName || l.name).toLowerCase().includes(q)
      );
    }
    return toResponse(list);
  },

  getLinesBySubDepartment: (subDepartmentId) =>
    mockLines.getLines({ subDepartmentId }),

  getLine: (lineId) => {
    const line = mockLines
      .listRaw()
      .find((l) => String(l.id) === String(lineId));
    if (!line) return toError(`Line #${lineId} not found`, 404);
    return toResponse(line);
  },

  createLine: (payload = {}) => {
    const list = mockLines.listRaw();
    const name = String(payload.lineName || payload.name || "").trim();
    if (!name) return toError("Line name is required", 400);

    const parentSubDept = mockSubDepartments
      .listRaw()
      .find((sd) => String(sd.id) === String(payload.subDepartmentId));

    const id = nextNumericId(list);
    const created = {
      id,
      plantId: payload.plantId ?? parentSubDept?.plantId ?? 1,
      departmentId: payload.departmentId ?? parentSubDept?.departmentId ?? 1,
      subDepartmentId: payload.subDepartmentId
        ? Number(payload.subDepartmentId) || payload.subDepartmentId
        : parentSubDept?.id ?? 101,
      lineName: name,
      name,
      code: payload.code || `LN-${id}`,
      leaders: payload.leaders || "",
      mentor: payload.mentor || "",
      requirement: payload.requirement || "",
      description: payload.description || "",
    };
    mockLines.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updateLine: (lineId, payload = {}) => {
    const list = mockLines.listRaw();
    const index = list.findIndex((l) => String(l.id) === String(lineId));
    if (index === -1) return toError(`Line #${lineId} not found`, 404);

    const name = String(
      payload.lineName ?? payload.name ?? list[index].lineName
    ).trim();
    const updated = {
      ...list[index],
      ...payload,
      id: list[index].id,
      lineName: name,
      name,
    };
    list[index] = updated;
    mockLines.saveRaw(list);
    return toResponse(updated);
  },

  deleteLine: (lineId) => {
    const list = mockLines.listRaw();
    const next = list.filter((l) => String(l.id) !== String(lineId));
    mockLines.saveRaw(next);
    return toResponse({ message: "Line deleted successfully" });
  },
};

/* ============================================================================
   MACHINES OPERATIONS
============================================================================ */
export const mockMachines = {
  listRaw: () => readStore(STORAGE_KEYS.machines, machinesSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.machines, list),

  getMachines: (params = {}) => {
    let list = mockMachines.listRaw();
    if (params?.lineId) {
      list = list.filter((m) => String(m.lineId) === String(params.lineId));
    }
    if (params?.subDepartmentId) {
      const subDeptLineIds = new Set(
        mockLines
          .listRaw()
          .filter(
            (l) => String(l.subDepartmentId) === String(params.subDepartmentId)
          )
          .map((l) => String(l.id))
      );
      list = list.filter(
        (m) =>
          String(m.subDepartmentId) === String(params.subDepartmentId) ||
          subDeptLineIds.has(String(m.lineId))
      );
    }
    if (params?.departmentId) {
      list = list.filter(
        (m) => String(m.departmentId) === String(params.departmentId)
      );
    }
    if (params?.plantId) {
      list = list.filter((m) => String(m.plantId) === String(params.plantId));
    }
    if (params?.machineName) {
      const q = String(params.machineName).toLowerCase();
      list = list.filter((m) =>
        String(m.machineName || m.name).toLowerCase().includes(q)
      );
    }
    return toResponse(list);
  },

  getMachinesByLine: (lineId) => mockMachines.getMachines({ lineId }),

  getMachine: (machineId) => {
    const machine = mockMachines
      .listRaw()
      .find((m) => String(m.id) === String(machineId));
    if (!machine) return toError(`Machine #${machineId} not found`, 404);
    return toResponse(machine);
  },

  createMachine: (payload = {}) => {
    const list = mockMachines.listRaw();
    const name = String(payload.machineName || payload.name || "").trim();
    if (!name) return toError("Machine name is required", 400);

    const parentLine = mockLines
      .listRaw()
      .find((l) => String(l.id) === String(payload.lineId));

    const id = nextNumericId(list);
    const created = {
      id,
      plantId: payload.plantId ?? parentLine?.plantId ?? 1,
      departmentId: payload.departmentId ?? parentLine?.departmentId ?? 1,
      subDepartmentId:
        payload.subDepartmentId ?? parentLine?.subDepartmentId ?? 101,
      lineId: payload.lineId
        ? Number(payload.lineId) || payload.lineId
        : parentLine?.id ?? 201,
      machineName: name,
      name,
    };
    mockMachines.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updateMachine: (machineId, payload = {}) => {
    const list = mockMachines.listRaw();
    const index = list.findIndex((m) => String(m.id) === String(machineId));
    if (index === -1) return toError(`Machine #${machineId} not found`, 404);

    const name = String(
      payload.machineName ?? payload.name ?? list[index].machineName
    ).trim();
    const updated = {
      ...list[index],
      ...payload,
      id: list[index].id,
      machineName: name,
      name,
    };
    list[index] = updated;
    mockMachines.saveRaw(list);
    return toResponse(updated);
  },

  deleteMachine: (machineId) => {
    const list = mockMachines.listRaw();
    const next = list.filter((m) => String(m.id) !== String(machineId));
    mockMachines.saveRaw(next);
    return toResponse({ message: "Machine deleted successfully" });
  },
};

/* ============================================================================
   USERS OPERATIONS
============================================================================ */
export const mockUsers = {
  listRaw: () => readStore(STORAGE_KEYS.users, usersSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.users, list),

  getUsers: (params = {}) => {
    let list = mockUsers.listRaw();
    if (params?.plantId) {
      list = list.filter((u) => String(u.plantId) === String(params.plantId));
    }
    if (params?.departmentId) {
      list = list.filter(
        (u) => String(u.departmentId) === String(params.departmentId)
      );
    }
    if (params?.subDepartmentId) {
      list = list.filter(
        (u) => String(u.subDepartmentId) === String(params.subDepartmentId)
      );
    }
    if (params?.lineId) {
      list = list.filter((u) => String(u.lineId) === String(params.lineId));
    }
    if (params?.machineId) {
      list = list.filter(
        (u) => String(u.machineId) === String(params.machineId)
      );
    }
    if (params?.shift) {
      list = list.filter(
        (u) =>
          String(u.shift || "").toLowerCase() ===
          String(params.shift).toLowerCase()
      );
    }
    if (params?.skillLevel) {
      list = list.filter(
        (u) =>
          String(u.skillLevel || "").toLowerCase() ===
          String(params.skillLevel).toLowerCase()
      );
    }
    if (params?.active !== undefined) {
      list = list.filter((u) => Boolean(u.active) === Boolean(params.active));
    }
    const skip = Number(params?.skip) || 0;
    const limit = Number(params?.limit) || list.length || 1000;
    return toResponse(list.slice(skip, skip + limit));
  },

  getUser: (userId) => {
    const user = mockUsers
      .listRaw()
      .find(
        (u) =>
          String(u.id) === String(userId) ||
          String(u.payCode) === String(userId)
      );
    if (!user) return toError(`User #${userId} not found`, 404);
    return toResponse(user);
  },

  createUser: (payload = {}) => {
    const list = mockUsers.listRaw();
    const id = nextNumericId(list);
    const sno = list.length + 1;
    const isActive = payload.active !== false;
    const created = {
      id,
      sno,
      payCode: payload.payCode || String(10000 + id),
      cardNo: payload.cardNo || `000${10000 + id}`,
      empName: payload.empName || "New Employee",
      fatherName: payload.fatherName || "",
      dob: payload.dob || "",
      dateOfJoining: payload.dateOfJoining || payload.joiningDate || "",
      joiningDate: payload.dateOfJoining || payload.joiningDate || "",
      leavingDate: payload.leavingDate || "",
      companyName: payload.companyName || "NTF INDIA PVT LTD",
      plantId: payload.plantId ?? 1,
      plant: String(payload.plantId ?? payload.plant ?? "1"),
      plantLocation: payload.plantLocation || "Unit-V Manesar",
      departmentId: payload.departmentId ?? 1,
      departmentName: payload.departmentName || payload.department || "ASSEMBLY",
      department: payload.departmentName || payload.department || "ASSEMBLY",
      subDepartmentId: payload.subDepartmentId ?? 101,
      subDepartmentName:
        payload.subDepartmentName || payload.subDepartment || "Wiring Harness",
      subDepartment:
        payload.subDepartmentName || payload.subDepartment || "Wiring Harness",
      lineId: payload.lineId ?? 201,
      lineName: payload.lineName || payload.line || "Line 01",
      line: payload.lineName || payload.line || "Line 01",
      machineId: payload.machineId ?? 301,
      machineName: payload.machineName || payload.machine || "M/C 01",
      machine: payload.machineName || payload.machine || "M/C 01",
      shift: payload.shift || "A",
      grade: payload.grade || "SKILLED",
      designation: payload.designation || "OPERATOR",
      category: payload.category || "WORKER",
      gender: payload.gender || "Male",
      bloodGroup: payload.bloodGroup || "O+",
      maritalStatus: payload.maritalStatus || "Single",
      maritalState: payload.maritalStatus || "Single",
      email: payload.email || "",
      mobileNo: payload.mobileNo || payload.number || "",
      number: payload.mobileNo || payload.number || "",
      isDojo: Boolean(payload.isDojo),
      firstOfDay: payload.firstOfDay || payload.firstOfDate || "",
      firstOfDate: payload.firstOfDay || payload.firstOfDate || "",
      skillLevel: payload.skillLevel || "Level 1",
      salary: payload.salary ?? 20000,
      active: isActive,
      is_active: isActive,
      status: isActive ? "Active" : "Inactive",
      roleId: payload.roleId || 3,
      role: payload.role || "Plant Supervisor",
      roleName: payload.roleName || payload.role || "Plant Supervisor",
    };
    mockUsers.saveRaw([created, ...list]);
    return toResponse(created, 201);
  },

  updateUser: (userId, payload = {}) => {
    const list = mockUsers.listRaw();
    const index = list.findIndex((u) => String(u.id) === String(userId));
    if (index === -1) return toError(`User #${userId} not found`, 404);

    const existing = list[index];
    const isActive =
      payload.active !== undefined ? Boolean(payload.active) : existing.active;
    const updated = {
      ...existing,
      ...payload,
      id: existing.id,
      empName: payload.empName ?? existing.empName,
      departmentName:
        payload.departmentName ?? payload.department ?? existing.departmentName,
      department:
        payload.departmentName ?? payload.department ?? existing.department,
      subDepartmentName:
        payload.subDepartmentName ??
        payload.subDepartment ??
        existing.subDepartmentName,
      subDepartment:
        payload.subDepartmentName ??
        payload.subDepartment ??
        existing.subDepartment,
      lineName: payload.lineName ?? payload.line ?? existing.lineName,
      line: payload.lineName ?? payload.line ?? existing.line,
      machineName: payload.machineName ?? payload.machine ?? existing.machineName,
      machine: payload.machineName ?? payload.machine ?? existing.machine,
      dateOfJoining:
        payload.dateOfJoining ?? payload.joiningDate ?? existing.dateOfJoining,
      joiningDate:
        payload.dateOfJoining ?? payload.joiningDate ?? existing.joiningDate,
      mobileNo: payload.mobileNo ?? payload.number ?? existing.mobileNo,
      number: payload.mobileNo ?? payload.number ?? existing.number,
      firstOfDay:
        payload.firstOfDay ?? payload.firstOfDate ?? existing.firstOfDay,
      firstOfDate:
        payload.firstOfDay ?? payload.firstOfDate ?? existing.firstOfDate,
      active: isActive,
      is_active: isActive,
      status: isActive ? "Active" : "Inactive",
    };
    list[index] = updated;
    mockUsers.saveRaw(list);
    return toResponse(updated);
  },

  deleteUser: (userId) => {
    const list = mockUsers.listRaw();
    const index = list.findIndex((u) => String(u.id) === String(userId));
    if (index !== -1) {
      list[index] = {
        ...list[index],
        active: false,
        is_active: false,
        status: "Inactive",
      };
      mockUsers.saveRaw(list);
    }
    return toResponse({ message: "User deactivated successfully." });
  },

  uploadExcel: async (formData) => {
    try {
      const file = formData?.get?.("file");
      if (!file || typeof file.arrayBuffer !== "function") {
        return toResponse({ inserted: 0, updated: 0 });
      }
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: "" });

      const list = mockUsers.listRaw();
      let inserted = 0;
      let updated = 0;

      rows.forEach((row) => {
        const payCode = String(
          row["Pay Code"] || row.payCode || row.PAYCODE || ""
        ).trim();
        const empName = String(
          row["Emp Name"] ||
            row["Employee Name"] ||
            row.empName ||
            row.Name ||
            ""
        ).trim();
        if (!empName && !payCode) return;

        const existingIdx = payCode
          ? list.findIndex((u) => String(u.payCode) === payCode)
          : -1;

        if (existingIdx !== -1) {
          list[existingIdx] = {
            ...list[existingIdx],
            empName: empName || list[existingIdx].empName,
            departmentName:
              row.Department ||
              row["Department Name"] ||
              list[existingIdx].departmentName,
            department:
              row.Department ||
              row["Department Name"] ||
              list[existingIdx].department,
          };
          updated += 1;
        } else {
          const id = nextNumericId(list);
          list.push({
            id,
            sno: list.length + 1,
            payCode: payCode || String(10000 + id),
            cardNo: row["Card No"] || row.cardNo || `000${10000 + id}`,
            empName: empName || `Employee #${id}`,
            fatherName: row["Father Name"] || row.fatherName || "",
            dob: row.DOB || row.dob || "",
            dateOfJoining: row["Joining Date"] || row.joiningDate || "",
            joiningDate: row["Joining Date"] || row.joiningDate || "",
            leavingDate: row["Leaving Date"] || row.leavingDate || "",
            companyName:
              row["Company Name"] || row.companyName || "NTF INDIA PVT LTD",
            plantId: 1,
            plant: "1",
            plantLocation:
              row["Plant Location"] || row.plantLocation || "Unit-V Manesar",
            departmentName: row.Department || row.department || "ASSEMBLY",
            department: row.Department || row.department || "ASSEMBLY",
            subDepartmentName:
              row.SubDepartment || row.subDepartment || "Wiring Harness",
            subDepartment:
              row.SubDepartment || row.subDepartment || "Wiring Harness",
            lineName: row.Line || row.line || "Line 01",
            line: row.Line || row.line || "Line 01",
            machineName: row.Machine || row.machine || "M/C 01",
            machine: row.Machine || row.machine || "M/C 01",
            shift: row.Shift || row.shift || "A",
            grade: row.Grade || row.grade || "SKILLED",
            designation: row.Designation || row.designation || "OPERATOR",
            category: row.Category || row.category || "WORKER",
            gender: row.Gender || row.gender || "Male",
            bloodGroup: row["Blood Group"] || row.bloodGroup || "O+",
            maritalStatus: row["Marital Status"] || row.maritalStatus || "Single",
            email: row.Email || row.email || "",
            mobileNo: row.Number || row.number || "",
            number: row.Number || row.number || "",
            isDojo:
              String(row.isDojo || "No").toLowerCase() === "yes" ||
              row.isDojo === true,
            skillLevel: row.skillLevel || "Level 1",
            salary: Number(row.Salary || row.salary) || 20000,
            active: true,
            is_active: true,
            status: "Active",
            roleId: 3,
            role: "Plant Supervisor",
            roleName: "Plant Supervisor",
          });
          inserted += 1;
        }
      });

      mockUsers.saveRaw(list);
      return toResponse({ inserted, updated });
    } catch (err) {
      return toError(err?.message || "Failed to process Excel file", 400);
    }
  },

  assignUserRole: (userId, payload = {}) => {
    const users = mockUsers.listRaw();
    const roles = mockRoles.listRolesRaw();
    const idx = users.findIndex((u) => String(u.id) === String(userId));
    if (idx === -1) return toError(`User #${userId} not found`, 404);

    const roleObj = roles.find(
      (r) =>
        String(r.id) === String(payload.roleId) ||
        String(r.name).toLowerCase() === String(payload.roleId).toLowerCase()
    );
    const roleId = roleObj ? roleObj.id : Number(payload.roleId) || 1;
    const roleName = roleObj ? roleObj.name : String(payload.roleId);

    users[idx] = {
      ...users[idx],
      roleId,
      role_id: roleId,
      role: roleName,
      roleName,
    };
    mockUsers.saveRaw(users);
    return toResponse({
      message: `Role "${roleName}" assigned to ${users[idx].empName} successfully!`,
      user: users[idx],
    });
  },

  getUserPermissions: (userId) => {
    const user = mockUsers
      .listRaw()
      .find((u) => String(u.id) === String(userId));
    const roleId = user?.roleId || 1;
    const permsMap = mockRoles.listRolePermsRaw();
    const rolePerms = permsMap[String(roleId)] || permsMap["1"] || [];
    const pages = mockPages.listRaw();

    const formatted = pages.map((page) => {
      const matched = rolePerms.find(
        (p) =>
          String(p.pageId) === String(page.id) ||
          (p.pageKey && p.pageKey === page.pageKey && p.module === page.module)
      );
      const hasAccess = matched ? Boolean(matched.hasAccess) : false;
      const prefix =
        page.module === "DASHBOARD"
          ? "/dashboard"
          : page.module === "CMS"
            ? "/cms"
            : "/lms";
      return {
        pageId: page.id,
        title: page.name,
        name: page.name,
        pageKey: page.pageKey,
        module: page.module,
        route: `${prefix}/${page.pageKey}`,
        permissions: {
          View: hasAccess && Boolean(matched?.canView),
          "Upload Excel": hasAccess && Boolean(matched?.canUploadExcel),
          Create: hasAccess && Boolean(matched?.canCreate),
          Edit: hasAccess && Boolean(matched?.canEdit),
          Delete: hasAccess && Boolean(matched?.canDelete),
        },
      };
    });

    return toResponse({
      userId,
      roleId,
      roleName: user?.roleName || user?.role || "Plant Supervisor",
      permissions: formatted,
    });
  },

  getMyPermissions: () => toResponse(authSeed.myPermissions),
};

/* ============================================================================
   PAGES & ROLES OPERATIONS
============================================================================ */
export const mockPages = {
  listRaw: () => readStore(STORAGE_KEYS.pages, pagesSeed),
  saveRaw: (list) => writeStore(STORAGE_KEYS.pages, list),

  getPages: (params = {}) => {
    let list = mockPages.listRaw();
    if (params?.module) {
      list = list.filter(
        (p) =>
          String(p.module).toUpperCase() ===
          String(params.module).toUpperCase()
      );
    }
    return toResponse(list);
  },

  getAssignedPages: (roleId) => {
    const permsMap = mockRoles.listRolePermsRaw();
    const list = permsMap[String(roleId)] || [];
    return toResponse(list);
  },

  createPage: (payload = {}) => {
    const list = mockPages.listRaw();
    const id = nextNumericId(list);
    const created = {
      id,
      module: String(payload.module || "LMS").toUpperCase(),
      name: String(payload.name || "Untitled Page").trim(),
      pageKey: String(payload.pageKey || `page-${id}`).trim(),
      isActive: payload.isActive !== false,
    };
    mockPages.saveRaw([...list, created]);
    return toResponse(created, 201);
  },

  updatePage: (pageId, payload = {}) => {
    const list = mockPages.listRaw();
    const idx = list.findIndex((p) => String(p.id) === String(pageId));
    if (idx === -1) return toError(`Page #${pageId} not found`, 404);
    const updated = {
      ...list[idx],
      ...payload,
      id: list[idx].id,
    };
    list[idx] = updated;
    mockPages.saveRaw(list);
    return toResponse(updated);
  },

  deletePage: (pageId) => {
    const list = mockPages
      .listRaw()
      .filter((p) => String(p.id) !== String(pageId));
    mockPages.saveRaw(list);
    return toResponse({ message: "Page deleted successfully" });
  },
};

export const mockRoles = {
  listRolesRaw: () => readStore(STORAGE_KEYS.roles, rolesSeed.roles),
  saveRolesRaw: (list) => writeStore(STORAGE_KEYS.roles, list),

  listRolePermsRaw: () =>
    readStore(STORAGE_KEYS.rolePermissions, rolesSeed.rolePermissions),
  saveRolePermsRaw: (map) => writeStore(STORAGE_KEYS.rolePermissions, map),

  getRoles: () => {
    const roles = mockRoles.listRolesRaw();
    const users = mockUsers.listRaw();
    const withCounts = roles.map((role) => {
      const count = users.filter(
        (u) =>
          String(u.roleId) === String(role.id) ||
          String(u.roleName || u.role || "").toLowerCase() ===
            String(role.name).toLowerCase()
      ).length;
      return {
        ...role,
        users: count || role.users || 0,
        userCount: count || role.userCount || 0,
      };
    });
    return toResponse(withCounts);
  },

  getRole: (roleId) => {
    const role = mockRoles
      .listRolesRaw()
      .find((r) => String(r.id) === String(roleId));
    if (!role) return toError(`Role #${roleId} not found`, 404);
    return toResponse(role);
  },

  createRole: (payload = {}) => {
    const list = mockRoles.listRolesRaw();
    const id = nextNumericId(list);
    const isActive =
      payload.isActive !== undefined ? Boolean(payload.isActive) : true;
    const created = {
      id,
      name: String(payload.name || "New Role").trim(),
      type: payload.type || "Custom",
      description:
        payload.description ||
        `${payload.name || "Role"} profile privileges and access control`,
      isActive,
      status: isActive,
      users: 0,
      userCount: 0,
    };
    mockRoles.saveRolesRaw([...list, created]);
    return toResponse(created, 201);
  },

  deleteRole: (roleId) => {
    const list = mockRoles
      .listRolesRaw()
      .filter((r) => String(r.id) !== String(roleId));
    mockRoles.saveRolesRaw(list);
    const permsMap = mockRoles.listRolePermsRaw();
    delete permsMap[String(roleId)];
    mockRoles.saveRolePermsRaw(permsMap);
    return toResponse({ message: "Role deleted successfully" });
  },

  getRolePermissions: (roleId) => {
    const permsMap = mockRoles.listRolePermsRaw();
    return toResponse(permsMap[String(roleId)] || []);
  },

  getRolePages: (roleId) => mockRoles.getRolePermissions(roleId),

  updateRolePermissions: (roleId, permissionsPayload = []) => {
    const permsMap = mockRoles.listRolePermsRaw();
    permsMap[String(roleId)] = Array.isArray(permissionsPayload)
      ? permissionsPayload
      : [];
    mockRoles.saveRolePermsRaw(permsMap);
    return toResponse(permsMap[String(roleId)]);
  },

  updateRolePagePermission: (roleId, pageId, payload = {}) => {
    const permsMap = mockRoles.listRolePermsRaw();
    const current = Array.isArray(permsMap[String(roleId)])
      ? [...permsMap[String(roleId)]]
      : [];
    const idx = current.findIndex(
      (item) =>
        String(item.pageId) === String(pageId) ||
        String(item.pageKey) === String(payload.pageKey || pageId)
    );
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...payload };
    } else {
      current.push({ pageId, ...payload });
    }
    permsMap[String(roleId)] = current;
    mockRoles.saveRolePermsRaw(permsMap);
    return toResponse(payload);
  },

  deleteRolePagePermission: (roleId, pageId) => {
    const permsMap = mockRoles.listRolePermsRaw();
    const current = Array.isArray(permsMap[String(roleId)])
      ? permsMap[String(roleId)]
      : [];
    permsMap[String(roleId)] = current.filter(
      (item) =>
        String(item.pageId) !== String(pageId) &&
        String(item.pageKey) !== String(pageId)
    );
    mockRoles.saveRolePermsRaw(permsMap);
    return toResponse({ message: "Permission revoked" });
  },
};

/* ============================================================================
   DASHBOARD OPERATIONS
============================================================================ */
export const mockDashboard = {
  getOverview: () => clone(dashboardSeed),

  getAttendanceConfig: () => ({
    preColumns: clone(dashboardSeed.attendance.preColumns),
    dateColumns: clone(dashboardSeed.attendance.dateColumns),
    postColumns: clone(dashboardSeed.attendance.postColumns),
  }),

  getAttendanceRows: () =>
    readStore(STORAGE_KEYS.attendance, dashboardSeed.attendance.rows),

  saveAttendanceRows: (rows) => writeStore(STORAGE_KEYS.attendance, rows),

  getRequirements: () =>
    readStore(STORAGE_KEYS.requirements, dashboardSeed.requirements),

  saveRequirements: (rows) => writeStore(STORAGE_KEYS.requirements, rows),

  addRequirement: (payload = {}) => {
    const list = mockDashboard.getRequirements();
    const id = nextNumericId(list);
    const monthVal = {
      pp: Number(payload.pp) || 0,
      sp: Number(payload.sp) || 0,
      fn01: Number(payload.fn01) || 0,
      fn02: Number(payload.fn02) || 0,
    };
    const created = {
      id,
      code: payload.department || payload.code || `D0${id}`,
      plant: payload.plant || "Unit-V Manesar",
      department: payload.department || "ASSEMBLY",
      sectionName: payload.subDepartment || payload.sectionName || "General",
      lineDescription: payload.line || payload.lineDescription || "Line 01",
      machine: payload.machine || "M/C 01",
      shift: payload.shift || "A",
      approval: payload.approval || "Pending",
      jan: { ...monthVal },
      feb: { ...monthVal },
      mar: { ...monthVal },
      apr: { ...monthVal },
      may: { ...monthVal },
      jun: { ...monthVal },
      jul: { ...monthVal },
      aug: { ...monthVal },
      sep: { ...monthVal },
      oct: { ...monthVal },
      nov: { ...monthVal },
      dec: { ...monthVal },
    };
    const next = [...list, created];
    mockDashboard.saveRequirements(next);
    return created;
  },

  updateRequirement: (id, payload = {}) => {
    const list = mockDashboard.getRequirements();
    const idx = list.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) return null;
    const monthVal =
      payload.pp !== undefined ||
      payload.sp !== undefined ||
      payload.fn01 !== undefined ||
      payload.fn02 !== undefined
        ? {
            pp: Number(payload.pp) || 0,
            sp: Number(payload.sp) || 0,
            fn01: Number(payload.fn01) || 0,
            fn02: Number(payload.fn02) || 0,
          }
        : null;

    const updated = {
      ...list[idx],
      ...payload,
      code: payload.department || payload.code || list[idx].code,
      sectionName:
        payload.subDepartment || payload.sectionName || list[idx].sectionName,
      lineDescription:
        payload.line || payload.lineDescription || list[idx].lineDescription,
    };
    if (monthVal) {
      ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"].forEach(
        (m) => {
          updated[m] = { ...monthVal };
        }
      );
    }
    list[idx] = updated;
    mockDashboard.saveRequirements(list);
    return updated;
  },
};

/* ============================================================================
   LMS DATA OPERATIONS
============================================================================ */
export const mockLms = {
  getOverviewKpis: () => clone(lmsSeed.overviewKpis),
  getSeedTestPapers: () => clone(lmsSeed.testPapers),
};

/* ============================================================================
   CMS DATA OPERATIONS
============================================================================ */
export const mockCms = {
  getCategories: () => clone(cmsSeed.categories),
  getContents: () => readStore(STORAGE_KEYS.cmsContents, cmsSeed.contents),
  saveContents: (list) => writeStore(STORAGE_KEYS.cmsContents, list),

  createContent: (payload = {}) => {
    const list = mockCms.getContents();
    const id = nextNumericId(list);
    const created = {
      id,
      code: payload.code || `CMS-DOC-0${id}`,
      title: String(payload.title || "Untitled Document").trim(),
      category: payload.category || "SOP / Work Instruction",
      section: payload.section || "documents",
      plant: payload.plant || "Unit-V Manesar",
      department: payload.department || "ASSEMBLY",
      subDepartment: payload.subDepartment || "Wiring Harness",
      line: payload.line || "Line 01",
      machine: payload.machine || "M/C 01",
      author: payload.author || "Rajesh Kumar",
      version: payload.version || "Rev 01",
      status: payload.status || "Published",
      updatedAt: new Date().toISOString().slice(0, 10),
      summary: payload.summary || "",
      attachmentName: payload.attachmentName || "",
    };
    const next = [created, ...list];
    mockCms.saveContents(next);
    return created;
  },

  updateContent: (id, payload = {}) => {
    const list = mockCms.getContents();
    const idx = list.findIndex((item) => String(item.id) === String(id));
    if (idx === -1) return null;
    const updated = {
      ...list[idx],
      ...payload,
      id: list[idx].id,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    list[idx] = updated;
    mockCms.saveContents(list);
    return updated;
  },

  deleteContent: (id) => {
    const list = mockCms
      .getContents()
      .filter((item) => String(item.id) !== String(id));
    mockCms.saveContents(list);
    return true;
  },
};
