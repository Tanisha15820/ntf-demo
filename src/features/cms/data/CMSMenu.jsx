import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import FolderCopyOutlinedIcon from "@mui/icons-material/FolderCopyOutlined";

export const cmsMenus = [
  {
    name: "Content Overview",
    icon: <DashboardOutlinedIcon />,
    path: "/cms",
  },
  {
    name: "SOP & Documents",
    icon: <DescriptionOutlinedIcon />,
    path: "/cms/documents",
  },
  {
    name: "Announcements",
    icon: <CampaignOutlinedIcon />,
    path: "/cms/announcements",
  },
  {
    name: "Media & Templates",
    icon: <FolderCopyOutlinedIcon />,
    path: "/cms/templates",
  },
];
