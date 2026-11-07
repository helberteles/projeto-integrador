const express = require('express');
const produtos = require('./controllers/produtoController');
const fornecedores = require('./controllers/fornecedorController');
const associacoes = require('./controllers/associacaoController');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok', mensagem: 'API do Projeto Integrador funcionando.' }));

router.get('/produtos', produtos.listar);
router.get('/produtos/:id', produtos.buscarPorId);
router.post('/produtos', produtos.criar);
router.put('/produtos/:id', produtos.atualizar);
router.delete('/produtos/:id', produtos.excluir);

router.get('/fornecedores', fornecedores.listar);
router.get('/fornecedores/:id', fornecedores.buscarPorId);
router.post('/fornecedores', fornecedores.criar);
router.put('/fornecedores/:id', fornecedores.atualizar);
router.delete('/fornecedores/:id', fornecedores.excluir);

router.get('/associacoes', associacoes.listar);
router.post('/associacoes', associacoes.criar);
router.delete('/associacoes/:produtoId/:fornecedorId', associacoes.excluir);
router.get('/fornecedores/:id/produtos', associacoes.produtosDoFornecedor);
router.get('/produtos/:id/fornecedores', associacoes.fornecedoresDoProduto);

module.exports = router;
