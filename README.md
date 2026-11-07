# Projeto Integrador — Fase 2 (Fullstack)

Projeto acadêmico de gerenciamento de **Produtos**, **Fornecedores** e **Associações Produto/Fornecedor**.

## Estrutura

```text
projeto-integrador/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── produtoController.js
│   │   │   ├── fornecedorController.js
│   │   │   └── associacaoController.js
│   │   ├── database.js
│   │   ├── routes.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── style.css
│   ├── index.html
│   └── package.json
├── insomnia/
│   └── projeto-integrador-insomnia.json
├── docs/
│   └── chamadas-api.md
└── .gitignore
```

## Requisitos

- Node.js versão LTS
- npm

## 1. Executar o backend

No terminal:

```bash
cd backend
npm install
npm run dev
```

A API será iniciada em `http://localhost:3000`. O banco SQLite será criado automaticamente em `backend/data/projeto.db`, com alguns registros de exemplo na primeira execução.

Verificação rápida: abra `http://localhost:3000/api/health`.

## 2. Executar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente `http://localhost:5173`).

## 3. Testar no Insomnia

Importe o arquivo `insomnia/projeto-integrador-insomnia.json` no Insomnia. A coleção contém exemplos para produtos, fornecedores e associações.

A variável `base_url` está configurada como `http://localhost:3000`. Para testar uma API hospedada, substitua esse valor pelo endereço público.

## Endpoints principais

| Recurso | Método | Rota | Finalidade |
|---|---|---|---|
| Produtos | GET | `/api/produtos` | Listar produtos |
| Produtos | GET | `/api/produtos/:id` | Consultar produto |
| Produtos | POST | `/api/produtos` | Criar produto |
| Produtos | PUT | `/api/produtos/:id` | Atualizar produto |
| Produtos | DELETE | `/api/produtos/:id` | Excluir produto |
| Fornecedores | GET | `/api/fornecedores` | Listar fornecedores |
| Fornecedores | GET | `/api/fornecedores/:id` | Consultar fornecedor |
| Fornecedores | POST | `/api/fornecedores` | Criar fornecedor |
| Fornecedores | PUT | `/api/fornecedores/:id` | Atualizar fornecedor |
| Fornecedores | DELETE | `/api/fornecedores/:id` | Excluir fornecedor |
| Associações | GET | `/api/associacoes` | Listar associações |
| Associações | POST | `/api/associacoes` | Associar produto e fornecedor |
| Associações | DELETE | `/api/associacoes/:produtoId/:fornecedorId` | Remover associação |
| Associações | GET | `/api/fornecedores/:id/produtos` | Produtos de um fornecedor |
| Associações | GET | `/api/produtos/:id/fornecedores` | Fornecedores de um produto |

## Modelo de dados

- **Produto:** nome, descrição, preço e código de barras.
- **Fornecedor:** nome, CNPJ, endereço e contato.
- **Associação:** tabela intermediária com chave composta (`produto_id`, `fornecedor_id`), permitindo relacionamento muitos-para-muitos.

## Observações para a entrega

Este repositório contém os artefatos de código solicitados no texto de apoio: backend Node.js, três controladores REST, persistência SQLite, frontend React com três páginas e coleção de testes do Insomnia.

A execução local não significa que a API esteja publicada na nuvem. Se o professor precisar executar as chamadas remotamente, será necessário hospedar o backend e atualizar `base_url` na coleção do Insomnia. Não declare o serviço como hospedado sem realizar essa publicação.

Os dados iniciais são fictícios e servem apenas para demonstração acadêmica.
