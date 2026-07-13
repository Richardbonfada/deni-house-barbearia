# Deni House Barbearia

Aplicativo web estático para vitrine de serviços, referências de cortes, agendamento e painel do gerenciador da Deni House Barbearia.

## Como publicar na Vercel

- Framework Preset: Other
- Build Command: deixar vazio
- Output Directory: deixar vazio ou `.`
- Install Command: deixar vazio

## Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor.
3. Cole e rode o arquivo `supabase-schema.sql`. Ele cria as tabelas de clientes e agendamentos.
4. Na Vercel, adicione estas variáveis de ambiente:

```bash
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
```

Use a `service_role` apenas na Vercel. Nunca coloque essa chave dentro do `script.js`.

## Pix com Mercado Pago

1. Crie uma conta no Mercado Pago Developers.
2. Pegue o Access Token de produção.
3. Na Vercel, adicione:

```bash
MERCADO_PAGO_ACCESS_TOKEN=APP_USR...
```

Depois de salvar as variáveis na Vercel, faça um novo deploy. Quando o cliente escolher `Pagar agora`, o app cria o agendamento, gera o QR Code Pix e mostra o copia e cola.
