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
  "back-left": "57495b71-04fc-4a5a-bcc2-9c8eb63a42ba",
  "back-right": "f1a77a2c-f117-45e3-b21e-6dac1489d93a",
  left: "d2e183a4-9310-4a16-9fb3-3ca19c60d336",
  right: "eda3f7e3-92ad-415a-81e2-a59871be0710",
  "front-ringside": "641cabe9-6da1-4a74-8d33-35a12e81b28d",
} as const;
