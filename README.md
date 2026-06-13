# Tax Product Recommender

AI-assisted tax software product recommendation website for a fictional tax software company.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Simulated AI assistant with API route

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to Run the App

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## Environment Variables

No API key is required because the project uses a simulated AI assistant.

If you later connect a real AI provider, keep the key in `.env.local` only:

```bash
OPENAI_API_KEY=your_key_here
```

Never expose API keys in frontend code.

## Implemented Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page with hero, CTAs, product preview, how-it-works, FAQ |
| `/products` | All products with search, filter, and sort |
| `/compare` | Feature comparison table |
| `/recommend` | Multi-step recommendation wizard |
| `/assistant` | Simulated AI assistant |
| `/admin/products` | Admin/config view with local edit mode, validation warnings, and JSON export |

## API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/products` | GET | Returns all structured product data |
| `/api/recommend` | POST | Accepts questionnaire answers and returns recommendation |
| `/api/assistant` | POST | Accepts a question and returns simulated assistant response |

## Product Data Structure

Products are stored in `src/data/products.ts`.

Each product includes:

- `id`
- `name`
- `price`
- `currency`
- `description`
- `bestFor`
- `category`
- `supports` feature map

Product data is not hardcoded inside UI components.

## Recommendation Engine

Recommendation logic lives in `src/lib/recommendation.ts`, separate from UI components.

Priority order:

1. Incorporated company
2. Expert Full Service
3. Expert Assist
4. Self-Employed
5. Premier
6. Deluxe
7. Free

The engine returns:

- recommended product
- price
- confidence
- reasons
- matched inputs
- optional upgrade
- warnings
- disclaimer

Validation and contradiction handling live in `src/lib/validation.ts`.

## AI Assistant

The assistant is implemented in `src/lib/assistant.ts` and exposed through `POST /api/assistant`.

It:

- accepts natural language input
- detects keywords and intent
- maps questions to product rules
- answers comparison and Free-eligibility questions
- returns structured responses
- includes disclaimers
- refuses unsafe tax-outcome guarantees

It does not provide tax, legal, financial, or accounting advice.

## Admin / Config Page

`/admin/products` displays product configuration in a readable admin view, including:

- product ID
- product name
- price
- best for
- supported features
- unsupported features

The page also supports local browser-only editing, schema-style validation warnings, and exporting the product config as JSON.

## Manual Verification

| Scenario | Expected Result | Verified |
| --- | --- | --- |
| Salary only | Free | Yes |
| Salary + donations | Deluxe | Yes |
| Investment income | Premier | Yes |
| Rental income | Premier | Yes |
| Freelance income | Self-Employed | Yes |
| Home-office expenses | Self-Employed | Yes |
| Wants expert help | Expert Assist | Yes |
| Wants expert to file | Expert Full Service | Yes |
| Incorporated company with revenue | Business Corporate | Yes |
| Incorporated company with no revenue | Nil Corporate Return | Yes |
| AI asked about refund guarantee | Safe disclaimer response | Yes |

How to verify locally:

1. Run `npm run dev`
2. Open `/recommend` and test the scenarios above
3. Open `/assistant` and ask the example questions
4. Confirm `/admin/products` shows all 8 products clearly

## UI Theme

The interface uses a tax-focused visual theme with emerald/teal trust colors, warm amber finance accents, soft gradient backgrounds, glass-style surfaces, responsive cards, and dark-mode support.

## Bonus Features Implemented

| Feature | Status |
| --- | --- |
| Product filters, search, and sort | Yes |
| Dark mode toggle | Yes |
| localStorage wizard persistence | Yes |
| Recommendation download / print-to-PDF | Yes |
| Editable admin config (local browser storage) | Yes |
| Admin JSON export + validation warnings | Yes |
| Automated recommendation engine tests | Yes (`npm test`) |
| CI workflow | Yes (`.github/workflows/ci.yml`) |
| Vercel deployment config | Yes (`vercel.json`) |
| Skip link + keyboard assistant submit | Yes |

## Known Limitations

- AI assistant is simulated, not connected to a live LLM API
- Admin local edits are browser-only and do not change source product data
- Multilingual support is not included
- Live deployment link depends on your hosting account

## Future Improvements

- Connect a real AI API provider
- Add multilingual support
- Add full admin schema editing for feature flags
- Deploy to Vercel and add live demo link

## Assumptions

- The assistant can be simulated because the assignment allows mock AI when no API key is available
- Product recommendations are product guidance only, not tax advice
- Deployment is optional but preferred

## Use of AI During Development

AI tools were used to assist with:

- project planning
- code structure
- recommendation logic review
- UI scaffolding
- README drafting
- simulated assistant behavior

All outputs were reviewed manually against the assignment PDF requirements. Core business logic, validation behavior, and safety responses were checked against the required scenarios.

What was written/reviewed manually:

- product data modeling
- recommendation priority rules
- wizard validation flow
- API route structure
- admin/config display
- manual verification checklist
