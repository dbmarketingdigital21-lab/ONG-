/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle, RefreshCw, BarChart2, PackageOpen } from 'lucide-react';
import { ItemEstoque } from '../types';

interface EstoqueProps {
  estoque: ItemEstoque[];
  onAddItem: (item: Omit<ItemEstoque, 'id' | 'status'>) => void;
  onUpdateItem: (id: string, item: Omit<ItemEstoque, 'id' | 'status'>) => void;
  onDeleteItem: (id: string) => void;
  userRole: string;
}

export default function Estoque({ estoque, onAddItem, onUpdateItem, onDeleteItem, userRole }: EstoqueProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [nota, setNota] = useState('');
  const [quant, setQuant] = useState('');
  const [custo, setCusto] = useState('');
  const [validade, setValidade] = useState('');
  const [local, setLocal] = useState('');
  const [categoria, setCategoria] = useState('Alimentos');
  const [codigo, setCodigo] = useState('');

  const canEdit = userRole === 'Administrador' || userRole === 'Financeiro' || userRole === 'Coordenador';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !quant) return alert("Preencha o nome do item e quantidade!");

    const payload = {
      nome_item: nome,
      nota_fiscal: nota || undefined,
      quantidade: parseInt(quant),
      custo: parseFloat(custo || '0'),
      validade: validade || undefined,
      local_armazenagem: local,
      categoria,
      codigo_interno: codigo || undefined
    };

    if (editingId) {
      onUpdateItem(editingId, payload);
    } else {
      onAddItem(payload);
    }

    // Reset
    setNome('');
    setNota('');
    setQuant('');
    setCusto('');
    setValidade('');
    setLocal('');
    setCategoria('Alimentos');
    setCodigo('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item: ItemEstoque) => {
    setEditingId(item.id);
    setNome(item.nome_item);
    setNota(item.nota_fiscal || '');
    setQuant(item.quantidade.toString());
    setCusto(item.custo.toString());
    setValidade(item.validade || '');
    setLocal(item.local_armazenagem);
    setCategoria(item.categoria);
    setCodigo(item.codigo_interno || '');
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Head */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Almoxarifado & Estoque Comunitário</h2>
          <p className="text-xs text-slate-500">Controle de insumos, doações recebidas de cestas básicas, papelaria de apoio escolar e validade de lactovídeos.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingId(null);
              setNome('');
              setNota('');
              setQuant('');
              setCusto('');
              setValidade('');
              setLocal('');
              setCategoria('Alimentos');
              setCodigo('');
              setShowForm(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Cadastrar Insumo / Entrada</span>
          </button>
        )}
      </div>

      {/* Caixa de estatísticas do estoque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-slate-200 bg-white p-4 rounded-xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <BarChart2 size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono tracking-wider">Itens Registrados</span>
            <p className="text-lg font-bold text-slate-800">{estoque.length} Categorias em Armazém</p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4 rounded-xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono tracking-wider">Alerta Mínimo</span>
            <p className="text-lg font-bold text-amber-600">
              {estoque.filter(item => item.status === 'Estoque Baixo' || item.status === 'Esgotado').length} Itens em Atenção
            </p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-4 rounded-xl flex items-center space-x-3.5 shadow-xs">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <PackageOpen size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-medium uppercase font-mono tracking-wider">Desperdício / Validade</span>
            <p className="text-lg font-bold text-rose-600">
              {estoque.filter(item => item.status === 'Vencido').length} Lotes Vencidos
            </p>
          </div>
        </div>
      </div>

      {/* Listagem Geral */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-center select-none">
                <th className="p-3 text-left">Nome do Item / Código</th>
                <th className="p-3">Categoria</th>
                <th className="p-3 font-mono">NF-e</th>
                <th className="p-3">Qtd</th>
                <th className="p-3">Localização</th>
                <th className="p-3">Validade</th>
                <th className="p-3">Status</th>
                {canEdit && <th className="p-3">Controle</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-center">
              {estoque.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-3 text-left">
                    <div className="font-semibold text-slate-800">{item.nome_item}</div>
                    {item.codigo_interno && (
                      <span className="text-[10px] text-slate-400 font-mono block">Cod: {item.codigo_interno}</span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-500">{item.nota_fiscal || '-'}</td>
                  <td className="p-3">
                    <span className="font-bold">{item.quantidade} un</span>
                    <span className="text-[9px] text-slate-400 block">Custo R$ {item.custo.toFixed(2)}</span>
                  </td>
                  <td className="p-3 text-slate-600">{item.local_armazenagem}</td>
                  <td className="p-3 font-mono">{item.validade || 'Sem data'}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'Disponível' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'Estoque Baixo' ? 'bg-amber-100 text-amber-800' :
                      item.status === 'Esgotado' ? 'bg-slate-100 text-slate-600' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="p-3 space-x-1 select-none">
                      <button
                        onClick={() => handleEdit(item)}
                        title="Editar Insumo"
                        className="p-1 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition cursor-pointer"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        title="Excluir do cadastro"
                        className="p-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {estoque.length === 0 && (
                <tr>
                  <td colSpan={canEdit ? 8 : 7} className="p-8 text-slate-400 text-center text-xs">
                    Nenhum item em estoque no momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL CONFIG */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">
              {editingId ? 'Editar Insumo' : 'Entrada em Almoxarifado'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nome do Item / Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cesta Básica Tipo A"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Código de Controle</label>
                  <input
                    type="text"
                    placeholder="Ex: CST-11"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nota Fiscal N-e</label>
                  <input
                    type="text"
                    placeholder="Ex: NF-4099"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Quantidade</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 50"
                    value={quant}
                    onChange={(e) => setQuant(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={custo}
                    onChange={(e) => setCusto(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Categoria de Estoque</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                  >
                    <option value="Alimentos">Alimentos / Cozinha</option>
                    <option value="Papelaria">Papelaria / Escritório</option>
                    <option value="Limpeza">Material de Limpeza</option>
                    <option value="Esportivos">Insumos de Lazer / Esporte</option>
                    <option value="Outros">Outras Categorias</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Validade (Se aplicável)</label>
                  <input
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Local de Armazenagem</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Almoxarifado Principal, Cozinha"
                  value={local}
                  onChange={(e) => setLocal(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-700 font-semibold bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  {editingId ? 'Salvar Edições' : 'Registrar Insumo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
