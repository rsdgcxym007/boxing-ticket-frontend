import { useApi } from "../composables/useApi";

export async function submitOrder(orderData, slipFile = null) {
  const { upload } = useApi();

  const formData = new FormData();
  formData.append("zone", orderData.zone);
  formData.append("seats", orderData.selectedSeats.join(","));
  formData.append("total", String(orderData.total));
  formData.append("method", orderData.method);

  if (slipFile) {
    formData.append("slip", slipFile);
  }

  try {
    const res = await upload("/orders", formData);

    if (res?.id) {
      return res;
    } else {
      throw new Error("Server did not return a valid order object");
    }
  } catch (error) {
    console.error("❌ Error in submitOrder:", error);
    throw error;
  }
}
