const fs = require("fs");
const path = require("path");

module.exports = async function (context) {
  console.log("Running afterSign script...");

  const { appOutDir, packager } = context;

  try {
    // Log successful signing
    console.log("✅ App signed successfully");
    console.log("📦 Output directory:", appOutDir);

    // Optionally, you can add notarization here for macOS
    if (process.platform === "darwin") {
      console.log("💡 For macOS distribution, consider adding notarization");
    }
  } catch (error) {
    console.error("❌ Error in afterSign script:", error);
    throw error;
  }
};
