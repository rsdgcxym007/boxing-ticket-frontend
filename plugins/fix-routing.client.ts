// Client-side routing fix
if (process.client) {
  window.addEventListener("DOMContentLoaded", () => {
    // Fix any incorrect Thai locale paths
    const currentPath = window.location.pathname;

    // If we somehow end up with /th/... redirect to the correct path
    if (currentPath.startsWith("/th/")) {
      const cleanPath = currentPath.replace(/^\/th/, "") || "/";
      window.history.replaceState({}, "", cleanPath);
      window.location.reload();
    }
  });
}
