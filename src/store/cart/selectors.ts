import { createSelector } from "@reduxjs/toolkit";
import { PRODUCT_BY_ID } from "../../data/products";
import type { RootState } from "../../store";
import type { Money, OfferSavingLine, ProductId } from "../../types";
import { roundMoney } from "../../utils/money";

const selectCartQuantities = (state: RootState) => state.cart.quantities;

export const selectCartLines = createSelector([selectCartQuantities], (quantities) => {
  const lines = (Object.entries(quantities) as Array<[ProductId, number]>)
    .filter(([, qty]) => (qty ?? 0) > 0)
    .map(([productId, quantity]) => {
      const product = PRODUCT_BY_ID.get(productId);
      if (!product) return null;
      return { product, quantity };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // stable ordering like product list
  return lines.sort((a, b) => a.product.name.localeCompare(b.product.name));
});

export const selectSubtotal = createSelector([selectCartLines], (lines) =>
  roundMoney(lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0)),
);

export const selectSavingsByProductId = createSelector([selectCartQuantities], (q) => {
  const breadPrice = PRODUCT_BY_ID.get("bread")?.price ?? 0;
  const cheesePrice = PRODUCT_BY_ID.get("cheese")?.price ?? 0;
  const butterPrice = PRODUCT_BY_ID.get("butter")?.price ?? 0;

  const breadQty = q.bread ?? 0;
  const soupQty = q.soup ?? 0;
  const cheeseQty = q.cheese ?? 0;
  const butterQty = q.butter ?? 0;

  const cheeseSaving = Math.floor(cheeseQty / 2) * cheesePrice; // buy 1 get 1 free
  const soupBreadSaving = Math.min(soupQty, breadQty) * breadPrice * 0.5; // half price bread
  const butterSaving = butterQty * (butterPrice / 3); // third off

  const savings: Partial<Record<ProductId, Money>> = {};
  if (cheeseSaving > 0) savings.cheese = roundMoney(cheeseSaving);
  if (soupBreadSaving > 0) savings.bread = roundMoney(soupBreadSaving);
  if (butterSaving > 0) savings.butter = roundMoney(butterSaving);
  return savings;
});

export const selectOfferSavings = createSelector([selectSavingsByProductId], (savingsById) => {
  const offers: OfferSavingLine[] = [];
  const cheeseSaving = savingsById.cheese ?? 0;
  const breadSaving = savingsById.bread ?? 0;
  const butterSaving = savingsById.butter ?? 0;

  if (cheeseSaving > 0) {
    offers.push({ id: "offer-cheese-bogo", title: "Cheese 2 for 1", saving: cheeseSaving });
  }
  if (breadSaving > 0) {
    offers.push({
      id: "offer-soup-bread-half",
      title: "Soup + half price Bread",
      saving: breadSaving,
    });
  }
  if (butterSaving > 0) {
    offers.push({ id: "offer-butter-third", title: "Butter 1/3 off", saving: butterSaving });
  }
  return offers;
});

export const selectTotalSavings = createSelector([selectOfferSavings], (offers) =>
  roundMoney(offers.reduce((sum, o) => sum + o.saving, 0)),
);

export const selectTotal = createSelector([selectSubtotal, selectTotalSavings], (subtotal, savings) =>
  roundMoney(subtotal - savings),
);

