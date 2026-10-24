# Home Improvement Ratio Lab

An interactive supply chain financial analysis of **Home Depot (HD)**, **Lowe's (LOW)**, **Floor & Decor (FND)** and **Tractor Supply (TSCO)** for fiscal years 2025 and 2024.

Built by Team Aster for INSC 75663 Supply Chain and Operational Strategy, Executive MBA, Neeley School of Business, Texas Christian University (Fall 2026).

## Views

- **Summary** (`#summary`): seven key findings and the Strategic Profit Model.
- **Ratios** (`#ratios`): a chart for any ratio plus the full ratio sheet with Why It Matters and Impact labels.
- **What If** (`#whatif`): If/Then analysis, sensitivity sliders and a tornado chart.
- **Workbook View** (`#workbook`): all four companies in the assignment's spreadsheet layout.
- **Sources & Inputs** (`#sources`): editable 10-K figures, citations and notes.

## What It Does

- **Strategic Profit Model:** SC operating margin × asset turnover = ROA, plus ROPA for the assets the supply chain controls.
- **Ratio Sheet:** working capital, asset, labor, profitability and liquidity ratios side by side, with a "Why It Matters" label on each.
- **Goodwill and Lease Adjustments:** ROA excluding goodwill and intangibles, and ROPA including operating lease right-of-use assets.
- **If/Then Analysis:** standard-step and match-best-peer scenarios for six key ratios.
- **Sensitivity:** sliders for inventory days, payables days, COGS, SG&A, PP&E and sales, plus a tornado chart of the levers that move ROPA most.
- **Editable Inputs:** every 10-K figure can be edited in the browser; edits stay in that browser only.

## How to View

Open `index.html` in any browser, or visit the GitHub Pages site for this repository.

## Data

`data/companies.json` holds every input in US$ millions (employees in thousands), with sources and notes per company. Figures come from company 10-K filings and Q4 earnings releases (SEC EDGAR and investor relations sites). Some balance sheet and income statement figures were taken from earnings releases, which report the same consolidated statements as the 10-K; verify against 10-K Item 8 before relying on them.

## Method

- SC Operating Margin (SCOM) = (sales − COGS − SG&A) ÷ sales, with SG&A as reported.
- PP&E excludes operating lease right-of-use assets unless a ratio says otherwise.
- Home Depot's fiscal 2024 and Lowe's fiscal 2023 had 53 weeks, which affects sales growth.
- Floor & Decor and Tractor Supply fiscal years end in late December, about five weeks before Home Depot and Lowe's.

## Resources

- Swink, M. (2026). *Income stmt and balance sheet 102226.xlsx* [Ratio template]. INSC 75663, Texas Christian University.
- Swink, M. (2026). *How SCM affects the bottom line: Strategic Profit Model* [Lecture slides]. INSC 75663, Texas Christian University.
- Swink, M., Melnyk, S. A., & Hartley, J. L. (2024). *Managing operations across the supply chain* (5th ed.). McGraw Hill.

## Acknowledgments

Data gathering and the interactive page were built with AI assistance (Claude, Anthropic). Analysis and conclusions are the team's own. This project is for educational use and is not affiliated with or endorsed by any of the companies analyzed.
