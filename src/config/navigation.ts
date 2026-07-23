import MenuIcon1 from "@/assets/menuIcon1.svg";
import MenuIcon2 from "@/assets/sidebar_icons/HomeIcon.svg";
import MenuIcon3 from "@/assets/sidebar_icons/NotePadIcon.svg";
import MenuIcon4 from "@/assets/sidebar_icons/CommunicationIcon.svg";
import MenuIcon5 from "@/assets/sidebar_icons/RecieptIcon.svg";
import MenuIcon6 from "@/assets/sidebar_icons/NotificationIcon.svg";
import MenuIcon7 from "@/assets/sidebar_icons/truck.svg";
import StackIcon from "@/assets/sidebar_icons/StackIcon.svg"

export type SubNavItem = {
  label: string;
  path: string;
};

export type NavItem = {
  title: string;
  color: string;
  icon: string;
  path?: string;
  items?: SubNavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    color: "bg-[#FD8D5B]",
    icon: MenuIcon1,
    path: "/dashboard",
  },
  {
    title: "My Projects",
    color: "bg-[#A855F7]",
    icon: MenuIcon2,
    items: [],
    path: "/my_projects",
  },
  {
    title: "",
    color: "bg-[#3AB449]",
    icon: MenuIcon3,
    items: [
      { label: "Drawings", path: "/drawings" },
      // { label: "Documents", path: "/documents" },
    ],
  },
  {
    title: "Communication",
    color: "bg-[#DCC426]",
    icon: MenuIcon4,
    items: [],
    path: "/communication",
  },
  {
    title: "",
    color: "bg-[#000000]",
    icon: MenuIcon5,
    items: [
      { label: "Payments", path: "/payments" },
      { label: "Invoices", path: "/invoices" },
      { label: "Tax Report", path: "/tax_reports" },
    ],
  },
  {
    title: "Notifications",
    color: "bg-[#A855F7]",
    icon: MenuIcon6,
    path: "/notification",
  },
  {
    title: "Delivery Shedule",
    color: "bg-[#2B7FFF]",
    icon: MenuIcon7,
    path: "/delivery-schedule",
  },
  {
    title: "Material Orders",
    color: "bg-[#CE222B]",
    icon: StackIcon,
    items: [
      {
        label: "Material Orders", path: "/material-orders"
      },
      { label: "Order Quotations", path: "/order-quotations" },
    ]
  }
];
