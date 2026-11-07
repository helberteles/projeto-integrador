const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || 'Falha na comunicação com a API.');
  return data;
}

export const api = {
  listarProdutos: () => request('/produtos'),
  criarProduto: (produto) => request('/produtos', { method: 'POST', body: JSON.stringify(produto) }),
  excluirProduto: (id) => request(`/produtos/${id}`, { method: 'DELETE' }),
  listarFornecedores: () => request('/fornecedores'),
  criarFornecedor: (fornecedor) => request('/fornecedores', { method: 'POST', body: JSON.stringify(fornecedor) }),
  excluirFornecedor: (id) => request(`/fornecedores/${id}`, { method: 'DELETE' }),
  listarAssociacoes: () => request('/associacoes'),
  criarAssociacao: (associacao) => request('/associacoes', { method: 'POST', body: JSON.stringify(associacao) }),
  excluirAssociacao: (produtoId, fornecedorId) => request(`/associacoes/${produtoId}/${fornecedorId}`, { method: 'DELETE' })
};
