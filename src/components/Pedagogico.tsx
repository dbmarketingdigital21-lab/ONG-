/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, Edit, GraduationCap, School, BookOpen, FileUp, Trophy, ChevronRight } from 'lucide-react';
import { Estudante } from '../types';

interface PedagogicoProps {
  estudantes: Estudante[];
  onAddEstudante: (est: Omit<Estudante, 'id'>) => void;
  onUpdateEstudante: (id: string, est: Partial<Estudante>) => void;
  onDeleteEstudante: (id: string) => void;
  userRole: string;
}

export default function Pedagogico({
  estudantes,
  onAddEstudante,
  onUpdateEstudante,
  onDeleteEstudante,
  userRole
}: PedagogicoProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingEst, setEditingEst] = useState<Estudante | null>(null);
  
  // Detalhes / Boletim switcher
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form State
  const [nome, setNome] = useState('');
  const [escola, setEscola] = useState('');
  const [diretor, setDiretor] = useState('');
  const [professor, setProfessor] = useState('');
  const [endEscola, setEndEscola] = useState('');
  const [telEscola, setTelEscola] = useState('');
  const [horario, setHorario] = useState('Das 08:00 às 12:00');
  const [feedback, setFeedback] = useState('');
  const [obs, setObs] = useState('');

  // Grades Form State
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [b3, setB3] = useState('');
  const [b4, setB4] = useState('');

  // File simulated append
  const [newFileName, setNewFileName] = useState('');

  const canEdit = userRole === 'Administrador' || userRole === 'Coordenador' || userRole === 'Pedagógico';

  const handleCreateOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !escola) return alert("Prazos e dados estruturantes do estudante ausentes!");

    const payload = {
      nome,
      escola,
      diretor: diretor || undefined,
      professor: professor || undefined,
      endereco_escola: endEscola || undefined,
      telefone_escola: telEscola || undefined,
      horario_aulas: horario || undefined,
      feedback_bimestral: feedback || undefined,
      observacoes: obs || undefined,
      notas: {
        bimestre1: b1 ? parseFloat(b1) : undefined,
        bimestre2: b2 ? parseFloat(b2) : undefined,
        bimestre3: b3 ? parseFloat(b3) : undefined,
        bimestre4: b4 ? parseFloat(b4) : undefined,
      },
      documentos: editingEst ? editingEst.documentos : []
    };

    if (editingEst) {
      onUpdateEstudante(editingEst.id, payload);
    } else {
      onAddEstudante(payload);
    }

    // Reset
    setNome('');
    setEscola('');
    setDiretor('');
    setProfessor('');
    setEndEscola('');
    setTelEscola('');
    setHorario('Das 08:00 às 12:00');
    setFeedback('');
    setObs('');
    setB1('');
    setB2('');
    setB3('');
    setB4('');
    setShowForm(false);
    setEditingEst(null);
  };

  const handleEditInit = (est: Estudante) => {
    setEditingEst(est);
    setNome(est.nome);
    setEscola(est.escola);
    setDiretor(est.diretor || '');
    setProfessor(est.professor || '');
    setEndEscola(est.endereco_escola || '');
    setTelEscola(est.telefone_escola || '');
    setHorario(est.horario_aulas || 'Das 08:00 às 12:00');
    setFeedback(est.feedback_bimestral || '');
    setObs(est.observacoes || '');
    setB1(est.notas?.bimestre1?.toString() || '');
    setB2(est.notas?.bimestre2?.toString() || '');
    setB3(est.notas?.bimestre3?.toString() || '');
    setB4(est.notas?.bimestre4?.toString() || '');
    setShowForm(true);
  };

  const handleAddFileSimulated = (estId: string) => {
    if (!newFileName) return alert("Insira o nome do arquivo escolar!");
    const target = estudantes.find(e => e.id === estId);
    if (!target) return;

    const updatedDocuments = [
      ...target.documentos,
      { nome: newFileName, url: "#", tipo: "pdf" }
    ];
    onUpdateEstudante(estId, { documentos: updatedDocuments });
    setNewFileName('');
    alert("Arquivo pedagógico físico atrelado com sucesso!");
  };

  // Boletim Média Geral
  const getMedia = (notas: Estudante['notas']) => {
    let sum = 0;
    let count = 0;
    if (notas.bimestre1 !== undefined) { sum += notas.bimestre1; count++; }
    if (notas.bimestre2 !== undefined) { sum += notas.bimestre2; count++; }
    if (notas.bimestre3 !== undefined) { sum += notas.bimestre3; count++; }
    if (notas.bimestre4 !== undefined) { sum += notas.bimestre4; count++; }
    return count > 0 ? (sum / count).toFixed(1) : 'Sem Notas';
  };

  const currentActiveEst = estudantes.find(e => e.id === selectedId) || estudantes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Diretório Pedagógico & Apoio Regular</h2>
          <p className="text-xs text-slate-500">Cadastro de estudantes beneficiados, relatórios bimestrais qualitativos e boletim de notas de matérias escolares básicas.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingEst(null);
              setNome('');
              setEscola('');
              setDiretor('');
              setProfessor('');
              setEndEscola('');
              setTelEscola('');
              setHorario('Das 08:00 às 12:00');
              setFeedback('');
              setObs('');
              setB1('');
              setB2('');
              setB3('');
              setB4('');
              setShowForm(true);
            }}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Cadastrar Estudante</span>
          </button>
        )}
      </div>

      {/* Grid Principal: Esquerda: Menu Alunos, Direita: Boletim Completo, Notas e Documentos */}
      {estudantes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Seção Alunos (Lista rápida de escolha) */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5">
            <h3 className="font-bold text-slate-800 text-xs uppercase font-mono tracking-wider text-slate-500">Estudantes Assistidos</h3>
            <div className="space-y-1.5 max-h-120 overflow-y-auto">
              {estudantes.map(st => {
                const isActive = (selectedId === null && currentActiveEst?.id === st.id) || selectedId === st.id;
                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedId(st.id)}
                    className={`p-3.5 rounded-lg border transition cursor-pointer text-left flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-slate-50 border-slate-100 hover:bg-slate-100/50 text-slate-800'
                    }`}
                  >
                    <div className="space-y-1 truncate pr-2">
                      <h4 className="font-bold text-xs">{st.nome}</h4>
                      <p className={`text-[10px] truncate ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>{st.escola}</p>
                    </div>
                    <div className="flex items-center space-x-1 shrink-0 font-mono text-[10px]">
                      <span>Média:</span>
                      <span className={`font-bold px-1 rounded ${
                        isActive ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800'
                      }`}>{getMedia(st.notas)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* painel de apoio detalhado (2 colunas) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            {currentActiveEst ? (
              <div className="space-y-6 text-xs">
                {/* Cabeçalho Atendidos */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                      <GraduationCap size={26} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{currentActiveEst.nome}</h3>
                      <p className="text-slate-500 font-mono text-[10px]">Apoio Escolar em Período Turno Reverso</p>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="flex items-center space-x-1.5 select-none">
                      <button
                        onClick={() => handleEditInit(currentActiveEst)}
                        title="Editar Informações"
                        className="p-1 px-2.5 text-xs border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-semibold rounded flex items-center space-x-1 cursor-pointer"
                      >
                        <Edit size={12} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Tem certeza que deseja inativar esta ficha de apoio?")) {
                            onDeleteEstudante(currentActiveEst.id);
                            setSelectedId(null);
                          }
                        }}
                        title="Apagar Estudante"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bloco 1: Informações Escola Regular */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-1.5 text-indigo-700 font-semibold">
                      <School size={14} />
                      <span>Dados Escola Regular</span>
                    </div>
                    <div className="space-y-1 flex flex-col text-slate-600 leading-relaxed text-[11px]">
                      <span>Escola: <b className="text-slate-800">{currentActiveEst.escola}</b></span>
                      <span>Diretor(a): <b className="text-slate-800">{currentActiveEst.diretor || 'Não informado'}</b></span>
                      <span>Prof. Principal: <b className="text-slate-800">{currentActiveEst.professor || 'Não informado'}</b></span>
                      <span>Horário: <b className="text-slate-800 font-mono">{currentActiveEst.horario_aulas}</b></span>
                      {currentActiveEst.telefone_escola && <span>Telefone: <b>{currentActiveEst.telefone_escola}</b></span>}
                    </div>
                  </div>

                  {/* Notas Bimestrais */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-4 space-y-2.5">
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold">
                      <Trophy size={14} />
                      <span>Boletim de Transparência</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center font-mono text-[10px]">
                      <div className="bg-white border border-slate-150 p-1.5 rounded">
                        <span className="text-slate-400 block mb-0.5">B1</span>
                        <b className="text-xs text-slate-800">{currentActiveEst.notas?.bimestre1 ?? '-'}</b>
                      </div>
                      <div className="bg-white border border-slate-150 p-1.5 rounded">
                        <span className="text-slate-400 block mb-0.5">B2</span>
                        <b className="text-xs text-slate-800">{currentActiveEst.notas?.bimestre2 ?? '-'}</b>
                      </div>
                      <div className="bg-white border border-slate-150 p-1.5 rounded">
                        <span className="text-slate-400 block mb-0.5">B3</span>
                        <b className="text-xs text-slate-800">{currentActiveEst.notas?.bimestre3 ?? '-'}</b>
                      </div>
                      <div className="bg-white border border-slate-150 p-1.5 rounded">
                        <span className="text-slate-400 block mb-0.5">B4</span>
                        <b className="text-xs text-slate-800">{currentActiveEst.notas?.bimestre4 ?? '-'}</b>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700 text-center flex items-center justify-center space-x-2">
                      <span>Média Anual Consolidada:</span>
                      <span className="bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold text-xs">
                        {getMedia(currentActiveEst.notas)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bloco 2: Feedbacks e Avaliação */}
                <div className="space-y-2">
                  <span className="block font-semibold text-slate-700">Parecer Qualitativo / Avaliação Trimestral</span>
                  <div className="p-4 bg-slate-50 border border-slate-100 text-slate-600 rounded-lg italic leading-relaxed text-[11px]">
                    "{currentActiveEst.feedback_bimestral || 'Ainda não possui parecer qualitativo bimestral preenchido para o período letivo corrente.'}"
                  </div>
                </div>

                {/* Bloco 3: Anexos e Históricos */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Documentação Escolar Digitalizada / Atividades</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* Lista Files */}
                    <div className="space-y-1.5 max-h-28 overflow-y-auto">
                      {currentActiveEst.documentos && currentActiveEst.documentos.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 text-[11px] text-slate-700">
                          <span className="truncate">📁 {doc.nome}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-mono">PDF</span>
                        </div>
                      ))}
                      {(!currentActiveEst.documentos || currentActiveEst.documentos.length === 0) && (
                        <p className="text-slate-400 italic text-[10px]">Sem arquivos escolares anexados.</p>
                      )}
                    </div>

                    {/* Cadastrador File Fictício */}
                    {canEdit && (
                      <div className="p-3 border border-dashed border-slate-200 bg-slate-50/50 rounded-lg space-y-2">
                        <span className="block text-[10px] font-semibold text-slate-500 uppercase">Simular Anexação de Atividade ou Histórico</span>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Ex: Boletim Oficial 2026.pdf"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="bg-white border border-slate-300 rounded text-[11px] px-2.5 py-1 flex-1 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddFileSimulated(currentActiveEst.id)}
                            className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-medium flex items-center space-x-1 cursor-pointer"
                          >
                            <FileUp size={12} />
                            <span>Anexar</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-center py-10">Selecione um aluno para acompanhar seu prontuário acadêmico.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
          <BookOpen size={40} className="text-slate-300 mx-auto" />
          <h3 className="font-semibold text-slate-705">Árvore Estudantil Vazia</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">Não há nenhum beneficiário de ensino ou estudante assistido cadastrado na base institucional. Clique acima para registrar o primeiro!</p>
        </div>
      )}

      {/* --- FORM CADASTRO ESTUDANTE MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 border border-slate-200 overflow-y-auto max-h-[92vh]">
            <h3 className="font-bold text-slate-800 mb-4 text-base">
              {editingEst ? 'Editar Ficha Estudantil' : 'Registrar Estudante Assistido'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nome Completo do Aluno</label>
                  <input
                    type="text"
                    required
                    placeholder="Gabriel dos Santos Lima"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Escola de Ensino Regular</label>
                  <input
                    type="text"
                    required
                    placeholder="E.E. Professor João de Barros"
                    value={escola}
                    onChange={(e) => setEscola(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Diretor(a) da Escola</label>
                  <input
                    type="text"
                    placeholder="Regina Célia"
                    value={diretor}
                    onChange={(e) => setDiretor(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Professora Principal</label>
                  <input
                    type="text"
                    placeholder="Maria de Lourdes"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Horário Letivo</label>
                  <input
                    type="text"
                    placeholder="Ex: Das 07:30 às 12:30"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Endereço da Escola</label>
                  <input
                    type="text"
                    placeholder="Rua da República, 120, Centro"
                    value={endEscola}
                    onChange={(e) => setEndEscola(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Telefone da Escola</label>
                  <input
                    type="text"
                    placeholder="(XX) XXXX-XXXX"
                    value={telEscola}
                    onChange={(e) => setTelEscola(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Notas do Aluno */}
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <span className="block font-semibold text-slate-650">Lançamento de Notas (Se houver)</span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Bimestre 1</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={b1}
                      onChange={(e) => setB1(e.target.value)}
                      className="w-full text-center border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Bimestre 2</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={b2}
                      onChange={(e) => setB2(e.target.value)}
                      className="w-full text-center border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Bimestre 3</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={b3}
                      onChange={(e) => setB3(e.target.value)}
                      className="w-full text-center border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Bimestre 4</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={b4}
                      onChange={(e) => setB4(e.target.value)}
                      className="w-full text-center border border-slate-300 rounded px-1.5 py-1 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Parecer de Acompanhamento Bimestral</label>
                <textarea
                  rows={2}
                  placeholder="Incorpore observações sobre leitura, caligrafia, foco, interações, etc."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Encontra-se sob acompanhamento com psicopedagoga ou necessita de óculos de grau..."
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-705 bg-slate-50 font-semibold cursor-pointer hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 text-white font-semibold rounded cursor-pointer hover:bg-emerald-700"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
