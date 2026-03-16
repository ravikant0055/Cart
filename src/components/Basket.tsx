import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addOne, removeOne, setQuantity, clearCart } from "../store/cart/cartSlice";
import {
  selectCartLines,
  selectOfferSavings,
  selectSavingsByProductId,
  selectSubtotal,
  selectTotal,
  selectTotalSavings,
} from "../store/cart/selectors";
import { formatGBP, roundMoney } from "../utils/money";

export default function Basket() {
  const dispatch = useAppDispatch();
  const lines = useAppSelector(selectCartLines);
  const subtotal = useAppSelector(selectSubtotal);
  const totalSavings = useAppSelector(selectTotalSavings);
  const total = useAppSelector(selectTotal);
  const offerSavings = useAppSelector(selectOfferSavings);
  const savingsById = useAppSelector(selectSavingsByProductId);

  const isEmpty = lines.length === 0;

  const perLine = useMemo(() => {
    return lines.map((l) => {
      const lineSubtotal = roundMoney(l.product.price * l.quantity);
      const lineSaving = savingsById[l.product.id] ?? 0;
      const lineTotal = roundMoney(lineSubtotal - lineSaving);
      return { ...l, lineSubtotal, lineSaving, lineTotal };
    });
  }, [lines, savingsById]);

  return (
    <section className="flex h-full flex-col justify-between rounded-md bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">Basket</h1>
        <button
          type="button"
          className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          onClick={() => dispatch(clearCart())}
          disabled={isEmpty}
        >
          Clear
        </button>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto max-h-65 pr-1 scrollbar-hide">
        {isEmpty ? (
          <div className="mt-6 rounded-md border border-dashed p-6 text-center text-gray-500">
            Your basket is empty. Add some items.
          </div>
        ) : (
          <div className="divide-y">
            {perLine.map(({ product, quantity, lineSaving, lineSubtotal, lineTotal }) => (
              <div key={product.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium">{product.name}</h2>
                    <p className="mt-1 font-medium text-gray-400">{formatGBP(product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-gray-300 px-3 py-2 font-medium hover:bg-gray-200 cursor-pointer"
                        onClick={() => dispatch(removeOne(product.id))}
                      >
                        -
                      </button>

                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={quantity}
                        onChange={(e) =>
                          dispatch(setQuantity({ productId: product.id, quantity: Number(e.target.value) }))
                        }
                        className="w-14 rounded-md border border-gray-200 text-center outline-none focus:border-blue-500"
                      />

                      <button
                        type="button"
                        className="rounded-lg bg-blue-500 text-white px-3 py-2 font-medium hover:bg-blue-400 cursor-pointer"
                        onClick={() => dispatch(addOne(product.id))}
                      >
                        +
                      </button>
                    </div>

                    <p className="text-sm text-gray-400">
                      Item price {formatGBP(product.price)} * {quantity} = {formatGBP(lineSubtotal)}
                    </p>
                  </div>
                </div>

                {lineSaving > 0 && (
                  <p className="mt-2 text-right font-medium text-red-500">
                    Savings {formatGBP(lineSaving)}
                  </p>
                )}
                <p className="mt-1 text-right font-medium">Item cost {formatGBP(lineTotal)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 border-t pt-4">
        {offerSavings.length > 0 && (
          <div className="mb-3 space-y-1">
            {offerSavings.map((o) => (
              <div key={o.id} className="flex justify-between text-sm">
                <span className="text-gray-500">{o.title}</span>
                <span className="font-medium text-red-500">- {formatGBP(o.saving)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Sub Total:</span>
            <span className="font-medium">{formatGBP(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Savings:</span>
            <span className="font-medium text-red-500">- {formatGBP(totalSavings)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total Amount:</span>
            <span className="font-semibold">{formatGBP(total)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

