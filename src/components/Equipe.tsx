/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Calendar, UserCheck, Shield, Award, Sparkles } from 'lucide-react';
import { Dirigente, Coordenador } from '../types';

interface EquipeProps {
  dirigentes: Dirigente[];
  coordenadores: Coordenador[];
  onAddDirigente: (dir: Omit<Dirigente, 'id'>) => void;
  onDeleteDirigente: (id: string) => void;
  onAddCoordenador: (coor: Omit<Coordenador, 'id'>) => void;
  onDeleteCoordenador: (id: string) => void;
  userRole: string;
}

export default function Equipe({
  dirigentes,
  coordenadores,
  onAddDirigente,
  onDeleteDirigente,
  onAddCoordenador,
  onDeleteCoordenador,
  userRole
}: EquipeProps) {
  const [showDirForm, setShowDirForm] = useState(false);
  const [showCoorForm, setShowCoorForm] = useState(false);

  // Dirigente Form State
  const [dirNome, setDirNome] = useState('');
  const [dirCpf, setDirCpf] = useState('');
  const [dirRg, setDirRg] = useState('');
  const [dirCargo, setDirCargo] = useState('Presidente');
  const [dirTel, setDirTel] = useState('');
  const [dirEmail, setDirEmail] = useState('');
  const [dirInicio, setDirInicio] = useState(new Date().toISOString().split('T')[0]);
  const [dirFim, setDirFim] = useState('2027-12-31');

  // Coordenador Form State
  const [coorNome, setCoorNome] = useState('');
  const [coorCpf, setCoorCpf] = useState('');
  const [coorCargo, setCoorCargo] = useState('Coordenador Geral');
  const [coorTel, setCoorTel] = useState('');
  const [coorEmail, setCoorEmail] = useState('');
  const [coorProjeto, setCoorProjeto] = useState('');

  const canEdit = userRole === 'Administrador' || userRole === 'Coordenador';

  const handleDirSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirNome || !dirCpf) return alert("Preencha nome e CPF!");
    
    onAddDirigente({
      nome_completo: dirNome,
      cpf: dirCpf,
      rg: dirRg || undefined,
      cargo: dirCargo,
      telefone: dirTel,
      email: dirEmail,
      data_inicio_mandato: dirInicio,
      data_fim_mandato: dirFim,
      status: 'Ativo'
    });

    setDirNome('');
    setDirCpf('');
    setDirRg('');
    setDirTel('');
    setDirEmail('');
    setShowDirForm(false);
  };

  const handleCoorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coorNome || !coorCpf || !coorProjeto) return alert("Nome, CPF e Projeto são obrigatórios!");
    
    onAddCoordenador({
      nome: coorNome,
      cpf: coorCpf,
      cargo: coorCargo,
      telefone: coorTel,
      email: coorEmail,
      projeto_vinculado: coorProjeto,
      status: 'Ativo'
    });

    setCoorNome('');
    setCoorCpf('');
    setCoorTel('');
    setCoorEmail('');
    setCoorProjeto('');
    setShowCoorForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Diretoria Executiva e Coordenação</h2>
        <p className="text-xs text-slate-500">Gestão administrativa de cargos eleitos de dirigentes, conselhos fiscais deliberativos e equipe técnica de projetos.</p>
      </div>

      {/* DIRIGENTES LIST */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Award size={18} className="text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">Dirigentes Eleitos (Ata de Fundação / Estatuto)</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowDirForm(true)}
              className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1.5 rounded hover:bg-emerald-100 flex items-center space-x-1 cursor-pointer transition"
            >
              <Plus size={12} />
              <span>Adicionar Dirigente</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dirigentes.map(d => (
            <div key={d.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-2 relative group hover:border-slate-300 transition">
              {canEdit && (
                <button
                  onClick={() => onDeleteDirigente(d.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Inativar Dirigente"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {d.cargo}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Mandato: {d.data_inicio_mandato} a {d.data_fim_mandato}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{d.nome_completo}</h4>
              <p className="text-[11px] text-slate-500 font-mono">CPF: {d.cpf} {d.rg && `| RG: ${d.rg}`}</p>
              <div className="text-[11px] text-slate-650 flex flex-col pt-1.5 border-t border-slate-100/50">
                <span>E-mail: <b>{d.email}</b></span>
                <span>Contato: <b>{d.telefone}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COORDENADORES LIST */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <UserCheck size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Coordenadores de Projetos Sociais</h3>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowCoorForm(true)}
              className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1.5 rounded hover:bg-indigo-100 flex items-center space-x-1 cursor-pointer transition"
            >
              <Plus size={12} />
              <span>Adicionar Coordenador</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordenadores.map(c => (
            <div key={c.id} className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-2 relative group hover:border-slate-350 transition">
              {canEdit && (
                <button
                  onClick={() => onDeleteCoordenador(c.id)}
                  className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Remover Coordenador"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {c.cargo}
                </span>
                <span className="text-[10px] bg-slate-150 text-slate-700 font-bold px-2 py-0.5 rounded truncate max-w-44">
                  Proj: {c.projeto_vinculado}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{c.nome}</h4>
              <p className="text-[11px] text-slate-500 font-mono">CPF: {c.cpf}</p>
              <div className="text-[11px] text-slate-650 flex flex-col pt-1.5 border-t border-slate-100/50">
                <span>E-mail: <b>{c.email}</b></span>
                <span>Contato: <b>{c.telefone}</b></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FORMS MODAIS --- */}

      {/* Modal Dirigente */}
      {showDirForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Adicionar Dirigente Conselho</h3>
            <form onSubmit={handleDirSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Carlos Eduardo Mendes"
                  value={dirNome}
                  onChange={(e) => setDirNome(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CPF do Titular</label>
                  <input
                    type="text"
                    required
                    placeholder="123.456.789-00"
                    value={dirCpf}
                    onChange={(e) => setDirCpf(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cédula de Identidade RG</label>
                  <input
                    type="text"
                    placeholder="99.999.999-X"
                    value={dirRg}
                    onChange={(e) => setDirRg(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cargo Deliberado</label>
                  <select
                    value={dirCargo}
                    onChange={(e) => setDirCargo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                  >
                    <option value="Presidente">Presidente</option>
                    <option value="Secretária Geral">Secretária Geral</option>
                    <option value="Secretário Adjunto">Secretário Adjunto</option>
                    <option value="Tesoureiro">Tesoureiro Principal</option>
                    <option value="Conselheiro Fiscal">Conselheiro Fiscal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98777-6655"
                    value={dirTel}
                    onChange={(e) => setDirTel(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="carlos.fin@vivaamanha.org"
                  value={dirEmail}
                  onChange={(e) => setDirEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Início da Gestão/Mandato</label>
                  <input
                    type="date"
                    required
                    value={dirInicio}
                    onChange={(e) => setDirInicio(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Fim Mandato Eleito</label>
                  <input
                    type="date"
                    required
                    value={dirFim}
                    onChange={(e) => setDirFim(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDirForm(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-705 bg-slate-50 font-semibold rounded cursor-pointer hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white font-semibold rounded cursor-pointer hover:bg-emerald-700"
                >
                  Eleger e Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Coordenador */}
      {showCoorForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Nova Coordenação Técnica</h3>
            <form onSubmit={handleCoorSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nome do Profissional</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Costa"
                  value={coorNome}
                  onChange={(e) => setCoorNome(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">CPF do Trabalhador</label>
                  <input
                    type="text"
                    required
                    placeholder="111.222.333-44"
                    value={coorCpf}
                    onChange={(e) => setCoorCpf(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Cargo Técnico</label>
                  <input
                    type="text"
                    required
                    value={coorCargo}
                    onChange={(e) => setCoorCargo(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Telefone de Contato</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 98111-2233"
                    value={coorTel}
                    onChange={(e) => setCoorTel(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    required
                    placeholder="mariana@vivaamanha.org"
                    value={coorEmail}
                    onChange={(e) => setCoorEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Projeto Vinculado da OSC</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Reforço Escolar da Comunidade, Apoio Alimentar"
                  value={coorProjeto}
                  onChange={(e) => setCoorProjeto(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCoorForm(false)}
                  className="px-3.5 py-2 border border-slate-300 text-slate-705 bg-slate-50 font-semibold rounded cursor-pointer hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 text-white font-semibold rounded cursor-pointer hover:bg-indigo-700"
                >
                  Vincular e Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
