# Colocar o Spring Lab no GitHub e na Vercel

## 1. Preparar o repositório

Extraia o ZIP. A pasta `spring-lab` contém o aplicativo; é nela que está `package.json`.

Crie um repositório **privado** no GitHub e envie o conteúdo dessa pasta. Inclua arquivos ocultos como `.gitignore` e `.env.example`. Não envie `.env.local`, credenciais, `node_modules` ou `.next`.

Se usar Git, siga os comandos exibidos pelo GitHub para conectar a pasta ao seu novo repositório. Nenhum endereço de repositório está fixado neste projeto.

## 2. Preparar o banco compartilhado

Crie um PostgreSQL no Neon, diretamente ou pela integração Neon no Marketplace da Vercel. Copie a conexão disponibilizada pelo provedor.

No editor SQL do Neon, execute o conteúdo de:

```text
database/001_initial.sql
```

Alternativa local: copie `.env.example` para `.env.local`, preencha `DATABASE_URL` e execute `npm ci` seguido de `npm run db:setup`. Faça isso antes de iniciar a primeira tentativa com ranking.

Sem banco configurado, o site abre em modo treino. Se a variável existir mas a conexão ou a tabela estiver incorreta, o sistema mostra erro, em vez de fingir que salvou resultados.

## 3. Importar na Vercel

Importe o repositório GitHub. Use estas configurações:

| Campo | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | A pasta que contém `package.json` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Padrão do Next.js; deixe sem alteração |
| Node.js | 22.x |

Em Environment Variables, adicione `DATABASE_URL` com a conexão Neon para o ambiente desejado. Não use o prefixo `NEXT_PUBLIC_`. O aplicativo também aceita `POSTGRES_URL` se esse for o nome criado pela integração; `DATABASE_URL` tem prioridade.

Se configurar o banco depois do primeiro deploy, faça um novo deploy para carregar a variável. Separe bancos/branches de Preview e Production caso queira evitar misturar testes com resultados da turma.

## 4. Manter o acesso privado

O pedido atual é manter o acesso privado. O aplicativo não inclui autenticação de usuários: a privacidade deve ser aplicada pela hospedagem antes de compartilhar o endereço.

Em **Settings → Deployment Protection**, selecione **Vercel Authentication** com o escopo **All Deployments**, para cobrir também os domínios de produção. A [documentação oficial](https://vercel.com/docs/deployment-protection) lista essa cobertura em todos os planos. O acesso fica limitado a usuários Vercel com a permissão adequada. A opção Standard Protection deixa os domínios de produção desprotegidos.

Um repositório privado e a instrução `noindex` do site não tornam a página privada. Para liberar futuramente à turma, defina quem poderá acessar antes de compartilhar.

Confira o acesso em uma janela sem sessão: ela deve pedir autenticação ou negar entrada. Só depois compartilhe com as pessoas autorizadas. Não há publicação automática incluída no ZIP.

## 5. Conferir o resultado

1. Abra o site e inicie um simulado com um apelido de teste.
2. Responda às 25 questões. A tela final deve dizer que a tentativa foi salva no ranking.
3. Abra Ranking em outro navegador autorizado e confira o mesmo resultado.
4. Recarregue e confira que o resultado concluído permanece.
5. Teste os flashcards e os 11 módulos também no celular.

A versão local foi validada sem banco. A integração real com Neon depende da sua conexão e da execução do SQL inicial.

## Se aparecer algum problema

- **Ranking aguardando ativação:** falta `DATABASE_URL`/`POSTGRES_URL` no ambiente do deploy.
- **Erro ao começar ou finalizar:** confira a conexão e se `av1_attempts` foi criada no mesmo banco indicado pela variável. Consulte os logs privados da Vercel.
- **Resultado não aparece:** tentativas do modo treino e tentativas incompletas não entram no ranking.
- **Build com pasta errada:** Root Directory precisa apontar para a pasta que contém `package.json`.
- **Env alterada:** faça um novo deploy.

## Documentação oficial

- [Next.js na Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [PostgreSQL e integrações](https://vercel.com/docs/postgres)
- [Deployment Protection](https://vercel.com/docs/deployment-protection)
- [Neon serverless driver](https://neon.com/docs/serverless/serverless-driver)
