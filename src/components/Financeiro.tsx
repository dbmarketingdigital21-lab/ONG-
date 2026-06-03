/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileSpreadsheet, 
  FileText, 
  Upload, 
  Download,
  DollarSign
} from 'lucide-react';
import { Receita, Despesa, ContaBancaria, Fornecedor } from '../types';

interface FinanceiroProps {
  receitas: Receita[];
  despesas: Despesa[];
  contas: ContaBancaria[];
  fornecedores: Fornecedor[];
  onAddReceita: (rec: Omit<Receita, 'id'>) => void;
  onDeleteReceita: (id: string) => void;
  onAddDespesa: (des: Omit<Despesa, 'id' | 'fornecedor_nome'>) => void;
  onDeleteDespesa: (id: string) => void;
  onAddConta: (conta: Omit<ContaBancaria, 'id'>) => void;
  onDeleteConta: (id: string) => void;
  userRole: string;
}

export default function Financeiro({
  receitas,
  despesas,
  contas,
  fornecedores,
  onAddReceita,
  onDeleteReceita,
  onAddDespesa,
  onDeleteDespesa,
  onAddConta,
  onDeleteConta,
  userRole
}: FinanceiroProps) {
  // Estados para formulários
  const [showRecForm, setShowRecForm] = useState(false);
  const [showDespForm, setShowDespForm] = useState(false);
  const [showContaForm, setShowContaForm] = useState(false);

  // Form Receita State
  const [recCat, setRecCat] = useState<'Doação financeira' | 'Almoço' | 'Bazar' | 'Eventos' | 'Outros'>('Doação financeira');
  const [recEvento, setRecEvento] = useState('');
  const [recValor, setRecValor] = useState('');
  const [recData, setRecData] = useState(new Date().toISOString().split('T')[0]);
  const [recForma, setRecForma] = useState<'Pix' | 'Transferência' | 'Dinheiro' | 'Cartão' | 'Boleto'>('Pix');
  const [recObs, setRecObs] = useState('');

  // Form Despesa State
  const [despCat, setDespCat] = useState('Alimentação');
  const [despValor, setDespValor] = useState('');
  const [despData, setDespData] = useState(new Date().toISOString().split('T')[0]);
  const [despFornecedorId, setDespFornecedorId] = useState('');
  const [despForma, setDespForma] = useState<'Pix' | 'Transferência' | 'Dinheiro' | 'Cartão' | 'Boleto'>('Pix');
  const [despComprovante, setDespComprovante] = useState('');

  // Form Conta Bancária State
  const [bancoName, setBancoName] = useState('');
  const [bancoAg, setBancoAg] = useState('');
  const [bancoCc, setBancoCc] = useState('');
  const [bancoTipo, setBancoTipo] = useState<'Corrente' | 'Poupança' | 'Aplicação'>('Corrente');
  const [bancoPix, setBancoPix] = useState('');
  const [bancoTitular, setBancoTitular] = useState('ONG Chico Xavier');

  // Estado de Importação de Arquivo Bancário
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  const canEdit = userRole === 'Administrador' || userRole === 'Financeiro';

  // Submissão Receita
  const handleRecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recValor || parseFloat(recValor) <= 0) return alert('Insira um preço válido!');
    onAddReceita({
      categoria: recCat,
      tipo_evento: recEvento,
      valor: parseFloat(recValor),
      data: recData,
      forma_pagamento: recForma,
      observacoes: recObs
    });
    setRecValor('');
    setRecEvento('');
    setRecObs('');
    setShowRecForm(false);
  };

  // Submissão Despesa
  const handleDespSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!despValor || parseFloat(despValor) <= 0) return alert('Insira um preço de despesa adequado!');
    if (!despFornecedorId) return alert('Selecione um fornecedor para esta despesa.');
    onAddDespesa({
      categoria: despCat,
      valor: parseFloat(despValor),
      data: despData,
      fornecedor_id: despFornecedorId,
      forma_pagamento: despForma,
      comprovanteUrl: despComprovante || undefined
    });
    setDespValor('');
    setDespComprovante('');
    setShowDespForm(false);
  };

  // Submissão Conta
  const handleContaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bancoName || !bancoAg || !bancoCc) return alert('Preencha os campos bancários chaves');
    onAddConta({
      banco: bancoName,
      agencia: bancoAg,
      conta: bancoCc,
      tipo_conta: bancoTipo,
      pixEscrita: bancoPix,
      titular: bancoTitular,
      status: 'Ativa'
    });
    setBancoName('');
    setBancoAg('');
    setBancoCc('');
    setBancoPix('');
    setShowContaForm(false);
  };

  // Simulação Drag & Drop de Importação de Extrato OFX/PDF
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportLoading(true);
    setImportStatus("Processando arquivo bancário...");

    setTimeout(() => {
      setImportLoading(false);
      setImportStatus(`Extrato Bancário (${file.name}) processado com sucesso! Foram identificados 3 lançamentos correspondentes.`);
    }, 1500);
  };

  // Exportação Simulada
  const handleExport = (type: 'pdf' | 'excel' | 'ofx') => {
    if (type === 'pdf') {
      alert("Gerando download do Relatório Financeiro Analítico em PDF...");
    } else if (type === 'excel') {
      alert("Exportando fluxo de caixa consolidado para formato XLS / Excel...");
    } else {
      alert("Exportando dados bancários configurados em layout OFX para conciliação...");
    }
  };

  return (
    <div className="space-y-6">
      {/* Botões Superiores de Ação e Título */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Módulo Financeiro</h2>
          <p className="text-xs text-slate-500">Gestão integrada de doações corporativas, bazar de caridade, despesas e faturas de fornecedores.</p>
        </div>
        {canEdit && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRecForm(true)}
              className="px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Lançar Receita</span>
            </button>
            <button
              onClick={() => setShowDespForm(true)}
              className="px-3.5 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span>Lançar Despesa</span>
            </button>
          </div>
        )}
      </div>

      {/* Seção de Contas Bancárias (Minimal) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard size={18} className="text-slate-600" />
            <h3 className="font-semibold text-slate-800 text-sm">Contas Bancárias Ativas</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowContaForm(true)}
              className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <Plus size={12} />
              <span>Cadastrar Conta</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contas.map(c => (
            <div key={c.id} className="border border-slate-100 bg-slate-50 rounded-lg p-4 space-y-2 relative group hover:border-slate-300 transition">
              {canEdit && (
                <button
                  onClick={() => onDeleteConta(c.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
                  {c.tipo_conta}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Ag: {c.agencia} • C/C: {c.conta}</span>
              </div>
              <h4 className="font-semibold text-slate-800 text-xs">{c.banco}</h4>
              <p className="text-[11px] text-slate-500 font-mono">Titular: {c.titular}</p>
              {c.pixEscrita && (
                <div className="text-[10px] text-slate-600 font-mono">
                  Chave Pix: <b className="text-emerald-700">{c.pixEscrita}</b>
                </div>
              )}
            </div>
          ))}
          {contas.length === 0 && (
            <p className="col-span-full text-center text-xs text-slate-400">Nenhuma conta configurada ainda.</p>
          )}
        </div>
      </div>

      {/* Grid: Entradas x Saídas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TABELA DE RECEITAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ArrowUpRight size={18} className="text-emerald-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Doações e Receitas (Crédito)</h3>
            </div>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <th className="p-2.5">Categoria</th>
                  <th className="p-2.5">Data/Forma</th>
                  <th className="p-2.5">Valor</th>
                  {canEdit && <th className="p-2.5 text-center">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {receitas.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5">
                      <div className="font-semibold">{r.categoria}</div>
                      {r.tipo_evento && <span className="text-[9px] text-slate-400 block">{r.tipo_evento}</span>}
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-500">
                      {r.data} <br/> ({r.forma_pagamento})
                    </td>
                    <td className="p-2.5 font-bold text-emerald-600">R$ {r.valor.toFixed(2)}</td>
                    {canEdit && (
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => onDeleteReceita(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {receitas.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 4 : 3} className="text-center p-6 text-slate-400">Nenhuma receita lançada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABELA DE DESPESAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <ArrowDownRight size={18} className="text-rose-600" />
              <h3 className="font-semibold text-slate-800 text-sm">Despesas e Pagamentos (Débito)</h3>
            </div>
          </div>
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
                  <th className="p-2.5">Item/Categoria</th>
                  <th className="p-2.5">Fornecedor</th>
                  <th className="p-2.5">Valor</th>
                  {canEdit && <th className="p-2.5 text-center">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {despesas.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5">
                      <div className="font-semibold">{d.categoria}</div>
                      <span className="text-[10px] text-slate-500 font-mono font-medium block">{d.data} • {d.forma_pagamento}</span>
                    </td>
                    <td className="p-2.5 text-[11px] text-slate-600">{d.fornecedor_nome}</td>
                    <td className="p-2.5 font-bold text-rose-600">R$ {d.valor.toFixed(2)}</td>
                    {canEdit && (
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => onDeleteDespesa(d.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {despesas.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 4 : 3} className="text-center p-6 text-slate-400">Nenhuma despesa lançada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Caixa de Importação e Exportação (Simulação Completa PDF, Excel, OFX) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-white rounded-xl p-6 border border-slate-800">
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">Importação Bancária Integrada (OFX / PDF)</h3>
          <p className="text-xs text-slate-400">Arraste seu arquivo de extrato consolidado do seu banco para o campo de upload para efetuar a conciliação automática.</p>
          
          <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-5 flex flex-col items-center justify-center space-y-2 transition bg-slate-950 relative">
            <Upload size={28} className="text-slate-400" />
            <span className="text-xs font-semibold">Fazer upload de arquivo OFX ou PDF</span>
            <span className="text-[10px] text-slate-500">Arraste aqui ou clique para selecionar</span>
            <input
              type="file"
              accept=".ofx,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          {importLoading && (
            <div className="text-xs text-emerald-400 animate-pulse flex items-center space-x-1">
              <span className="animate-spin mr-1">⌛</span> Processando arquivo...
            </div>
          )}
          {importStatus && (
            <p className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 p-2.5 rounded">
              {importStatus}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-white">Exportação e Emissão de Transparência</h3>
          <p className="text-xs text-slate-400 font-light">Emita relatórios financeiros analíticos para prestação de contas governamentais ou aprovações de diretoria.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleExport('pdf')}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-705 rounded-xl transition space-y-1.5 cursor-pointer text-center"
            >
              <FileText size={20} className="text-rose-400" />
              <span className="text-[11px] font-semibold">Gerar PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-705 rounded-xl transition space-y-1.5 cursor-pointer text-center"
            >
              <FileSpreadsheet size={20} className="text-emerald-400" />
              <span className="text-[11px] font-semibold">Gerar Excel</span>
            </button>
            <button
              onClick={() => handleExport('ofx')}
              className="flex flex-col items-center justify-center p-3.5 bg-slate-850 hover:bg-slate-800 border border-slate-705 rounded-xl transition space-y-1.5 cursor-pointer text-center"
            >
              <Download size={20} className="text-blue-400" />
              <span className="text-[11px] font-semibold">Exportar OFX</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAIS DE CADASTRO --- */}

      {/* Modal Lançar Receita */}
      {showRecForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Lançar Receita</h3>
            <form onSubmit={handleRecSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Categoria da Receita</label>
                <select
                  value={recCat}
                  onChange={(e) => setRecCat(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="Doação financeira">Doação financeira</option>
                  <option value="Almoço">Almoço</option>
                  <option value="Bazar">Bazar</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Tipo de Evento (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Bazar de Outono"
                  value={recEvento}
                  onChange={(e) => setRecEvento(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={recValor}
                    onChange={(e) => setRecValor(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={recData}
                    onChange={(e) => setRecData(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Forma de Pagamento</label>
                <select
                  value={recForma}
                  onChange={(e) => setRecForma(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="Pix">Pix / Chave</option>
                  <option value="Transferência">Transferência Bancária</option>
                  <option value="Dinheiro">Dinheiro Físico</option>
                  <option value="Cartão">Cartão Débito/Crédito</option>
                  <option value="Boleto">Boleto Bancário</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Observações</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes da emenda, doadores, etc."
                  value={recObs}
                  onChange={(e) => setRecObs(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-700 font-semibold bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-750 transition cursor-pointer"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Lançar Despesa */}
      {showDespForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Lançar Despesa / Fatura</h3>
            <form onSubmit={handleDespSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Categoria de Custo</label>
                <select
                  value={despCat}
                  onChange={(e) => setDespCat(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="Alimentação">Alimentação / Cozinha</option>
                  <option value="Materiais Didáticos">Materiais Didáticos / Escola</option>
                  <option value="Manutenção Predial">Manutenção Predial / Reformas</option>
                  <option value="Serviços de Terceiros">Serviços de Terceiros / Telecom</option>
                  <option value="Salários / Direção">Salários / Direção administrativa</option>
                  <option value="Outros">Outras despesas operacionais</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Fornecedor Credor</label>
                <select
                  required
                  value={despFornecedorId}
                  onChange={(e) => setDespFornecedorId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="">Selecione o fornecedor...</option>
                  {fornecedores.map(f => (
                    <option key={f.id} value={f.id}>{f.nome} ({f.tipo_fornecedor})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Valor do Pagamento</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={despValor}
                    onChange={(e) => setDespValor(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={despData}
                    onChange={(e) => setDespData(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Forma de Pagamento</label>
                <select
                  value={despForma}
                  onChange={(e) => setDespForma(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                >
                  <option value="Pix">Pix / Chave</option>
                  <option value="Transferência">Transferência Bancária</option>
                  <option value="Dinheiro">Dinheiro Físico</option>
                  <option value="Cartão">Cartão Débito/Crédito</option>
                  <option value="Boleto">Boleto Bancário</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Simular Anexação de Comprovante (Base64/Url)</label>
                <input
                  type="text"
                  placeholder="URL do arquivo comprovante ou simular..."
                  value={despComprovante}
                  onChange={(e) => setDespComprovante(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDespForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-700 font-semibold bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-rose-600 text-white rounded font-semibold hover:bg-rose-700 transition cursor-pointer"
                >
                  Concluir Saída
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Cadastro de Conta Bancária */}
      {showContaForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Nova Conta Bancária</h3>
            <form onSubmit={handleContaSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Banco / Instituição Emissora</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Banco do Brasil S/A"
                  value={bancoName}
                  onChange={(e) => setBancoName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Agência</label>
                  <input
                    type="text"
                    required
                    placeholder="1234-5"
                    value={bancoAg}
                    onChange={(e) => setBancoAg(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Conta Corrente</label>
                  <input
                    type="text"
                    required
                    placeholder="99887-1"
                    value={bancoCc}
                    onChange={(e) => setBancoCc(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Tipo de Conta</label>
                  <select
                    value={bancoTipo}
                    onChange={(e) => setBancoTipo(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                  >
                    <option value="Corrente">Conta Corrente</option>
                    <option value="Poupança">Poupança</option>
                    <option value="Aplicação">Investimento / Aplicação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Titular Responsável</label>
                  <input
                    type="text"
                    required
                    value={bancoTitular}
                    onChange={(e) => setBancoTitular(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Chave Pix de Recebimento</label>
                <input
                  type="text"
                  placeholder="E-mail, CNPJ ou Celular"
                  value={bancoPix}
                  onChange={(e) => setBancoPix(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContaForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-700 font-semibold bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white rounded font-semibold hover:bg-emerald-700 transition cursor-pointer"
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
