export const formatCurrency = (value: any): string => {
  if (value == null || value === "") return "฿0";

  const cleaned = String(value).replace(/[^\d.-]/g, "");

  const num = Number(cleaned);

  if (isNaN(num)) return "0";

  return `${num.toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};
