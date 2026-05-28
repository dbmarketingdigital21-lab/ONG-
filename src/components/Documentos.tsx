/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, FolderLock, Download, ExternalLink, Calendar, Search, AlertTriangle } from 'lucide-react';
import { DocumentoInstitucional } from '../types';

interface DocumentosProps {
  documentos: DocumentoInstitucional[];
  onAddDocumento: (doc: Omit<DocumentoInstitucional, 'id' | 'data_upload'>) => void;
  onDeleteDocumento: (id: string) => void;
  userRole: string;
}

export default function Documentos({ documentos, onAddDocumento, onDeleteDocumento, userRole }: DocumentosProps) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');

  // Form State
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<DocumentoInstitucional['categoria']>('Estatuto social');
  const [validade, setValidade] = useState('');
  const [arquivoMock, setArquivoMock] = useState('');

  const canEdit = userRole === 'Administrador' || userRole === 'Coordenador';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return alert("Insira o nome de referência do documento!");

    onAddDocumento({
      categoria,
      nome,
      arquivoUrl: arquivoMock || '#',
      validade: validade || 'Sem vencimento'
    });

    setNome('');
    setValidade('');
    setArquivoMock('');
    setShowForm(false);
  };

  const categories: DocumentoInstitucional['categoria'][] = [
    'Estatuto social',
    'CNPJ',
    'Certificações',
    'Licenciamentos',
    'Ata de eleição',
    'Certidões',
    'Convênios públicos',
    'Parcerias privadas'
  ];

  const filteredDocs = documentos.filter(doc => {
    const matchesSearch = doc.nome.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === 'All' || doc.categoria === filterCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Cofre de Documentos Institucionais</h2>
          <p className="text-xs text-slate-500">Módulo seguro de backup e visualização de atas eleitorais, convênios públicos, alvarás sanitários e CNPJ regulatório.</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Fazer Upload Seguro</span>
          </button>
        )}
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs w-full sm:max-w-md">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar documento por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-slate-705"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium w-full sm:w-auto shrink-0 justify-end">
          <span className="text-slate-500">Filtrar Categoria:</span>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50"
          >
            <option value="All">Todas Categorias</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => {
          // Verifica vencimento
          const isVencendo = doc.validade !== 'Sem vencimento' && (() => {
            const parts = doc.validade ? doc.validade.split('-') : [];
            if (parts.length === 3) {
              const val = new Date(doc.validade!);
              const limite = new Date();
              limite.setDate(limite.getDate() + 90);
              return val < limite;
            }
            return false;
          })();

          return (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition flex flex-col justify-between space-y-4 relative group hover:shadow-xs">
              {canEdit && (
                <button
                  onClick={() => onDeleteDocumento(doc.id)}
                  title="Excluir Permanentemente"
                  className="absolute top-4 right-4 p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-slate-900 text-white rounded-lg">
                    <FolderLock size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">
                      {doc.categoria}
                    </span>
                    <h3 className="font-bold text-slate-800 text-xs pr-4 leading-tight truncate max-w-48" title={doc.nome}>
                      {doc.nome}
                    </h3>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex justify-between">
                    <span>Validade:</span>
                    <span className={`font-bold ${isVencendo ? 'text-amber-600 font-semibold' : 'text-slate-700'}`}>
                      {doc.validade}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enviado em:</span>
                    <span>{doc.data_upload}</span>
                  </div>
                </div>
              </div>

              {/* Warnings e Baixar */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                {isVencendo ? (
                  <div className="flex items-center space-x-1 animate-pulse text-[10px] text-amber-600 font-semibold font-mono font-medium">
                    <AlertTriangle size={12} />
                    <span>Requer Renovação</span>
                  </div>
                ) : (
                  <div className="text-[10px] text-emerald-600 font-bold font-mono">
                    ✔ Válido
                  </div>
                )}

                <div className="flex items-center space-x-1.5 text-[11px] select-none">
                  <button
                    onClick={() => alert(`Simulando visualização online e encriptada do arquivo PDF: ${doc.nome}`)}
                    className="p-1 px-2.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer flex items-center space-x-1"
                  >
                    <span>Ver</span>
                  </button>
                  <button
                    onClick={() => alert(`Baixando cópia oficial encriptada de segurança: ${doc.nome}`)}
                    className="p-1 px-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white rounded font-medium flex items-center space-x-1 cursor-pointer"
                  >
                    <Download size={11} />
                    <span>Baixar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filteredDocs.length === 0 && (
          <p className="col-span-full text-slate-400 text-center text-xs py-8 bg-white border border-slate-200 rounded-xl">Nenhum documento legal indexado.</p>
        )}
      </div>

      {/* --- MODAL UPLOAD SEGURO --- */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-base">Anexar Documento Seguro</h3>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nome Administrativo do Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ata Posse Diretoria 2026-2028.pdf"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Categoria Regulatória</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 text-slate-700"
                  />
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-mono font-medium">Deixe em branco p/ sem validade</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Upload Físico do Documento (Simulado PDF/JPG)</label>
                <input
                  type="text"
                  placeholder="Simular arquivo enviando como link ou base64 criptográfico..."
                  value={arquivoMock}
                  onChange={(e) => setArquivoMock(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3.5 py-2 border border-slate-300 rounded text-slate-705 bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-750 text-white rounded font-semibold cursor-pointer"
                >
                  Confirmar Envio Encriptado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
