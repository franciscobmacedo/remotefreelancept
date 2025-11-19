# Technical Documentation: Simulation & I18n Implementation

## 1. Internationalization (i18n) System

### Architecture
- **Store-based State:** The current language state (`'pt' | 'en'`) is managed in the `comparison` store (`src/store/comparison.ts`).
- **Composable:** A `useI18n` composable (`src/i18n/index.ts`) provides a reactive `t` object containing all translations based on the current store state.
- **Translation File:** All strings are centralized in `src/i18n/translations.ts`, structured as a nested object with `pt` and `en` keys.

### Implementation Details
- **Reactive Switching:** Components use `const { t } = useI18n()` to access strings. When the store's language changes, `t` automatically updates, triggering a re-render of all text.
- **Formatted Content:** Some translations include HTML (e.g., `aboutText`), which are rendered using `v-html`.

## 2. Simulation Logic Enhancements

### Unipessoal Optimization (`optimizeUnipessoal`)
- **Bug Fix:** The previous implementation incorrectly divided the Social Security base cap by 12 inside the monthly calculation loop, resulting in a cap that was 1/12th of the legal limit.
- **Correction:** Removed the erroneous division. The optimizer now correctly calculates SS contributions based on the full monthly salary, capped at the correct IAS multiple.
- **Feasibility Check:** Added a check `if (totalCompanyCost > grossIncomeYear) break;` to ensure the optimizer doesn't suggest salaries that exceed the company's total revenue.

### Liquidity & Benefits Logic
- **New State:** Added `unipessoalExpensesAsLiquidity` (boolean) to `ComparisonState`.
- **Calculation:** In `comparison.getters.unipessoal`:
  - If `unipessoalExpensesAsLiquidity` is `true`, the value of `expenses` is added to a new field `liquidityExpenses`.
  - `finalNetIncome` remains the cash-in-hand value, but `liquidityExpenses` tracks the "perk" value.
- **Typings:** Updated `ContractComparison` interface to include `liquidityExpenses?: GrossIncome`.

## 3. UI/UX & Visualization

### Comparison Chart (`ComparisonChart.vue`)
- **Stacked Bars:** Modified the Chart.js configuration to stack "Liquidity" on top of "Net Income".
  - **Stack 0:** Net Income (Green) + Liquidity (Light Green).
  - **Stack 1:** Taxes (Red).
- **Data Mapping:** The chart now computes `Base Net Income = Total Net - Liquidity` to avoid double counting when stacking.

### Tables (`DetailedComparisonTable.vue` & `ComparisonTable.vue`)
- **Detailed Table:** Added a conditional row for "Liquidity (Expenses/Benefits)" if the value is > 0.
- **Summary Table:** Added a "Liquidity" column to the summary view.

### Input Layout (`ComparisonView.vue`)
- **Grid System:** Refactored the top input section from a simple flex/stack to a `grid-cols-12` layout.
  - **Row 1:** Income (5 cols), Frequency (4 cols), Year (3 cols).
  - **Row 2:** VAT Toggle & CTI Months.
- **Clarity:** Grouped related inputs logically to reduce visual clutter.

### Consistency
- **Summary Card:** Updated `getEstimatedNetIncome` to return `finalNetIncome` (after expenses) instead of raw `netIncome`, ensuring the "Summary" card matches the "Detailed Table" bottom line.
