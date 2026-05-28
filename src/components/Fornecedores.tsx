/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, ShieldCheck, Mail, Phone, MapPin, Search } from 'lucide-react';
import { Fornecedor } from '../types';

interface FornecedoresProps {
  fornecedores: Fornecedor[];
  onAddFornecedor: (forn: Omit<Fornecedor, 'id'>) => void;
  onDeleteFornecedor: (id: string) => void;
  userRole: string;
}

export default function Fornecedores({ fornecedores, onAddFornecedor, onDeleteFornecedor, userRole }: FornecedoresProps) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState<'Alimentação' | 'Materiais permanentes' | 'Informática' | 'Manutenção predial' | 'Construção' | 'Outros'>('Alimentação');
  const [dadosBancarios, setDadosBancarios] = useState('');
  const [pix, setPix] = useState('');
  const [doc, setDoc] = useState('');

  const canEdit = userRole === 'Administrador' || userRole === 'Financeiro';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !cnpj) return alert("Preecha nome e CNPJ corporativo!");
    
    onAddFornecedor({
      nome,
      cnpj,
      endereco,
      telefone,
      email,
      tipo_fornecedor: tipo,
      dados_bancarios: dadosBancarios || undefined,
      pix: pix || undefined,
      documentoUrl: doc || undefined
    });

    setNome('');
    setCnpj('');
    setEndereco('');
    setTelefone('');
    setEmail('');
    setDadosBancarios('');
    setPix('');
    setDoc('');
    setShowForm(false);
  };

  const filteredFornecedores = fornecedores.filter(
    f => f.nome.toLowerCase().includes(search.toLowerCase()) || f.cnpj.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fornecedores Corporativos</h2>
          <p className="text-xs text-slate-500">Mapeamento e registro fiscal de fornecedores de alimentos, materiais construtivos e tecnologia da informação.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Cadastrar Fornecedor</span>
          </button>
        )}
      </div>

      {/* Caixa de Busca */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center space-x-3">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Pesquisar fornecedor cadastrado por nome ou CNPJ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-xs w-full focus:outline-none text-slate-700"
        />
      </div>

      {/* Lista Layout Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFornecedores.map(f => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 relative group hover:border-slate-350 transition shadow-xs">
            {canEdit && (
              <button
                onClick={() => onDeleteFornecedor(f.id)}
                title="Excluir Fornecedor"
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            )}

            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-800 text-sm">{f.nome}</h3>
                  <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded uppercase">
                    {f.tipo_fornecedor}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">CNPJ: {f.cnpj}</p>
              </div>
            </div>

            {/* Informações detalhadas do fornecedor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-100 pt-3.5 pt-3">
              <div className="flex items-center space-x-1.5">
                <Mail size={13} className="text-slate-400" />
                <span className="truncate">{f.email}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone size={13} className="text-slate-400" />
                <span>{f.telefone}</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:col-span-2">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{f.endereco}</span>
              </div>
            </div>

            {/* Finance / Bank Details segment */}
            {(f.dados_bancarios || f.pix) && (
              <div className="bg-slate-50 rounded-lg p-3 text-[11px] font-mono border border-slate-100 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Dados de Faturamento e Crédito</div>
                {f.dados_bancarios && <p className="text-slate-600">Banco: {f.dados_bancarios}</p>}
                {f.pix && <p className="text-slate-600">Chave PIX: <b className="text-emerald-700">{f.pix}</b></p>}
              </div>
            )}
          </div>
        ))}
        {filteredFornecedores.length === 0 && (
          <p className="col-span-full text-center text-xs p-8 text-slate-400">Nenhum fornecedor localizado.</p>
        )}
      </div>

      {/* MODAL CONFIG */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Novo Fornecedor</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Razão Social / Nome Fantasia</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Comercial de Alimentos Arco-Íris Ltda"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CNPJ Corporativo</label>
                  <input
                    type="text"
                    required
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tipo de Fornecimento</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                  >
                    <option value="Alimentação">Alimentação / Cozinha</option>
                    <option value="Materiais permanentes">Materiais Permanentes</option>
                    <option value="Informática">Informática / Telecom</option>
                    <option value="Manutenção predial">Manutenção Predial</option>
                    <option value="Construção">Construção Civil</option>
                    <option value="Outros">Outras Categorias</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Telefone da Firma</label>
                  <input
                    type="text"
                    required
                    placeholder="(XX) XXXXX-XXXX"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">E-mail Comercial</label>
                  <input
                    type="email"
                    required
                    placeholder="compras@fornecedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Endereço de Faturamento</label>
                <input
                  type="text"
                  required
                  placeholder="Rua, número, Bairro - Cidade/UF"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Dados Bancários (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Bradesco Ag 0110 CC 9980-1"
                    value={dadosBancarios}
                    onChange={(e) => setDadosBancarios(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Chave PIX de Cobrança</label>
                  <input
                    type="text"
                    placeholder="E-mail ou CNPJ"
                    value={pix}
                    onChange={(e) => setPix(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
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
                  Salvar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
