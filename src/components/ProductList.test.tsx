import { describe, expect, it } from "vitest";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductList from "./ProductList";
import { store } from "../store";
import { clearCart, setQuantity } from "../store/cart/cartSlice";

describe("<ProductList />", () => {
  it("disables Add button for products already in cart", async () => {
    store.dispatch(clearCart());
    store.dispatch(setQuantity({ productId: "bread", quantity: 1 }));

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>,
    );

    const addButtons = screen.getAllByRole("button", { name: /add/i });
    // Bread row should have disabled Add (because in cart)
    // We find it by locating "Bread" then nearest button within same row.
    const breadRow = screen.getByText("Bread").closest("div");
    expect(breadRow).not.toBeNull();
    const breadAdd = breadRow!.querySelector("button");
    expect(breadAdd).not.toBeNull();
    expect(breadAdd).toBeDisabled();

    // A product not in cart (e.g. Milk) should remain enabled
    const milkRow = screen.getByText("Milk").closest("div");
    expect(milkRow).not.toBeNull();
    const milkAdd = milkRow!.querySelector("button");
    expect(milkAdd).not.toBeNull();
    expect(milkAdd).not.toBeDisabled();

    // Clicking enabled button should disable it (since it gets added)
    const user = userEvent.setup();
    await user.click(milkAdd!);
    expect(milkAdd).toBeDisabled();

    // sanity: we still render buttons
    expect(addButtons.length).toBeGreaterThan(0);
  });
});

