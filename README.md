# Tela de Sala

Aplicativo web completo para exibir e gerenciar informações de uma sala de aula. O projeto utiliza React, TypeScript, Vite e Tailwind CSS no frontend, com uma API Express para persistência e sincronização.

## Principais recursos

- Painel administrativo com visão geral, aula atual, agenda, cronômetro, avisos, tarefas e aniversariantes.
- Modo de exibição otimizado para televisão, projetor e monitor.
- Três layouts: painel completo, foco na atividade e agenda em destaque.
- Oito temas visuais, modo claro/escuro, escala de fonte e preferências de exibição.
- Cronômetro calculado pelo horário real, com pausa, retomada, presets e atalhos.
- Atualização entre abas por BroadcastChannel e evento `storage`.
- Sincronização entre dispositivos pela API Express e Server-Sent Events.
- Persistência local no navegador e persistência em arquivo JSON no servidor.
- Exportação e importação de backup JSON com validação.
- Upload local de logomarca em PNG, JPG, SVG ou WebP.
- Proteção opcional do painel por PIN com hash SHA-256 via Web Crypto API.
- Histórico das aulas finalizadas.
- PWA instalável e funcionamento offline depois do primeiro carregamento.
- Testes com Vitest, React Testing Library e Supertest.

## Tecnologias

Frontend: React 18, TypeScript, Vite, Tailwind CSS, React Router, Zustand, React Hook Form, Zod, Lucide React, date-fns e vite-plugin-pwa.

Backend: Node.js, Express, TypeScript, Zod, Helmet, CORS e persistência atômica em JSON.

## Requisitos

- Node.js 20 ou superior.
- npm 10 ou superior.

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Desenvolvimento

Inicie React e Express ao mesmo tempo:

```bash
npm run dev
```

Endereços padrão:

- Frontend: `http://localhost:5173`
- API: `http://127.0.0.1:3333`
- Health check: `http://127.0.0.1:3333/api/health`

## Docker com PostgreSQL e dados mock

A aplicação, a API e o PostgreSQL podem ser iniciados como uma única stack:

```bash
docker compose up --build
```

Depois da inicialização, acesse `http://localhost:8088`. O banco fica disponível apenas para a aplicação dentro da rede do Compose.

Na primeira criação do volume, o arquivo `docker/init.sql` cria a tabela `classroom_state` e executa um `INSERT` com uma aula mock completa. Para apagar o volume e executar esse `INSERT` novamente:

```bash
docker compose down -v
docker compose up --build
```

Comandos equivalentes pelo npm:

```bash
npm run docker:up
npm run docker:down
npm run docker:reset
```

## Build de produção

```bash
npm run build
```

O build do React será criado em `client/dist` e o build da API em `server/dist`.

Para servir o frontend e a API em uma implantação única:

```bash
npm start
```

O Express serve os arquivos de `client/dist` e mantém as rotas SPA funcionando.

## Comandos

```bash
npm run dev
npm run build
npm run lint
npm run test
npm start
```

Também é possível executar comandos por workspace:

```bash
npm run dev --workspace client
npm run dev --workspace server
npm run preview --workspace client
```

## Estrutura

```text
tela-de-sala/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── test/
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── data/
│   ├── src/
│   └── package.json
├── netlify.toml
├── render.yaml
└── package.json
```

## Persistência

O navegador mantém o estado em `localStorage`. Quando a API está disponível, o frontend envia uma cópia do estado para `server/data/classroom-state.json`.

A escrita no servidor utiliza arquivo temporário e renomeação para reduzir o risco de corrupção. Para produção, monte um disco persistente e configure `DATA_FILE` para esse volume.

Exemplo:

```env
DATA_FILE=/var/data/classroom-state.json
```

O backend em arquivo JSON é adequado para uma escola, sala ou instalação de pequeno porte. Para múltiplas escolas e muitos usuários simultâneos, substitua a classe `JsonStateStore` por PostgreSQL, Supabase ou outro banco de dados.

## Sincronização

- Mesma origem e mesmo navegador: BroadcastChannel.
- Navegadores sem BroadcastChannel: evento `storage`.
- Dispositivos diferentes: API Express e Server-Sent Events.
- Sem API: o sistema continua funcional em modo local.

O indicador no painel mostra `API conectada` ou `Modo local`.

## Variáveis de ambiente

Frontend, em `client/.env`:

```env
VITE_API_URL=http://127.0.0.1:3333
```

Backend, em `server/.env` ou nas variáveis da plataforma:

```env
PORT=3333
CORS_ORIGIN=https://seu-site.netlify.app
DATA_FILE=/var/data/classroom-state.json
```

## Deploy completo em Render

O arquivo `render.yaml` permite uma implantação única:

1. Envie o projeto para o GitHub.
2. No Render, escolha **New > Blueprint**.
3. Selecione o repositório.
4. O build executará `npm install && npm run build`.
5. O start executará `npm start`.
6. Para persistência real, adicione um Persistent Disk e configure `DATA_FILE`.

Nessa modalidade, não é necessário definir `VITE_API_URL`, pois o React e a API usam o mesmo domínio.

## Deploy do frontend no Netlify

O `netlify.toml` já configura:

- comando: `npm install && npm run build --workspace client`;
- diretório publicado: `client/dist`;
- fallback SPA para `index.html`;
- cabeçalhos básicos de segurança e cache.

Procedimento:

1. Publique a API Express no Render, Railway ou VPS.
2. Copie a URL pública da API.
3. No Netlify, importe o repositório.
4. Crie a variável `VITE_API_URL` com a URL da API, sem barra final.
5. Na API, configure `CORS_ORIGIN` com o domínio do Netlify.
6. Execute o deploy.

Sem `VITE_API_URL`, o site no Netlify funciona apenas com a persistência local do navegador.

## Deploy manual no Netlify

```bash
npm install
npm run build --workspace client
```

Envie a pasta `client/dist` pelo painel de deploy manual do Netlify.

## Abrir em uma televisão ou projetor

1. Abra o painel no computador do professor.
2. Abra `Exibição` em uma nova aba.
3. Mova essa aba para a tela externa.
4. Pressione `F` ou use o botão de tela cheia.
5. Faça as alterações pelo painel; a apresentação será atualizada automaticamente.

Atalhos no modo de exibição:

- `F`: tela cheia.
- `Espaço`: iniciar ou pausar.
- `R`: reiniciar.
- `Seta para cima`: adicionar um minuto.
- `Seta para baixo`: remover um minuto.
- `H`: ocultar ou exibir controles.
- `L`: alternar layout.

## Backup

Em Configurações, use **Exportar JSON** para baixar todos os dados. Para restaurar, selecione **Importar JSON**. O sistema valida formato, tamanho e estrutura antes de substituir o conteúdo.

## PWA e modo offline

O `vite-plugin-pwa` gera manifest e service worker durante o build. Depois do primeiro acesso, os arquivos do frontend ficam disponíveis offline. A API não é necessária para consultar os dados já salvos localmente.

## Testes

```bash
npm run test
```

Os testes cobrem cálculo do cronômetro, renderização da home, validação de importação e leitura/escrita da API.

## Solução de problemas

### O painel mostra “Modo local”

Verifique se a API está executando, se `VITE_API_URL` está correto e se `CORS_ORIGIN` permite o domínio do frontend.

### A rota interna retorna 404 no Netlify

Confirme que `client/public/_redirects` está presente no build ou que o redirect do `netlify.toml` foi aplicado.

### O estado do servidor some após reiniciar

A plataforma está usando armazenamento efêmero. Configure um disco persistente e a variável `DATA_FILE`.

### O navegador bloqueia os sons

Os navegadores exigem interação do usuário antes de reproduzir áudio. Clique na tela ou em um controle antes de iniciar o cronômetro.

### A Wake Lock API não funciona

Nem todos os navegadores e dispositivos oferecem suporte. O aplicativo continua funcionando sem esse recurso.

## Segurança

- Não há chaves secretas no frontend.
- O PIN é uma proteção local contra alterações acidentais, não autenticação de alta segurança.
- O backend valida o corpo recebido, limita JSON a 6 MB e aplica cabeçalhos pelo Helmet.
- Para acesso público, adicione autenticação real e um banco de dados antes de armazenar dados sensíveis.

## Licença

Uso privado ou comercial permitido conforme as necessidades do projeto. Recomenda-se adicionar uma licença MIT ou uma licença proprietária antes da publicação pública.
