/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  GraduationCap, 
  Package, 
  FolderLock, 
  Scale, 
  DollarSign,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Receita, Despesa, ItemEstoque, DocumentoInstitucional, Estudante, ProcessoJudicial } from '../types';

interface DashboardProps {
  receitas: Receita[];
  despesas: Despesa[];
  estoque: ItemEstoque[];
  documentos: DocumentoInstitucional[];
  estudantes: Estudante[];
  processos: ProcessoJudicial[];
}

export default function Dashboard({ receitas, despesas, estoque, documentos, estudantes, processos }: DashboardProps) {
  // Cálculos de indicadores
  const totalReceitas = receitas.reduce((acc, current) => acc + current.valor, 0);
  const totalDespesas = despesas.reduce((acc, current) => acc + current.valor, 0);
  const saldoCaixa = totalReceitas - totalDespesas;

  const estoqueBaixoCount = estoque.filter(item => item.status === 'Estoque Baixo' || item.status === 'Esgotado').length;
  const estoqueVencidoCount = estoque.filter(item => item.status === 'Vencido').length;

  const docsVencendoCount = documentos.filter(doc => {
    if (doc.validade === 'Sem vencimento') return false;
    const parts = doc.validade ? doc.validade.split('-') : [];
    if (parts.length === 3) {
      const validadeDate = new Date(doc.validade!);
      const limite = new Date();
      limite.setDate(limite.getDate() + 90); // Nos próximos 90 dias
      return validadeDate < limite;
    }
    return false;
  }).length;

  const processosAtivos = processos.filter(p => p.situacao === 'Ativo').length;

  // Renderizador de Gráfico customizado SVG para Fluxo de Caixa (Mensal acumulado simulado)
  const chartData = [
    { mes: 'Jan', ent: 4000, sai: 2500 },
    { mes: 'Fev', ent: 5500, sai: 3100 },
    { mes: 'Mar', ent: 6200, sai: 4200 },
    { mes: 'Abr', ent: 8900, sai: 5800 },
    { mes: 'Mai', ent: totalReceitas, sai: totalDespesas }, // Dinâmico com dados atuais
  ];

  const maxVal = Math.max(...chartData.flatMap(d => [d.ent, d.sai])) * 1.15 || 10000;

  return (
    <div className="space-y-6">
      {/* Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Visão Geral da Instituição</h2>
          <p className="text-xs text-slate-500 font-sans">Acompanhamento de transparência e saúde administrativa da OSC em tempo real.</p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[10px] bg-white border border-slate-200/80 px-3 py-1.5 rounded-xl text-slate-600 shadow-sm">
          <Clock size={12} className="text-[#38bdf8]" />
          <span>Último fechamento de caixa automático de 2026</span>
        </div>
      </div>

      {/* Grid Bento Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1 (Span 2): Fluxo de Caixa Mensal (Membros e Doações) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex justify-between items-center">
              <span>Fluxo de Caixa Consolidado</span>
              <span className="inline-flex items-center text-[9px] text-[#10b981] font-bold bg-[#10b981]/5 px-2 py-0.5 rounded-full border border-[#10b981]/10">
                <span className="w-1 h-1 rounded-full bg-[#10b981] mr-1 animate-pulse"></span>
                Em Dia
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2 font-display">
              R$ {saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Saldo Líquido (Arrecadamento de R$ {totalReceitas.toLocaleString('pt-BR')} despesado em R$ {totalDespesas.toLocaleString('pt-BR')})
            </p>
          </div>

          {/* Gráfico de Barras SVG customizado integrado */}
          <div className="h-44 flex flex-col justify-between pt-2">
            <div className="relative flex-1 flex items-end justify-between px-4 border-b border-l border-slate-100">
              {/* Gridlines horizontais */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-slate-100 pointer-events-none" />
              <div className="absolute left-0 right-0 top-2/4 border-t border-dashed border-slate-100 pointer-events-none" />
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-slate-100 pointer-events-none" />

              {/* Barras dinâmicas */}
              {chartData.map((d, index) => {
                const entHeight = `${(d.ent / maxVal) * 100}%`;
                const saiHeight = `${(d.sai / maxVal) * 100}%`;

                return (
                  <div key={index} className="flex flex-col items-center space-y-1 z-10 w-12 sm:w-14">
                    <div className="flex items-end space-x-1 h-28 w-full justify-center">
                      <div 
                        style={{ height: entHeight }} 
                        className="w-3.5 bg-[#38bdf8] rounded-t hover:bg-[#38bdf8]/85 transition-all duration-350 relative group cursor-pointer"
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow">
                          Ent: R$ {d.ent.toFixed(2)}
                        </div>
                      </div>
                      <div 
                        style={{ height: saiHeight }} 
                        className="w-3.5 bg-slate-900 rounded-t hover:bg-slate-800 transition-all duration-350 relative group cursor-pointer"
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white font-mono text-[9px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50 shadow font-sans">
                          Sai: R$ {d.sai.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono mt-0.5">{d.mes}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CARD 2 (Span 1): Acolhidos Ativos */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex items-center justify-between">
              <span>Acolhidos Ativos</span>
              <GraduationCap size={16} className="text-[#38bdf8]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-950 mt-3 font-display">
              {estudantes.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-2 font-sans leading-relaxed">
              Estudantes ativos com 100% de presença e assistência ativa.
            </div>
          </div>
          {/* Progress bar bento styling */}
          <div className="mt-4">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span>Capacidade: 160</span>
              <span>{Math.round((estudantes.length / 160) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#38bdf8] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (estudantes.length / 160) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* CARD 3 (Span 1): Alertas de Estoque */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex items-center justify-between">
              <span>Alertas de Estoque</span>
              <Package size={16} className="text-[#38bdf8]" />
            </div>
            <div className={`text-3xl font-extrabold mt-3 font-display ${estoqueBaixoCount + estoqueVencidoCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {(estoqueBaixoCount + estoqueVencidoCount).toString().padStart(2, '0')}
            </div>
            <p className="text-[11px] text-slate-550 mt-2 leading-relaxed">
              Alimentos/insumos com estoque crítico ou data de validade expirada.
            </p>
          </div>
          {/* Bento status indicators list */}
          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-start gap-1">
            {Array.from({ length: Math.min(4, estoqueBaixoCount + estoqueVencidoCount) }).map((_, i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            ))}
            {estoqueBaixoCount + estoqueVencidoCount === 0 && (
              <span className="text-[10px] text-[#10b981] font-mono font-semibold">● Almoxarifado em dia</span>
            )}
          </div>
        </div>

        {/* CARD 4 (Span 2): Atendimentos & Ação Social */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex justify-between items-center">
              <span>Atendimentos Recentes</span>
              <span className="text-[9px] text-[#38bdf8] font-mono font-bold bg-[#38bdf8]/5 px-2 py-0.5 rounded-full border border-[#38bdf8]/10">CONFORMIDADE ATIVA</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="border-l-4 border-[#38bdf8] pl-3 py-1 bg-slate-50/65 rounded-r-xl">
                <span className="text-[9px] font-mono font-bold text-[#38bdf8] block uppercase">PSICOLOGIA</span>
                <span className="text-xs font-bold text-slate-800 block">Sessão Individual</span>
                <span className="text-[10px] text-slate-400 block">Histórico de triagem</span>
              </div>
              <div className="border-l-4 border-[#10b981] pl-3 py-1 bg-slate-50/65 rounded-r-xl">
                <span className="text-[9px] font-mono font-bold text-[#10b981] block uppercase">ASSIST. SOCIAL</span>
                <span className="text-xs font-bold text-slate-800 block">Socioassistencial</span>
                <span className="text-[10px] text-slate-400 block">Registro socioeconômico</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 font-mono">
            Integrado ao prontuário socioassistencial unificado da OSC.
          </div>
        </div>

        {/* CARD 5 (Span 1): Processos Judiciais */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex items-center justify-between">
              <span>Processos Ativos</span>
              <Scale size={16} className="text-[#38bdf8]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
              {processosAtivos.toString().padStart(2, '0')}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Acompanhamento jurídico ativo sob triagem da comarca local.
            </p>
          </div>
          <div className="text-[10px] text-[#38bdf8] font-bold mt-4 font-mono uppercase cursor-pointer hover:underline flex items-center gap-1">
            <span>Ver Detalhes →</span>
          </div>
        </div>

        {/* CARD 6 (Span 1): Validade Documental */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display flex items-center justify-between">
              <span>Certidões & Validades</span>
              <FolderLock size={16} className="text-[#38bdf8]" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 mt-3 font-display">
              {docsVencendoCount.toString().padStart(2, '0')}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
              Alvarás, atas e certidões ativas vencendo em até 90 dias.
            </p>
          </div>
          <div className="mt-4">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono ${
              docsVencendoCount > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
            }`}>
              {docsVencendoCount > 0 ? 'Exige atenção proativa' : 'Tudo em Ordem'}
            </span>
          </div>
        </div>

      </div>

      {/* Grid Inferior: Lista de itens críticos e expirando - Checklist Bento Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm font-display flex items-center justify-between">
            <span>Auditoria Geral: Checklist Imediato</span>
            <span className="text-[10px] text-slate-400 font-mono font-medium uppercase bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-0.5">Versão de Auditoria</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Verificação automática de inconformidades de prazos e almoxarifado do sistema de gerenciamento.</p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100 bg-slate-50/20">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-700 font-semibold">
                <th className="p-3.5 font-display text-xs text-slate-600">Categoria de Alerta</th>
                <th className="p-3.5 font-display text-xs text-slate-600">Item / Documento Alvo</th>
                <th className="p-3.5 font-display text-xs text-slate-600">Inconformidade</th>
                <th className="p-3.5 font-display text-xs text-slate-600 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {/* Linhas de Alerta de Estoque */}
              {estoque.filter(e => e.status !== 'Disponível').map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono bg-amber-50 text-amber-700 border border-amber-100">
                      Insumo / Estoque
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800 font-sans">{item.nome_item}</td>
                  <td className="p-3.5 text-slate-500">
                    {item.status === 'Estoque Baixo' && `Quantidade crítica de apenas ${item.quantidade} unidade(s)`}
                    {item.status === 'Esgotado' && `Produto esgotado completamente do almoxarifado`}
                    {item.status === 'Vencido' && `Validade expirada em (${item.validade})`}
                  </td>
                  <td className="p-3.5 text-right font-display text-xs">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold font-mono ${
                      item.status === 'Vencido' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Linhas de Alerta de Documentos */}
              {documentos.filter(d => d.validade !== 'Sem vencimento').map(doc => {
                const isOver = new Date(doc.validade!) < new Date();
                return (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono bg-sky-50 text-sky-700 border border-sky-100">
                        Documento Legal
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800 font-sans">{doc.nome}</td>
                    <td className="p-3.5 text-slate-550">Validade fixada para {doc.validade}</td>
                    <td className="p-3.5 text-right font-display text-xs">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-extrabold font-mono ${
                        isOver ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-sky-50 text-sky-700 border border-sky-100'
                      }`}>
                        {isOver ? 'Vencido' : 'Expirando'}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {estoque.filter(e => e.status !== 'Disponível').length === 0 && 
               documentos.filter(d => d.validade !== 'Sem vencimento').length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-mono">
                    Nenhum alerta de desconformidade ativo no momento. Tudo em ordem!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
