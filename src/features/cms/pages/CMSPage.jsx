import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import {
  FileText,
  CirclePlus,
  Pencil,
  Trash2,
  Search,
  Eye,
  X,
  Tag,
  Building2,
  Factory,
  Calendar,
  User,
} from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import KPICards from "../../../components/KPICards";
import Filters from "../../../components/Filters";
import { cmsMenus } from "../data/CMSMenu";
import CmsApi from "../services/CmsApi";
import {
  mockPlants,
  mockDepartments,
  mockSubDepartments,
  mockLines,
  mockMachines,
} from "../../../data/mockStore";

const STATUS_OPTIONS = ["Published", "Under Review", "Draft", "Archived"];

const statusBadgeClass = (status) => {
  switch (status) {
    case "Published":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Under Review":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Draft":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
};

const resolveSectionFromPath = (pathname = "") => {
  const clean = pathname.replace(/\/+$/, "");
  if (clean.endsWith("/documents")) return "documents";
  if (clean.endsWith("/announcements")) return "announcements";
  if (clean.endsWith("/templates")) return "templates";
  return "overview";
};

const resolveMenuName = (section) => {
  if (section === "documents") return "SOP & Documents";
  if (section === "announcements") return "Announcements";
  if (section === "templates") return "Media & Templates";
  return "Content Overview";
};

const CMSPage = () => {
  const location = useLocation();
  const activeSection = resolveSectionFromPath(location.pathname);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(() =>
    resolveMenuName(activeSection)
  );

  const [contents, setContents] = useState(() => CmsApi.getContents());
  const categories = useMemo(() => CmsApi.getCategories(), []);
  const plants = useMemo(() => mockPlants.listRaw(), []);
  const departments = useMemo(() => mockDepartments.listRaw(), []);
  const subDepartments = useMemo(() => mockSubDepartments.listRaw(), []);
  const lines = useMemo(() => mockLines.listRaw(), []);
  const machines = useMemo(() => mockMachines.listRaw(), []);

  const [filterValues, setFilterValues] = useState({});
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState("");

  const [form, setForm] = useState({
    code: "",
    title: "",
    category: categories[0] || "SOP / Work Instruction",
    section: "documents",
    plant: plants[0]?.name || "Unit-V Manesar",
    department: departments[0]?.name || "ASSEMBLY",
    subDepartment: subDepartments[0]?.name || "Wiring Harness",
    line: lines[0]?.name || "Line 01",
    machine: machines[0]?.name || "M/C 01",
    author: "Rajesh Kumar",
    version: "Rev 01",
    status: "Published",
    summary: "",
    attachmentName: "",
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const sectionItems = useMemo(() => {
    if (activeSection === "overview") return contents;
    return contents.filter((item) => item.section === activeSection);
  }, [contents, activeSection]);

  const filteredContents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sectionItems.filter((item) => {
      const matchesSearch =
        !q ||
        String(item.title || "").toLowerCase().includes(q) ||
        String(item.code || "").toLowerCase().includes(q) ||
        String(item.summary || "").toLowerCase().includes(q) ||
        String(item.author || "").toLowerCase().includes(q) ||
        String(item.department || "").toLowerCase().includes(q);

      const matchesCat =
        !categoryFilter || item.category === categoryFilter;
      const matchesStatus =
        !statusFilter || item.status === statusFilter;
      const matchesPlant =
        !filterValues.plant ||
        String(item.plant || "").toLowerCase() ===
          String(filterValues.plant).toLowerCase();
      const matchesDept =
        !filterValues.department ||
        String(item.department || "").toLowerCase() ===
          String(filterValues.department).toLowerCase();
      const matchesSubDept =
        !filterValues.subDepartment ||
        String(item.subDepartment || "").toLowerCase() ===
          String(filterValues.subDepartment).toLowerCase();
      const matchesLine =
        !filterValues.line ||
        String(item.line || "").toLowerCase() ===
          String(filterValues.line).toLowerCase();
      const matchesMachine =
        !filterValues.machine ||
        String(item.machine || "").toLowerCase() ===
          String(filterValues.machine).toLowerCase();

      return (
        matchesSearch &&
        matchesCat &&
        matchesStatus &&
        matchesPlant &&
        matchesDept &&
        matchesSubDept &&
        matchesLine &&
        matchesMachine
      );
    });
  }, [
    sectionItems,
    search,
    categoryFilter,
    statusFilter,
    filterValues,
  ]);

  const kpiData = useMemo(
    () => [
      {
        title: "Total Content Items",
        value: contents.length,
        color: "blue",
        icon: <DescriptionOutlinedIcon sx={{ fontSize: 24 }} />,
      },
      {
        title: "Published SOPs & WIs",
        value: contents.filter((c) => c.status === "Published").length,
        color: "green",
        icon: <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />,
      },
      {
        title: "Active Announcements",
        value: contents.filter((c) => c.section === "announcements").length,
        color: "purple",
        icon: <CampaignOutlinedIcon sx={{ fontSize: 24 }} />,
      },
      {
        title: "Pending Reviews",
        value: contents.filter(
          (c) => c.status === "Under Review" || c.status === "Draft"
        ).length,
        color: "orange",
        icon: <PendingActionsOutlinedIcon sx={{ fontSize: 24 }} />,
      },
    ],
    [contents]
  );

  const openAddModal = () => {
    const defaultSec =
      activeSection === "overview" ? "documents" : activeSection;
    const defaultCat =
      defaultSec === "announcements"
        ? "Policy & Announcement"
        : defaultSec === "templates"
          ? "Training Template"
          : "SOP / Work Instruction";

    setEditingItem(null);
    setForm({
      code: `CMS-${String(contents.length + 1).padStart(3, "0")}`,
      title: "",
      category: defaultCat,
      section: defaultSec,
      plant: plants[0]?.name || "Unit-V Manesar",
      department: departments[0]?.name || "ASSEMBLY",
      subDepartment: subDepartments[0]?.name || "Wiring Harness",
      line: lines[0]?.name || "Line 01",
      machine: machines[0]?.name || "M/C 01",
      author: "Rajesh Kumar",
      version: "Rev 01",
      status: "Published",
      summary: "",
      attachmentName: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      code: item.code || "",
      title: item.title || "",
      category: item.category || "SOP / Work Instruction",
      section: item.section || "documents",
      plant: item.plant || "Unit-V Manesar",
      department: item.department || "ASSEMBLY",
      subDepartment: item.subDepartment || "Wiring Harness",
      line: item.line || "Line 01",
      machine: item.machine || "M/C 01",
      author: item.author || "Rajesh Kumar",
      version: item.version || "Rev 01",
      status: item.status || "Published",
      summary: item.summary || "",
      attachmentName: item.attachmentName || "",
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showToast("Please enter a content title.");
      return;
    }

    if (editingItem) {
      CmsApi.updateContent(editingItem.id, form);
      showToast("Content item updated successfully.");
    } else {
      CmsApi.createContent(form);
      showToast("Content item published to CMS successfully.");
    }
    setContents(CmsApi.getContents());
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    CmsApi.deleteContent(deleteTarget.id);
    setContents(CmsApi.getContents());
    setDeleteTarget(null);
    showToast("Content item deleted.");
  };

  return (
    <div className="flex h-screen bg-[#F7F7F5] overflow-hidden">
      <Sidebar
        menuItems={cmsMenus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Navbar
            setMobileOpen={setMobileOpen}
            activeMenu={resolveMenuName(activeSection)}
          />
        </div>

        <main className="flex-1 overflow-y-auto px-6 pt-5 pb-8 space-y-6">
          <KPICards data={kpiData} />

          <Filters
            values={filterValues}
            onChange={setFilterValues}
            showDates={false}
          />

          <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-[#e2edf2] bg-white/85 backdrop-blur-md shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-[#e2edf2] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f7f5] border border-[#0d9488]/20 text-[#0d9488] shadow-xs">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#0f172a]">
                    {resolveMenuName(activeSection)}
                  </h2>
                  <p className="text-xs text-[#64748b]">
                    Manage organizational SOPs, work instructions, circulars, and templates
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0d9488] to-[#14b8a6] hover:from-[#0f766e] hover:to-[#0d9488] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#0d9488]/25 transition-all"
              >
                <CirclePlus size={16} />
                Create Content
              </button>
            </div>

            {/* Search & Category/Status Bar */}
            <div className="flex flex-col gap-3 border-b border-[#f1f5f9] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2.5 flex-1">
                <div className="relative w-full sm:w-72">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search code, title, department, author..."
                    className="h-9 w-full rounded-xl border border-[#e2edf2] bg-white pl-9 pr-3 text-xs text-[#0f172a] outline-none focus:border-[#0d9488] focus:ring-2 focus:ring-[#0d9488]/15"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-9 rounded-xl border border-[#e2edf2] bg-white px-3 text-xs text-[#0f172a] outline-none focus:border-[#0d9488]"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 rounded-xl border border-[#e2edf2] bg-white px-3 text-xs text-[#0f172a] outline-none focus:border-[#0d9488]"
                >
                  <option value="">All Statuses</option>
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-xs text-[#64748b]">
                Showing{" "}
                <span className="font-semibold text-[#0f172a]">
                  {filteredContents.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#0f172a]">
                  {sectionItems.length}
                </span>{" "}
                items
              </p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-[#e2edf2]">
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Doc Code
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Title & Summary
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Plant & Dept
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Version
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Updated
                    </th>
                    <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-[#475569]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContents.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-14 text-center text-sm text-slate-400"
                      >
                        No content items match the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredContents.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]/80 transition"
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex rounded-lg bg-[#e6f7f5] border border-[#0d9488]/20 px-2.5 py-1 text-xs font-bold text-[#0d9488]">
                            {item.code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 max-w-md">
                          <div className="text-xs font-bold text-[#0f172a]">
                            {item.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-[#64748b] line-clamp-1">
                            {item.summary}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                            <Tag size={11} className="text-[#0d9488]" />
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="text-xs font-semibold text-[#0f172a]">
                            {item.department}
                          </div>
                          <div className="text-[11px] text-[#64748b]">
                            {item.plant} • {item.line}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs font-medium text-[#475569]">
                          {item.version}
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-xs text-[#64748b]">
                          <div>{item.updatedAt}</div>
                          <div className="text-[10px] text-[#94a3b8]">
                            by {item.author}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              title="View details"
                              onClick={() => setViewItem(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2edf2] bg-white text-[#0f172a] hover:bg-[#e6f7f5] hover:text-[#0d9488] transition"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              type="button"
                              title="Edit content"
                              onClick={() => openEditModal(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2edf2] bg-white text-[#0f172a] hover:bg-[#e6f7f5] hover:text-[#0d9488] transition"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              type="button"
                              title="Delete content"
                              onClick={() => setDeleteTarget(item)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#fff0ee] text-[#e74c3c] hover:bg-[#ffe3df] transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ADD / EDIT MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl md:rounded-3xl border border-[#e2edf2] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2edf2] px-5 py-4">
              <h3 className="text-base font-bold text-[#0f172a]">
                {editingItem ? "Edit CMS Content" : "Create CMS Content"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-5 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Document Code
                  </label>
                  <input
                    value={form.code}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, code: e.target.value }))
                    }
                    placeholder="e.g. WI-ASM-005"
                    className="h-10 w-full rounded-xl border border-[#e2edf2] px-3 text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    CMS Section
                  </label>
                  <select
                    value={form.section}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, section: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    <option value="documents">SOP & Documents</option>
                    <option value="announcements">Announcements</option>
                    <option value="templates">Media & Templates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                  Content Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter document or announcement title"
                  className="h-10 w-full rounded-xl border border-[#e2edf2] px-3 text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Plant
                  </label>
                  <select
                    value={form.plant}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, plant: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    {plants.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Department
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Line
                  </label>
                  <select
                    value={form.line}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, line: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    {lines.map((l) => (
                      <option key={l.id} value={l.name}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Author
                  </label>
                  <input
                    value={form.author}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, author: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] px-3 text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Version
                  </label>
                  <input
                    value={form.version}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, version: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] px-3 text-xs outline-none focus:border-[#0d9488]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className="h-10 w-full rounded-xl border border-[#e2edf2] bg-white px-3 text-xs outline-none focus:border-[#0d9488]"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                  Summary / Description
                </label>
                <textarea
                  rows={3}
                  value={form.summary}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Describe the SOP, policy, or template guidelines..."
                  className="w-full rounded-xl border border-[#e2edf2] p-3 text-xs outline-none focus:border-[#0d9488]"
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-[#e2edf2] pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#e2edf2] bg-white px-4 py-2 text-xs font-semibold text-[#64748b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#0d9488] to-[#14b8a6] px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-[#0d9488]/25"
                >
                  {editingItem ? "Save Changes" : "Publish Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setViewItem(null);
          }}
        >
          <div className="w-full max-w-xl rounded-2xl md:rounded-3xl border border-[#e2edf2] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e2edf2] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="rounded-lg bg-[#e6f7f5] px-2.5 py-1 text-xs font-bold text-[#0d9488]">
                  {viewItem.code}
                </span>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusBadgeClass(
                    viewItem.status
                  )}`}
                >
                  {viewItem.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setViewItem(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <h3 className="text-base font-bold text-[#0f172a]">
                {viewItem.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#475569] bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2edf2]">
                {viewItem.summary || "No summary provided."}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 rounded-xl border border-[#e2edf2] p-3">
                  <Factory size={15} className="text-[#0d9488]" />
                  <div>
                    <div className="text-[10px] text-[#64748b]">Plant</div>
                    <div className="font-semibold text-[#0f172a]">
                      {viewItem.plant}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#e2edf2] p-3">
                  <Building2 size={15} className="text-[#0d9488]" />
                  <div>
                    <div className="text-[10px] text-[#64748b]">Department</div>
                    <div className="font-semibold text-[#0f172a]">
                      {viewItem.department} • {viewItem.line}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#e2edf2] p-3">
                  <User size={15} className="text-[#0d9488]" />
                  <div>
                    <div className="text-[10px] text-[#64748b]">Author</div>
                    <div className="font-semibold text-[#0f172a]">
                      {viewItem.author} ({viewItem.version})
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-[#e2edf2] p-3">
                  <Calendar size={15} className="text-[#0d9488]" />
                  <div>
                    <div className="text-[10px] text-[#64748b]">
                      Last Updated
                    </div>
                    <div className="font-semibold text-[#0f172a]">
                      {viewItem.updatedAt}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-[#e2edf2] pt-4">
                <button
                  type="button"
                  onClick={() => setViewItem(null)}
                  className="rounded-xl bg-[#0d9488] px-4 py-2 text-xs font-semibold text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDeleteTarget(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-[#e2edf2] bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-[#0f172a]">
              Confirm Delete
            </h3>
            <p className="mt-2 text-xs text-[#64748b] leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-[#0f172a]">"{deleteTarget.title}"</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-[#e2edf2] px-4 py-2 text-xs font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-[#0d9488] bg-[#0f172a] px-4 py-2.5 text-xs font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
};

export default CMSPage;
