# Swagger / OpenAPI

Esta pasta contem a documentacao academica da API do projeto `Agendamento SUS`.

Arquivos:
- `openapi.yaml`: contrato principal em OpenAPI 3.0.3

## Como abrir para mostrar ao professor

1. Acesse `https://editor.swagger.io/`
2. Clique em `File` -> `Import File`
3. Selecione `docs/swagger/openapi.yaml`
4. Mostre as tags da API:
   - Autenticacao
   - Unidades
   - Especialidades
   - Medicos
   - Horarios
   - Agendamentos

## Observacao importante

O projeto hoje usa `Vue 3 + Supabase` diretamente no cliente.
Por isso, o arquivo Swagger representa a API de negocio equivalente do sistema,
boa para apresentacao, defesa de arquitetura e futura migracao para um backend REST.

## Pontos bons para destacar na apresentacao

- controle de acesso por perfil: `admin`, `gestor` e `paciente`
- CRUD das entidades principais do sistema
- fluxo completo de agendamento
- contrato padronizado para evolucao futura da aplicacao
