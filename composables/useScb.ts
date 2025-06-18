import { useFetch, useRuntimeConfig } from "nuxt/app";

type ScbQrData = {
  qrImage?: string;
  qrRawData?: string;
};

type ScbQrResponse = {
  message: string;
  data: ScbQrData;
};

export const useScb = () => {
  const config = useRuntimeConfig();
  const apiUrl = `${config.public.apiBase}/api/scb/payment-request`;

  const requestQR = async (
    amount: number,
    ref1: string,
    ref2: string
  ): Promise<ScbQrData> => {
    const { data, error } = await useFetch<ScbQrResponse>(apiUrl, {
      method: "POST",
      body: { amount, ref1, ref2 },
    });

    if (error.value || !data.value?.data) {
      throw new Error("❌ Failed to generate SCB QR Code");
    }

    return data.value.data;
  };

  return { requestQR };
};
