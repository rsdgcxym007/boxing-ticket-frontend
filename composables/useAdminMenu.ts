export const useAdminMenu = () => {
  return [
    {
      icon: "mdi-view-dashboard",
      label: "แดชบอร์ด",
      to: "/admin/dashboard",
    },
    {
      icon: "mdi-clipboard-text",
      label: "รายการออเดอร์",
      to: "/admin/orders",
    },
    {
      icon: "mdi-account-cog-outline",
      label: "จัดการผู้แนะนำ",
      to: "/admin/referrer/",
    },
    {
      icon: "mdi-account-group",
      label: "จัดการพนักงาน",
      to: "/admin/staff",
    },
    // {
    //   icon: "mdi-account-group",
    //   label: "ระบบตรวจสอบ",
    //   to: "/admin/audit",
    // },
  ];
};
