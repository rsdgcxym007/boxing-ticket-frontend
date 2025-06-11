export const seatZones = [
  {
    zone: "RINGSIDE",
    color: "bg-red-500",
    seats: ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8"],
  },
  {
    zone: "REGULAR_LEFT",
    color: "bg-blue-400",
    seats: Array.from({ length: 30 }, (_, i) => "L" + (i + 1)),
  },
  {
    zone: "REGULAR_RIGHT",
    color: "bg-blue-400",
    seats: Array.from({ length: 30 }, (_, i) => "R" + (i + 1)),
  },
  {
    zone: "CENTER_FRONT",
    color: "bg-yellow-400",
    seats: Array.from({ length: 40 }, (_, i) => "C" + (i + 1)),
  },
];
