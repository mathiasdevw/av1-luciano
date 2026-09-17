# Produção: Vercel + PostgreSQL hospedado

O computador pode ficar desligado: a Vercel executa o site e o provedor PostgreSQL mantém os resultados. O banco não precisa ser aberto ao público; somente o servidor do aplicativo usa a credencial privada.

## Caminho sugerido: Neon Free

1. Crie sua conta e um projeto PostgreSQL no [Neon](https://neon.com/). Escolha o plano Free e uma região próxima da região das funções da Vercel.
2. Em Connect, copie a URL com **Connection pooling** para `DATABASE_URL`. Mantenha os parâmetros de conexão/TLS fornecidos pelo painel. O host pooled normalmente contém `-pooler`.
3. Opcionalmente, copie a conexão direta, sem pooling, para `DATABASE_MIGRATION_URL`. Ela será usada somente para preparar as tabelas; se omitida, o comando usa `DATABASE_URL`.
4. Na Vercel, importe `mathiasdevw/av1-luciano`, selecione Next.js e adicione essas variáveis ao ambiente **Production** antes do deploy. Root Directory é a raiz do repositório.
5. Faça o deploy. `vercel.json` seleciona `npm run build:vercel`, que prepara as tabelas e compila o site. Não é necessário copiar SQL manualmente.
6. Abra `/api/health`: com a proteção de acesso satisfeita, deve responder `{"status":"ok"}`. Conclua um simulado e confira o ranking em outro navegador autorizado.

A conta e o banco hospedado ainda precisam ser criados pelo proprietário. Nenhuma credencial de produção acompanha o projeto. O plano gratuito tem limites de armazenamento e processamento; acompanhe o consumo no painel. O recurso pode suspender processamento quando ocioso e retomá-lo ao receber uma nova conexão, adicionando latência ao primeiro acesso. Não há promessa de disponibilidade ilimitada.

O cliente continua compatível com PostgreSQL padrão. Você pode usar outro provedor, incluindo Supabase com sua conexão PostgreSQL apropriada para serverless. Não use a chave pública da API Supabase como `DATABASE_URL`.

## Configuração da Vercel

| Campo | Valor |
| --- | --- |
| Framework | Next.js |
| Root Directory | Raiz do repositório |
| Node.js | 22.x |
| Install Command | `npm ci` |
| Build Command | `npm run build:vercel` (já definido em vercel.json) |
| Output Directory | Padrão do Next.js |
| DATABASE_URL | URL do PostgreSQL hospedado; preferencialmente pooled |
| DATABASE_MIGRATION_URL | Opcional: URL direta para migrations |

Não configure exportação estática. Não use `NEXT_PUBLIC_` nas credenciais. Não use `localhost`/`127.0.0.1` na conexão de produção: eles não apontam para seu computador. O Compose é apenas para desenvolvimento local.

A variável `POSTGRES_URL` é aceita como alternativa a `DATABASE_URL`. Alterou variáveis? Faça um novo deploy. Se já tinha sobrescrito o Build Command no painel, use o comando novo acima.

## Migrations e preservação dos resultados

O comando lê `database/NNN_descricao.sql`, aplica somente arquivos novos e registra checksum em `av1_schema_migrations`. Deploys concorrentes são serializados com um lock transacional. Uma falha desfaz a transação e impede a nova versão de ser publicada.

Não edite uma migration já aplicada: acrescente um novo arquivo numerado, mantendo nomes com zeros à esquerda para ordenação. Faça alterações compatíveis com a versão anterior, que pode continuar atendendo enquanto o deploy compila. Exemplo: adicionar coluna opcional é preferível a renomear ou excluir uma coluna usada pelo código antigo.

O primeiro deploy reconhece instalações antigas aplicando o script inicial idempotente. As tabelas e tentativas existentes são preservadas. O usuário da conexão de migrations precisa ter permissão para criar tabelas; se usar uma conexão de runtime com permissões menores, configure `DATABASE_MIGRATION_URL` separadamente.

Use um banco/branch separado para Preview. Preview sem banco oferece modo treino; Production sem conexão interrompe o build. O build local `npm run build` continua sem aplicar migrations automaticamente.

## Acesso da turma

Enquanto quiser manter privado, configure **Settings → Deployment Protection → Vercel Authentication → All Deployments**. Autorize os participantes conforme as opções da sua conta. Standard Protection não cobre os domínios de produção.

Um repositório privado ou `noindex` não restringe o site. A proteção de acesso é configurada no painel da Vercel. O aplicativo não tem cadastro individual: apelidos servem apenas para o ranking informal de estudo. Antes de disponibilizar publicamente, configure limites de requisições no Firewall da Vercel conforme o tráfego esperado.

## Operação e conferência

- `/api/health` verifica a conexão e a existência da tabela, sem mostrar host, usuário ou senha. Retorna 503 quando indisponível. Não faça consultas constantes para manter o plano gratuito acordado.
- Cada instância do aplicativo reutiliza no máximo uma conexão. O pooler do provedor ajuda a absorver múltiplas instâncias da Vercel.
- Respostas e segredos de tentativa não são publicados pelo ranking. Reenvios de uma conclusão devolvem o resultado original.
- A API limita corpos a 12 KB e retorna erros genéricos. Credenciais ficam fora do repositório.
- Os dados concluídos ficam no PostgreSQL. Progresso de uma prova ainda aberta fica na memória da página e se perde ao recarregar.
- Faça backup pelo provedor ou com ferramentas PostgreSQL antes de alterações estruturais. Retenção e recuperação dependem do plano contratado.

## Validação realizada

Testes de conteúdo/correção, limite de requisições, lint, build de produção e integração com PostgreSQL real local. Migrations foram reaplicadas sem duplicação. O teste de integração verifica persistência, ranking, segredo e idempotência. A conexão hospedada e o deploy final precisam ser conferidos depois que você configurar a conta e as variáveis.

## Referências oficiais

- [Neon: plano gratuito](https://neon.com/blog/how-to-make-the-most-of-neons-free-plan)
- [Neon: connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Supabase: planos](https://supabase.com/pricing)
- [Vercel: configuração do projeto](https://vercel.com/docs/project-configuration)
- [Vercel: proteção de acesso](https://vercel.com/docs/deployment-protection)
