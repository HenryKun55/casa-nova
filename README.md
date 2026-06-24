# Chá de Casa Nova — Henrique & Yasmim 💛

Site-memória do nosso Chá de Casa Nova (29 de março de 2026). O evento já
passou, e este cantinho ficou para lembrar com carinho de todo mundo que fez
parte — mostrando as mensagens que recebemos, com animação.

É um site **100% estático e offline** (sem banco de dados), publicado de graça
no **GitHub Pages**.

## Rodar localmente

```bash
bun install
bun run dev          # http://localhost:3000
```

## Gerar o site estático

```bash
bun run build        # gera a pasta ./out
```

## Deploy no GitHub Pages

O deploy é automático: a cada `push` na branch `master`, o workflow
`.github/workflows/deploy.yml` faz o build e publica.

Só é preciso habilitar uma vez:
**Settings → Pages → Build and deployment → Source: GitHub Actions.**

Depois disso o site fica em: https://henrykun55.github.io/casa-nova/

> O `basePath` `/casa-nova` é aplicado só em produção. Em `bun run dev` o site
> roda na raiz normalmente.

## Backup do banco (Neon)

Os dados originais do Neon estão salvos **localmente** na pasta `backup/`
(JSON de cada tabela, `full-backup.json` e `restore.sql`). Essa pasta está no
`.gitignore` porque contém dados pessoais (e-mails, WhatsApp) — **não** é
enviada ao GitHub.

Para refazer o backup (precisa do `DATABASE_URL` no `.env`):

```bash
bun run scripts/backup-db.ts
```

Para regenerar as mensagens do site a partir do backup:

```bash
bun run scripts/generate-messages.ts   # gera src/data/messages.json
```

Como o site agora é independente do banco, o Neon pode ser liberado para outro
projeto sem afetar este site.
