## Setup

In the server folder, run the following commands:

```bash
npm install
```

```bash
cp .env .env.local
```

Then add your OpenAI API key to the `.env.local` file.

## Run the server

```bash
npx tsx server.ts
```

## Run parsing

Uncomment the parse.ts file and run it with the pdf file.

```bash
npx tsx parse.ts ./sides.pdf
```

## Run the full workflow

```bash
npx tsx index.ts
```