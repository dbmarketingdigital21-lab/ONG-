/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  HeartHandshake, 
  Scale, 
  FileText, 
  ShoppingBag, 
  PenTool, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  CornerDownRight,
  Eraser
} from 'lucide-react';
import { ProcessoJudicial, Prontuario, CestaBasica, TermoResponsabilidade } from '../types';

interface SocialPsicologiaProps {
  processos: ProcessoJudicial[];
  prontuarios: Prontuario[];
  cestas: CestaBasica[];
  termos: TermoResponsabilidade[];
  onAddProcesso: (proc: Omit<ProcessoJudicial, 'id'>) => void;
  onDeleteProcesso: (id: string) => void;
  onAddProntuario: (pront: Omit<Prontuario, 'id' | 'data' | 'hora'>) => void;
  onDeleteProntuario: (id: string) => void;
  onAddCesta: (cesta: Omit<CestaBasica, 'id' | 'data_entrega'>) => void;
  onDeleteCesta: (id: string) => void;
  onAddTermo: (termo: Omit<TermoResponsabilidade, 'id' | 'data_criacao'>) => void;
  onDeleteTermo: (id: string) => void;
  userRole: string;
}

export default function SocialPsicologia({
  processos,
  prontuarios,
  cestas,
  termos,
  onAddProcesso,
  onDeleteProcesso,
  onAddProntuario,
  onDeleteProntuario,
  onAddCesta,
  onDeleteCesta,
  onAddTermo,
  onDeleteTermo,
  userRole
}: SocialPsicologiaProps) {
  // Tabs switcher
  const [activeSubTab, setActiveSubTab] = useState<'prontuarios' | 'cestas' | 'processos' | 'termos'>('prontuarios');

  // Modais trigger
  const [showForm, setShowForm] = useState(false);

  // States para formulários:
  // 1. Prontuários
  const [acolhido, setAcolhido] = useState('');
  const [tipoAtendimento, setTipoAtendimento] = useState('Consulta Individual Psicológica');
  const [responsavel, setResponsavel] = useState('Dr. Roberto Antunes (Psicólogo)');
  const [observacoes, setObservacoes] = useState('');

  // 2. Cestas Básicas
  const [recebedor, setRecebedor] = useState('');
  const [relacao, setRelacao] = useState<'Beneficiário' | 'Funcionário' | 'Voluntário' | 'Outros'>('Beneficiário');
  const [quantidade, setQuantidade] = useState('1');

  // 3. Processos Judiciais
  const [numeroProc, setNumeroProc] = useState('');
  const [situacaoProc, setSituacaoProc] = useState<'Ativo' | 'Arquivado' | 'Em Andamento'>('Ativo');
  const [envolvidos, setEnvolvidos] = useState('');
  const [obsProc, setObsProc] = useState('');

  // 4. Termos & Assinatura Digital
  const [termoResponsavel, setTermoResponsavel] = useState('');
  const [termoAto, setTermoAto] = useState('Termo de Consentimento - Direitos e Deveres');
  const [termoDesc, setTermoDesc] = useState('Autorizo o trânsito livre de meu assistido na instituição para fins educacionais e assumo total responsabilidade civil e jurídica.');
  const [assinaturaBase64, setAssinaturaBase64] = useState<string | null>(null);

  // Canvas Drawing Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const canEdit = userRole === 'Administrador' || userRole === 'Assistência Social' || userRole === 'Psicólogo';

  // Rotinas de Desenho no Canvas (Digital Signature Pad)
  useEffect(() => {
    if (activeSubTab === 'termos' && showForm && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }
    }
  }, [activeSubTab, showForm]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      setIsDrawing(true);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const rect = canvas.getBoundingClientRect();
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveCanvasSignature = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL();
    setAssinaturaBase64(dataUrl);
    alert("Assinatura autalografada salva com segurança no sistema!");
  };

  // Submissões
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeSubTab === 'prontuarios') {
      if (!acolhido || !observacoes) return alert("Acolhido e observações são obrigatórios!");
      onAddProntuario({ acolhido, tipo_atendimento: tipoAtendimento, responsavel, observacoes });
      setAcolhido('');
      setObservacoes('');
    } else if (activeSubTab === 'cestas') {
      if (!recebedor || !quantidade) return alert("Recebedor e quantidade são obrigatórios!");
      onAddCesta({ recebedor, relacao, quantidade: parseInt(quantidade) });
      setRecebedor('');
    } else if (activeSubTab === 'processos') {
      if (!numeroProc || !envolvidos) return alert("Número de processo e envolvidos são obrigatórios!");
      onAddProcesso({ numero_processo: numeroProc, situacao: situacaoProc, envolvidos, observacoes: obsProc });
      setNumeroProc('');
      setEnvolvidos('');
      setObsProc('');
    } else if (activeSubTab === 'termos') {
      if (!termoResponsavel || !termoDesc) return alert("Responsável e descrição do termo são obrigatórios!");
      onAddTermo({
        responsavel: termoResponsavel,
        ato: termoAto,
        descricao: termoDesc,
        assinatura_digital: assinaturaBase64 || undefined
      });
      setTermoResponsavel('');
      setAssinaturaBase64(null);
    }

    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Serviço de Assistência Social & Psicologia</h2>
          <p className="text-xs text-slate-500">Módulo direcionado a Prontuários psicossociais, entregas de cestas de subsistência e assinatura eletrônica de termos.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Cadastrar {
              activeSubTab === 'prontuarios' ? 'Prontuário' :
              activeSubTab === 'cestas' ? 'Entrega de Cesta' :
              activeSubTab === 'processos' ? 'Processo' : 'Termo de Responsabilidade'
            }</span>
          </button>
        )}
      </div>

      {/* Sub-navegação interna */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 select-none">
        <button
          onClick={() => setActiveSubTab('prontuarios')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'prontuarios' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Prontuários e Atendimentos
        </button>
        <button
          onClick={() => setActiveSubTab('cestas')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'cestas' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Cestas Básicas Entregues
        </button>
        <button
          onClick={() => setActiveSubTab('processos')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'processos' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Processos Judiciais Ativos
        </button>
        <button
          onClick={() => setActiveSubTab('termos')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'termos' ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Termos de Autorização
        </button>
      </div>

      {/* RENDER TAB CONFORME SCOPE */}

      {/* 1. PRONTUÁRIOS */}
      {activeSubTab === 'prontuarios' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 mb-2">
            <HeartHandshake className="text-slate-600" size={18} />
            <span className="font-bold text-slate-800 text-sm">Mapa de Atendimentos & Visitas</span>
          </div>

          <div className="space-y-3.5">
            {prontuarios.map(p => (
              <div key={p.id} className="border border-slate-100 bg-slate-50/50 hover:border-slate-350 p-4 rounded-xl relative group transition">
                {canEdit && (
                  <button
                    onClick={() => onDeleteProntuario(p.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between text-xs mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-sm">{p.acolhido}</span>
                    <span className="bg-indigo-50 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase">
                      {p.tipo_atendimento}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-mono mt-1 md:mt-0">
                    <span className="flex items-center space-x-1"><Calendar size={11} /> <span>{p.data}</span></span>
                    <span className="flex items-center space-x-1"><Clock size={11} /> <span>{p.hora}</span></span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic pr-4">"{p.observacoes}"</p>
                <div className="text-[10px] text-slate-500 font-bold mt-2 font-mono flex items-center space-x-1">
                  <CornerDownRight size={11} />
                  <span>Profissional Responsável: {p.responsavel}</span>
                </div>
              </div>
            ))}
            {prontuarios.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">Nenhum prontuário registrado.</p>
            )}
          </div>
        </div>
      )}

      {/* 2. CESTAS BÁSICAS */}
      {activeSubTab === 'cestas' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <th className="p-3">Nome do Recebedor</th>
                  <th className="p-3">Relação / Vínculo</th>
                  <th className="p-3">Data de Entrega</th>
                  <th className="p-3">Qtd Cestas</th>
                  {canEdit && <th className="p-3 text-center">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-705">
                {cestas.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold">{c.recebedor}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">{c.relacao}</span>
                    </td>
                    <td className="p-3 font-mono text-slate-500">{c.data_entrega}</td>
                    <td className="p-3 font-bold">{c.quantidade} un</td>
                    {canEdit && (
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteCesta(c.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {cestas.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="p-6 text-slate-400 text-center">Nenhuma entrega de cesta básica mapeada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PROCESSOS JUDICIAIS */}
      {activeSubTab === 'processos' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                  <th className="p-3">Número do Processo</th>
                  <th className="p-3">Partes Envolvidas</th>
                  <th className="p-3 font-semibold">Situação</th>
                  <th className="p-3">Descrição Resumida</th>
                  {canEdit && <th className="p-3 text-center">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-705">
                {processos.map(pr => (
                  <tr key={pr.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-800">{pr.numero_processo}</td>
                    <td className="p-3 truncate max-w-44">{pr.envolvidos}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        pr.situacao === 'Ativo' ? 'bg-amber-100 text-amber-850' : 'bg-slate-100 text-slate-600'
                      }`}>{pr.situacao}</span>
                    </td>
                    <td className="p-3 text-slate-500 italic truncate max-w-xs">{pr.observacoes || 'Sem notas adicionais'}</td>
                    {canEdit && (
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onDeleteProcesso(pr.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {processos.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 5 : 4} className="p-6 text-slate-400 text-center">Nenhum pleito ativo verificado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TERMOS & ASSINATURA DIGITAL */}
      {activeSubTab === 'termos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {termos.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 relative group">
              {canEdit && (
                <button
                  onClick={() => onDeleteTermo(t.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-650 p-1 opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded">{t.ato}</span>
                <span className="text-[10px] text-slate-400 font-mono">{new Date(t.data_criacao).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Responsável: {t.responsavel}</h4>
              <p className="text-xs text-slate-500 pr-2 leading-relaxed">{t.descricao}</p>

              {/* Assinatura gravada */}
              {t.assinatura_digital && (
                <div className="border border-slate-100 bg-slate-50 rounded-lg p-2 flex flex-col items-center justify-center space-y-1">
                  <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">Assinatura Certificada</span>
                  <img
                    src={t.assinatura_digital}
                    alt="Digital signature"
                    referrerPolicy="no-referrer"
                    className="max-h-20 max-w-full block bg-white border border-slate-200 rounded"
                  />
                </div>
              )}
            </div>
          ))}
          {termos.length === 0 && (
            <p className="col-span-full text-slate-400 text-center text-xs p-6 bg-white border border-slate-200 rounded-xl">Nenhum termo de consentimento registrado.</p>
          )}
        </div>
      )}

      {/* --- MODAIS DE CADASTRO --- */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200 overflow-y-auto max-h-[92vh]">
            <h3 className="font-bold text-slate-800 mb-4 text-base">
              {activeSubTab === 'prontuarios' && 'Lançar Prontuário Comunitário'}
              {activeSubTab === 'cestas' && 'Lançar Entrega de Cesta Básica'}
              {activeSubTab === 'processos' && 'Cadastrar Processo Judicial'}
              {activeSubTab === 'termos' && 'Novo Termo de Responsabilidade'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              
              {/* Form Prontuários */}
              {activeSubTab === 'prontuarios' && (
                <>
                  <div>
                    <label className="block text-slate-655 font-medium mb-1">Nome do Acolhido</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Gabriel dos Santos Lima"
                      value={acolhido}
                      onChange={(e) => setAcolhido(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-655 font-medium mb-1">Tipo de Atendimento / Visita</label>
                    <select
                      value={tipoAtendimento}
                      onChange={(e) => setTipoAtendimento(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                    >
                      <option value="Consulta Individual Psicológica">Consulta Individual Psicológica</option>
                      <option value="Visita Domiciliar Social">Visita Domiciliar Social</option>
                      <option value="Entrevista de Triagem">Entrevista de Triagem</option>
                      <option value="Entrega de Donativos com Acompanhamento">Entrega de Donativos com Acompanhamento</option>
                      <option value="Encaminhamento Extraordinário">Encaminhamento Extraordinário</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-655 font-medium mb-1">Técnico Encarregado</label>
                    <input
                      type="text"
                      required
                      value={responsavel}
                      onChange={(e) => setResponsavel(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-655 font-medium mb-1">Anotações do Prontuário</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Descreva a evolução psicossocial, condições de moradia ou pareceres técnicos com riqueza de detalhes..."
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-550 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* Form Cestas */}
              {activeSubTab === 'cestas' && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nome do Recebedor Oficial</label>
                    <input
                      type="text"
                      required
                      placeholder="Sandra de Oliveira"
                      value={recebedor}
                      onChange={(e) => setRecebedor(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Vínculo com a OSC</label>
                      <select
                        value={relacao}
                        onChange={(e) => setRelacao(e.target.value as any)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                      >
                        <option value="Beneficiário">Beneficiário Cadastrado</option>
                        <option value="Voluntário">Voluntário Comunitário</option>
                        <option value="Funcionário">Funcionário Interno</option>
                        <option value="Outros">Outras Relações</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Quantidade de Cestas</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Processos */}
              {activeSubTab === 'processos' && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Número do Pleito Judicial</label>
                    <input
                      type="text"
                      required
                      placeholder="0002133-90.2026.8.26.0100"
                      value={numeroProc}
                      onChange={(e) => setNumeroProc(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Situação Corrente</label>
                      <select
                        value={situacaoProc}
                        onChange={(e) => setSituacaoProc(e.target.value as any)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-705"
                      >
                        <option value="Ativo">Ativo / Vigente</option>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Arquivado">Arquivado / Concluído</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Partes Envolvidas</label>
                      <input
                        type="text"
                        required
                        placeholder="AVA vs Prefeitura Municipal"
                        value={envolvidos}
                        onChange={(e) => setEnvolvidos(e.target.value)}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Observações Judiciais</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva detalhes de andamento, prazos legais etc."
                      value={obsProc}
                      onChange={(e) => setObsProc(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>
                </>
              )}

              {/* Form Termos & ASSINATURA PAD REAL */}
              {activeSubTab === 'termos' && (
                <>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Nome do Responsável Legal</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo de Lima"
                      value={termoResponsavel}
                      onChange={(e) => setTermoResponsavel(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-550"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Ato / Finalidade de Autorização</label>
                    <input
                      type="text"
                      required
                      value={termoAto}
                      onChange={(e) => setTermoAto(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Descrição Textual do Termo</label>
                    <textarea
                      rows={2}
                      required
                      value={termoDesc}
                      onChange={(e) => setTermoDesc(e.target.value)}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  {/* Assinatura Pad no Canvas */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-650">
                      <span>Assinatura Digital Autógrafa (Desenhe no Quadro)</span>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="text-rose-500 hover:text-rose-700 flex items-center space-x-1 hover:underline cursor-pointer"
                        title="Limpar quadro de assinatura"
                      >
                        <Eraser size={11} />
                        <span>Limpar</span>
                      </button>
                    </div>

                    <div className="border border-slate-300 bg-slate-50 rounded-lg overflow-hidden flex flex-col">
                      <canvas
                        ref={canvasRef}
                        width={380}
                        height={120}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="bg-white block cursor-crosshair w-full"
                      />
                      <div className="p-2 border-t border-slate-200 bg-slate-100 text-center select-none">
                        <button
                          type="button"
                          onClick={saveCanvasSignature}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 border border-slate-700 text-white rounded font-mono font-medium text-[10px] cursor-pointer"
                        >
                          ✔ Certificar Assinatura
                        </button>
                      </div>
                    </div>
                    {assinaturaBase64 && (
                      <div className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-250 p-1.5 rounded font-bold font-mono">
                        ✔ Assinatura capturada com integridade criptográfica!
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-755 bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white font-semibold rounded cursor-pointer hover:bg-emerald-700"
                >
                  Confirmar Dados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
