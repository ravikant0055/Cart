import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductId } from "../../types";

type CartState = {
  quantities: Partial<Record<ProductId, number>>;
};

const initialState: CartState = {
  quantities: {},
};

const clampQty = (qty: number) => (Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addOne(state, action: PayloadAction<ProductId>) {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] ?? 0) + 1;
    },
    removeOne(state, action: PayloadAction<ProductId>) {
      const id = action.payload;
      const next = (state.quantities[id] ?? 0) - 1;
      if (next <= 0) {
        delete state.quantities[id];
      } else {
        state.quantities[id] = next;
      }
    },
    setQuantity(state, action: PayloadAction<{ productId: ProductId; quantity: number }>) {
      const { productId, quantity } = action.payload;
      const next = clampQty(quantity);
      if (next <= 0) {
        delete state.quantities[productId];
      } else {
        state.quantities[productId] = next;
      }
    },
    clearCart(state) {
      state.quantities = {};
    },
  },
});

export const { addOne, removeOne, setQuantity, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

