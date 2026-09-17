# Spring Lab · AV1

Plataforma de estudo em português sobre os 11 assuntos da AV1. O foco está nos conceitos e nas anotações: os exemplos não exigem conhecer o projeto da aula.

- Simulado de **25 questões**, sorteadas de um banco de **55**.
- Cada tentativa inclui pelo menos duas questões de cada um dos 11 assuntos.
- **34 questões com trechos de código** para interpretar comportamento, saída ou erros.
- Correção comentada e aproveitamento por assunto.
- 55 flashcards com filtro por assunto e 11 módulos na biblioteca.
- Ranking compartilhado de tentativas, persistido em PostgreSQL quando configurado.
- Interface responsiva para computador e celular.

## Executar no computador

Requer Node.js 22.13 ou superior. Recomendado: Node.js 22 LTS.

```sh
npm ci
npm run dev
```

Abra http://localhost:5173. Sem `DATABASE_URL`, o modo treino funciona com correção completa. O ranking exibe que ainda precisa ser ativado.

## Publicar na Vercel

Siga [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md). O projeto usa Next.js com rotas de servidor e pode ser importado diretamente de um repositório GitHub. Não configure exportação estática.

## Banco para o ranking

Copie `.env.example` para `.env.local` e preencha `DATABASE_URL` com a conexão do seu PostgreSQL. A variável deve permanecer somente no servidor.

```sh
npm run db:setup
```

O cliente usa o protocolo PostgreSQL padrão, compatível com banco local ou hospedado. Use a URL e os parâmetros TLS do seu provedor; não desative a verificação de certificados.

O comando cria a tabela e o índice definidos em `database/001_initial.sql`. Também é possível executar esse arquivo no editor SQL do seu provedor. Reinicie o aplicativo depois de alterar as variáveis.

## PostgreSQL local com Docker

Copie `.env.example` para `.env.local`, escolha `POSTGRES_PASSWORD` e preencha `DATABASE_URL` conforme o exemplo. A porta local é 5433 para evitar conflito com outros bancos.

```sh
docker compose --env-file .env.local up -d --wait
npm run db:setup
npm run dev
```

Os dados ficam no volume `spring_lab_data` mesmo ao recriar o contêiner. Para parar sem apagar resultados, use `docker compose --env-file .env.local stop`. A Vercel não executa esse Compose: em produção, configure um PostgreSQL hospedado acessível por ela. `localhost` na Vercel não aponta para seu computador.

## Como funciona

`lib/content/study.json` contém os módulos, questões e referências oficiais. `lib/quiz-core.ts` sorteia e corrige as provas. `app/api/quiz/route.ts` inicia e conclui as tentativas; com banco, o servidor armazena as questões sorteadas e calcula a nota. Um segredo aleatório identifica cada tentativa; somente o hash é armazenado no banco. Reenviar uma tentativa concluída devolve a mesma nota, sem duplicar o registro.

O ranking mostra as 50 melhores tentativas da versão atual do banco de questões, ordenadas por acertos e depois pela data de conclusão. Tentativas incompletas não aparecem. Cada acerto vale um ponto, sem bônus por velocidade.

Este é um ranking informal de estudo. Apelidos não verificam identidade, novas tentativas aparecem separadamente e os gabaritos estão acessíveis nos flashcards. Não há mecanismos de fiscalização de prova.

O progresso da prova e dos flashcards fica na memória da página: trocar de seção mantém as respostas; recarregar perde a tentativa em andamento. Resultados concluídos ficam no banco, quando ele está conectado. Não há armazenamento persistente local simulando um ranking compartilhado.

## Conteúdos

Anotações Spring; arquitetura; IoC e DI; Spring Data JPA; relacionamentos; records e DTOs; Validation; Apache Kafka; Flyway; Docker e Compose; Redis.

Os trechos de Spring são exemplos didáticos. O aplicativo de estudo é construído com Next.js/React/TypeScript; não precisa executar os microsserviços Java, Docker, Kafka ou Redis para funcionar.

## Verificações

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

A compilação usa Webpack. Testes verificam sorteios com cobertura dos 11 assuntos, integridade do banco de questões, correção e rejeição de respostas inválidas. O fluxo completo de 25 questões foi conferido no navegador em modo treino. A integração com PostgreSQL local também foi testada: gravação de questões/respostas, correção, ranking, rejeição de segredo incorreto e reenvio sem alterar a nota. Com o servidor e o banco local ativos, execute `npm run test:db` para repetir essa verificação; somente a tentativa criada pelo teste será removida. A conexão de produção deve ser validada depois da configuração, pois nenhum banco hospedado foi fornecido.

## Editar questões

Cada questão tem `id` único, `topic` entre 0 e 10, `prompt`, `code`, quatro `options`, `answer` de 0 a 3, `explanation`, `difficulty` e `kind`. Após mudanças incompatíveis em IDs/gabaritos, atualize `BANK_VERSION` em `lib/quiz-core.ts` para separar rankings e invalidar tentativas antigas ainda abertas.

A configuração inicial do banco não é um gerenciador de migrations. Para evoluções futuras, acrescente scripts SQL versionados e aplique-os deliberadamente; não reescreva a tabela para perder resultados.
