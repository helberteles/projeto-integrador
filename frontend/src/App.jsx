import { useEffect, useState } from 'react';
import { api } from './api';

const money = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function App() {
  const [aba, setAba] = useState('produtos');
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [associacoes, setAssociacoes] = useState([]);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [produto, setProduto] = useState({ nome: '', descricao: '', preco: '', codigo_barras: '' });
  const [fornecedor, setFornecedor] = useState({ nome: '', cnpj: '', endereco: '', contato: '' });
  const [associacao, setAssociacao] = useState({ produto_id: '', fornecedor_id: '' });

  async function carregar() {
    try {
      setErro('');
      const [p, f, a] = await Promise.all([
        api.listarProdutos(), api.listarFornecedores(), api.listarAssociacoes()
      ]);
      setProdutos(p); setFornecedores(f); setAssociacoes(a);
      if (!associacao.produto_id && p[0]) setAssociacao((old) => ({ ...old, produto_id: String(p[0].id) }));
      if (!associacao.fornecedor_id && f[0]) setAssociacao((old) => ({ ...old, fornecedor_id: String(f[0].id) }));
    } catch (e) {
      setErro(`${e.message} Verifique se o backend está iniciado.`);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function executar(acao, sucesso) {
    try {
      setErro(''); setMensagem('');
      await acao();
      setMensagem(sucesso);
      await carregar();
    } catch (e) { setErro(e.message); }
  }

  function campo(label, value, onChange, type = 'text', required = true) {
    return <label>{label}<input required={required} type={type} value={value}
      onChange={(e) => onChange(e.target.value)} /></label>;
  }

  return (
    <div className="app">
      <header>
        <div className="marca">PI</div>
        <div><h1>Projeto Integrador</h1><p>Gestão de produtos e fornecedores</p></div>
        <span className="status">Sistema acadêmico</span>
      </header>

      <nav>
        <button className={aba === 'produtos' ? 'ativo' : ''} onClick={() => setAba('produtos')}>Produtos</button>
        <button className={aba === 'fornecedores' ? 'ativo' : ''} onClick={() => setAba('fornecedores')}>Fornecedores</button>
        <button className={aba === 'associacoes' ? 'ativo' : ''} onClick={() => setAba('associacoes')}>Associação</button>
      </nav>

      <main>
        {erro && <div className="alerta erro">{erro}</div>}
        {mensagem && <div className="alerta sucesso">{mensagem}</div>}

        {aba === 'produtos' && <>
          <section className="titulo"><div><h2>Produtos</h2><p>Cadastre e consulte os produtos.</p></div><span>{produtos.length} registros</span></section>
          <section className="painel">
            <h3>Novo produto</h3>
            <form onSubmit={(e) => { e.preventDefault(); executar(() => api.criarProduto({ ...produto, preco: Number(produto.preco) }), 'Produto cadastrado.'); setProduto({ nome: '', descricao: '', preco: '', codigo_barras: '' }); }}>
              {campo('Nome', produto.nome, v => setProduto({ ...produto, nome: v }))}
              {campo('Descrição', produto.descricao, v => setProduto({ ...produto, descricao: v }), 'text', false)}
              {campo('Preço (R$)', produto.preco, v => setProduto({ ...produto, preco: v }), 'number')}
              {campo('Código de barras', produto.codigo_barras, v => setProduto({ ...produto, codigo_barras: v }))}
              <button className="primario">Cadastrar produto</button>
            </form>
          </section>
          <section className="painel"><h3>Lista de produtos</h3>
            <div className="tabela"><table><thead><tr><th>Nome</th><th>Descrição</th><th>Preço</th><th>Código de barras</th><th>Ação</th></tr></thead>
              <tbody>{produtos.map(p => <tr key={p.id}><td>{p.nome}</td><td>{p.descricao}</td><td>{money(p.preco)}</td><td>{p.codigo_barras}</td><td><button className="perigo" onClick={() => executar(() => api.excluirProduto(p.id), 'Produto excluído.')}>Excluir</button></td></tr>)}</tbody>
            </table></div>
          </section>
        </>}

        {aba === 'fornecedores' && <>
          <section className="titulo"><div><h2>Fornecedores</h2><p>Cadastre e consulte os fornecedores.</p></div><span>{fornecedores.length} registros</span></section>
          <section className="painel"><h3>Novo fornecedor</h3>
            <form onSubmit={(e) => { e.preventDefault(); executar(() => api.criarFornecedor(fornecedor), 'Fornecedor cadastrado.'); setFornecedor({ nome: '', cnpj: '', endereco: '', contato: '' }); }}>
              {campo('Nome', fornecedor.nome, v => setFornecedor({ ...fornecedor, nome: v }))}
              {campo('CNPJ', fornecedor.cnpj, v => setFornecedor({ ...fornecedor, cnpj: v }))}
              {campo('Endereço', fornecedor.endereco, v => setFornecedor({ ...fornecedor, endereco: v }), 'text', false)}
              {campo('Contato', fornecedor.contato, v => setFornecedor({ ...fornecedor, contato: v }), 'text', false)}
              <button className="primario">Cadastrar fornecedor</button>
            </form>
          </section>
          <section className="painel"><h3>Lista de fornecedores</h3>
            <div className="tabela"><table><thead><tr><th>Nome</th><th>CNPJ</th><th>Endereço</th><th>Contato</th><th>Ação</th></tr></thead>
              <tbody>{fornecedores.map(f => <tr key={f.id}><td>{f.nome}</td><td>{f.cnpj}</td><td>{f.endereco}</td><td>{f.contato}</td><td><button className="perigo" onClick={() => executar(() => api.excluirFornecedor(f.id), 'Fornecedor excluído.')}>Excluir</button></td></tr>)}</tbody>
            </table></div>
          </section>
        </>}

        {aba === 'associacoes' && <>
          <section className="titulo"><div><h2>Associação Produto / Fornecedor</h2><p>Relacione produtos aos fornecedores.</p></div><span>{associacoes.length} relações</span></section>
          <section className="painel"><h3>Nova associação</h3>
            <form onSubmit={(e) => { e.preventDefault(); executar(() => api.criarAssociacao({ produto_id: Number(associacao.produto_id), fornecedor_id: Number(associacao.fornecedor_id) }), 'Associação criada.'); }}>
              <label>Produto<select required value={associacao.produto_id} onChange={e => setAssociacao({ ...associacao, produto_id: e.target.value })}><option value="">Selecione</option>{produtos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}</select></label>
              <label>Fornecedor<select required value={associacao.fornecedor_id} onChange={e => setAssociacao({ ...associacao, fornecedor_id: e.target.value })}><option value="">Selecione</option>{fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}</select></label>
              <button className="primario" disabled={!produtos.length || !fornecedores.length}>Associar</button>
            </form>
          </section>
          <section className="painel"><h3>Associações cadastradas</h3>
            <div className="tabela"><table><thead><tr><th>Produto</th><th>Fornecedor</th><th>Ação</th></tr></thead>
              <tbody>{associacoes.map(a => <tr key={`${a.produto_id}-${a.fornecedor_id}`}><td>{a.produto}</td><td>{a.fornecedor}</td><td><button className="perigo" onClick={() => executar(() => api.excluirAssociacao(a.produto_id, a.fornecedor_id), 'Associação removida.')}>Remover</button></td></tr>)}</tbody>
            </table></div>
          </section>
        </>}
      </main>
      <footer>Projeto Integrador • Fase 2 • Dados de demonstração</footer>
    </div>
  );
}
