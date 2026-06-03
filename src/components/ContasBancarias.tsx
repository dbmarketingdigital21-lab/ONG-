/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Trash2, 
  CheckCircle, 
  User, 
  ShieldAlert, 
  Hash, 
  Activity,
  X 
} from 'lucide-react';
import { ContaBancaria } from '../types';

interface ContasBancariasProps {
  contas: ContaBancaria[];
  onAddConta: (conta: Omit<ContaBancaria, 'id'>) => Promise<void>;
  onDeleteConta: (id: string) => Promise<void>;
  userRole: string;
}

export default function ContasBancarias({
  contas,
  onAddConta,
  onDeleteConta,
  userRole
}: ContasBancariasProps) {
  const [showForm, setShowForm] = useState(false);
  const [bancoName, setBancoName] = useState('');
  const [bancoAg, setBancoAg] = useState('');
  const [bancoCc, setBancoCc] = useState('');
  const [bancoTipo, setBancoTipo] = useState<'Corrente' | 'Poupança' | 'Aplicação'>('Corrente');
  const [bancoPix, setBancoPix] = useState('');
  const [bancoTitular, setBancoTitular] = useState('ONG Chico Xavier');

  const canEdit = userRole === 'Administrador' || userRole === 'Financeiro';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bancoName || !bancoAg || !bancoCc) {
      return alert('Preencha os campos bancários chaves: Banco, Agência e Conta');
    }
    try {
      await onAddConta({
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
      setShowForm(false);
    } catch (err) {
      alert('Erro ao cadastrar a conta bancária.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja desvincular a conta do ${name}?`)) {
      try {
        await onDeleteConta(id);
      } catch (err) {
        alert('Erro ao excluir conta.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Contas Bancárias</h2>
          <p className="text-xs text-slate-500 font-sans">Gerencie as contas correntes, poupanças e chaves Pix da instituição</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Cadastrar Conta</span>
          </button>
        )}
      </div>

      {/* Grid of Bank Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contas.map((c) => (
          <div 
            key={c.id} 
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 hover:border-slate-300 transition relative group"
          >
            {canEdit && (
              <button
                onClick={() => handleDelete(c.id, c.banco)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded-lg transition opacity-100 md:opacity-0 md:group-hover:opacity-100 cursor-pointer"
                title="Desvincular Conta"
              >
                <Trash2 size={14} />
              </button>
            )}

            <div className="flex items-center justify-between">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/15 font-mono uppercase">
                {c.tipo_conta}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Agência: {c.agencia}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 font-display text-sm">{c.banco}</h4>
              <p className="text-[11px] text-slate-450 font-mono mt-0.5">Conta Corrente: {c.conta}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2 text-xs font-sans text-slate-650">
              <div className="flex items-center space-x-1.5 min-w-0">
                <User size={13} className="text-slate-400" />
                <span className="truncate">Titular: <b>{c.titular}</b></span>
              </div>
              {c.pixEscrita && (
                <div className="flex items-center space-x-1.5 min-w-0">
                  <CreditCard size={13} className="text-[#10b981]" />
                  <span className="truncate">Chave Pix: <strong className="text-emerald-700">{c.pixEscrita}</strong></span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-1 text-[10px] font-semibold text-emerald-600">
                <CheckCircle size={12} className="text-emerald-500" />
                <span>Ativa e Integrada</span>
              </div>
            </div>
          </div>
        ))}

        {contas.length === 0 && (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 font-sans">
            <CreditCard size={32} className="text-slate-350" />
            <div className="space-y-1">
              <p className="font-bold text-slate-800 text-sm">Nenhuma conta cadastrada</p>
              <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
                Cadastre as contas bancárias da instituição para realizar a transparência nos relatórios analíticos.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Cadastro de Conta Bancária */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm font-display">Cadastrar Nova Conta</h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 px-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Banco / Instituição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Banco do Brasil S/A"
                  value={bancoName}
                  onChange={(e) => setBancoName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Agência</label>
                  <input
                    type="text"
                    required
                    placeholder="1234-5"
                    value={bancoAg}
                    onChange={(e) => setBancoAg(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Conta Corrente</label>
                  <input
                    type="text"
                    required
                    placeholder="99887-1"
                    value={bancoCc}
                    onChange={(e) => setBancoCc(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Tipo de Conta</label>
                  <select
                    value={bancoTipo}
                    onChange={(e) => setBancoTipo(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2.5 bg-white text-slate-700"
                  >
                    <option value="Corrente">Conta Corrente</option>
                    <option value="Poupança">Poupança</option>
                    <option value="Aplicação">Investimento / Aplicação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Chave Pix (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: CNPJ ou E-mail"
                    value={bancoPix}
                    onChange={(e) => setBancoPix(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Titular Responsável</label>
                <input
                  type="text"
                  required
                  value={bancoTitular}
                  onChange={(e) => setBancoTitular(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2 shadow-sm border border-slate-305 rounded-xl text-slate-705 font-semibold bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                >
                  Cadastrar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
