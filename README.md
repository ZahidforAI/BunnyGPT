# BunnyGPT

BunnyGPT is the public, pre mint intelligence preview for BunnyHood. Visitors choose Quant, Trader, or Contrarian and can ask about BunnyHood, markets, crypto, AI, technology, and current events.

The production app uses Vercel's native Next.js and Python layout:

```text
api/index.py                  FastAPI function entrypoint
api/core.py                   LangChain, search, prices, and SSE streaming
api/bunnyhood-knowledge.ts    Official BunnyHood source of truth
pyproject.toml                Python dependencies
components/bunny-gpt.tsx      Agent selection and chat interface
lib/personalities.ts          Quant, Trader, and Contrarian profiles
public/                       Official BunnyHood images
scripts/dev.mjs               Combined local development launcher
```

## Local development

Copy `.env.example` to `.env`, add the real keys, then run:

```bash
npm ci
python -m pip install -r requirements.txt
npm run dev
```

The command starts FastAPI at `http://127.0.0.1:8000` and Next.js at `http://localhost:5173`.

## Deploy to Vercel

1. Push the entire repository to GitHub.
2. In Vercel, select Add New Project and import the repository.
3. Keep Root Directory set to the repository root.
4. Keep Framework Preset set to Next.js. Vercel packages `api/index.py` as the Python API function.
5. Add these project environment variables for Production, Preview, and Development:

```text
OPENROUTER_API_KEY
OPENROUTER_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=nvidia/nemotron-3.5-lightning:free
OPENROUTER_SITE_URL=https://your-project.vercel.app
YOU_API_KEY
```

6. Select Deploy. After the first deployment, replace `OPENROUTER_SITE_URL` with the real Vercel domain if necessary and redeploy.

The browser calls the same-domain FastAPI `/api/chat` function. API keys stay server side.

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
