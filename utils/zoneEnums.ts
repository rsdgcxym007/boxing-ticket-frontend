export const ZONE_NAMES = {
  "61c2dea0-beb5-4a8d-b26d-6ca45ad3f194": "back-left",
  "35cb87bd-9e7f-4c8a-8ce5-f233a981a97d": "back-right",
  "f79cebc6-81aa-49b4-8e45-b81197760ded": "left",
  "d5b3d095-c93a-4ce4-a601-482e9475f954": "right",
  "ddb14cab-e1eb-42b6-b284-077081b48585": "front-ringside",
} as const;

export const ZONE_LABELS = {
  "back-left": "โซนด้านหลังซ้าย",
  "back-right": "โซนด้านหลังขวา",
  left: "โซนด้านซ้าย",
  right: "โซนด้านขวา",
  "front-ringside": "เวทีด้านหน้า (Ringside)",
} as const;

export const ZONE_IDS_BY_NAME = {
  "back-left": "61c2dea0-beb5-4a8d-b26d-6ca45ad3f194",
  "back-right": "35cb87bd-9e7f-4c8a-8ce5-f233a981a97d",
  left: "f79cebc6-81aa-49b4-8e45-b81197760ded",
  right: "d5b3d095-c93a-4ce4-a601-482e9475f954",
  "front-ringside": "ddb14cab-e1eb-42b6-b284-077081b48585",
} as const;
