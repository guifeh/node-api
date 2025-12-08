# Desafio Node.js — API de Cursos

Resumo rápido
- API REST simples em TypeScript usando Fastify.
- Rotas principais (implementadas no projeto):
  - POST /courses — criar curso
  - GET /courses — listar cursos
  - GET /courses/:id — obter curso por id
  - PUT /courses/:id — editar curso
  - DELETE /courses/:id — remover curso
- Banco: PostgreSQL 17 (arquivo docker-compose.yml incluído).
- Documentação Swagger ativada quando NODE_ENV=development.

Pré-requisitos
- Node.js (recomendado >= 18)
- npm ou yarn
- Docker (para rodar Postgres via docker compose)
- TypeScript no projeto (já presente: .ts files)

Configuração local (passo a passo — Windows)
1. Clonar / copiar repositório para sua máquina:
   - git clone <repo-url> c:\Users\admin\OneDrive\Documentos\node-api

2. Iniciar PostgreSQL 17 com Docker Compose (arquivo já presente em docker-compose.yml):
   - PowerShell / CMD:
     - docker compose up -d
   - O compose expõe a porta 5432: o banco será acessível em localhost:5432
   - Variáveis definidas no compose:
     - POSTGRES_USER=postgres
     - POSTGRES_PASSWORD=postgres
     - POSTGRES_DB=desafio

3. (Opcional) .env local
   - Recomenda criar um .env na raiz com a string de conexão. Exemplo:
     DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio
   - Ajuste conforme seu cliente de DB / ORM se necessário.

4. Instalar dependências
   - Abra PowerShell na pasta do projeto:
     - npm install
     - ou yarn install

5. Rodar em modo dev (TypeScript)
   - Se houver script dev no package.json (ex.: ts-node-dev / nodemon + ts-node):
     - $env:NODE_ENV='development'
     - npm run dev
   - Alternativa: compilar e rodar
     - npm run build
     - npm start

6. Acessar a API
   - Base: http://localhost:3333
   - Se NODE_ENV=development, a documentação pode ficar disponível em:
     - http://localhost:3333/docs  (plugin scalar-api-reference registrado)
     - além do Swagger/OpenAPI gerado pelo fastify-swagger (configuração em server.ts)

Exemplos de uso (curl)
- Criar curso (POST):
  curl -X POST http://localhost:3333/courses -H "Content-Type: application/json" -d "{\"title\":\"Curso Exemplo\"}"

- Listar cursos (GET):
  curl http://localhost:3333/courses

- Obter por id (GET):
  curl http://localhost:3333/courses/<id>

- Editar título (PUT):
  curl -X PUT http://localhost:3333/courses/<id> -H "Content-Type: application/json" -d "{\"title\":\"Novo Título\"}"

- Deletar (DELETE):
  curl -X DELETE http://localhost:3333/courses/<id>

Observações técnicas relevantes (baseado nos arquivos do projeto)
- O servidor principal está em `server.ts`.
  - Usa fastify com provider Zod (fastify-type-provider-zod) para validação/serialização.
  - Registra rotas localizadas em `./src/routes/`:
    - create-course.ts
    - get-courses.ts
    - get-course-by-id.ts
    - edit-courses.ts
    - delete-courses.ts
- Logger configurado com `pino-pretty`.
- Certifique-se que sua camada de acesso aos dados (db, ORM/Query Builder) esteja configurada para usar o banco em `localhost:5432` (ou conforme seu .env).
- Exceções/erros devem ser tratados no servidor; verifique logs no console integrado do VS Code ou terminal.

Solução de problemas rápida
- Erro de conexão com Postgres:
  - Verifique `docker compose ps` e `docker logs <container>`; confirme usuário/senha/DB.
  - Teste com psql ou um cliente GUI apontando para localhost:5432.
- Porta 3333 em uso: pare o processo que está usando a porta ou altere a porta em server.ts/variável de ambiente.
- Dependências faltando ou scripts ausentes: abra package.json e confirme scripts (`dev`, `build`, `start`) antes de executar comandos.

Contribuição
- Para adicionar rotas, edite/adicione arquivos em `src/routes/`.
- Siga o padrão atual: exportar um route plugin e registrar no `server.ts`.

Licença
- Adicione a licença desejada

## Diagrama de fluxo

Abaixo está um diagrama Mermaid com o fluxo principal da aplicação (requisições do cliente → rotas Fastify → banco PostgreSQL → persistência/volume; documentação disponível em /docs quando em desenvolvimento).

```mermaid
flowchart LR
  Client[Cliente (browser / curl / app)] -->|HTTP| Fastify[Fastify Server]
  Fastify --> Routes{Rotas /courses}
  Routes --> Create[POST /courses]
  Routes --> List[GET /courses]
  Routes --> GetById[GET /courses/:id]
  Routes --> Update[PUT /courses/:id]
  Routes --> Delete[DELETE /courses/:id]

  Create --> DB[(Postgres 17)]
  List --> DB
  GetById --> DB
  Update --> DB
  Delete --> DB

  Fastify --> Docs[/docs (Swagger / scalar-api-reference)]
  DockerCompose[Docker Compose] --> DB
  DB -->|dados persistidos| Volume[(Volume: postgres_data)]