export const ZONE_NAMES = {
  "cdf12f66-e147-4df3-a295-586d93917ffc": "back-left",
  "4cd004ed-625d-4ffc-a636-215f38d5d4ae": "back-right",
  "7638ac7a-4f94-4330-9bb3-f233a1a62a09": "left",
  "9c72f498-7b27-48ae-a7f4-86ec55b2c5c8": "right",
  "88fd3f40-69df-4869-be08-c729cebdc10c": "front-ringside",
} as const;

export const ZONE_LABELS = {
  "back-left": "โซนด้านหลังซ้าย",
  "back-right": "โซนด้านหลังขวา",
  left: "โซนด้านซ้าย",
  right: "โซนด้านขวา",
  "front-ringside": "เวทีด้านหน้า (Ringside)",
} as const;

export const ZONE_IDS_BY_NAME = {
  "back-left": "cdf12f66-e147-4df3-a295-586d93917ffc",
  "back-right": "4cd004ed-625d-4ffc-a636-215f38d5d4ae",
  left: "7638ac7a-4f94-4330-9bb3-f233a1a62a09",
  right: "9c72f498-7b27-48ae-a7f4-86ec55b2c5c8",
  "front-ringside": "88fd3f40-69df-4869-be08-c729cebdc10c",
} as const;
