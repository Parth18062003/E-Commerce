import { InventoryItem } from "../Inventory/types";

function escapeCSV(value: string): string {
  // Escape quotes and commas in the value
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    value = `"${value.replace(/"/g, '""')}"`;  // Escape quotes with double quotes
  }
  return value;
}

export function exportToCSV(items: InventoryItem[], filename: string) {
  const headers = [
    "SKU",
    "Product ID",
    "Color",
    "Size",
    "Stock Quantity",
    "Reserved Stock",
    "Available Stock",
    "Last Updated"
  ];

  // Map each inventory item to a row, escaping each value
  const rows: string[] = [];

  items.forEach(item => {
    // Loop through the variant's sizeStock to create rows for each size
    item.variant.sizeStock.forEach(size => {
      const row = [
        escapeCSV(item.variantSku),                        // SKU
        escapeCSV(item.productId),                          // Product ID
        escapeCSV(item.variant.color),                      // Color
        escapeCSV(size.size),                               // Size
        escapeCSV(size.stockQuantity.toString()),           // Stock Quantity
        escapeCSV(item.reservedStock?.toString() || '0'),   // Reserved Stock (fallback to 0)
        escapeCSV(item.availableStock?.toString() || '0'),  // Available Stock (fallback to 0)
        escapeCSV(new Date(item.updatedAt).toLocaleString())// Last Updated
      ];
      rows.push(row.join(","));
    });
  });

  // Prepare the CSV content
  const csvContent = [
    headers.map(escapeCSV).join(","), // Escaping headers (just in case)
    ...rows
  ].join("\n");

  // Create a Blob from the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  // For modern browsers
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();

  // Clean up the link element and revoke the URL
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
