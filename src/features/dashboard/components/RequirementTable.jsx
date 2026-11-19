import { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RequirementPopup from "./RequirementPopup";
import DashboardApi from "../services/DashboardApi";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const approvalStyles = {
  "System Approved": {
    badge: "bg-green-100 text-green-700 ring-green-600/20",
    dot: "bg-green-500",
  },
  Pending: {
    badge: "bg-amber-100 text-amber-700 ring-amber-600/20",
    dot: "bg-amber-500",
  },
  Rejected: {
    badge: "bg-red-100 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
  },
};

const RequirementTable = ({ filters = {} }) => {
  const [requirements, setRequirements] = useState(() =>
    DashboardApi.getRequirements()
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search] = useState("");
  const [open, setOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSaveRequirement = (formPayload) => {
    if (editingRow) {
      DashboardApi.updateRequirement(editingRow.id, formPayload);
    } else {
      DashboardApi.addRequirement(formPayload);
    }
    setRequirements(DashboardApi.getRequirements());
    setEditingRow(null);
    setOpen(false);
  };

  const filteredData = requirements.filter((row) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      String(row.code || "").toLowerCase().includes(q) ||
      String(row.sectionName || "").toLowerCase().includes(q) ||
      String(row.lineDescription || "").toLowerCase().includes(q);

    const matchesPlant =
      !filters.plant ||
      !row.plant ||
      String(row.plant).toLowerCase() === String(filters.plant).toLowerCase();
    const matchesDept =
      !filters.department ||
      String(row.department || row.code || "").toLowerCase() ===
        String(filters.department).toLowerCase();
    const matchesSubDept =
      !filters.subDepartment ||
      String(row.sectionName || "").toLowerCase() ===
        String(filters.subDepartment).toLowerCase();
    const matchesLine =
      !filters.line ||
      String(row.lineDescription || "").toLowerCase() ===
        String(filters.line).toLowerCase();
    const matchesShift =
      !filters.shift ||
      !row.shift ||
      String(row.shift).toLowerCase() === String(filters.shift).toLowerCase();

    return (
      matchesSearch &&
      matchesPlant &&
      matchesDept &&
      matchesSubDept &&
      matchesLine &&
      matchesShift
    );
  });

  const displayedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const from = filteredData.length === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(filteredData.length, (page + 1) * rowsPerPage);

  return (
    <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-[#e2edf2] bg-white/85 backdrop-blur-md shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#e2edf2] px-5 py-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f7f5] border border-[#0d9488]/20 text-[#0d9488] shadow-xs">
            <AssignmentOutlinedIcon
              sx={{
                color: "#0d9488",
                fontSize: 20,
              }}
            />
          </div>

          <div>
            <h2 className="text-base font-bold leading-tight text-[#0f172a]">
              Requirement Records
            </h2>

            <p className="text-xs text-[#64748b]">
              View and manage manpower requirements
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingRow(null);
            setOpen(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#0d9488] to-[#14b8a6] px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-[#0d9488]/25 transition-all duration-200 hover:from-[#0f766e] hover:to-[#0d9488] active:scale-[0.99]"
        >
          <AddCircleOutlineOutlinedIcon
            sx={{
              fontSize: 16,
            }}
          />
          Add Requirement
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1900px] border-collapse">
          <thead>
            <tr className="bg-gray-100/80">
              <th
                rowSpan={2}
                className="sticky left-0 z-20 w-[170px] border-b border-r border-gray-200 bg-gray-100 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-600"
              >
                Department Name
              </th>

              <th
                rowSpan={2}
                className="sticky left-[170px] z-20 w-[200px] border-b border-r border-gray-200 bg-gray-100 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-600"
              >
                Sub-Department Name
              </th>

              <th
                rowSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-600"
              >
                Line Description
              </th>

              <th
                rowSpan={2}
                className="border-b border-r border-gray-200 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-600"
              >
                Machines
              </th>

              {months.map((month) => (
                <th
                  key={month}
                  rowSpan={2}
                  className="border-b border-r border-[#0d9488]/30 px-4 py-2.5 text-center text-xs font-bold text-white bg-[#0f766e]"
                >
                  {month}
                </th>
              ))}

              <th
                rowSpan={2}
                className="border-b border-gray-200 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wider text-gray-600"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedData.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-gray-50">
                <td className="sticky left-0 z-10 w-[170px] border-b border-r border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700">
                  {row.code}
                </td>

                <td className="sticky left-[170px] z-10 w-[200px] border-b border-r border-gray-100 bg-white px-4 py-3 text-sm text-gray-700">
                  {row.sectionName}
                </td>

                <td className="border-b border-r border-gray-100 px-4 py-3 text-sm text-gray-700">
                  {row.lineDescription}
                </td>

                <td className="border-b border-r border-gray-100 px-4 py-3 text-center text-sm text-gray-700">
                  {row.approval && (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${
                        approvalStyles[row.approval]?.badge ||
                        approvalStyles.Pending.badge
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          approvalStyles[row.approval]?.dot ||
                          approvalStyles.Pending.dot
                        }`}
                      />
                      {row.approval}
                    </span>
                  )}
                </td>

                {months.map((month) => {
                  const monthKey = month.toLowerCase();
                  const data = row[monthKey] || {
                    pp: 0,
                    sp: 0,
                    fn01: 0,
                    fn02: 0,
                  };
                  const total = Object.values(data).reduce(
                    (sum, value) => sum + Number(value || 0),
                    0,
                  );

                  return (
                    <td
                      key={month}
                      className="border-b border-r border-gray-100 px-4 py-3 text-center text-xs tabular-nums text-gray-700"
                    >
                      {total}
                    </td>
                  );
                })}

                <td className="border-b border-gray-100 px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() => {
                        setEditingRow(row);
                        setOpen(true);
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#6B7280] transition hover:bg-gray-100 hover:text-primary"
                    >
                      <EditOutlinedIcon
                        sx={{
                          color: "#F59E0B",
                          fontSize: 18,
                        }}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex min-h-[48px] items-center justify-between gap-2 border-t border-[#e2edf2] px-4">
          <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
            <span>Rows per page</span>

            <select
              value={rowsPerPage}
              onChange={handleChangeRowsPerPage}
              className="cursor-pointer rounded-lg border border-[#e2edf2] bg-white py-1 pl-2 pr-6 text-[11px] text-[#0f172a] outline-none focus:border-[#0d9488]"
            >
              {[10, 25, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#6B7280]">
              {from}-{to} of {filteredData.length}
            </span>

            <button
              type="button"
              onClick={() => handleChangePage(null, page - 1)}
              disabled={page === 0}
              className="flex h-8 w-8 items-center justify-center rounded text-[#6B7280] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: 20 }} />
            </button>

            <button
              type="button"
              onClick={() => handleChangePage(null, page + 1)}
              disabled={page >= totalPages - 1}
              className="flex h-8 w-8 items-center justify-center rounded text-[#6B7280] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <KeyboardArrowRightIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>
      </div>

      <RequirementPopup
        key={editingRow ? `edit-${editingRow.id}` : "add-new"}
        open={open}
        initialData={editingRow}
        onClose={() => {
          setOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSaveRequirement}
      />
    </div>
  );
};

export default RequirementTable;
