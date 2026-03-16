import Basket from "./Basket";
import ProductList from "../components/ProductList";

export default function Layout() {
  return (
    <div className="flex h-screen bg-[#f0f1f3] p-6">
      <div className="mx-auto grid h-full max-w-5xl flex-1 grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        <ProductList />
        <Basket />
      </div>
    </div>
  );
}

