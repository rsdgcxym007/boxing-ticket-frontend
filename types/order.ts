export interface Seat {
  id: string;
  seatNumber: string;
}

export interface Referrer {
  name: string;
  code: string;
}

export interface PaymentUser {
  name: string;
}

export interface Payment {
  method: string;
  amount: string;
  paidAt: string;
  user: PaymentUser;
}

export interface User {
  name: string;
  role: string;
}

export interface Order {
  id: string;
  total: number;
  status: string;
  method: string;
  createdAt: string;
  showDate: string;
  customerName: string;
  standingAdultQty: number;
  standingChildQty: number;
  standingTotal: number;
  standingCommission: number;
  referrerCommission: number;
  user: User;
  referrer: Referrer;
  seats: Seat[];
  payment: Payment | null;
  seatBookings: Seat[];
}
