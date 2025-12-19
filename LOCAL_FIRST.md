# 🚀 Local-First Architecture

Esta aplicação agora funciona com uma arquitetura **local-first**, permitindo que os usuários continuem usando a aplicação mesmo offline!

## 🎯 O que é Local-First?

Local-first significa que:
- ✅ **Dados são armazenados localmente primeiro** (no navegador do usuário)
- ✅ **A aplicação funciona offline**
- ✅ **Sincronização automática** quando a conexão voltar
- ✅ **Performance melhorada** (carregamento instantâneo)
- ✅ **PWA** (Progressive Web App) - pode ser instalado como app

## 🏗️ Arquitetura

### 1. **IndexedDB (Dexie)**
Banco de dados local no navegador que armazena:
- Produtos (`products`)
- Reservas (`reservations`)
- Fila de sincronização (`syncQueue`)

**Localização**: `src/lib/db/local-db.ts`

### 2. **Sync Manager**
Gerencia a sincronização entre dados locais e servidor:
- Detecta quando o dispositivo está online/offline
- Sincroniza automaticamente a cada 30 segundos
- Mantém fila de operações pendentes
- Retry automático em caso de falha

**Localização**: `src/lib/sync/sync-manager.ts`

### 3. **Service Worker**
Cache de assets e páginas para funcionamento offline:
- Cache de páginas estáticas
- Estratégia "Network First, Cache Fallback"
- Atualização automática do cache

**Localização**: `public/sw.js`

### 4. **React Query + Local-First**
Hooks atualizados para estratégia local-first:
- Retorna dados locais imediatamente
- Sincroniza em background
- Optimistic updates

**Localização**:
- `src/hooks/use-products.ts`
- `src/hooks/use-reservations.ts`

## 🔄 Fluxo de Dados

### Carregamento de Produtos
```
1. Verifica IndexedDB
2. Se houver dados locais → Retorna imediatamente
3. Em background → Sincroniza com servidor
4. Se não houver dados locais + online → Busca do servidor
5. Se offline e sem dados locais → Mostra erro
```

### Criação de Reserva
```
1. Salva imediatamente no IndexedDB (optimistic update)
2. Se online → Envia para o servidor
   - Sucesso → Atualiza ID local com ID do servidor
   - Falha → Adiciona à fila de sincronização
3. Se offline → Adiciona à fila de sincronização
4. Quando voltar online → Sincroniza automaticamente
```

## 📊 Indicador de Status

O componente `<SyncStatus />` mostra:
- 🟢 **Online** - Sincronizado
- 🔵 **Sincronizando** - Operações pendentes
- 🟡 **Offline** - Sem conexão

**Localização**: `src/components/sync-status.tsx`

## 🛠️ Como Usar

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
bun run dev

# Abrir no navegador
# Ir para: http://localhost:3000
```

### Testando Offline
1. Abra as DevTools (F12)
2. Vá para a aba "Network"
3. Selecione "Offline" no dropdown de throttling
4. A aplicação continuará funcionando!

### Instalando como PWA
1. Acesse a aplicação no navegador
2. Clique no ícone de "Instalar" na barra de endereços
3. A aplicação será instalada como um app nativo

## 🔍 Monitoramento

### Ver Dados Locais
Abra as DevTools → Application → IndexedDB → CasaNovaDB

### Ver Service Worker
DevTools → Application → Service Workers

### Ver Cache
DevTools → Application → Cache Storage

## ⚙️ Configurações

### Intervalo de Sincronização
Padrão: 30 segundos

Para alterar, edite `src/lib/sync/sync-manager.ts`:
```typescript
startAutoSync(60000); // 60 segundos
```

### Tentativas de Retry
Padrão: 3 tentativas

Para alterar, edite `src/lib/sync/sync-manager.ts`:
```typescript
if (item.retries >= 5) { // 5 tentativas
  // ...
}
```

## 📱 PWA Features

### Manifest
**Localização**: `public/manifest.json`

Configurações:
- Nome: "Chá de Casa Nova"
- Ícones: Vários tamanhos
- Display: standalone
- Theme color: #e11d48

### Instalação
A aplicação pode ser instalada em:
- ✅ Desktop (Chrome, Edge)
- ✅ Android (Chrome)
- ✅ iOS (Safari) - Adicionar à Tela Inicial

## 🎨 Componentes

### SyncStatus
Indicador visual do status de sincronização

**Uso**:
```tsx
import { SyncStatus } from "@/components/sync-status";

<SyncStatus />
```

### useOnline Hook
Detecta status de conexão

**Uso**:
```tsx
import { useOnline } from "@/hooks/use-online";

const isOnline = useOnline();
```

## 🐛 Debug

### Limpar Dados Locais
```typescript
import { db } from "@/lib/db/local-db";

// Limpar tudo
await db.clearAll();
```

### Ver Fila de Sincronização
```typescript
import { db } from "@/lib/db/local-db";

const queue = await db.syncQueue.toArray();
console.log("Operações pendentes:", queue);
```

### Forçar Sincronização
```typescript
import { syncManager } from "@/lib/sync/sync-manager";

await syncManager.syncAll();
```

## 🚨 Tratamento de Erros

### Conflitos de Sincronização
Estratégia atual: **Server wins** (servidor sempre vence)

Futuramente pode ser implementado:
- Last-write-wins
- Conflict resolution UI
- Merge strategies

### Falhas de Rede
- Retry automático com backoff exponencial
- Toast notifications para o usuário
- Dados salvos localmente até sincronizar

## 📈 Performance

### Benefícios
- ⚡ Carregamento instantâneo (dados locais)
- 🚀 Menos requests ao servidor
- 💾 Cache de assets
- 📱 Funciona offline

### Considerações
- 💽 Limite de storage do IndexedDB (~50MB+ dependendo do navegador)
- 🔄 Sincronização consome bateria
- 📊 Mais complexidade no código

## 🔐 Segurança

- ✅ Service Worker só funciona em HTTPS
- ✅ Dados locais isolados por origem
- ✅ IndexedDB criptografado pelo navegador
- ⚠️ Não armazenar dados sensíveis sem criptografia adicional

## 📚 Referências

- [Dexie.js Documentation](https://dexie.org/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
