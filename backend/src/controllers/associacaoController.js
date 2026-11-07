const db = require('../database');

exports.listar = (req, res) => {
  const associacoes = db.prepare(`
    SELECT pf.produto_id, p.nome AS produto,
           pf.fornecedor_id, f.nome AS fornecedor
    FROM produto_fornecedor pf
    JOIN produtos p ON p.id = pf.produto_id
    JOIN fornecedores f ON f.id = pf.fornecedor_id
    ORDER BY p.nome, f.nome
  `).all();
  res.json(associacoes);
};

exports.criar = (req, res) => {
  const { produto_id, fornecedor_id } = req.body;
  if (!produto_id || !fornecedor_id) {
    return res.status(400).json({ erro: 'Informe produto_id e fornecedor_id.' });
  }
  const produto = db.prepare('SELECT id FROM produtos WHERE id = ?').get(produto_id);
  const fornecedor = db.prepare('SELECT id FROM fornecedores WHERE id = ?').get(fornecedor_id);
  if (!produto || !fornecedor) {
    return res.status(404).json({ erro: 'Produto ou fornecedor não encontrado.' });
  }
  try {
    db.prepare('INSERT INTO produto_fornecedor (produto_id, fornecedor_id) VALUES (?, ?)').run(produto_id, fornecedor_id);
    res.status(201).json({ mensagem: 'Associação criada com sucesso.', produto_id, fornecedor_id });
  } catch (error) {
    res.status(409).json({ erro: 'Esta associação já existe.' });
  }
};

exports.excluir = (req, res) => {
  const result = db.prepare(`
    DELETE FROM produto_fornecedor
    WHERE produto_id = ? AND fornecedor_id = ?
  `).run(req.params.produtoId, req.params.fornecedorId);
  if (!result.changes) return res.status(404).json({ erro: 'Associação não encontrada.' });
  res.json({ mensagem: 'Associação removida com sucesso.' });
};

exports.produtosDoFornecedor = (req, res) => {
  const rows = db.prepare(`
    SELECT p.* FROM produtos p
    JOIN produto_fornecedor pf ON pf.produto_id = p.id
    WHERE pf.fornecedor_id = ?
    ORDER BY p.nome
  `).all(req.params.id);
  res.json(rows);
};

exports.fornecedoresDoProduto = (req, res) => {
  const rows = db.prepare(`
    SELECT f.* FROM fornecedores f
    JOIN produto_fornecedor pf ON pf.fornecedor_id = f.id
    WHERE pf.produto_id = ?
    ORDER BY f.nome
  `).all(req.params.id);
  res.json(rows);
};
