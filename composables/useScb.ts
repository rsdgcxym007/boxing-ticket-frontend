import { useFetch, useRuntimeConfig } from "nuxt/app";

type ScbQrResponse = {
  message: string;
  data: {
    qrImage?: string;
    qrRawData?: string;
  };
};

export const useScb = () => {
  const config = useRuntimeConfig();

  const requestQR = async (
    amount: number,
    ref1: string,
    ref2: string
  ): Promise<ScbQrResponse["data"]> => {
    const { data, error } = await useFetch<ScbQrResponse>(
      `${config.public.apiBase}/api/scb/payment-request`,
      {
        method: "POST",
        body: { amount, ref1, ref2 },
      }
    );

    if (error.value) throw new Error("❌ Failed to get QR");

    return data.value?.data as any;
  };

  return { requestQR };
};
