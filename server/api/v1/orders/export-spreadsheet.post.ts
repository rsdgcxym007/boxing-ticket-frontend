export default defineEventHandler(async (event) => {
  try {
    // Only allow POST method
    if (event.node.req.method !== "POST") {
      throw createError({
        statusCode: 405,
        statusMessage: "Method Not Allowed",
      });
    }

    // Parse request body
    const body = await readBody(event);

    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: "Request body is required",
      });
    }

    const { orderIds, format, exportId, options } = body;

    // Validate format
    if (!format || !["csv", "excel"].includes(format)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid format. Must be csv or excel",
      });
    }

    // Mock processing - In real implementation, you would:
    // 1. Query database for orders
    // 2. Generate CSV/Excel file
    // 3. Store file temporarily or stream it
    // 4. Return download URL or file stream

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock CSV content
    const csvContent = `Order ID,Customer Name,Phone,Email,Ticket Type,Zone,Seat,Price,Payment Method,Status,Created At
ORD001,สมชาย ใจดี,0812345678,somchai@email.com,Standard,A,A001,2500,credit_card,completed,2024-08-10 10:00:00
ORD002,สมหญิง รักงาม,0823456789,somying@email.com,VIP,B,B001,5000,bank_transfer,completed,2024-08-10 11:00:00
ORD003,นายพล ชัยชนะ,0834567890,pol@email.com,Standard,A,A002,2500,cash,pending,2024-08-10 12:00:00`;

    // For CSV format, return file content as blob
    if (format === "csv") {
      // Add BOM for UTF-8 to ensure proper encoding in Excel
      const bom = "\uFEFF";
      const csvWithBom = bom + csvContent;

      setHeader(event, "Content-Type", "text/csv; charset=utf-8");
      setHeader(
        event,
        "Content-Disposition",
        `attachment; filename="orders_export_${Date.now()}.csv"`
      );

      return csvWithBom;
    }

    // For Excel format, you would need a library like xlsx
    // For now, return CSV with different headers
    if (format === "excel") {
      setHeader(
        event,
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      setHeader(
        event,
        "Content-Disposition",
        `attachment; filename="orders_export_${Date.now()}.xlsx"`
      );

      // In real implementation, use xlsx library to generate Excel file
      // For demo, return CSV content with Excel headers
      return csvContent;
    }

    // If using WebSocket progress tracking, return JSON response
    if (exportId) {
      // In real implementation, you would:
      // 1. Store file in temporary location
      // 2. Send progress updates via WebSocket
      // 3. Return download URL

      return {
        success: true,
        message: "Export completed successfully",
        exportId,
        downloadUrl: `/api/v1/orders/download/${exportId}`,
        filename: `orders_export_${Date.now()}.${
          format === "excel" ? "xlsx" : "csv"
        }`,
        recordCount: orderIds?.length || 0,
      };
    }

    // Default response for legacy calls
    return {
      success: true,
      message: "Export completed successfully",
      recordCount: orderIds?.length || 0,
    };
  } catch (error: any) {
    console.error("Export error:", error);

    if (error.statusCode) {
      throw error;
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error during export: " + error.message,
    });
  }
});
