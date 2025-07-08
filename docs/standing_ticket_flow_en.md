# Standing Ticket Purchase Flow (English)

## Overview
The standing ticket purchase flow allows users to select and book standing tickets for boxing events. The process ensures real-time seat availability updates and provides a seamless booking experience.

## Steps

1. **Open the Modal**
   - The user opens the standing ticket modal.
   - The modal displays available zones and dates for selection.

2. **Select Zone and Date**
   - The user selects a zone and a date.
   - The system fetches available seats for the selected zone and date.

3. **Choose Seats**
   - The user clicks on available seats to select them.
   - Selected seats are highlighted, and their status is updated in real-time.

4. **Confirm Selection**
   - The user reviews the selected seats and total price.
   - The user clicks "Confirm" to proceed.

5. **Create Order**
   - The system creates an order with the selected seats.
   - The order status is set to "PENDING".

6. **Payment**
   - The user completes the payment process.
   - The order status is updated to "PAID".

7. **Finalize Booking**
   - The user receives a confirmation of the booking.
   - The selected seats are locked and marked as booked.

## API Endpoints

1. **Fetch Available Seats**
   - Endpoint: `/api/seats`
   - Method: `GET`
   - Description: Retrieves available seats for the selected zone and date.

2. **Create Order**
   - Endpoint: `/api/orders`
   - Method: `POST`
   - Description: Creates an order with the selected seats.

3. **Confirm Payment**
   - Endpoint: `/api/payments`
   - Method: `POST`
   - Description: Processes payment for the created order.

4. **Cancel Selection**
   - Endpoint: `/api/seats/cancel`
   - Method: `POST`
   - Description: Cancels the selected seats and releases them.

## Notes
- Real-time updates ensure that seat availability is accurate.
- Users can cancel their selection before confirming the booking.
- Locked seats are released if the user does not complete the booking within a specified time.
