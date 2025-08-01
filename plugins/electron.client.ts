import { useRouter } from "vue-router";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const router = useRouter();
    // Initialize Electron features when available
    if (window.electronAPI) {
      console.log("🚀 Electron integration loaded");

      // Setup global keyboard shortcuts
      document.addEventListener("keydown", (e) => {
        const { ctrlKey, metaKey, key, shiftKey } = e;
        const modifier = process.platform === "darwin" ? metaKey : ctrlKey;

        if (modifier && !shiftKey) {
          switch (key) {
            case "1":
              e.preventDefault();
              router.push("/admin/dashboard");
              break;
            case "2":
              e.preventDefault();
              router.push("/admin/orders");
              break;
            case "3":
              e.preventDefault();
              router.push("/admin/staff");
              break;
            case "4":
              e.preventDefault();
              router.push("/admin/audit");
              break;
            case "5":
              e.preventDefault();
              router.push("/admin/referrer");
              break;
            case "r":
              if (!shiftKey) {
                e.preventDefault();
                router.push("/ringside");
              }
              break;
            case "s":
              e.preventDefault();
              router.push("/StandingTicketForm");
              break;
            case "p":
              e.preventDefault();
              window.print();
              break;
          }
        }

        // Ctrl+Shift+R for force reload
        if (modifier && shiftKey && key === "R") {
          e.preventDefault();
          window.location.reload();
        }

        // F5 for reload
        if (key === "F5") {
          e.preventDefault();
          window.location.reload();
        }

        // F11 for fullscreen toggle (handled by Electron)
        if (key === "F11") {
          e.preventDefault();
          // Electron will handle this
        }
      });

      // Prevent default drag and drop
      document.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      document.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
      });

      // Handle window focus/blur for optimizations
      window.addEventListener("focus", () => {
        document.body.classList.add("window-focused");
      });

      window.addEventListener("blur", () => {
        document.body.classList.remove("window-focused");
      });
    } else {
      console.log("🌐 Running in web browser mode");
    }

    // Add platform-specific body classes
    const platform = window.nodeAPI?.platform || "web";
    document.body.classList.add(`platform-${platform}`);

    // Add electron class if running in Electron
    if (window.electronAPI) {
      document.body.classList.add("electron-app");
    }
  }
});
