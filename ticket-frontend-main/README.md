# Web frontend for ticket chain

Ticket chain is here: https://gitlab.com/chromaway/core/directory-chain/-/tree/dev/src/ticket_chain?ref_type=heads

## Configuration

Set these values in `.env` or `.env.local`:

* VITE_SYSTEM_CLUSTER_NODES
* VITE_AUTH_SERVER_FT4_URL

Use these value for Devnet2:

```
VITE_SYSTEM_CLUSTER_NODES=["https://node0.devnet2.chromia.dev:7740"]
VITE_AUTH_SERVER_FT4_URL="https://auth-server-ft4.devnet2.chromia.dev/"
```

## Running

```bash
npm run dev
```

or

```bash
npm run preview
```
