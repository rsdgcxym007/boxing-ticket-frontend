const fs = require("fs");
const path = require("path");

module.exports = async function (context) {
  console.log("Running beforePack script...");

  const { appDir, electronVersion, platform, arch } = context;

  try {
    // Ensure dist directory exists
    const distPath = path.join(appDir, "dist");
    if (!fs.existsSync(distPath)) {
      console.error(
        "Dist directory not found. Please run npm run build first."
      );
      process.exit(1);
    }

    // Copy electron files
    const electronSrcDir = path.join(appDir, "electron");
    const electronDestDir = path.join(appDir, "dist", "electron");

    if (!fs.existsSync(electronDestDir)) {
      fs.mkdirSync(electronDestDir, { recursive: true });
    }

    // Copy main.js
    fs.copyFileSync(
      path.join(electronSrcDir, "main.js"),
      path.join(electronDestDir, "main.js")
    );

    // Copy preload.js
    fs.copyFileSync(
      path.join(electronSrcDir, "preload.js"),
      path.join(electronDestDir, "preload.js")
    );

    // Copy splash.html
    fs.copyFileSync(
      path.join(electronSrcDir, "splash.html"),
      path.join(electronDestDir, "splash.html")
    );

    console.log("✅ Electron files copied successfully");

    // Update package.json main field for Electron build
    const packageJsonPath = path.join(appDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    packageJson.main = "electron/main.js";
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log("✅ Package.json updated for Electron build");
  } catch (error) {
    console.error("❌ Error in beforePack script:", error);
    throw error;
  }
};
