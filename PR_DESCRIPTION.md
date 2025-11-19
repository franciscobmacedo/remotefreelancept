# Pull Request: Internationalization (i18n) & Simulation Engine Enhancements

## 📝 Description

This PR introduces full internationalization support (PT/EN) and significantly refines the simulation logic and UI for the "Unipessoal" regime and general comparisons.

## ✨ Key Changes

### 🌍 Internationalization (i18n)
- **Bilingual Support:** Implemented a robust i18n system supporting Portuguese (default) and English.
- **Component Refactor:** Updated all key views (`ComparisonView`, `Dashboard`, `AboutView`) and components (`FooterBar`, `Table`, `Chart`) to use dynamic translation keys instead of hardcoded text.
- **Language Switcher:** Added a seamless language toggle in the `FooterBar`.

### ⚙️ Simulation Engine & Logic
- **Unipessoal Optimizer Fix:** Corrected a critical bug in the `optimizeUnipessoal` function where the Social Security base was being incorrectly calculated (divided by 12 twice), leading to artificially low tax estimates. The optimizer now suggests more realistic salaries.
- **Liquidity/Benefits Feature:** Introduced a new toggle for "Unipessoal" to treat deductible expenses as "Liquidity/Benefits" (e.g., company car, daily allowances).
  - These are now visualized as a stacked bar in the **Comparison Chart**, showing the "Total Value" (Net Income + Benefits).
  - Added specific rows/columns in **Detailed** and **Summary Tables** to discriminate this value.
- **Consistency Fixes:** Aligned the "Income Summary" card (top of Comparison View) to match the "Detailed Table" logic, ensuring it reflects the *final* net income after all additional expenses (Accountant, Insurance, etc.).

### 🎨 UI/UX Improvements
- **Layout Overhaul:** Redesigned the "Simulation Parameters" input section in `ComparisonView` using a cleaner grid layout for better readability and alignment.
- **PDF Export:** Added a "Print/Export PDF" button with print-specific CSS styles to generate clean reports.
- **Visual Feedback:** Enhanced the "Auto" expense button state and added tooltips/labels to clarify that the "Summary" card refers to the "Recibos Verdes" baseline.

## 🧪 Testing
- Verified calculations against 2025 tax brackets.
- Checked consistency between Summary and Detailed views.
- Validated language switching across all pages.

## 📸 Screenshots
*(Attach screenshots of the new English UI, the stacked Chart, and the improved Input Grid here)*
