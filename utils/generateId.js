// Utility function to generate unique IDs
let idCounter = 0;

export function generateId(prefix = "id") {
  idCounter++;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

// Alternative with random string
export function generateRandomId(prefix = "id", length = 8) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${result}`;
}
