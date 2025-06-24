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
  const groupedByRow: Record<number, Seat[]> = {};

  for (const seat of seats) {
    if (!groupedByRow[seat.rowIndex]) {
      groupedByRow[seat.rowIndex] = [];
    }
    groupedByRow[seat.rowIndex].push(seat);
  }

  const layout: SeatLayout = [];

  const allRows = Object.keys(groupedByRow)
    .map((k) => parseInt(k))
    .sort((a, b) => a - b);

  for (const rowIndex of allRows) {
    const rowSeats = groupedByRow[rowIndex];

    const maxCol = Math.max(...rowSeats.map((s) => s.columnIndex));

    const rowArray: (Seat | null)[] = Array.from(
      { length: maxCol + 1 },
      () => null
    );

    for (const seat of rowSeats) {
      rowArray[seat.columnIndex] = seat;
    }

    layout.push(rowArray);
  }

  return layout;
}
