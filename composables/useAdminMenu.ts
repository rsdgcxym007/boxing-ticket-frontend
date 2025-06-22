export const useAdminMenu = () => {
  return [
    {
      icon: "mdi:view-dashboard",
      label: "แดชบอร์ด",
      to: "/admin/dashboard",
    },
    {
      icon: "mdi:clipboard-text",
      label: "รายการออเดอร์",
      to: "/admin/orders",
    },
    // {
    //   icon: "mdi:cog-outline",
    //   label: "การตั้งค่า",
    //   to: "/admin/settings",
    // },
  ];
};
