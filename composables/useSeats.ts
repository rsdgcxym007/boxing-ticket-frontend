import { ref, computed } from "vue";

const seatMap = [
  { id: "R1", zone: "RINGSIDE FRONT", number: 1, price: 1000 },
  { id: "R2", zone: "RINGSIDE FRONT", number: 2, price: 1000 },
  { id: "RT1", zone: "REGULAR TOP", number: 1, price: 500 },
  { id: "RL1", zone: "REGULAR LEFT", number: 1, price: 500 },
  { id: "RR1", zone: "REGULAR RIGHT", number: 1, price: 500 },
  { id: "B1", zone: "CENTER BACK", number: 1, price: 400 },
  // เพิ่มตามต้องการ...
];

const bookedIds = ["R1", "RL1"]; // mock ที่จองไว้

export function useSeats() {
  const seats = ref(
    seatMap.map((seat) => ({
      ...seat,
      status: bookedIds.includes(seat.id) ? "booked" : "available",
    }))
  );

  const selectedSeats = computed(() =>
    seats.value.filter((s) => s.status === "selected")
  );

  const maxSelectable = 6;

  const totalPrice = computed(() =>
    selectedSeats.value.reduce((sum, s) => sum + s.price, 0)
  );

  function toggleSeat(seat) {
    if (seat.status === "booked") return;
    const index = seats.value.findIndex((s) => s.id === seat.id);
    if (seats.value[index].status === "available") {
      if (selectedSeats.value.length < maxSelectable)
        seats.value[index].status = "selected";
    } else if (seats.value[index].status === "selected") {
      seats.value[index].status = "available";
    }
  }

  return {
    seats,
    toggleSeat,
    selectedSeats,
    totalPrice,
    maxSelectable,
  };
}
