export const useAdminMenu = () => {
  return [
    // Dashboard & Core Management
    {
      icon: "mdi-view-dashboard",
      label: "แดชบอร์ด",
      to: "/admin/dashboard",
      role: ["admin", "staff"],
    },
    {
      icon: "mdi-clipboard-text",
      label: "รายการออเดอร์",
      to: "/admin/orders",
      role: ["admin", "staff"],
    },

    // User Management
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

    // Ticket Management
    {
      icon: "mdi-ticket-percent",
      label: "จัดการราคาตั๋ว",
      to: "/admin/pricing",
      role: ["admin"],
    },
    {
      icon: "mdi-stadium",
      label: "จัดการโซนนั่ง",
      to: "/admin/zones",
      role: ["admin"],
    },

    // Analytics & Reports
    {
      icon: "mdi-chart-line",
      label: "รายงานยอดขาย",
      to: "/admin/analytics",
      role: ["admin", "staff"],
    },
    {
      icon: "mdi-file-export",
      label: "ส่งออกรายงาน",
      to: "/admin/reports",
      role: ["admin"],
    },

    // System Management
    {
      icon: "mdi-cog",
      label: "ตั้งค่าระบบ",
      to: "/admin/settings",
      role: ["admin"],
    },
    {
      icon: "mdi-shield-check",
      label: "ระบบตรวจสอบ",
      to: "/admin/audit",
      role: ["admin"],
    },
    {
      icon: "mdi-database",
      label: "สำรองข้อมูล",
      to: "/admin/backup",
      role: ["admin"],
    },

    // Tools & Testing
    {
      icon: "mdi-wrench",
      label: "เครื่องมือช่วย",
      to: "/admin/tools",
      role: ["admin"],
    },
    {
      icon: "mdi-qrcode-scan",
      label: "🔍 QR Scanner",
      to: "/mobile/scanner",
      role: ["admin", "staff"],
    },
    {
      icon: "mdi-test-tube",
      label: "ทดสอบระบบ",
      to: "/admin/testing",
      role: ["admin"],
    },
  ];
};
