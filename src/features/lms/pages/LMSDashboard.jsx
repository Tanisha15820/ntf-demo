import { useState } from "react";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SignalCellularAltRoundedIcon from "@mui/icons-material/SignalCellularAltRounded";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import KPICards from "../../../components/KPICards";
import Filters from "../../../components/Filters";
import { lmsMenus } from "../data/LMSMenu";
import { mockLms } from "../../../data/mockStore";

const ICON_MAP = {
  "total-operators": <PeopleAltOutlinedIcon sx={{ fontSize: 24 }} />,
  "total-sections": <PersonOutlinedIcon sx={{ fontSize: 24 }} />,
  "total-courses": <GroupsOutlinedIcon sx={{ fontSize: 24 }} />,
  "dojo-hiring": <SignalCellularAltRoundedIcon sx={{ fontSize: 24 }} />,
};

const LMSDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Overview");

  const kpiData = mockLms.getOverviewKpis().map((kpi) => ({
    ...kpi,
    icon: ICON_MAP[kpi.id] || <PeopleAltOutlinedIcon sx={{ fontSize: 24 }} />,
  }));

  return (
    <div className="flex h-screen bg-[#F7F7F5] overflow-hidden">
      <Sidebar
        menuItems={lmsMenus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Navbar setMobileOpen={setMobileOpen} activeMenu={activeMenu} />
        </div>

        <main className="flex-1 overflow-y-auto px-6 pt-5 pb-8 space-y-6">
          <KPICards data={kpiData} />
          <Filters />
        </main>
      </div>
    </div>
  );
};

export default LMSDashboard;
