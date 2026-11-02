# Durrar Masagh | Credit demo and platform plan

**Status:** interactive front-end demo and UX plan. The company develops software on ERPNext/Frappe; its configuration, data sources, workflows and future stack have not been confirmed.

## Aim

Present a connected operations demo using **synthetic records**. Browser-only changes demonstrate quotations, stock, receipts and task review across three roles. After the demo gets a green light, discover actual processes and validate a private, locally hosted pilot. No company records are connected.

## Read in this order

1. [PROJECT_CHARTER.md](PROJECT_CHARTER.md): purpose and enduring constraints.
2. [AGENTS.md](AGENTS.md): contributor rules.
3. [PRODUCT_SPEC.md](PRODUCT_SPEC.md): demo contract and later hypotheses.
4. [ARCHITECTURE.md](ARCHITECTURE.md): boundaries and proposed on-premise shape.
5. [ROADMAP.md](ROADMAP.md): detailed phases and exit gates.
6. [TASKS.md](TASKS.md): next concrete work.
7. [docs/OPEN_QUESTIONS.md](docs/OPEN_QUESTIONS.md): discovery questions.

Accepted decisions in [DECISIONS.md](DECISIONS.md) take precedence over proposals. Unanswered questions are not requirements. The old ERPNext investigation was removed because it concerned a public demo instance, not this company's confirmed environment; it remains in Git history if needed.

## Current next step

Read [the complete UX/UI plan](docs/DEMO_UX_PLAN.md), including comparison tables, permissions, 20 screen wireframes and the five-minute script.

## Run the demo

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory demo
node demo/checks.mjs
```

Open `http://127.0.0.1:4174`. Select Mona, Khalid or Sara. Data persists in browser session storage; the Demo guide includes a reset. Core controls support Arabic/RTL; mock assistant prose and the presenter script are English. Permissions are simulated in the browser and require server enforcement before production.

Source: `demo/index.html`, `styles.css`, `model.mjs`, `app.mjs`. No dependencies or local build step. For private hosting, `node demo/build.mjs` copies these four files into ignored `dist/`, the Sites output directory. Never place real company data there.
