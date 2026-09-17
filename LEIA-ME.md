# AV1 Spring Lab

Projeto de estudo em português baseado no delivery_app_2026, para AV1 de 18/09/2026.

## O que está pronto

- Guia de 11 assuntos com exemplos e fontes do projeto do professor.
- 33 flashcards com resposta explicada e filtro por assunto.
- Simulado com as 33 questões em ordem aleatória, navegação e correção ao final.
- Ranking persistido em banco, por tentativa: acertos decrescentes e conclusão crescente em caso de empate.
- O site publicado permanece privado, por solicitação do usuário.

## Estrutura

- `app/page.tsx`: interface React.
- `lib/content/study.json`: conteúdo pedagógico e questões.
- `app/api/quiz/route.ts`: criação de tentativa e correção no servidor.
- `app/api/ranking/route.ts`: consulta de ranking.
- `db/schema.ts` e `drizzle/`: esquema e migration do banco.
- `lib/database.ts`: acesso ao D1 com consultas parametrizadas.

Este é um projeto web que ensina Spring, não uma reimplementação Java do delivery. O projeto original em Downloads não foi alterado. ManyToMany, fluxo produtor/consumidor Kafka e Compose são complementos identificados.

## Rodar em outro computador

Requer Node 22.13 ou superior e npm. Extraia o projeto e execute no terminal da pasta:

```sh
npm ci
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_nice_shocker.sql
npm run dev
```

Aplique a migration acima apenas uma vez por banco local novo. Abra o endereço mostrado no terminal. A prévia local usa banco local; a publicação usa banco separado. O arquivo `.openai/hosting.json` contém a identidade do site privado existente; reutilize-a somente ao editar esse site pela plataforma Sites.

## Regras e limites

Cada acerto vale um ponto, até 33. As respostas podem ser alteradas antes do envio final. O servidor calcula o resultado e evita alterar uma tentativa já concluída. O ranking mostra as 50 melhores tentativas; não agrupa por pessoa. Apelidos não verificam identidade. Este é um recurso informal de estudo, não um sistema de avaliação oficial: o conteúdo e gabarito também estão disponíveis nos flashcards e no código cliente.

Trocar de aba preserva a tentativa aberta na memória. Recarregar a página a reinicia; resultados já concluídos continuam salvos no banco. Falhas de envio preservam respostas para tentar novamente.

## Validação realizada

Build de produção e conferência TypeScript. Teste de API com 32 acertos em 33, repetição idempotente de envio e consulta persistida no ranking. Interface verificada para início do simulado, seleção de resposta, navegação, flashcards e guia. Integração WebMCP validada para assunto válido e rejeição de assunto inexistente.
