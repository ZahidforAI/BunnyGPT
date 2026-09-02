# BunnyGPT

BunnyGPT is the public, pre mint intelligence preview for BunnyHood. Visitors choose Quant, Trader, or Contrarian and can ask about BunnyHood, markets, crypto, AI, technology, and current events.

The production repository is organized as two Vercel Services:

```text
frontend/                     Native Next.js application
  app/api/chat/route.ts       Streaming proxy to the private backend
  components/bunny-gpt.tsx    Agent selection and chat interface
  lib/personalities.ts        Quant, Trader, and Contrarian profiles
  public/                     Official BunnyHood images
backend/                      Private FastAPI service
  app.py                      LangChain, search, prices, and SSE streaming
  bunnyhood-knowledge.ts      Official BunnyHood source of truth
  pyproject.toml              Vercel Python dependencies
vercel.json                   Service definitions, binding, and routing
scripts/dev.mjs               Combined local development launcher
```

## Local development

Copy `.env.example` to `.env`, add the real keys, then run:

```bash
npm --prefix frontend ci
python -m pip install -r requirements.txt
npm run dev
```

The command starts FastAPI at `http://127.0.0.1:8000` and Next.js at `http://localhost:5173`.

## Deploy to Vercel

1. Push the entire repository to GitHub.
2. In Vercel, select Add New Project and import the repository.
3. Keep Root Directory set to the repository root.
4. Set Framework Preset to Services. Vercel reads `vercel.json` and builds the two services independently.
5. Add these project environment variables for Production, Preview, and Development:

```text
OPENROUTER_API_KEY
OPENROUTER_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
OPENROUTER_SITE_URL=https://your-project.vercel.app
YOU_API_KEY
```

Do not add `LANGCHAIN_API_URL` in Vercel. The `frontend` service binding injects the correct private backend URL for every production and preview deployment.

6. Select Deploy. After the first deployment, replace `OPENROUTER_SITE_URL` with the real Vercel domain if necessary and redeploy.

The backend has no public rewrite. Browser requests go to the Next.js `/api/chat` route, which calls FastAPI through Vercel internal service networking. API keys stay server side.

## Checks

```bash
npm run typecheck
npm run lint
npm test
python -m unittest discover -s tests -p "test_*.py" -v
```

## Live information

Every non identity question uses live research. Current BTC, ETH, and SOL requests also receive a timestamped CoinGecko snapshot. Answers stream to the interface through Server Sent Events.

## Safety

The agents do not expose provider credentials, request seed phrases, claim unannounced BunnyHood details, or pretend to execute financial transactions. `.env` files are ignored by Git and must never be committed.
