import type { Product } from "../types";

export const PRODUCTS: readonly Product[] = [
  { id: "bread", name: "Bread", price: 1.1 },
  { id: "milk", name: "Milk", price: 0.5 },
  { id: "cheese", name: "Cheese", price: 0.9 },
  { id: "soup", name: "Soup", price: 0.6 },
  { id: "butter", name: "Butter", price: 1.2 },
] as const;

export const PRODUCT_BY_ID: ReadonlyMap<Product["id"], Product> = new Map(
  PRODUCTS.map((p) => [p.id, p]),
);
