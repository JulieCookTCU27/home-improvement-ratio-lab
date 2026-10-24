/* Shared engine for the instructional Ratio Lab pages.
   Example Retailer is a made-up company with round numbers, used only to teach the math.
   Every input can be edited on the Start Here page; edits are kept in this browser and used on every page. */

const EXAMPLE = {
  name: 'Example Retailer',
  revenue: 50000, prior_revenue: 47500, cogs: 33000, sga: 10500, depreciation: 1000,
  operating_income: 5500, net_income: 3800,
  cash: 1200, receivables: 900, inventory: 8000, total_current_assets: 11000,
  ppe_net: 12000, rou_assets: 4000, goodwill_intangibles: 3000, total_assets: 32000,
  accounts_payable: 5500, total_current_liabilities: 9500, employees_thousands: 180
};

const FIELDS = [
  ['Income Statement', [
    ['revenue', 'Revenue (Sales)', 'Top line: everything customers paid for the year.'],
    ['prior_revenue', 'Prior-Year Revenue', 'Last year\'s sales, needed only for sales growth.'],
    ['cogs', 'Cost of Goods Sold (COGS)', 'What the company paid for the products it sold.'],
    ['sga', 'SG&A', 'Selling, general and administrative costs: store labor, rent, marketing, headquarters.'],
    ['depreciation', 'Depreciation & Amortization', 'The yearly wear-and-tear charge on stores, trucks and equipment.'],
    ['operating_income', 'Operating Income', 'Profit from running the business, before interest and tax.'],
    ['net_income', 'Net Income', 'Bottom line, after interest and tax.']
  ]],
  ['Balance Sheet', [
    ['cash', 'Cash', 'Cash and cash equivalents on the balance sheet date.'],
    ['receivables', 'Receivables', 'Money customers owe the company.'],
    ['inventory', 'Inventory', 'Goods on shelves, in warehouses and in transit.'],
    ['total_current_assets', 'Total Current Assets', 'Assets expected to turn into cash within a year.'],
    ['ppe_net', 'PP&E, Net', 'Property, plant and equipment after depreciation: stores, distribution centers, trucks.'],
    ['rou_assets', 'Operating Lease ROU Assets', 'Right-of-use assets: the value of buildings the company leases instead of owns.'],
    ['goodwill_intangibles', 'Goodwill & Intangibles', 'What the company paid above book value when it bought other companies, plus brands and similar assets.'],
    ['total_assets', 'Total Assets', 'Everything the company owns.'],
    ['accounts_payable', 'Accounts Payable', 'Money the company owes its suppliers.'],
    ['total_current_liabilities', 'Total Current Liabilities', 'Bills due within a year.']
  ]],
  ['Other', [
    ['employees_thousands', 'Employees (Thousands)', 'Headcount from the annual report, in thousands.']
  ]]
];

const KEY = 'ratio-lab-learn-v1';
function loadData() {
  const d = Object.assign({}, EXAMPLE);
  try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s) for (const k in s) if (k in d) d[k] = s[k]; } catch (e) {}
  return d;
}
function saveData(d) {
  try {
    const diff = {}; for (const k in d) if (d[k] !== EXAMPLE[k]) diff[k] = d[k];
    localStorage.setItem(KEY, JSON.stringify(diff));
  } catch (e) {}
}
function resetData() { try { localStorage.removeItem(KEY); } catch (e) {} return Object.assign({}, EXAMPLE); }
function isEdited(d) { return Object.keys(EXAMPLE).some(k => d[k] !== EXAMPLE[k]); }

const ok = v => typeof v === 'number' && isFinite(v);
const div = (a, b) => (ok(a) && ok(b) && b !== 0) ? a / b : null;

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function fmt(v, kind, dp) {
  if (!ok(v)) return '—';
  switch (kind) {
    case 'pct': return (v * 100).toFixed(dp ?? 1) + '%';
    case 'days': return v.toFixed(dp ?? 1) + ' days';
    case 'x': return v.toFixed(dp ?? 2) + '×';
    case 'k': return '$' + Math.round(v).toLocaleString('en-US') + 'K';
    case 'm': return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: dp ?? 0 }) + 'M';
    case 'dec': return v.toFixed(dp ?? 4);
    default: return v.toLocaleString('en-US', { maximumFractionDigits: dp ?? 2 });
  }
}
const M = v => fmt(v, 'm');

/* Derived building blocks used by several ratios */
function blocks(d) {
  const gp = d.revenue - d.cogs;
  const scop = d.revenue - d.cogs - d.sga;
  return { gp, scop };
}

/* Ratio catalog. Each entry teaches one calculation.
   plain: everyday explanation. analogy: a picture to remember it by. formula: the formal definition.
   steps(d): the walkthrough, each step [what you do, the arithmetic, the result].
   better: which direction is usually good. why: what it tells you about the supply chain. watch: common mistakes. */
const RATIOS = [
  { group: 'Working Capital Productivity', intro: 'How much cash the business ties up in day-to-day operations: inventory on the shelf, money customers still owe, and money owed to suppliers.' },
  { k: 'invDays', name: 'Inventory Days', kind: 'days', better: 'Lower Is Usually Better',
    plain: 'How many days the average product sits in the company before it sells.',
    analogy: 'Think of your pantry. If you buy 30 days of groceries at a time, you have 30 days of food sitting on the shelf, and your money is tied up in it until you eat it.',
    formula: 'Inventory Days = Inventory ÷ COGS × 365',
    steps: d => [
      ['Find inventory on the balance sheet.', '', M(d.inventory)],
      ['Find cost of goods sold on the income statement.', '', M(d.cogs)],
      ['Divide COGS by 365 to get one day of cost.', `${M(d.cogs)} ÷ 365`, fmt(d.cogs / 365, 'm', 1)],
      ['Divide inventory by one day of cost.', `${M(d.inventory)} ÷ ${fmt(d.cogs / 365, 'm', 1)}`, fmt(div(d.inventory, d.cogs) * 365, 'days')]],
    value: d => div(d.inventory, d.cogs) * 365,
    why: 'Every extra day of inventory is cash sitting on a shelf. Fewer days frees cash, lowers markdown and obsolescence risk, and usually means better forecasting and replenishment. Too few days risks empty shelves.',
    watch: '<b>Use COGS, not sales.</b> Inventory is recorded at cost, so divide by cost. Dividing by sales mixes cost with selling price and makes inventory look smaller than it is. Some textbooks and rankings use sales; this lab uses COGS.' },
  { k: 'recDays', name: 'Receivables Days', kind: 'days', better: 'Lower Is Usually Better',
    plain: 'How many days, on average, it takes customers to pay after a sale.',
    analogy: 'If you lend a friend money and they pay you back in 30 days, your money is out for 30 days. Receivable days measures that wait across every customer.',
    formula: 'Receivables Days = Receivables ÷ Sales × 365',
    steps: d => [
      ['Find receivables on the balance sheet.', '', M(d.receivables)],
      ['Find revenue on the income statement.', '', M(d.revenue)],
      ['Divide revenue by 365 to get one day of sales.', `${M(d.revenue)} ÷ 365`, fmt(d.revenue / 365, 'm', 1)],
      ['Divide receivables by one day of sales.', `${M(d.receivables)} ÷ ${fmt(d.revenue / 365, 'm', 1)}`, fmt(div(d.receivables, d.revenue) * 365, 'days')]],
    value: d => div(d.receivables, d.revenue) * 365,
    why: 'Cash customers have not paid yet cannot be used to buy inventory or pay bills. Retailers that sell mostly to walk-in shoppers have very few receivable days; those that sell to businesses on credit have more.',
    watch: '<b>Use sales, not COGS.</b> Receivables are recorded at selling price, so divide by sales. If a company reports no trade receivables, the answer is close to zero, not missing.' },
  { k: 'payDays', name: 'Payables Days', kind: 'days', better: 'Higher Helps Cash, Within Reason',
    plain: 'How many days, on average, the company takes to pay its suppliers.',
    analogy: 'Paying with a credit card and settling the bill a month later. You keep your cash longer, and the card company effectively lends it to you.',
    formula: 'Payables Days = Accounts Payable ÷ COGS × 365',
    steps: d => [
      ['Find accounts payable on the balance sheet.', '', M(d.accounts_payable)],
      ['Find cost of goods sold.', '', M(d.cogs)],
      ['Divide COGS by 365 to get one day of purchases.', `${M(d.cogs)} ÷ 365`, fmt(d.cogs / 365, 'm', 1)],
      ['Divide payables by one day of purchases.', `${M(d.accounts_payable)} ÷ ${fmt(d.cogs / 365, 'm', 1)}`, fmt(div(d.accounts_payable, d.cogs) * 365, 'days')]],
    value: d => div(d.accounts_payable, d.cogs) * 365,
    why: 'When suppliers wait longer to be paid, they are financing part of the inventory. That helps cash flow, but squeezing suppliers too hard can raise prices, hurt service and damage the relationship later.',
    watch: '<b>More is not always better.</b> Research on supplier payment terms finds that stretching payables can hurt profits a year or two later through higher costs, unless the buyer has dominant market power.' },
  { k: 'ccc', name: 'Cash Conversion Cycle', kind: 'days', better: 'Lower Is Usually Better',
    plain: 'The number of days between paying suppliers and collecting cash from customers.',
    analogy: 'A lemonade stand buys lemons Monday, sells lemonade Wednesday, and gets paid Friday, but did not pay for the lemons until Thursday. The stand was out of pocket for one day.',
    formula: 'Cash Conversion Cycle = Inventory Days + Receivables Days − Payables Days',
    steps: d => { const i = div(d.inventory, d.cogs) * 365, r = div(d.receivables, d.revenue) * 365, p = div(d.accounts_payable, d.cogs) * 365; return [
      ['Start with inventory days.', '', fmt(i, 'days')],
      ['Add receivables days.', `${fmt(i, 'dec', 1)} + ${fmt(r, 'dec', 1)}`, fmt(i + r, 'days')],
      ['Subtract payables days.', `${fmt(i + r, 'dec', 1)} − ${fmt(p, 'dec', 1)}`, fmt(i + r - p, 'days')]]; },
    value: d => div(d.inventory, d.cogs) * 365 + div(d.receivables, d.revenue) * 365 - div(d.accounts_payable, d.cogs) * 365,
    why: 'This is the single best test of supply chain cash efficiency. A short or negative cycle means customers and suppliers fund the operation; a long one means the company must fund it with its own cash or debt.',
    watch: '<b>Negative is possible.</b> If a company collects from customers before it pays suppliers, the cycle is negative, which means suppliers are funding growth.' },
  { k: 'wcs', name: 'Working Capital / Sales', kind: 'pct', better: 'Lower Is Usually Better',
    plain: 'How much short-term money the company keeps tied up for every dollar it sells.',
    analogy: 'The float in a cash register plus the stock in the back room. You need some to operate, but every dollar there is a dollar not invested elsewhere.',
    formula: 'Working Capital / Sales = (Current Assets − Current Liabilities) ÷ Sales',
    steps: d => [
      ['Find total current assets.', '', M(d.total_current_assets)],
      ['Subtract total current liabilities to get working capital.', `${M(d.total_current_assets)} − ${M(d.total_current_liabilities)}`, M(d.total_current_assets - d.total_current_liabilities)],
      ['Divide by revenue.', `${M(d.total_current_assets - d.total_current_liabilities)} ÷ ${M(d.revenue)}`, fmt(div(d.total_current_assets - d.total_current_liabilities, d.revenue), 'pct')]],
    value: d => div(d.total_current_assets - d.total_current_liabilities, d.revenue),
    why: 'A lean supply chain supports a lot of sales with little working capital. A rising percentage often means inventory is building up or customers are paying slower.',
    watch: '<b>Read it with the day counts.</b> This ratio shows the total; inventory, receivable and payable days show which piece caused it.' },
  { k: 'cashA', name: 'Cash / Assets', kind: 'pct', better: 'Depends on the Situation',
    plain: 'What share of everything the company owns is sitting in cash.',
    analogy: 'An emergency fund. It keeps you safe, but money in savings earns less than money invested.',
    formula: 'Cash / Assets = Cash ÷ Total Assets',
    steps: d => [
      ['Find cash on the balance sheet.', '', M(d.cash)],
      ['Find total assets.', '', M(d.total_assets)],
      ['Divide cash by total assets.', `${M(d.cash)} ÷ ${M(d.total_assets)}`, fmt(div(d.cash, d.total_assets), 'pct')]],
    value: d => div(d.cash, d.total_assets),
    why: 'Cash is a safety cushion against disruptions, but idle cash lowers return on assets. Compare it with peers and with how predictable the business is.',
    watch: '<b>One date only.</b> The balance sheet shows cash on one day, which can swing around year-end.' },

  { group: 'Asset Productivity', intro: 'How hard the company\'s stores, warehouses and other long-term assets work to produce sales.' },
  { k: 'ato', name: 'Asset Turnover', kind: 'x', better: 'Higher Is Usually Better',
    plain: 'How many dollars of sales each dollar of assets produces in a year.',
    analogy: 'A food truck that serves 300 customers a day gets more out of the same truck than one that serves 100.',
    formula: 'Asset Turnover = Sales ÷ Total Assets',
    steps: d => [
      ['Find revenue.', '', M(d.revenue)],
      ['Find total assets.', '', M(d.total_assets)],
      ['Divide revenue by total assets.', `${M(d.revenue)} ÷ ${M(d.total_assets)}`, fmt(div(d.revenue, d.total_assets), 'x')]],
    value: d => div(d.revenue, d.total_assets),
    why: 'Turnover is half of the return story. A company with thin margins can still earn a good return if it turns its assets quickly.',
    watch: '<b>Acquisitions lower it.</b> Buying another company adds goodwill to assets without adding much physical capacity, so turnover drops even if operations did not change.' },
  { k: 'ppeT', name: 'PP&E Turnover', kind: 'x', better: 'Higher Is Usually Better',
    plain: 'How many dollars of sales each dollar of stores, warehouses and equipment produces.',
    analogy: 'Sales per square foot, but for the whole physical network.',
    formula: 'PP&E Turnover = Sales ÷ PP&E, Net',
    steps: d => [
      ['Find revenue.', '', M(d.revenue)],
      ['Find net PP&E.', '', M(d.ppe_net)],
      ['Divide revenue by PP&E.', `${M(d.revenue)} ÷ ${M(d.ppe_net)}`, fmt(div(d.revenue, d.ppe_net), 'x')]],
    value: d => div(d.revenue, d.ppe_net),
    why: 'Shows the payoff from investment in the physical network. New distribution centers lower it at first and should raise it once they are busy.',
    watch: '<b>Leasing flatters it.</b> Leased buildings sit in lease assets, not PP&E, so a company that leases most stores shows higher PP&E turnover than one that owns them.' },
  { k: 'ppeA', name: 'PP&E / Assets', kind: 'pct', better: 'Describes the Business Model',
    plain: 'What share of the company\'s assets is physical buildings and equipment.',
    analogy: 'Owning your house versus renting it. Owners have more wealth tied up in the building.',
    formula: 'PP&E / Assets = PP&E, Net ÷ Total Assets',
    steps: d => [
      ['Find net PP&E.', '', M(d.ppe_net)],
      ['Divide by total assets.', `${M(d.ppe_net)} ÷ ${M(d.total_assets)}`, fmt(div(d.ppe_net, d.total_assets), 'pct')]],
    value: d => div(d.ppe_net, d.total_assets),
    why: 'An asset-heavy model has more fixed capacity to keep busy, so volume swings hit profit harder.',
    watch: '<b>Not good or bad by itself.</b> Compare it with peers that use the same format.' },
  { k: 'leaseShare', name: 'Leased Share of Physical Assets', kind: 'pct', better: 'Describes the Business Model',
    plain: 'Of all the buildings and equipment the company uses, what share it leases rather than owns.',
    analogy: 'If you rent nine of your ten apartments, 90% of your living space is leased.',
    formula: 'Leased Share = Lease ROU Assets ÷ (PP&E + Lease ROU Assets)',
    steps: d => [
      ['Find operating lease right-of-use assets.', '', M(d.rou_assets)],
      ['Add PP&E to get all physical assets.', `${M(d.ppe_net)} + ${M(d.rou_assets)}`, M(d.ppe_net + d.rou_assets)],
      ['Divide lease assets by the total.', `${M(d.rou_assets)} ÷ ${M(d.ppe_net + d.rou_assets)}`, fmt(div(d.rou_assets, d.ppe_net + d.rou_assets), 'pct')]],
    value: d => div(d.rou_assets, d.ppe_net + d.rou_assets),
    why: 'Tells you how much to adjust PP&E turnover and ROPA before comparing a company that leases with one that owns.',
    watch: '<b>Look in the notes.</b> Lease assets are on the balance sheet but are often a separate line from PP&E.' },
  { k: 'gwA', name: 'Goodwill & Intangibles / Assets', kind: 'pct', better: 'Lower Means More Organic Growth',
    plain: 'What share of the company\'s assets comes from buying other companies rather than building its own.',
    analogy: 'The premium you pay for a business\'s name and customer list, above the value of its equipment.',
    formula: 'Goodwill & Intangibles / Assets = Goodwill & Intangibles ÷ Total Assets',
    steps: d => [
      ['Find goodwill and intangible assets.', '', M(d.goodwill_intangibles)],
      ['Divide by total assets.', `${M(d.goodwill_intangibles)} ÷ ${M(d.total_assets)}`, fmt(div(d.goodwill_intangibles, d.total_assets), 'pct')]],
    value: d => div(d.goodwill_intangibles, d.total_assets),
    why: 'Goodwill does not stock shelves or ship orders. A high share means part of the asset base is acquisition premium, which dilutes asset-based returns.',
    watch: '<b>Check for a recent deal.</b> A jump in this ratio usually means an acquisition, which also changes revenue, receivables and inventory.' },

  { group: 'Labor Productivity', intro: 'How much output the workforce produces.' },
  { k: 'spe', name: 'Sales per Employee', kind: 'k', better: 'Higher Is Usually Better',
    plain: 'Average sales produced by each employee in a year.',
    analogy: 'How many pizzas each cook turns out per shift.',
    formula: 'Sales per Employee = Sales ÷ Employees',
    steps: d => [
      ['Find revenue, in millions.', '', M(d.revenue)],
      ['Find employees, in thousands.', '', fmt(d.employees_thousands, '', 1) + 'K'],
      ['Divide. Millions ÷ thousands = thousands of dollars per employee.', `${M(d.revenue)} ÷ ${fmt(d.employees_thousands, '', 1)}K`, fmt(div(d.revenue, d.employees_thousands) * 1000, 'k')]],
    value: d => div(d.revenue, d.employees_thousands) * 1000,
    why: 'Reflects staffing levels, store formats and automation. Self-checkout, larger tickets and better scheduling all raise it.',
    watch: '<b>Watch part-time workers.</b> Headcount counts a part-timer the same as a full-timer.' },

  { group: 'Growth and Profitability', intro: 'How fast the company grows and how much profit it keeps from each dollar of sales and each dollar of assets.' },
  { k: 'growth', name: 'Sales Growth', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'How much sales grew compared with last year.',
    analogy: 'Your paycheck went from $47,500 to $50,000.',
    formula: 'Sales Growth = (This Year\'s Sales − Last Year\'s Sales) ÷ Last Year\'s Sales',
    steps: d => [
      ['Find this year\'s and last year\'s revenue.', `${M(d.revenue)} and ${M(d.prior_revenue)}`, ''],
      ['Subtract to get the change.', `${M(d.revenue)} − ${M(d.prior_revenue)}`, M(d.revenue - d.prior_revenue)],
      ['Divide the change by last year.', `${M(d.revenue - d.prior_revenue)} ÷ ${M(d.prior_revenue)}`, fmt(div(d.revenue - d.prior_revenue, d.prior_revenue), 'pct')]],
    value: d => div(d.revenue - d.prior_revenue, d.prior_revenue),
    why: 'Growth spreads the fixed cost of stores and distribution centers over more sales, which lifts margins and asset turnover.',
    watch: '<b>Check the calendar.</b> Many retailers have a 53-week year every five or six years. The extra week inflates that year and makes the next year\'s growth look weaker.' },
  { k: 'gm', name: 'Gross Margin', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Of every dollar of sales, how much is left after paying for the products.',
    analogy: 'You buy a shirt for $6 and sell it for $10. You keep $4, a 40% gross margin, before paying rent or staff.',
    formula: 'Gross Margin = (Sales − COGS) ÷ Sales',
    steps: d => [
      ['Subtract COGS from revenue to get gross profit.', `${M(d.revenue)} − ${M(d.cogs)}`, M(d.revenue - d.cogs)],
      ['Divide gross profit by revenue.', `${M(d.revenue - d.cogs)} ÷ ${M(d.revenue)}`, fmt(div(d.revenue - d.cogs, d.revenue), 'pct')]],
    value: d => div(d.revenue - d.cogs, d.revenue),
    why: 'Reflects pricing power, product mix, buying scale and markdowns. Supply chain mistakes such as overbuying show up here as discounting.',
    watch: '<b>Definitions vary.</b> Some companies put freight or distribution costs in COGS and others put them in SG&A, so compare gross margin and SG&A together.' },
  { k: 'gproi', name: 'GPROI (Gross Margin Return on Inventory)', kind: 'x', better: 'Higher Is Usually Better',
    plain: 'How many dollars of gross profit each dollar of inventory earns in a year.',
    analogy: 'A farmer\'s yield per acre, except the acre is a dollar of inventory.',
    formula: 'GPROI = Gross Profit ÷ Inventory',
    steps: d => [
      ['Calculate gross profit (sales − COGS).', `${M(d.revenue)} − ${M(d.cogs)}`, M(d.revenue - d.cogs)],
      ['Find inventory.', '', M(d.inventory)],
      ['Divide gross profit by inventory.', `${M(d.revenue - d.cogs)} ÷ ${M(d.inventory)}`, fmt(div(d.revenue - d.cogs, d.inventory), 'x')]],
    value: d => div(d.revenue - d.cogs, d.inventory),
    why: 'Combines margin and turns into one number. A high-margin store that turns slowly and a low-margin store that turns fast can earn the same GPROI.',
    watch: '<b>Same thing, two names.</b> Also called GMROI. It equals gross margin × (sales ÷ inventory).' },
  { k: 'opm', name: 'Operating Margin', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Of every dollar of sales, how much is left after all operating costs.',
    analogy: 'What the shirt seller keeps after paying for the shirts, the rent, the staff and the wear on the display racks.',
    formula: 'Operating Margin = Operating Income ÷ Sales',
    steps: d => [
      ['Find operating income on the income statement.', '', M(d.operating_income)],
      ['Divide by revenue.', `${M(d.operating_income)} ÷ ${M(d.revenue)}`, fmt(div(d.operating_income, d.revenue), 'pct')]],
    value: d => div(d.operating_income, d.revenue),
    why: 'Shows how efficiently the whole operation runs, including depreciation on the network.',
    watch: '<b>One-time items.</b> Restructuring charges or gains on sales can distort a single year.' },
  { k: 'scom', name: 'SC Operating Margin (SCOM)', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Profit after product costs and operating costs, before depreciation, interest and tax. It isolates what the supply chain and operations control.',
    analogy: 'Your take-home from a side business after supplies and helpers, before you think about the loan on the van.',
    formula: 'SCOM = (Sales − COGS − SG&A) ÷ Sales',
    steps: d => { const b = blocks(d); return [
      ['Subtract COGS from revenue.', `${M(d.revenue)} − ${M(d.cogs)}`, M(b.gp)],
      ['Subtract SG&A to get SC operating profit.', `${M(b.gp)} − ${M(d.sga)}`, M(b.scop)],
      ['Divide by revenue.', `${M(b.scop)} ÷ ${M(d.revenue)}`, fmt(div(b.scop, d.revenue), 'pct')]]; },
    value: d => div(blocks(d).scop, d.revenue),
    why: 'This is the margin half of the Strategic Profit Model. Cutting waste in buying, moving or selling goods raises it directly.',
    watch: '<b>Check where depreciation sits.</b> If a company folds depreciation into SG&A, its SCOM is slightly understated compared with peers that report depreciation separately.' },
  { k: 'roa', name: 'Return on Assets (ROA)', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Bottom-line profit earned on everything the company owns.',
    analogy: 'The yearly return on a rental property: rent after all expenses, divided by what the property is worth.',
    formula: 'ROA = Net Income ÷ Total Assets',
    steps: d => [
      ['Find net income.', '', M(d.net_income)],
      ['Divide by total assets.', `${M(d.net_income)} ÷ ${M(d.total_assets)}`, fmt(div(d.net_income, d.total_assets), 'pct')]],
    value: d => div(d.net_income, d.total_assets),
    why: 'The overall scorecard. It includes interest and taxes, which the supply chain does not control, so the SCOM versions below isolate operations.',
    watch: '<b>Leverage and tax matter.</b> Two companies with identical operations can have different ROA because of debt and tax rates.' },
  { k: 'roaS', name: 'ROA Using SCOM', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Supply chain operating profit earned on everything the company owns.',
    analogy: 'The rental property return before the mortgage and taxes.',
    formula: 'ROA Using SCOM = (Sales − COGS − SG&A) ÷ Total Assets = SCOM × Asset Turnover',
    steps: d => { const b = blocks(d); return [
      ['Calculate SC operating profit (sales − COGS − SG&A).', '', M(b.scop)],
      ['Divide by total assets.', `${M(b.scop)} ÷ ${M(d.total_assets)}`, fmt(div(b.scop, d.total_assets), 'pct')],
      ['Check: SCOM × asset turnover gives the same answer.', `${fmt(div(b.scop, d.revenue), 'pct')} × ${fmt(div(d.revenue, d.total_assets), 'x')}`, fmt(div(b.scop, d.revenue) * div(d.revenue, d.total_assets), 'pct')]]; },
    value: d => div(blocks(d).scop, d.total_assets),
    why: 'This is the result of the Strategic Profit Model. It shows whether a company earns its return through margin, through speed, or both.',
    watch: '<b>Same profit, different base.</b> Only the denominator changes between ROA Using SCOM, ROIC Using SCOM and ROPA.' },
  { k: 'roaSxg', name: 'ROA Using SCOM, Excluding Goodwill', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'The same return, with acquisition premiums removed from the asset base.',
    analogy: 'Judging a restaurant by its kitchen and dining room, not by what the owner paid for the brand name.',
    formula: 'SC Operating Profit ÷ (Total Assets − Goodwill & Intangibles)',
    steps: d => { const b = blocks(d), base = d.total_assets - d.goodwill_intangibles; return [
      ['Subtract goodwill and intangibles from total assets.', `${M(d.total_assets)} − ${M(d.goodwill_intangibles)}`, M(base)],
      ['Divide SC operating profit by the result.', `${M(b.scop)} ÷ ${M(base)}`, fmt(div(b.scop, base), 'pct')]]; },
    value: d => div(blocks(d).scop, d.total_assets - d.goodwill_intangibles),
    why: 'The gap between this and ROA Using SCOM shows how much acquisitions dilute the return. It makes companies that grew by buying comparable with those that grew on their own.',
    watch: '<b>Use both.</b> Goodwill is a real cost of the deal, so this adjustment explains the return rather than replacing it.' },
  { k: 'roicS', name: 'ROIC Using SCOM', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Supply chain operating profit earned on the assets actually put to work, leaving out idle cash.',
    analogy: 'The return on the money in your business, not counting what sits in the bank.',
    formula: 'ROIC Using SCOM = SC Operating Profit ÷ (Total Assets − Cash)',
    steps: d => { const b = blocks(d), base = d.total_assets - d.cash; return [
      ['Subtract cash from total assets.', `${M(d.total_assets)} − ${M(d.cash)}`, M(base)],
      ['Divide SC operating profit by the result.', `${M(b.scop)} ÷ ${M(base)}`, fmt(div(b.scop, base), 'pct')]]; },
    value: d => div(blocks(d).scop, d.total_assets - d.cash),
    why: 'Removes the effect of a large cash pile, so a cash-rich company is judged on its operations.',
    watch: '<b>Not the finance-textbook ROIC.</b> That version uses after-tax profit and invested capital; this one keeps the supply chain profit definition.' },
  { k: 'ropa', name: 'ROPA (Return on Physical Assets)', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'Supply chain operating profit earned on the assets the supply chain directly controls: inventory and PP&E.',
    analogy: 'How much a delivery business earns on its trucks and the packages on board.',
    formula: 'ROPA = SC Operating Profit ÷ (PP&E + Inventory)',
    steps: d => { const b = blocks(d), base = d.ppe_net + d.inventory; return [
      ['Add PP&E and inventory to get physical assets.', `${M(d.ppe_net)} + ${M(d.inventory)}`, M(base)],
      ['Calculate SC operating profit.', `${M(d.revenue)} − ${M(d.cogs)} − ${M(d.sga)}`, M(b.scop)],
      ['Divide profit by physical assets.', `${M(b.scop)} ÷ ${M(base)}`, fmt(div(b.scop, base), 'pct')]]; },
    value: d => div(blocks(d).scop, d.ppe_net + d.inventory),
    why: 'The best single test of supply chain efficiency, because supply chain managers decide how much inventory to hold and what network to build.',
    watch: '<b>Leasing raises it.</b> Leased stores are not in PP&E, so compare with the lease-adjusted version below.' },
  { k: 'ropaL', name: 'ROPA Including Leased Assets', kind: 'pct', better: 'Higher Is Usually Better',
    plain: 'ROPA with leased buildings counted alongside owned ones.',
    analogy: 'Counting rented trucks along with owned trucks when you measure the fleet\'s return.',
    formula: 'SC Operating Profit ÷ (PP&E + Lease ROU Assets + Inventory)',
    steps: d => { const b = blocks(d), base = d.ppe_net + d.rou_assets + d.inventory; return [
      ['Add PP&E, lease assets and inventory.', `${M(d.ppe_net)} + ${M(d.rou_assets)} + ${M(d.inventory)}`, M(base)],
      ['Divide SC operating profit by the total.', `${M(b.scop)} ÷ ${M(base)}`, fmt(div(b.scop, base), 'pct')]]; },
    value: d => div(blocks(d).scop, d.ppe_net + d.rou_assets + d.inventory),
    why: 'Puts heavy leasers and heavy owners on equal footing so the comparison reflects operations, not the own-versus-lease choice.',
    watch: '<b>Lease costs are already in SG&A.</b> Rent is an operating expense, so the profit side needs no adjustment here.' },

  { group: 'Liquidity', intro: 'Whether the company can cover the bills that come due in the next year.' },
  { k: 'cur', name: 'Current Ratio', kind: 'x', better: 'Depends on the Situation',
    plain: 'Short-term assets divided by short-term bills.',
    analogy: 'Your checking account plus what friends owe you, compared with this month\'s bills.',
    formula: 'Current Ratio = Current Assets ÷ Current Liabilities',
    steps: d => [
      ['Find total current assets and total current liabilities.', `${M(d.total_current_assets)} and ${M(d.total_current_liabilities)}`, ''],
      ['Divide assets by liabilities.', `${M(d.total_current_assets)} ÷ ${M(d.total_current_liabilities)}`, fmt(div(d.total_current_assets, d.total_current_liabilities), 'x')]],
    value: d => div(d.total_current_assets, d.total_current_liabilities),
    why: 'Above 1 means short-term assets cover short-term bills. Retailers often run near 1 because suppliers finance their inventory.',
    watch: '<b>Lower can mean efficient.</b> A low current ratio paired with fast inventory turns is a sign of a lean supply chain, not distress.' },
  { k: 'quick', name: 'Quick Ratio', kind: 'x', better: 'Depends on the Situation',
    plain: 'The current ratio without counting inventory, since inventory takes time to turn into cash.',
    analogy: 'Could you pay this month\'s bills without selling anything in your garage?',
    formula: 'Quick Ratio = (Current Assets − Inventory) ÷ Current Liabilities',
    steps: d => [
      ['Subtract inventory from current assets.', `${M(d.total_current_assets)} − ${M(d.inventory)}`, M(d.total_current_assets - d.inventory)],
      ['Divide by current liabilities.', `${M(d.total_current_assets - d.inventory)} ÷ ${M(d.total_current_liabilities)}`, fmt(div(d.total_current_assets - d.inventory, d.total_current_liabilities), 'x')]],
    value: d => div(d.total_current_assets - d.inventory, d.total_current_liabilities),
    why: 'A stricter liquidity test. Inventory-heavy retailers normally show low values.',
    watch: '<b>Compare within an industry.</b> A grocer and a software company will never have similar quick ratios.' }
];

const RATIO = Object.fromEntries(RATIOS.filter(r => r.k).map(r => [r.k, r]));
function all(d) { const o = {}; RATIOS.forEach(r => { if (r.k) o[r.k] = r.value(d); }); return o; }

/* Mark the current page in the nav */
document.addEventListener('DOMContentLoaded', () => {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.tabs a').forEach(a => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  const flag = document.getElementById('dataflag');
  if (flag) { const d = loadData(); flag.textContent = isEdited(d) ? 'Using Your Edited Figures' : 'Example Retailer: Made-Up Figures for Practice'; }
});
