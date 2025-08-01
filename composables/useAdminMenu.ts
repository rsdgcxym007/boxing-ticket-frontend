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
      role: ["admin", "staff"],
    },
    {
      icon: "mdi-account-cog-outline",
      label: "จัดการผู้แนะนำ",
      to: "/admin/referrer/",
      role: ["admin"],
    },
    {
      icon: "mdi-account-group",
      label: "จัดการพนักงาน",
      to: "/admin/staff",
      role: ["admin"],
    },
    {
      icon: "mdi-update",
      label: "ทดสอบอัพเดท",
      to: "/update-test",
      role: ["admin"],
    },
    // {
    //   icon: "mdi-account-group",
    //   label: "ระบบตรวจสอบ",
    //   to: "/admin/audit",
    // },
  ];
};
