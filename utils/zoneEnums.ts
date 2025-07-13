export const ZONE_NAMES = {
  "79d13d9a-5702-4443-b584-5b2dbd52c856": "back-left",
  "1307175c-2b70-4c6c-8d45-1d0c16b33e6c": "back-right",
  "0cb3e92c-e46c-4ae2-b107-817f1ad06394": "left",
  "be4d651e-a83e-4858-959c-1638fe6f7854": "right",
  "e461e040-532a-4af9-b61e-9dbf9ae9fa8b": "front-ringside",
} as const;

export const ZONE_LABELS = {
  "back-left": "โซนด้านหลังซ้าย",
  "back-right": "โซนด้านหลังขวา",
  left: "โซนด้านซ้าย",
  right: "โซนด้านขวา",
  "front-ringside": "เวทีด้านหน้า (Ringside)",
} as const;

export const ZONE_IDS_BY_NAME = {
  "back-left": "79d13d9a-5702-4443-b584-5b2dbd52c856",
  "back-right": "1307175c-2b70-4c6c-8d45-1d0c16b33e6c",
  left: "0cb3e92c-e46c-4ae2-b107-817f1ad06394",
  right: "be4d651e-a83e-4858-959c-1638fe6f7854",
  "front-ringside": "e461e040-532a-4af9-b61e-9dbf9ae9fa8b",
} as const;
