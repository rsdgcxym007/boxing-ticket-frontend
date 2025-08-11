/**
 * Device Information Utility
 * Collects device and browser information for authentication
 */

export interface DeviceInfo {
  deviceName: string;
  ipAddress: string;
  userAgent?: string;
  platform?: string;
  browser?: string;
  os?: string;
}

/**
 * Detects the device name based on user agent
 */
export function getDeviceName(): string {
  if (typeof navigator === "undefined") return "Unknown Device";

  const userAgent = navigator.userAgent;

  // Mobile devices
  if (/iPhone/i.test(userAgent)) {
    const match = userAgent.match(/iPhone OS (\d+)_(\d+)/);
    const version = match ? `iOS ${match[1]}.${match[2]}` : "iOS";
    return `iPhone (${version})`;
  }

  if (/iPad/i.test(userAgent)) {
    return "iPad";
  }

  if (/Android/i.test(userAgent)) {
    const match = userAgent.match(/Android (\d+(?:\.\d+)?)/);
    const version = match ? `Android ${match[1]}` : "Android";

    // Try to detect specific Android devices
    if (/Samsung/i.test(userAgent)) return `Samsung Device (${version})`;
    if (/Huawei/i.test(userAgent)) return `Huawei Device (${version})`;
    if (/Xiaomi/i.test(userAgent)) return `Xiaomi Device (${version})`;
    if (/OnePlus/i.test(userAgent)) return `OnePlus Device (${version})`;

    return `Android Device (${version})`;
  }

  // Desktop platforms
  if (/Mac OS X/i.test(userAgent)) {
    const match = userAgent.match(/Mac OS X (\d+)_(\d+)/);
    const version = match ? `macOS ${match[1]}.${match[2]}` : "macOS";
    return `Mac (${version})`;
  }

  if (/Windows NT/i.test(userAgent)) {
    const match = userAgent.match(/Windows NT (\d+\.\d+)/);
    let version = "Windows";
    if (match) {
      const winVersion = match[1];
      if (winVersion === "10.0") version = "Windows 10/11";
      else if (winVersion === "6.3") version = "Windows 8.1";
      else if (winVersion === "6.2") version = "Windows 8";
      else if (winVersion === "6.1") version = "Windows 7";
      else version = `Windows ${winVersion}`;
    }
    return version;
  }

  if (/Linux/i.test(userAgent)) {
    return "Linux";
  }

  return "Unknown Device";
}

/**
 * Detects the browser name and version
 */
export function getBrowserInfo(): string {
  if (typeof navigator === "undefined") return "Unknown Browser";

  const userAgent = navigator.userAgent;

  // Chrome
  if (/Chrome/i.test(userAgent) && !/Edge|Edg/i.test(userAgent)) {
    const match = userAgent.match(/Chrome\/(\d+)/);
    const version = match ? match[1] : "";
    return `Chrome ${version}`;
  }

  // Edge
  if (/Edge|Edg/i.test(userAgent)) {
    const match = userAgent.match(/(?:Edge|Edg)\/(\d+)/);
    const version = match ? match[1] : "";
    return `Edge ${version}`;
  }

  // Firefox
  if (/Firefox/i.test(userAgent)) {
    const match = userAgent.match(/Firefox\/(\d+)/);
    const version = match ? match[1] : "";
    return `Firefox ${version}`;
  }

  // Safari
  if (/Safari/i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) {
    const match = userAgent.match(/Version\/(\d+)/);
    const version = match ? match[1] : "";
    return `Safari ${version}`;
  }

  return "Unknown Browser";
}

/**
 * Gets the client's IP address (simplified version)
 * Note: This will return a placeholder as real IP detection requires server-side support
 */
export async function getClientIP(): Promise<string> {
  try {
    // In a real-world scenario, you might use a service like ipify.org
    // For now, we'll return a placeholder or try to get it from the server

    // Try to get IP from a free service (optional)
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip || "127.0.0.1";
  } catch (error) {
    console.warn("Failed to get client IP:", error);
    return "127.0.0.1"; // Fallback IP
  }
}

/**
 * Collects comprehensive device information
 */
export async function collectDeviceInfo(): Promise<DeviceInfo> {
  const deviceName = getDeviceName();
  const browser = getBrowserInfo();
  const ipAddress = await getClientIP();

  const deviceInfo: DeviceInfo = {
    deviceName: `${deviceName} - ${browser}`,
    ipAddress,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    platform: typeof navigator !== "undefined" ? navigator.platform : undefined,
    browser,
    os: getDeviceName(),
  };

  return deviceInfo;
}

/**
 * Creates a simplified device identifier for display purposes
 */
export function createDeviceIdentifier(): string {
  const deviceName = getDeviceName();
  const browser = getBrowserInfo();
  const timestamp = new Date().toLocaleString();

  return `${deviceName} - ${browser} (${timestamp})`;
}
