import { PRODUCTS } from "../data/products";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addOne } from "../store/cart/cartSlice";
import { formatGBP } from "../utils/money";

export default function ProductList() {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector((s) => s.cart.quantities);

  return (
    <section className="flex h-full flex-col rounded-md bg-white p-4 shadow-sm">
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="mt-3 flex-1 divide-y overflow-y-auto scrollbar-hide">
        {PRODUCTS.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3">
            <h2 className="font-medium">{item.name}</h2>
            <div className="flex items-center gap-4">
              <p className="font-medium text-gray-400">
                <span className="text-black">{formatGBP(item.price)}</span>
              </p>
              <button
                type="button"
                disabled={(quantities[item.id] ?? 0) > 0}
                onClick={() => dispatch(addOne(item.id))}
                className={[
                  "rounded-md px-3 py-2 font-medium text-white cursor-pointer",
                  (quantities[item.id] ?? 0) > 0
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
                ].join(" ")}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

