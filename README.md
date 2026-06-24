# Desafio do Asfalto

Quiz viral para caminhoneiros e mecanicos de caminhao, criado para o perfil `@zedagraxa.oficial`.

## Rodar localmente

```cmd
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variaveis de ambiente

Crie um arquivo `.env.local` com:

```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Banco de dados

Execute o arquivo `supabase.sql` no SQL Editor do Supabase.

Por padrao, a aplicacao usa a tabela `resultados_do_quiz`. Se quiser trocar o nome, crie a variavel `SUPABASE_TABLE`.

Nenhum dado pessoal do usuario e salvo. Nome e Instagram ficam apenas no navegador do usuario e no card, quando autorizado.
