// composables/useBaseComponents.ts
// Common utilities for base components
export const useBaseComponents = () => {
  return {
    // Button utilities
    // Button utilities

    getButtonVariant: (type: string) => {
      switch (type) {
        case "submit":
          return "primary";
        case "cancel":
          return "secondary";
        case "delete":
          return "danger";
        case "save":
          return "success";
        default:
          return "primary";
      }
    },

    // Alert utilities
    showAlert: (
      type: "info" | "success" | "warning" | "error",
      message: string,
      title?: string
    ) => {
      // You can integrate with your toast system here
      console.log(`${type.toUpperCase()}: ${title || ""} ${message}`);
    },

    // Modal utilities
    createModal: (component: any, props?: any) => {
      // Modal creation helper
      return {
        component,
        props: props || {},
        isOpen: false,
      };
    },
  };
};
