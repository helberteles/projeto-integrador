const db = require('../database');

exports.listar = (req, res) => {
  const produtos = db.prepare('SELECT * FROM produtos ORDER BY id').all();
  res.json(produtos);
};

exports.buscarPorId = (req, res) => {
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.json(produto);
};

exports.criar = (req, res) => {
  const { nome, descricao = '', preco, codigo_barras } = req.body;
  if (!nome || preco === undefined || !codigo_barras) {
    return res.status(400).json({ erro: 'Informe nome, preço e código de barras.' });
  }
  if (Number(preco) < 0 || Number.isNaN(Number(preco))) {
    return res.status(400).json({ erro: 'O preço deve ser um número maior ou igual a zero.' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO produtos (nome, descricao, preco, codigo_barras)
      VALUES (?, ?, ?, ?)
    `).run(nome, descricao, Number(preco), codigo_barras);
    res.status(201).json(db.prepare('SELECT * FROM produtos WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) {
    res.status(409).json({ erro: 'Não foi possível cadastrar. Verifique se o código de barras já existe.' });
  }
};

exports.atualizar = (req, res) => {
  const atual = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!atual) return res.status(404).json({ erro: 'Produto não encontrado.' });

  const dados = {
    nome: req.body.nome ?? atual.nome,
    descricao: req.body.descricao ?? atual.descricao,
    preco: req.body.preco ?? atual.preco,
    codigo_barras: req.body.codigo_barras ?? atual.codigo_barras
  };
  if (!dados.nome || Number(dados.preco) < 0 || Number.isNaN(Number(dados.preco))) {
    return res.status(400).json({ erro: 'Dados do produto inválidos.' });
  }
  try {
    db.prepare(`
      UPDATE produtos SET nome = ?, descricao = ?, preco = ?, codigo_barras = ?
      WHERE id = ?
    `).run(dados.nome, dados.descricao, Number(dados.preco), dados.codigo_barras, req.params.id);
    res.json(db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(409).json({ erro: 'Não foi possível atualizar. Verifique o código de barras.' });
  }
};

exports.excluir = (req, res) => {
  const result = db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ erro: 'Produto não encontrado.' });
  res.json({ mensagem: 'Produto excluído com sucesso.' });
};
