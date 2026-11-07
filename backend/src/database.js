const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'projeto.db'));
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT DEFAULT '',
    preco REAL NOT NULL CHECK(preco >= 0),
    codigo_barras TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    endereco TEXT DEFAULT '',
    contato TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS produto_fornecedor (
    produto_id INTEGER NOT NULL,
    fornecedor_id INTEGER NOT NULL,
    PRIMARY KEY (produto_id, fornecedor_id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE CASCADE
  );
`);

const totalProdutos = db.prepare('SELECT COUNT(*) AS total FROM produtos').get().total;
if (totalProdutos === 0) {
  const inserir = db.prepare(`
    INSERT INTO produtos (nome, descricao, preco, codigo_barras)
    VALUES (?, ?, ?, ?)
  `);
  inserir.run('Notebook Lenovo', 'Computador portátil', 3499.90, '789000000001');
  inserir.run('Mouse sem fio', 'Mouse óptico USB', 89.90, '789000000002');
  inserir.run('Teclado USB', 'Teclado ABNT2', 129.90, '789000000003');
}

const totalFornecedores = db.prepare('SELECT COUNT(*) AS total FROM fornecedores').get().total;
if (totalFornecedores === 0) {
  const inserir = db.prepare(`
    INSERT INTO fornecedores (nome, cnpj, endereco, contato)
    VALUES (?, ?, ?, ?)
  `);
  inserir.run('Tech Distribuidora Ltda.', '12.345.678/0001-90', 'São Paulo - SP', '(11) 3333-1000');
  inserir.run('Comercial Brasil S.A.', '23.456.789/0001-01', 'Campinas - SP', '(19) 3333-2000');
  inserir.run('Mundo Digital ME', '34.567.890/0001-12', 'Sumaré - SP', '(19) 3333-3000');
}

const totalAssociacoes = db.prepare('SELECT COUNT(*) AS total FROM produto_fornecedor').get().total;
if (totalAssociacoes === 0) {
  const associar = db.prepare(`
    INSERT OR IGNORE INTO produto_fornecedor (produto_id, fornecedor_id)
    VALUES (?, ?)
  `);
  associar.run(1, 1);
  associar.run(2, 1);
  associar.run(2, 2);
  associar.run(3, 3);
}

module.exports = db;
