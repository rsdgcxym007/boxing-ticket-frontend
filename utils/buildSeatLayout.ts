type Seat = {
  id: string;
  seatNumber: string;
  status: string;
  rowIndex: number;
  columnIndex: number;
  zoneId: string;
  orderId?: string | null;
  isLockedUntil?: string | null;
};

type SeatLayout = (Seat | null)[][];

export function buildSeatLayoutFromCoordinates(seats: Seat[]): SeatLayout {
  // หาขนาดสูงสุดของ layout
  const maxRow = Math.max(...seats.map((s) => s.rowIndex));
  const maxCol = Math.max(...seats.map((s) => s.columnIndex));

  // เตรียม layout ว่าง
  const layout: SeatLayout = Array.from({ length: maxRow + 1 }, () =>
    Array.from({ length: maxCol + 1 }, () => null)
  );

  // วางเก้าอี้ลงในตำแหน่งจริง
  for (const seat of seats) {
    layout[seat.rowIndex][seat.columnIndex] = seat;
  }

  return layout;
}
