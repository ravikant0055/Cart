## Cart App (Products, Basket, Special Offers)

Shopping cart application that lets users add products to a basket and calculates a bill including:

- **Subtotal** (before special offers)
- **Special offers applied** (each offer’s individual saving)
- **Final total** (after savings)

### Features

- **Product list**: add items to basket (disabled/greyed out once in basket)
- **Basket**: update quantities with +/- or direct input
- **Offer engine**: computes savings and totals from basket contents
- **Bill breakdown**:
  - subtotal
  - each offer saving line
  - total savings
  - final amount

### Special offers

- **Cheese 2 for 1**: buy one cheese, get the second free (every 2 cheeses → 1 free)
- **Soup + half price Bread**: for each soup, one bread is half price (limited by bread quantity)
- **Butter 1/3 off**: a third off every butter

### Tech stack

- **React** + **TypeScript**
- **Tailwind CSS** (UI styling)
- **Redux Toolkit** + **React-Redux** (state management)
- **Vitest** + **React Testing Library** (unit tests)
- **Vite** (build tooling)

### Getting started

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

### Tests

Run tests in watch mode:

```bash
npm test
```

Run tests once (CI):

```bash
npm run test:run
```

### Project notes

- Core pricing logic lives in Redux selectors: `src/store/cart/selectors.ts`
- Cart state is managed in: `src/store/cart/cartSlice.ts`

### Linting

```bash
npm run lint
```

---

If you’re deploying to Vercel, production builds use `vite.config.ts`. Unit test configuration is isolated in `vitest.config.ts`.
