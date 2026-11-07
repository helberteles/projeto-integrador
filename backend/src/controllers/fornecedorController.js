const db = require('../database');

exports.listar = (req, res) => {
  res.json(db.prepare('SELECT * FROM fornecedores ORDER BY id').all());
};

exports.buscarPorId = (req, res) => {
  const fornecedor = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id);
  if (!fornecedor) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  res.json(fornecedor);
};

exports.criar = (req, res) => {
  const { nome, cnpj, endereco = '', contato = '' } = req.body;
  if (!nome || !cnpj) {
    return res.status(400).json({ erro: 'Informe nome e CNPJ.' });
  }
  try {
    const result = db.prepare(`
      INSERT INTO fornecedores (nome, cnpj, endereco, contato)
      VALUES (?, ?, ?, ?)
    `).run(nome, cnpj, endereco, contato);
    res.status(201).json(db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(result.lastInsertRowid));
  } catch (error) {
    res.status(409).json({ erro: 'Não foi possível cadastrar. Verifique se o CNPJ já existe.' });
  }
};

exports.atualizar = (req, res) => {
  const atual = db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id);
  if (!atual) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });

  const dados = {
    nome: req.body.nome ?? atual.nome,
    cnpj: req.body.cnpj ?? atual.cnpj,
    endereco: req.body.endereco ?? atual.endereco,
    contato: req.body.contato ?? atual.contato
  };
  if (!dados.nome || !dados.cnpj) {
    return res.status(400).json({ erro: 'Nome e CNPJ são obrigatórios.' });
  }
  try {
    db.prepare(`
      UPDATE fornecedores SET nome = ?, cnpj = ?, endereco = ?, contato = ?
      WHERE id = ?
    `).run(dados.nome, dados.cnpj, dados.endereco, dados.contato, req.params.id);
    res.json(db.prepare('SELECT * FROM fornecedores WHERE id = ?').get(req.params.id));
  } catch (error) {
    res.status(409).json({ erro: 'Não foi possível atualizar. Verifique o CNPJ.' });
  }
};

exports.excluir = (req, res) => {
  const result = db.prepare('DELETE FROM fornecedores WHERE id = ?').run(req.params.id);
  if (!result.changes) return res.status(404).json({ erro: 'Fornecedor não encontrado.' });
  res.json({ mensagem: 'Fornecedor excluído com sucesso.' });
};
