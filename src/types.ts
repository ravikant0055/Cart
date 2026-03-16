export type ProductId = "bread" | "milk" | "cheese" | "soup" | "butter";

export type Money = number;

export interface Product {
  id: ProductId;
  name: string;
  price: Money;
}

export interface CartLine {
  productId: ProductId;
  quantity: number;
}

export interface OfferSavingLine {
  /** Stable id for rendering */
  id: string;
  title: string;
  saving: Money;
}
