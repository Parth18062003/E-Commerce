export const formatCurrency = (amount: number | string): string => {
    // If the amount is a string, parse it to a number
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  
    // Ensure the parsed value is a valid number before formatting
    if (isNaN(numericAmount)) {
      return "Invalid amount"; // Or you can return an error message or default value
    }
  
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(numericAmount);
  };
  