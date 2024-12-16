export interface InventoryItem {
  productId: string;
  variant: {
    color: string;
    sizeStock: {
      size: string;
      stockQuantity: number;
    }[];
  };
  size: string;
  variantSku: string;
  stockQuantity: number;
  reservedStock: number;
  availableStock: number;
  updatedAt: string;
}

export interface InventorySummary {
  totalProducts: number;
  lowStockItems: number;
  reservedItems: number;
  availableItems: number;
}

export interface SortConfig {
  key: keyof InventoryItem | 'variant.color' | 'updatedAt' | 'sizeStock.size'; // Add nested properties here
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  sku?: string;           
  productId?: string;     
  color?: string;         
  size?: string;
  minStock?: number;      
  maxStock?: number;      
  reserved?: boolean;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalPages: number;
}