import { InventoryItem } from '../../core/models/inventory.model';
import { MOCK_PRODUCTS } from './products.mock';

export const MOCK_INVENTORY: InventoryItem[] = MOCK_PRODUCTS.flatMap((product, index) => {
  // Generate 1 or 2 inventory locations per product (totaling ~40 items)
  const items: InventoryItem[] = [
    {
      id: `inv-${index + 1}a`,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      productId: product.id,
      productName: product.name,
      productImage: product.featuredImage,
      sku: product.sku,
      locationId: `loc-${(index % 8) + 1}a`,
      locationName: `Main Warehouse - Sector ${(index % 4) + 1}`,
      availableQuantity: product.stockQuantity,
      reservedQuantity: Math.floor(product.stockQuantity * 0.15),
      damagedQuantity: index % 5 === 0 ? 2 : 0,
      reorderLevel: product.reorderLevel,
      status:
        product.stockQuantity === 0
          ? 'OUT_OF_STOCK'
          : product.stockQuantity <= product.reorderLevel
          ? 'LOW_STOCK'
          : 'IN_STOCK',
      lastRestockedAt: `2024-02-${(index % 25) + 1 < 10 ? '0' : ''}${(index % 25) + 1}`,
      updatedAt: `2024-03-0${(index % 8) + 1}`,
    },
  ];

  if (index < 10) {
    items.push({
      id: `inv-${index + 1}b`,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      productId: product.id,
      productName: product.name,
      productImage: product.featuredImage,
      sku: `${product.sku}-EXT`,
      locationId: `loc-${(index % 8) + 1}b`,
      locationName: `Secondary Fulfillment Center B`,
      availableQuantity: Math.floor(product.stockQuantity * 0.5),
      reservedQuantity: 3,
      damagedQuantity: 0,
      reorderLevel: Math.floor(product.reorderLevel * 0.5),
      status: 'IN_STOCK',
      lastRestockedAt: '2024-02-18',
      updatedAt: '2024-03-02',
    });
  }

  return items;
});
