## Setup

```bash
npm install
```

Add your OpenAI API key to the `.env` file.

## Run the reading portion

```bash
npx tsx --env-file=.env readthrough.ts
```

## Run parsing

```bash
npx tsx --env-file=.env parse.ts ./sides.pdf
```

## Run audio generation

```bash
npx tsx --env-file=.env index.ts
```
