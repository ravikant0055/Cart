import { describe, expect, it } from "vitest";
import { store } from "../../store";
import { addOne, clearCart, setQuantity } from "./cartSlice";
import { selectOfferSavings, selectSubtotal, selectTotal, selectTotalSavings } from "./selectors";

describe("cart selectors (offers + totals)", () => {
  it("returns zeros for empty cart", () => {
    store.dispatch(clearCart());
    const state = store.getState();
    expect(selectSubtotal(state)).toBe(0);
    expect(selectTotalSavings(state)).toBe(0);
    expect(selectTotal(state)).toBe(0);
    expect(selectOfferSavings(state)).toEqual([]);
  });

  it("applies Cheese 2-for-1 (buy one get one free)", () => {
    store.dispatch(clearCart());
    store.dispatch(setQuantity({ productId: "cheese", quantity: 3 }));

    const state = store.getState();
    expect(selectSubtotal(state)).toBe(2.7); // 0.90 * 3
    expect(selectTotalSavings(state)).toBe(0.9); // 1 free cheese
    expect(selectTotal(state)).toBe(1.8);

    expect(selectOfferSavings(state)).toEqual([
      { id: "offer-cheese-bogo", title: "Cheese 2 for 1", saving: 0.9 },
    ]);
  });

  it("applies Soup + half-price Bread, limited by bread quantity", () => {
    store.dispatch(clearCart());
    store.dispatch(setQuantity({ productId: "soup", quantity: 2 }));
    store.dispatch(setQuantity({ productId: "bread", quantity: 1 }));

    const state = store.getState();
    expect(selectSubtotal(state)).toBe(2.3); // (0.60*2)+(1.10*1)
    expect(selectTotalSavings(state)).toBe(0.55); // half price bread once
    expect(selectTotal(state)).toBe(1.75);
  });

  it("applies Butter 1/3 off per butter", () => {
    store.dispatch(clearCart());
    store.dispatch(setQuantity({ productId: "butter", quantity: 2 }));

    const state = store.getState();
    expect(selectSubtotal(state)).toBe(2.4);
    expect(selectTotalSavings(state)).toBe(0.8); // 1.20/3 * 2 = 0.80
    expect(selectTotal(state)).toBe(1.6);
  });

  it("combines multiple offers", () => {
    store.dispatch(clearCart());
    store.dispatch(setQuantity({ productId: "soup", quantity: 1 }));
    store.dispatch(setQuantity({ productId: "bread", quantity: 2 }));
    store.dispatch(setQuantity({ productId: "cheese", quantity: 2 }));
    store.dispatch(addOne("butter"));

    const state = store.getState();
    // subtotal = soup(0.6) + bread(2.2) + cheese(1.8) + butter(1.2) = 5.8
    expect(selectSubtotal(state)).toBe(5.8);

    // savings = bread half once(0.55) + cheese bogo once(0.9) + butter third(0.4) = 1.85
    expect(selectTotalSavings(state)).toBe(1.85);
    expect(selectTotal(state)).toBe(3.95);
  });
});

