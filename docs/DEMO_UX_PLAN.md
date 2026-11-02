# Durar Masagh operations demo — UX/UI and build plan

Prepared 31 October 2026. This plan describes a fictional, interactive front-end demonstration. User-authorised scope: full plan and rebuilt clickable demo. Its business rules are illustrative proposals for later company validation.

## 1. Understanding, evidence and assumptions

The presentation must prove that a single workflow can connect a customer's order, its selling units, available stock, supplier sourcing, collections and accountable follow-up. Management should be able to operate the demo themselves, change a quantity, record a receipt, switch roles and see consistent results. Discovery of their actual process follows a green light.

### Company research

| Finding | Evidence and confidence | Use in the demo |
| --- | --- | --- |
| Riyadh contact address; building materials, safety and industrial supplies; scaffolding/formwork design and supply | Company [About page](https://dmgroupksa.com/about/) | Industrial vocabulary and a practical, structured interface |
| Architecture, Building Materials, Commercial Steel, Fencing, Hand Tools, MRO & Industrial, Safety, Scaffolding divisions | Same company page | Product taxonomy for later discovery; no invented department hierarchy |
| Founded 2009; company size 51–200 | [Company LinkedIn profile](https://www.linkedin.com/company/durarmasagh), accessed 31 October 2026 | Corrects the pasted 51–100 figure; staff numbers are not a product requirement |
| Products include aluminium tile trim, scaffolding and polystyrene | [Company catalogue](https://dmgroupksa.com/store2/) | Relevant product vocabulary; prices and stock quantities remain fictional |
| ERPNext/Frappe development | Reported by the project owner in this conversation | Existing system to assess after the demo |
| X/Instagram identity | Focused searches did not establish an official account | No social handles, imagery or claims invented |
| Brand palette | No authoritative colour specification obtained | Palette below is a proposal, not an extracted official identity |
| Saturday–Thursday workweek | Supplied in the brief, not confirmed directly with the company | Demo calendar assumption only; do not use it to infer grace periods |

The website stresses supply quality, reliability and service. The proposed personality is precise, dependable and practical. Avoid adding founding dates, supposed customers or staff names as decoration. All customer, supplier and demo-user identities are fictional.

### What we know versus what we are testing

The user's mixed-unit and supplier-credit scenarios are the problem to demonstrate; they are not independently verified company procedures. Assume one Central team, an East team for access testing, SAR trading and one USD invoice to demonstrate currency separation. Use a fixed presentation date of 31 October 2026 so ageing and the script are reproducible.

Use 15% VAT for the demonstration's standard-rated domestic lines. This is a demo tax assumption consistent with [ZATCA's standard-rate guidance](https://zatca.gov.sa/en/HelpCenter/guidelines/Documents/Amendments-to-the-Implementing-Regulation-of-%28VAT%29.PDF); actual tax treatment, exemptions, invoice format and rounding policy need finance validation. The demo does not issue compliant tax invoices.

The browser's role switcher demonstrates access behaviour. It is not secure authentication: anyone who owns this browser can inspect its fictional dataset. A real deployment must enforce the same rules on the server.

### Questions to ask after the presentation

1. Which task currently takes the most time, and what does the existing customised ERPNext flow already solve?
2. Which reports define customer debt, available credit and supplier balances? Who approves those definitions?
3. Are bags breakable? Do screws-per-kg vary by SKU or shipment? Who checks conversions and prices?
4. Is supplier credit due on a fixed date, a genuine collection-triggered contract, or simply funded using collections?
5. How are partial receipts, advances, disputes, refunds and multi-invoice allocations handled?
6. Which employee/customer/team/warehouse scopes apply? Are costs and margins confidential by role?
7. Who may post receipts, approve follow-ups, receive stock and change product units?
8. Which English/Arabic terms, business calendar, rounding and tax rules are approved?
9. What integrations, server/network constraints, audit retention and support arrangements exist?

### A credible value argument

ERPNext already supports [alternate selling units against one stock unit](https://docs.frappe.io/erpnext/Selling-in-different-UOM), [receivables](https://docs.frappe.io/erpnext/accounts-receivable-and-payable) and [credit limits](https://docs.frappe.io/erpnext/credit-limit); [Frappe supports customisation](https://frappe.io/framework/customisation). Do not claim those features are unique to this demo.

The value to test is fewer handoffs, clearer exceptions, a purpose-built role workspace and faster evidence retrieval. Measure a complete scenario against their actual setup after discovery. A custom application can be built on Frappe, alongside ERPNext or independently. Compare delivery cost, upgrades, control of the user experience, integration effort and maintenance before committing to replacement. Company-owned software and open-source frameworks are compatible choices.

## 2. Solution analysis and data model

### Unit conversion options

| Approach | Simplicity | Error risk | Training effort | Reporting accuracy |
| --- | --- | --- | --- | --- |
| Separate SKU and balance for every selling unit | Simple initial entry; conversion transfers multiply | High: the same physical stock can be counted twice | Medium: staff transfer bags/kg/pieces manually | Fragile across units and returns |
| One stock unit per product, approved alternate factors | Low ongoing complexity | Low for fixed factors; variable factors need verification | Low: select quantity/unit and inspect conversion | Strong: all movements reconcile in one unit |
| Dual quantity / batch-specific catch-weight inventory | Most complex | Low when actual count and weight are captured correctly | High: weighing/counting and batch selection required | Best where weight-to-count varies materially |

**Selected demo approach:** one stock unit with per-product factors. Use measured counts for variable products and visibly flag estimated weight-to-count factors. Promote to batch-specific actual counts only if discovery proves that variability requires it. A universal kg-to-pieces conversion is invalid.

### Supplier-credit options

| Approach | Simplicity | Error risk | Training effort | Reporting accuracy |
| --- | --- | --- | --- | --- |
| Notes on quotations plus independent payable list | Easy to start | High: staff lose the relationship | Low initially, high reconciliation effort | Weak attribution of incoming cash to obligations |
| Explicit sourcing link, fixed supplier terms, collection-linked recommendation | Moderate; small set of linked records | Low with capped allocation and due-date visibility | Moderate: choose supplier, terms and fulfilment | Strong separation of receivables, payables and cash |
| Pay-when-paid obligation activated by a contractual trigger | More policy complexity | High if assumed without supplier agreement | High: define qualifying receipt and deadlines | Accurate only when contract terms genuinely support it |

**Selected demo approach:** explicit sourcing link and fixed due date. A quote requests sourcing; it does not create an accounting liability. In the demo, conversion to a sale requires confirmation that the sourced goods were fulfilled and a supplier invoice received. That step records the demo payable. In production, the payable belongs to the verified purchase invoice event, independently of sale timing.

A customer receipt updates a suggested funding allocation. It never marks the supplier paid or changes the contractual due date. The overdue supplier alert remains even if the customer has paid nothing. No supplier-payment execution is included.

### Calculation contract

- Money: integer halalas for posted totals. Quantity: base units at six decimal places. Parse decimal conversion factors as rational values; round base quantities once to the allowed precision. Reject unsupported precision or unsafe magnitudes.
- Unit price: demo prices derive from the base-unit sales price; displayed unit prices are indicative to two decimals. Line net uses the base quantity and base price before rounding to halalas. A future separate price list per unit is a distinct choice.
- VAT: 15% per line, rounded to halalas; grand total = sum of rounded net plus rounded VAT. Snapshot conversion factor, quantity, rate and tax result on submitted documents.
- Availability = on hand minus reserved. A quotation does not reserve stock. Recheck the whole quotation at conversion; repeated lines share the same remaining available quantity.
- Source only the shortage. Local delivery reduces local stock; direct supplier fulfilment does not create phantom local stock. Supplier receipt into a warehouse would need separate inbound/outbound movements in production.
- Customer outstanding = posted invoice gross minus allocated receipts. Keep SAR and USD totals separate. Missing limit is unknown. Do not calculate available credit without an exposure policy.
- Receipt reference is unique; reject zero, negative, overpayment and duplicate allocations. A converted quotation cannot convert again.
- Supplier recommendation = rounded(supplier gross × collected fraction of linked sale) minus supplier payments made, capped at remaining payable. It is a demo funding rule, not an accounting or legal assertion.

### Reproducible example

| Event | Result |
| --- | --- |
| Cement: 50 bags × 50 kg × SAR 0.35/kg | SAR 875.00 net; SAR 131.25 VAT |
| Screws: 10 dozen × 12 pcs × SAR 0.25/pc | SAR 30.00 net; SAR 4.50 VAT |
| Quotation total | SAR 1,040.75 |
| Screw stock: 24 pcs | 24 locally fulfilled; 96 sourced from Najd Supply |
| Supplier cost: 96 × SAR 0.15 + 15% demo VAT | SAR 16.56 payable, due 7 November |
| Customer receipt: SAR 500.00 | Customer balance SAR 540.75; recommended supplier allocation SAR 7.96 |
| Supplier remains unpaid | SAR 16.56 debt and 7 November due date unchanged |

### Edge cases

| Case | Demo behaviour | Later validation |
| --- | --- | --- |
| Half a cement bag | 0.5 bag = 25 kg; allowed for this fictional SKU | Confirm break-pack policy and packaging cost |
| Pounds | 1 lb = 0.45359237 kg; stock quantity rounded to six decimals | Choose scale precision and accumulated tolerance |
| Screws/kg | 200 pcs/kg is product-specific and requires confirmation; fractional pieces rejected | Actual measured count or shipment-specific factor |
| Factor changes after a quote | Submitted quantity/factor is retained | Version factors and handle revisions/returns |
| Multiple lines of one product | Allocate availability across lines once | Reservation/concurrency policy on server |
| Partial receipts | Allocate to one selected invoice; preserve remainder | Support many-invoice allocations and unallocated advances |
| Supplier already overdue | Show overdue even while customer remains unpaid | Escalation policy and payment approval |
| Returns, refunds, disputes | Outside interactive demo; no silent balance edits | Reversal entries, stock disposition and approved reconciliation |
| Browser refresh / role change | Session data persists; chats clear on role change | Server sessions, audit and revocation |

### Entities and relationships

| Entity | Key fields | Relationships / rule |
| --- | --- | --- |
| User | id, role, team, name | Employee owns records; manager scopes to team; executive company-wide |
| Customer | id, ownerId, teamId, name, nullable limit | Has quotations, sales and tasks |
| Supplier | id, teamId, name | Has sourced line allocations and payables |
| Product | id, SKU, baseUom, wholeNumber, team/location, base sales price, cost | Has conversions and movements; location scopes stock |
| Unit conversion | productId, UOM, factor, estimated flag | Decimal/rational factor; snapshot on document line |
| Stock movement | productId, base quantity delta, reference, date, location | Receipts positive, local deliveries negative; initial balance seeded |
| Quotation / line | customer, owner, status, unit qty, factor, net, VAT, sourcing choice | Draft → Sent → Converted; duplicate conversion blocked |
| Sourcing allocation | lineId, supplierId, local/sourced quantity, agreed due date | Embedded on demo line; production separates fulfilment and invoice links |
| Sale / invoice | customer, owner, currency, date, due, gross, lines | Posted demo invoice; multiple receipts; linked payables |
| Customer payment | id, reference, date, saleId, amount | Demo allocation is one-to-one per entry; many payments per sale |
| Supplier payable | id, supplierId, saleId, amount, paid, due, terms | Obligation is independent; funding recommendation is derived |
| Task | customerId, owner, team, due, state, outcome, promise, review comment | Open/Returned → Submitted → Approved or Returned |
| Event | actor, action, recordId, time | Session audit trail; production needs immutable server timestamps |

The demo models these in one browser store. A production schema should normalise payment allocations, fulfilment, purchase invoices and stock locations; do not turn this prototype into a live ledger by merely adding login.

## 3. Design system

### Palette — proposed identity

Use steel-blue structure, clean white working surfaces and restrained safety-amber emphasis. These are industrial cues, not verified official brand colours. The `dm` mark is a demo monogram, not the official logo.

Ratios below were calculated using WCAG relative luminance. Pair order is foreground/background. Do not use colour alone to communicate state.

| Token | Colours | Contrast | Intended use |
| --- | --- | --- | --- |
| Primary | white / `#183B50` | 11.80:1 | Main action and navigation; steel structure |
| Secondary | `#235D78` / white | 7.22:1 | Links and secondary emphasis |
| Neutral dark | `#162E3B` / white | 14.11:1 | Body text and numerical evidence |
| Neutral light | `#F3F5F6`; white panels | Decorative surface | Cool, paper-like workspace without warm cream |
| Muted text | `#526875` / white | 5.84:1 | Labels and explanatory text |
| Accent | `#162E3B` / `#E5AC38` | 6.91:1 | Safety signage cue; occasional attention/action |
| Success | `#176748` / `#E7F3ED` | 6.01:1 | Approved/available labels |
| Warning | `#755000` / `#FFF2D7` | 6.52:1 | Shortage, estimated conversion |
| Overdue/danger | `#A82F36` / `#FBE9E9` | 5.74:1 | Overdue and validation error |
| Info | `#235D78` / `#EDF5F9` | 6.54:1 | Source/freshness explanations |

### Typography and layout

Use locally available Arabic-capable system fonts: Arial Bold for headings, Tahoma for body and form controls, with the other as fallback. No external font request is needed. Localise language and layout together; mixed record IDs and monetary amounts remain isolated left-to-right. Core navigation, forms and feedback are available in Arabic. Mock assistant prose and the presenter guide remain English in this build and require editorial localisation before a fully bilingual presentation.

| Level | Size / weight / line height |
| --- | --- |
| Presentation headline | 49px / 700 / 1.15; 35px on mobile |
| Page title | 30px / 700 / 1.3; 26px on mobile |
| Section title | 18px / 700 / 1.4 |
| Subheading | 15px / 700 / 1.5 |
| Body / inputs | 14px / 400 / 1.6 |
| Helper text / table labels | 12px / 400–600 / 1.5; avoid essential tiny labels |
| Numeric summaries | 27px / 700 / 1.6; tabular figures where supported |

Spacing base: 4px; use 8/12/16/24/32 for gaps. Desktop: 224px sidebar, 76px header, flexible work area with maximum 1600px. Forms use two columns; related line controls use three. At 800px the sidebar becomes an operable drawer; forms and metrics collapse progressively. Tables scroll horizontally with stable headers, never hide money columns to fit.

Panels: 6px corners; controls: 4–5px; chat: 8px; status labels: 3px. Use borders between records, shadows only for floating chat/mobile navigation. Maintain dense 48–64px rows and at least 42–44px primary control targets. Avoid identical floating KPI cards: use one divided summary strip and a prioritised exception table. Numbers and labels carry meaning without decorative progress bars.

### Components and states

| Component | Contract and states |
| --- | --- |
| Table | Semantic headings; textual status and source; empty row; scroll container; links open the exact record |
| Field | Persistent label, correct input type, inline fixable error, required indicator via native validation; focus returned to error |
| Unit picker | Only approved product units; adjacent `qty × factor = stock qty`; estimated-factor confirmation |
| Badge | Text plus colour: Draft, Sent, Submitted, Approved, Returned, Overdue; never a coloured dot alone |
| Task row | Owner, due, customer and state; click opens outcome/history |
| Approval panel | Outcome first; comment required on Return; no self-approval |
| Chat panel | Suggested questions, user/assistant distinction, exact-record links, ambiguity choices and generic access refusal |
| Toast | Concise confirmation through an aria-live status; never the only error explanation |
| Drawer / overlay | Chat is nonmodal; Escape closes; mobile navigation toggle stays operable; no viewport-wide invisible overlay |
| Empty state | Explain absence and give a relevant next action, such as Create quotation |
| Loading state | Static status text and placeholder rows; avoid needless motion |
| Error state | Explain retry; do not substitute zero or show stale figures as current |
| Destructive reset | Explicit browser confirmation; only fictional session data is affected |

Keyboard: logical tab order, visible focus, native selects, submit via keyboard, skip link in the authenticated workspace. Focus goes to the page heading/workspace after navigation. Respect reduced motion. WCAG AA is a design target; passing colour checks and smoke tests does not constitute an accessibility audit.

## 4. Permissions and information architecture

### Access rules shared by screens and chat

An employee sees records where `ownerId = signedInUser.id`. A manager sees records where `teamId = manager.teamId`. Executives see all demo business records. Product availability is location/team scoped for employees and managers; executives see all locations. Each record lookup and action checks scope again, including direct navigation. New quotations inherit the selected customer's owner and team.

Warehouse actions need the manager/executive capability in this three-account demo. A real warehouse operator capability can be assigned independently of executive rank after discovery. A manager is not automatically authorised to the East team merely because they have a higher role than an employee.

| Screen / action | Employee | Manager | Executive |
| --- | --- | --- | --- |
| Overview | Own receivables, quotations and tasks | Team summaries and stock exceptions | Company summaries and drill-down |
| Task list/detail | Assigned records; log outcome and submit own task | Team records; approve/return others, reassign within team | All records; same explicit review actions |
| Review queue | Hidden; direct access denied | Submitted team work | All submitted work |
| Credit desk/customer | Assigned customers and their invoice evidence | Team customers | All customers |
| Quote list/new/detail | Own scope; create/send/convert fictional records | Team scope | All scopes |
| Sales/receipts | Assigned invoices; record SAR demo receipt | Team invoices/receipts | All invoices/receipts |
| Warehouse stock | Read own location quantities and sales prices | Team stock; add product and receive | All stock; add/receive to demo Central location |
| Product editor / receipt | Hidden; action denied | Allowed for team | Allowed |
| Supplier payable list/detail | Hidden; see fulfilment status only on own sale | Team obligations and recommendations | All obligations |
| Team performance | Hidden | Team employees | All employees |
| Assistant | Same record and field restrictions | Same team scope | All business records |
| Guide / language / demo account switch | Available | Available | Available |

### Field-level disclosure

| Field group | Employee | Manager | Executive |
| --- | --- | --- | --- |
| Customer ID/name/assigned owner, invoice dates, gross/paid/outstanding, currency, nullable credit limit | Own customer scope | Team | All |
| Product ID/name/UOM factors, sales rate, on hand/reserved/available, location | Own location | Team | All |
| Product cost, stock cost value, supplier amount/due/funding recommendation | Omitted, not shown as zero | Team | All |
| Own task outcome/promise/review comment | Visible | Team visible | All visible |
| Other-team record names, counts, suggestions, chat history | Not disclosed | Not disclosed | Visible |
| Credentials, real bank details, real personal/contact/tax IDs | Absent from all fixtures | Absent | Absent |
| Available credit, profitability forecast or automatic credit approval | Not calculated | Not calculated | Not calculated |

The front-end fixtures remain inspectable by a browser owner. The disclosure rules describe the UI and demo action boundary, not a production security guarantee. Clear chat history when switching demo accounts.

### Complete sitemap

All roles: S01 Account selection → S02 Overview → S03 Tasks → S04 Task detail; S06 Credit desk → S07 Customer; S08 Quotations → S09 Builder → S10 Preview; S11 Sales → S12 Invoice/receipt; S13 Stock; S19 Guide. Global S20 Assistant is available on every authenticated screen.

Manager and executive additionally: S05 Review queue → S04; S14 New product → S15 Receive stock → S13; S16 Supplier payables → S17 Payable; S18 Team performance. Executive uses the same routes with company scope. This avoids duplicate layouts with different financial definitions.

Navigation: persistent sidebar on desktop; explicit menu toggle on narrow screens; workspace breadcrumb; scoped customer search in the header; persistent assistant entry. Changes in one route update all consumers of that record.

## 5. Step-by-step flows and failures

### A. Employee follow-up

Account Mona → Overview priority → Tasks → T1 → record call outcome and optional promise date → Submit for review → Submitted state. It remains pending until a reviewer approves. Empty outcome blocks submission. Returned work shows the manager's comment and can be corrected and resubmitted. Unassigned task IDs return a generic unavailable state.

### B. Manager sign-off

Switch to Khalid → Review queue → submitted task → read outcome → Approve, or enter a reason and Return → queue and performance counts recalculate. Reassignment offers Central team assignees only. A task cannot be reviewed twice from an invalid state or approved by its assignee.

### C. Mixed-unit quotation and sale

Mona → New quotation → C101 → 50 cement bags + 10 dozen screws → inspect base quantities → source shortage from Najd Supply with due date → Preview → Send (simulation) → confirm supplier fulfilment/invoice → Convert. Quotation becomes Converted with a single sale link; local stock falls, receivable and linked payable appear. Missing supplier, invalid quantity, fractional pieces or unconfirmed measured factor prevents progress. Recheck availability at conversion; source allocations are not a promise of stock reservation.

### D. Partial collection

Sale → enter SAR 500 and unique receipt reference → Record → receipt appears in history; outstanding becomes SAR 540.75; manager can see SAR 7.96 recommended against the supplier amount. Duplicate reference and overpayment are blocked. Supplier remains unpaid and due on its original date.

### E. Warehouse

Khalid → Warehouse → New product → name/SKU/base kg/alternate bag/factor 50/rates → Create → Receive → enter units, quantity and receipt reference → Receive → movement and availability update. Duplicate SKU/reference, nonpositive factor and fractional piece count are blocked. Employee has read-only warehouse access. Quantity-based receipt controls operate on the selected product, not a hardcoded SKU.

### F. Executive investigation

Sara → Overview overdue receivables → customer → source invoice → owner and follow-up → Team performance. All metrics are derived from shared records and retain currency scope. Stock value uses fictional unit cost and is explicitly not an approved inventory valuation method. Loading/error states withhold values.

### G. Assistant

Any authenticated page → Assistant → ask `C101 balance`, `Al-Rimal balance`, `Which invoices are overdue?`, stock or quotation question → scoped answer → exact-record link. Ambiguous customer names produce choices. Employee asking `Eastern Works (demo) balance` receives a generic refusal without disclosing totals. Unknown questions receive supported examples, never invented answers. Mock intents are explicit; no LLM is connected.

## 6. Screen-by-screen wireframes

Every authenticated screen inherits the sidebar/header, clear synthetic-data marker, global assistant, scope checks, keyboard focus and presenter controls for loading/empty/error states. Each screen below specifies its local states as well. Transitions use direct navigation; no entrance animations. Submitted data persists in session storage; role switching preserves records and clears chat.

### S01 — Account selection

Purpose/access: everyone; three fictional accounts and the language choice.

```text
+--------------------------+---------------------------+
| dm · Durar Masagh         | English / العربية         |
| Every order. Every unit.  | Choose a workspace        |
| One clear picture.       | [Mona — Employee]         |
| Industrial grid motif    | [Khalid — Manager]        |
|                          | [Sara — Executive]        |
| Presentation prototype   | Fictional data notice     |
+--------------------------+---------------------------+
```

Priority: purpose, account selection, disclosure. Account click opens S02. Storage failure warns that refresh loses changes; it does not block the demo. No pretend password form or fake authentication promise.

### S02 — Role overview

Purpose/access: own/team/company summary according to role.

```text
Sidebar | Date / scope                         [New quote]
        | Receivables | Overdue | Pipeline | Awaiting review
        | Receivables needing attention | Stock exceptions
        | Customer → invoice → owner    | Collection priority
        | Work in progress              | Supplier exposure*
```

Data: derived SAR totals; USD visibly separate in credit desk; *supplier exposure for manager/executive only. Exceptions precede charts. Empty scope invites a quotation; source error removes financial totals; loading has status text. Customer opens S07, invoice S12, task S04.

### S03 — Tasks

Purpose/access: list scoped follow-up work.

```text
Tasks & follow-ups
Task / customer | Owner | Due | State | [Open]
T1 C101         | Mona  | ... | Open  | ...
```

State text distinguishes submitted from approved. Empty says no assigned work. Loading/error replace rows. Open → S04; reviewed tasks remain visible in their final state.

### S04 — Task detail and review

Purpose/access: employee records outcome; manager/executive reviews scoped work.

```text
Task title / customer                        [State]
Outcome textarea              | Customer context [Open]
Promise date (optional)       | Reassign within team*
Manager feedback, if returned |
[Submit for review] or [Return + comment] [Approve]
```

Data: owner, due, outcome, promise, review comment. Missing outcome/return reason gets inline error. Wrong state or owner blocks action. Successful review changes queue and performance; S07 gives evidence. No outcome is a local empty state.

### S05 — Review queue

Purpose/access: manager team / executive all submitted tasks.

```text
Review queue                         2 awaiting sign-off
Task / customer | Owner | Due | Submitted | [Review]
```

Open → S04. Empty: no work awaiting sign-off. Loading/error replace rows. Approved/returned tasks leave the queue immediately; they remain in S03.

### S06 — Credit desk

Purpose/access: scoped customer search and currency-separated balances.

```text
Credit desk
[Customer name or ID________________] [Search]
Customer / owner | SAR outstanding | USD outstanding | Limit | View
```

Names never auto-select ambiguous matches. Null limit displays Unknown; a verified settled account displays zero. No matches is a true empty result, not a zero balance. Loading/error hide amounts. View → S07.

### S07 — Customer credit record

Purpose/access: show the customer's evidence and responsibility.

```text
Customer name · ID · owner
Source / as-of / exposure-policy note
Invoice | Due | Total by currency | Outstanding | Open
Follow-up history / tasks
```

Data: scoped invoices and receipts; no fabricated document PDF. Empty invoices are identified as absent records. Unknown/inaccessible ID produces generic unavailable state. Invoice → S12; task → S04. Failure never becomes zero.

### S08 — Quotation register

Purpose/access: scoped quotation lifecycle list.

```text
Quotations                                  [New quotation]
Reference | Customer | Gross SAR | Draft / Sent / Converted | Open
```

Empty has Create first quotation → S09. Loading/error replace list. Sent is a simulated communication state; no real message is dispatched. Open → S10.

### S09 — Quotation builder

Purpose/access: authorised customer and location product selection.

```text
Customer [select]
Product [select] | Unit [select] | Quantity [input]
qty × factor = base quantity     Available / net amount
Shortage → Supplier [select] | Agreed due [date]
[Add product]                      Subtotal / VAT / Total
[Cancel]                           [Preview quotation]
```

Quantity inputs recalculate as the user types; totals are shared logic and focus stays in the edited field. Estimated factor asks for confirmation. Removing all lines yields a fixable validation message. Missing source, invalid quantity and unknown factor block preview. Customer switch preserves scope checks. Preview → S10 with a saved draft. Line values must never be reset by unrelated field edits.

### S10 — Quotation preview / send / convert

Purpose/access: inspect the immutable calculated draft and advance it.

```text
Q reference · Customer             Draft → Sent → Sale
Durar Masagh / quotation / demo marker
Product | Sold quantity/unit | Base qty | Net
Subtotal / VAT / Total
[Print] [Send quotation — simulation]
After send: [Confirm fulfilment + supplier invoice] [Convert]
```

A sent quote cannot be sent twice; conversion creates one sale only. Missing fulfilment confirmation is inline. Concurrent stock shortage requires a valid sourcing choice. Converted state links S12. Printing includes the synthetic-data notice and excludes navigation/chat.

### S11 — Sales and receipts register

Purpose/access: scoped posted invoices with payment state.

```text
Sales & receipts
Invoice / customer | Due | Gross / currency | Outstanding | Open
```

Zero outstanding remains visible. Loading/error withhold amounts. Empty links back to quotation creation. Open → S12; no bulk financial mutations.

### S12 — Invoice detail / record receipt

Purpose/access: record authorised demo collections and inspect evidence.

```text
Invoice / customer                 [Open / Paid / Overdue]
Gross / Outstanding / Due          | Amount received
Line evidence and owner            | Unique reference
Receipt history                    | [Record payment]
Supplier fulfilment / AP links*     |
```

*Only manager/executive sees supplier amounts and links. Employee sees fulfilment status. Blank, negative, duplicate and excessive receipts are blocked. Paid invoice hides entry; USD read-only entry explains the demo limit. On success all summaries and S17 recommendation update. No receipt history displays an empty table.

### S13 — Warehouse stock

Purpose/access: location quantities for all; costs/actions for manager/executive.

```text
Warehouse                         [New product]* [Receive]*
Product/SKU | On hand | Reserved | Available | Factors | Cost value*
Recent movements: product / signed base qty / reference
```

Low stock uses label plus colour. No movements is a valid empty state. Loading/error replace stock rows. *Capabilities omitted for employees. New → S14; Receive → S15. No fake stock adjustment button.

### S14 — New product

Purpose/access: manager/executive creates a fictional master record.

```text
Name [____]               SKU [____]
Base unit [kg / pcs]      Alternate unit [____]
Base units per alt [___]  Sales price / base [___]
Cost / base [___]         [ ] Factor needs verification
[Cancel]                                      [Create product]
```

Duplicate SKU, missing name, invalid factor or fractional piece conversion blocks save. Initial stock is zero; creation → S15 to record an actual movement. Empty form supplies labels and examples; loading/error preserves typed inputs.

### S15 — Stock receipt

Purpose/access: manager/executive records a team-location receipt.

```text
Product [select]       Receiving unit [select]
Qty [____]            Unique receipt reference [____]
Destination location
[ ] Verified product-specific conversion
                                         [Receive stock]
```

Product changes refresh valid units. Duplicate reference and nonpositive quantity block posting. Successful receipt → S13 with a movement and updated stock. Error preserves form values. With no products, prompt S14.

### S16 — Supplier payable register

Purpose/access: manager team / executive company obligations.

```text
Supplier obligations
Due dates remain independent of collection timing
Supplier / sale | Unpaid | Due / overdue | Funding suggestion | Review
```

Empty: no obligations created; quotations alone do not create one. Loading/error hide values. Review → S17. No Pay button because this prototype does not execute supplier payment.

### S17 — Supplier obligation detail

Purpose/access: inspect linked funding and due-date risk.

```text
AP reference / supplier
Unpaid amount | Contract due | Collection-linked recommendation
Calculation explanation / overdue warning
[View linked customer invoice]
```

Missing/inaccessible AP gives unavailable state. Zero customer collections produces zero suggested funding while debt remains. Loading/error do not erase overdue status by showing zero debt. Open → S12. Text distinguishes recommendation from cash paid.

### S18 — Team performance

Purpose/access: manager team / executive all employees in scope.

```text
Team performance
Employee | Open / returned | Awaiting review | Approved
```

Counts are computed from task states, not seeded dashboard totals. Empty: no scoped tasks. Loading/error replace metrics. Inspect actual task evidence through S03/S05; don't invent productivity scores or rankings.

### S19 — Presenter guide

Purpose/access: all demo accounts; presentation instructions and reset.

```text
Five-minute possibility
1 → 2 → 3 … role / route / expected result
What is simulated; next validation step
[Reset demo records]
```

Reset needs confirmation and restores the shared fixtures. Cancelling preserves work. Guide content is static; no network loading needed. An English presenter guide is supplied; Arabic editorial review remains a follow-up.

### S20 — Global assistant panel

Purpose/access: same role scope as the surrounding application.

```text
Operations assistant · Mock                  [Close]
User question
Answer / as-of / source
[Exact record link] or [Choose customer A/B]
Suggested questions
[Question________________________] [Send]
```

Unknown query suggests supported topics; ambiguity asks for selection; denied request exposes no record details. Empty chat invites a question. No artificial typing delay is needed for deterministic answers. Clear history on account switch. Escape closes; link navigates to the authorised route. Typed content is escaped, including HTML-like strings.

## 7. Red flags to avoid

| Common trope | Replacement |
| --- | --- |
| Construction stock photo behind every dashboard | Use product vocabulary, quantity rules and real workflow evidence |
| Endless coloured metric cards | One summary strip with an ordered exceptions table |
| Giant ERP form exposing every possible field | A short task-specific form with source/terms visible when needed |
| Green credit score with no policy or source | Currency-separated amounts, dated invoices and explicit unknowns |
| Chatbot presented as the financial authority | Deterministic numbers, scoped records and evidence links |
| Decorative bilingual toggle that only flips direction | Translate core navigation/forms; isolate IDs and disclose remaining untranslated content |
| “Our software beats ERPNext” without observing their version | Demonstrate an interaction, then benchmark against their real workflow |

## 8. Five-minute management demo

Reset records and select English before the run. Use 1440px for projection; show mobile navigation only if relevant. All transactions are fictional.

| Time | Account / exact action | Value to explain |
| --- | --- | --- |
| 0:00–0:25 | Mona → Overview | An employee immediately sees their own priorities and evidence |
| 0:25–1:20 | New quotation → 50 bags cement, 10 dozen screws → Najd Supply for shortage → Preview | Unit conversion and shortage sourcing in the same workflow; 96 screws sourced |
| 1:20–1:50 | Send simulation → confirm supplier fulfilment/invoice → Convert | One shared order changes stock and creates traceable obligations |
| 1:50–2:25 | Enter SAR 500 and `DEMO-RCPT-003` → Record payment | Customer balance becomes SAR 540.75 without spreadsheet reconciliation |
| 2:25–3:00 | My tasks → T1 → outcome/promise → Submit | Work has an accountable handoff rather than an unreviewed Done flag |
| 3:00–3:45 | Switch Khalid → Review queue → approve T1 → Supplier payables → new AP | Manager sees the same work; SAR 7.96 suggested supplier funding while SAR 16.56 debt and due date remain |
| 3:45–4:15 | Warehouse → Receive cement → 1 tonne → reference `DEMO-GR-001` | Purchasing and selling units reconcile to kg; full new-product form is available for questions |
| 4:15–4:40 | Switch Sara → Overview → Eastern Works customer | Executive scope includes another team; figures come from the same records |
| 4:40–4:55 | Switch Mona → assistant → `Eastern Works (demo) balance` | Access refusal; optional `Al-Rimal balance` shows ambiguity handling |
| 4:55–5:00 | Close with a follow-up proposal | Ask for a sponsor and a discovery session to validate their real ERPNext process |

Optional two-minute Q&A path: create a product, receive it, return a task with a comment, switch Arabic, try duplicate receipt or half bag. The five-minute run is a rehearsal target, not a measured claim of staff time savings.

## 9. Build plan and acceptance milestones

### Chosen demo stack

Buildless HTML, CSS and browser ES modules. The brief needs deterministic forms and session state; no backend, framework, authentication provider or AI service is required for the prototype. Keep source separate from generated output; this repo's old `dist/` prototype was ignored by Git and is superseded by tracked files.

```text
demo/
  index.html       entry point
  styles.css       responsive layouts, RTL, print and focus
  model.mjs        fixtures, scope rules, arithmetic, transitions
  app.mjs          routes, components, event handling, session storage
  checks.mjs       meaningful money/access/workflow checks
docs/
  DEMO_UX_PLAN.md  this specification and presentation script
```

### Implementation order

1. Evidence/assumptions: company research, corrected scope, comparison and role policy. Accept when facts and proposals are visibly distinguished.
2. Shared model: units, money, stock availability, roles, sale and receipt lifecycle. Accept when known scenarios reconcile and invalid actions fail.
3. Shell: account selector, routes, mobile menu, language direction and core translations. Accept when each role can navigate its scope on desktop and mobile.
4. Sales workflow: quotation editor, source selector, preview/send simulation, conversion and invoice evidence. Accept when changing quantities and repeated product lines do not oversell local stock.
5. Collections/payables: receipt allocation and supplier recommendation. Accept when partial receipt, duplicate and overpayment cases work and due dates remain independent.
6. Work management: submit/review/return/reassign. Accept when one role's work appears in the next role's queue with no double approval.
7. Warehouse: product creation, unit verification, stock receipt and movement list. Accept when product-specific receipt works and employee mutations fail.
8. Dashboard/chat: derive metrics; scoped intent responses and source links; no fake company-wide totals. Accept cross-team refusal and ambiguous customer selection.
9. Verification: automated checks; browser walkthrough, desktop/mobile/RTL and keyboard inspection; fix concrete issues. Rehearse the script, then package a private shareable version.

### Test and publication contract

Run `node demo/checks.mjs`, `node --check demo/app.mjs`, and `git diff --check`. Browser QA must traverse the quotation → sale → receipt → manager payable journey, task review, warehouse receipt, employee/executive scope, Arabic direction, mobile menu and reload persistence. This is a demo acceptance check, not production certification.

Save all source in Git; hosting uses `demo/` as the static directory. Private hosting is for fictional presentation data only. No company data, production connector or live model is introduced. Production remains a separate discovery, authorisation and validation phase.

### Verification record — 2 November 2026

- Automated model checks passed: unit conversion, VAT, role scope, task return/resubmit/approval, quote conversion, stock, duplicate/overpayment rejection and supplier due-date invariants.
- Browser walkthrough passed: the sample quote totalled SAR 1,040.75; a SAR 500 receipt left SAR 540.75; the manager saw a SAR 7.96 funding recommendation against the unchanged SAR 16.56 supplier obligation.
- Browser task submission and manager approval passed after correcting form dispatch. New-product creation and receipt of two 50 kg rolls produced 100 kg of stock. Session reload preserved records.
- Employee and executive views showed their respective scopes. The employee assistant refused Eastern Works and requested clarification for the two Al-Rimal customers.
- Desktop (1440px), mobile (390px), menu navigation and Arabic/RTL inspected. Live quantity editing preserved focus and immediately recalculated totals.
- The simulated source-error screen hid its records; keyboard activation of Retry restored the quotation register.
- Limits: role selection is a browser simulation; no secure backend, ERP connection, OCR or live AI. Core Arabic UI is present; assistant prose and presenter guide remain English. Presentation date is fixed at 31 October 2026 for repeatable examples.
