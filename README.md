# Agendamento SUS

Aplicacao Vue 3 + Vite para login, painel do paciente e painel administrativo com Supabase.

## Requisitos

- Node.js `20.19.0` ou superior
- npm
- Git

## Primeira configuracao

1. Instale as dependencias:

```sh
npm install
```

2. Crie seu arquivo local de ambiente a partir do exemplo:

```sh
cp .env.example .env
```

No Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Preencha o `.env` com as credenciais do seu projeto Supabase.

4. Rode o projeto:

```sh
npm run dev
```

## Outra maquina

Ao abrir o projeto em outra maquina:

1. Faca `git pull --rebase`
2. Crie o `.env` local a partir de `.env.example`
3. Rode `npm install`
4. Rode `npm run dev`

O arquivo `.env` nao entra mais no Git. Assim cada maquina pode usar suas credenciais locais sem gerar conflito de merge.

## Fluxo recomendado de Git

Para reduzir conflitos:

1. Antes de puxar alteracoes, confira se a arvore esta limpa com `git status`
2. Se houver mudancas locais, faca um commit ou use `git stash`
3. Use `git pull --rebase` em vez de `git pull`
4. Depois do pull, rode `npm install` se `package.json` ou `package-lock.json` mudarem

Se quiser aplicar isso no Git da maquina atual:

```sh
git config pull.rebase true
git config rebase.autoStash true
```

## Observacoes

- Nao edite `package-lock.json` manualmente
- Nao versione `.env`
- `node_modules` e `dist` sao gerados localmente e nao devem ser commitados

## Scripts

```sh
npm run dev
npm run build
npm run preview
```
