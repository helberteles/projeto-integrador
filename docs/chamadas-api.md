# Chamadas funcionais para demonstrar no Insomnia

Base URL local: `http://localhost:3000/api`

> Para o envio à plataforma, a orientação da atividade pede três chamadas funcionais. Use as três chamadas GET abaixo para demonstrar os três recursos principais. A coleção completa do Insomnia também inclui exemplos de criação.

## 1. Produtos

- Método: `GET`
- URL: `http://localhost:3000/api/produtos`
- Resultado esperado: HTTP `200 OK` e uma lista JSON de produtos.

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "nome": "Notebook Lenovo",
    "descricao": "Computador portátil",
    "preco": 3499.9,
    "codigo_barras": "789000000001"
  }
]
```

## 2. Fornecedores

- Método: `GET`
- URL: `http://localhost:3000/api/fornecedores`
- Resultado esperado: HTTP `200 OK` e uma lista JSON de fornecedores.

Exemplo de resposta:

```json
[
  {
    "id": 1,
    "nome": "Tech Distribuidora Ltda.",
    "cnpj": "12.345.678/0001-90",
    "endereco": "São Paulo - SP",
    "contato": "(11) 3333-1000"
  }
]
```

## 3. Associação Produto/Fornecedor

- Método: `GET`
- URL: `http://localhost:3000/api/associacoes`
- Resultado esperado: HTTP `200 OK` e uma lista de relações entre produtos e fornecedores.

Exemplo de resposta:

```json
[
  {
    "produto_id": 1,
    "produto": "Notebook Lenovo",
    "fornecedor_id": 1,
    "fornecedor": "Tech Distribuidora Ltda."
  }
]
```

## Observação

As respostas acima são exemplos ilustrativos. Os dados efetivamente retornados dependem dos registros presentes no banco SQLite local.
