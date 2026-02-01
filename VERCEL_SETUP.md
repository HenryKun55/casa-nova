# Configuração da Vercel

Este guia explica como configurar as variáveis de ambiente na Vercel para o projeto funcionar corretamente.

## Variáveis de Ambiente Necessárias

### 1. Database
- `DATABASE_URL` - URL de conexão com o banco de dados PostgreSQL (Neon)

### 2. NextAuth.js
- `NEXTAUTH_SECRET` - Chave secreta para NextAuth (gerar com `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL do seu site na Vercel (ex: `https://seu-site.vercel.app`)

### 3. Google OAuth
- `GOOGLE_CLIENT_ID` - Client ID do Google OAuth
- `GOOGLE_CLIENT_SECRET` - Client Secret do Google OAuth

### 4. Administradores
- `ADMIN_EMAILS` - Lista de emails separados por vírgula (ex: `email1@gmail.com,email2@gmail.com`)

### 5. UploadThing
- `UPLOADTHING_TOKEN` - Token do UploadThing
- `NEXT_PUBLIC_EVENT_DATE` - Data do evento (formato: YYYY-MM-DD)

### 6. **Serper API (IMPORTANTE para a busca com IA)** ⚠️
- `SERPER_API_KEY` - Chave da API do Serper para busca de produtos

**ATENÇÃO**: Esta variável é **obrigatória** para a funcionalidade de busca de produtos com IA funcionar na Vercel!

Valor atual: `e434905860f238956fb2914c741cbd02387d300d`

## Como Adicionar Variáveis na Vercel

### Método 1: Via Dashboard
1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável com seu valor correspondente
4. Selecione os ambientes (Production, Preview, Development)
5. Clique em **Save**

### Método 2: Via CLI
```bash
# Instale a CLI da Vercel (se ainda não tiver)
npm i -g vercel

# Faça login
vercel login

# Adicione as variáveis
vercel env add SERPER_API_KEY
# Cole o valor quando solicitado: e434905860f238956fb2914c741cbd02387d300d

# Repita para as outras variáveis...
```

### Método 3: Via arquivo .env (Vercel irá detectar automaticamente)
A Vercel permite fazer upload de um arquivo `.env` diretamente:

1. No dashboard do projeto, vá em **Settings** → **Environment Variables**
2. Clique em **Import .env**
3. Cole o conteúdo do seu `.env.local`

## Verificação

Após adicionar as variáveis:
1. Faça um novo deploy (ou force redeploy)
2. Teste a funcionalidade de busca com IA
3. Verifique os logs da Vercel em **Deployments** → [seu deploy] → **Function Logs**

Se ainda houver erro 500, verifique os logs da função para ver mensagens detalhadas de erro.

## Troubleshooting

### Erro 500 na busca com IA
- ✅ Verifique se `SERPER_API_KEY` está configurada
- ✅ Verifique se você está autenticado (NextAuth funcionando)
- ✅ Verifique os logs da função na Vercel
- ✅ Teste localmente primeiro com `bun run dev`

### Imagens não carregam
- As imagens do Serper vêm de `*.gstatic.com`
- Já configurado no `next.config.ts`, mas se persistir, adicione domínios específicos

### Timeout
- A Vercel tem limite de 10s para funções serverless no plano gratuito
- Se necessário, considere aumentar o timeout ou usar plano pago
