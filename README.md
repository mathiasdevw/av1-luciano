# Spring Lab · AV1

Plataforma de estudo em português sobre os 11 assuntos da AV1. O foco está nos conceitos e nas anotações: os exemplos não exigem conhecer o projeto da aula.

- Simulado de **25 questões**, sorteadas de um banco de **55**.
- Cada tentativa inclui pelo menos duas questões de cada um dos 11 assuntos.
- **34 questões com trechos de código** para interpretar comportamento, saída ou erros.
- Correção comentada e aproveitamento por assunto.
- 55 flashcards com filtro por assunto e 11 módulos na biblioteca.
- Ranking compartilhado de tentativas, persistido em PostgreSQL Neon quando configurado.
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

Copie `.env.example` para `.env.local` e preencha `DATABASE_URL` com a conexão do seu PostgreSQL Neon. A variável deve permanecer somente no servidor.

```sh
npm run db:setup
```

O comando cria a tabela e o índice definidos em `database/001_initial.sql`. Também é possível executar esse arquivo no editor SQL do Neon. Reinicie o aplicativo depois de alterar as variáveis.

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

A compilação usa Webpack. Testes verificam sorteios com cobertura dos 11 assuntos, integridade do banco de questões, correção e rejeição de respostas inválidas. O fluxo completo de 25 questões foi conferido no navegador em modo treino. A conexão com o seu Neon deve ser validada depois da configuração, pois nenhuma credencial de banco foi fornecida.

## Editar questões

Cada questão tem `id` único, `topic` entre 0 e 10, `prompt`, `code`, quatro `options`, `answer` de 0 a 3, `explanation`, `difficulty` e `kind`. Após mudanças incompatíveis em IDs/gabaritos, atualize `BANK_VERSION` em `lib/quiz-core.ts` para separar rankings e invalidar tentativas antigas ainda abertas.

A configuração inicial do banco não é um gerenciador de migrations. Para evoluções futuras, acrescente scripts SQL versionados e aplique-os deliberadamente; não reescreva a tabela para perder resultados.
