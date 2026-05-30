/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  Shield, 
  UserCheck, 
  UserX,
  X,
  Lock,
  Mail,
  MoreVertical
} from 'lucide-react';
import { Usuario } from '../types';

interface UsuariosProps {
  usuarios: Usuario[];
  onAddUsuario: (usr: Omit<Usuario, 'id' | 'created_at'> & { senha?: string }) => Promise<void>;
  onUpdateUsuario: (usr: Usuario) => Promise<void>;
  onDeleteUsuario: (id: string) => Promise<void>;
  userRole: string;
  currentUserId?: string;
}

export default function Usuarios({
  usuarios,
  onAddUsuario,
  onUpdateUsuario,
  onDeleteUsuario,
  userRole,
  currentUserId
}: UsuariosProps) {
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modais
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, name: string } | null>(null);

  // Form States
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNivel, setFormNivel] = useState<'Administrado' | 'Financeiro' | 'Coordenador' | 'Pedagógico' | 'Assistência Social' | 'Psicólogo' | 'Visualizador'>('Financeiro');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [formSenha, setFormSenha] = useState('');

  const canEdit = userRole === 'Administrador';

  // Stats
  const totalUsers = usuarios.length;
  const activeUsers = usuarios.filter(u => u.status === 'Ativo').length;
  const inactiveUsers = usuarios.filter(u => u.status === 'Inativo').length;
  const adminUsers = usuarios.filter(u => u.nivel_acesso === 'Administrador' || u.nivel_acesso === 'Administrado').length;

  // Filtragem
  const filteredUsuarios = usuarios.filter(u => {
    const matchesSearch = u.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'All' || 
                         u.nivel_acesso === levelFilter || 
                         (levelFilter === 'Administrador' && u.nivel_acesso === 'Administrado');
    
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome || !formEmail || !formSenha) return alert('Por favor, preencha os dados obrigatórios');
    try {
      await onAddUsuario({
        nome: formNome,
        email: formEmail,
        senha: formSenha,
        nivel_acesso: formNivel,
        status: formStatus
      });
      setFormNome('');
      setFormEmail('');
      setFormSenha('');
      setFormNivel('Financeiro');
      setFormStatus('Ativo');
      setShowAddModal(false);
    } catch (err) {
      alert('Erro ao cadastrar usuário');
    }
  };

  const handleEditClick = (u: Usuario) => {
    setEditingUsuario(u);
    setFormNome(u.nome);
    setFormEmail(u.email);
    setFormNivel(u.nivel_acesso === 'Administrado' ? 'Administrado' : u.nivel_acesso as any);
    setFormStatus(u.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUsuario || !formNome || !formEmail) return;
    try {
      await onUpdateUsuario({
        ...editingUsuario,
        nome: formNome,
        email: formEmail,
        nivel_acesso: formNivel,
        status: formStatus
      });
      setShowEditModal(false);
      setEditingUsuario(null);
    } catch (err) {
      alert('Erro ao atualizar usuário');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await onDeleteUsuario(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    }
  };

  // Cores de Tag de Nível de Acesso
  const getRoleBadgeClass = (nivel: string) => {
    switch (nivel) {
      case 'Administrador':
      case 'Administrado':
        return 'bg-emerald-50 text-emerald-700 border-emerald-150';
      case 'Financeiro':
        return 'bg-blue-50 text-blue-700 border-blue-150';
      case 'Coordenador':
        return 'bg-amber-50 text-amber-700 border-amber-150';
      case 'Pedagógico':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150';
      case 'Assistência Social':
        return 'bg-rose-50 text-rose-700 border-rose-150';
      case 'Psicólogo':
        return 'bg-purple-50 text-purple-700 border-purple-150';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Usuários</h2>
          <p className="text-xs text-slate-500 font-sans">Gerencie os usuários e permissões do sistema</p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Plus size={14} />
            <span>Novo Usuário</span>
          </button>
        )}
      </div>

      {/* Widgets Superiores/Estatísticos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usuários */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-[0_1px_3px_gradient] flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Users size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Total de Usuários</span>
            <span className="text-2xl font-black text-slate-900 font-display">{totalUsers}</span>
          </div>
        </div>

        {/* Ativos */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-[0_1px_3px_gradient] flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <UserCheck size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Ativos</span>
            <span className="text-2xl font-black text-slate-900 font-display">{activeUsers}</span>
          </div>
        </div>

        {/* Inativos */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-[0_1px_3px_gradient] flex items-center space-x-4">
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600">
            <UserX size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Inativos</span>
            <span className="text-2xl font-black text-slate-900 font-display">{inactiveUsers}</span>
          </div>
        </div>

        {/* Administradores */}
        <div className="bg-white border border-slate-200/85 p-5 rounded-2xl shadow-[0_1px_3px_gradient] flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
            <Shield size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase">Administradores</span>
            <span className="text-2xl font-black text-slate-900 font-display">{adminUsers}</span>
          </div>
        </div>
      </div>

      {/* Filtros Toolbar de Alinhamento */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition font-sans"
          />
        </div>

        <div className="flex w-full md:w-auto items-center space-x-2 shrink-0">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-blue-550 focus:outline-none focus:border-blue-550 transition flex-1 sm:flex-initial"
          >
            <option value="All">Todos os níveis</option>
            <option value="Administrador">Administrador</option>
            <option value="Financeiro">Financeiro</option>
            <option value="Coordenador">Coordenador</option>
            <option value="Pedagógico">Pedagógico</option>
            <option value="Assistência Social">Assistência Social</option>
            <option value="Psicólogo">Psicólogo</option>
            <option value="Visualizador">Visualizador</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 font-medium focus:ring-1 focus:ring-blue-550 focus:outline-none focus:border-blue-550 transition flex-1 sm:flex-initial"
          >
            <option value="All">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      {/* Grid Listagem / Tabela */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold tracking-wider">
                <th className="p-4 uppercase shrink-0">Usuário</th>
                <th className="p-4 uppercase">Nível de Acesso</th>
                <th className="p-4 uppercase">Status</th>
                <th className="p-4 uppercase">Criado em</th>
                <th className="p-4 uppercase">Último Login</th>
                <th className="p-4 text-right uppercase pr-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 text-slate-700 font-sans">
              {filteredUsuarios.map((u) => {
                const initial = u.nome ? u.nome.charAt(0).toUpperCase() : 'U';
                return (
                  <tr key={u.id} className="hover:bg-slate-50/40 transition">
                    <td className="p-4 flex items-center space-x-3">
                      <div className="w-9 h-9 bg-blue-600 text-white font-bold text-sm rounded-full flex items-center justify-center shadow-sm select-none shrink-0">
                        {initial}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-slate-900 truncate">{u.nome}</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeClass(u.nivel_acesso)}`}>
                        {u.nivel_acesso === 'Administrado' ? 'Administrador' : u.nivel_acesso}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        u.status === 'Ativo' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-500">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '01/01/2024'}
                    </td>
                    <td className="p-4 text-[10px] text-slate-500">
                      Nunca
                    </td>
                    <td className="p-4 text-right pr-6">
                      <div className="flex items-center justify-end space-x-1.5">
                        {canEdit && u.id !== currentUserId && (
                          <button
                            onClick={() => handleEditClick(u)}
                            className="p-1.5 text-slate-450 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                            title="Editar Usuário"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {canEdit && u.id !== currentUserId && (
                          <button
                            onClick={() => handleDeleteClick(u.id, u.nome)}
                            className="p-1.5 text-slate-450 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Remover Usuário"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsuarios.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-10 text-slate-400 font-sans">
                    Nenhum usuário cadastrado correspondente aos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cartões Informativos na Base explicando Níveis de Acesso */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <h4 className="font-bold text-slate-900 text-sm font-display">Níveis de Permissão</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-sans">
          
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col space-y-1">
            <span className="font-bold text-emerald-800">Administrador</span>
            <p className="text-slate-600 font-light text-[11px] leading-relaxed">
              Acesso total ao sistema. Pode criar, editar e excluir todos os registros.
            </p>
          </div>

          <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex flex-col space-y-1">
            <span className="font-bold text-blue-800">Financeiro</span>
            <p className="text-slate-600 font-light text-[11px] leading-relaxed">
              Acesso às contas bancárias e documentos. Pode criar e editar registros financeiros.
            </p>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex flex-col space-y-1">
            <span className="font-bold text-amber-800">Coordenador</span>
            <p className="text-slate-600 font-light text-[11px] leading-relaxed">
              Acesso aos coordenadores e documentos. Pode criar e editar coordenadores.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col space-y-1">
            <span className="font-bold text-slate-800">Visualizador</span>
            <p className="text-slate-600 font-light text-[11px] leading-relaxed">
              Acesso apenas para visualização. Não pode criar, editar ou excluir registros.
            </p>
          </div>

        </div>
      </div>

      {/* Modal NOVO USUÁRIO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm font-display">Cadastrar Novo Usuário</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 px-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <UserCheck size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria de Souza"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">E-mail Corporativo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Ex: maria.souza@osc.org.br"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={formSenha}
                    onChange={(e) => setFormSenha(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Nível de Acesso</label>
                  <select
                    value={formNivel}
                    onChange={(e) => setFormNivel(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2.5 bg-white text-slate-700"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Pedagógico">Pedagógico</option>
                    <option value="Assistência Social">Assistência Social</option>
                    <option value="Psicólogo">Psicólogo</option>
                    <option value="Visualizador">Visualizador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Status Inicial</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl px-2.5 py-2.5 bg-white text-slate-700"
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 shadow-sm border border-slate-305 rounded-xl text-slate-705 font-semibold bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                >
                  Confirmar Cadastro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal EDITAR USUÁRIO */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-940/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm font-display">Editar Usuário</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUsuario(null);
                }}
                className="p-1 px-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <UserCheck size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">E-mail Corporativo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-450">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Nível de Acesso</label>
                  <select
                    value={formNivel}
                    onChange={(e) => setFormNivel(e.target.value as any)}
                    disabled={editingUsuario?.id === currentUserId}
                    className={`w-full border border-slate-200 rounded-xl px-2.5 py-2.5 bg-white text-slate-700 ${editingUsuario?.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Pedagógico">Pedagógico</option>
                    <option value="Assistência Social">Assistência Social</option>
                    <option value="Psicólogo">Psicólogo</option>
                    <option value="Visualizador">Visualizador</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1 font-display">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    disabled={editingUsuario?.id === currentUserId}
                    className={`w-full border border-slate-200 rounded-xl px-2.5 py-2.5 bg-white text-slate-700 ${editingUsuario?.id === currentUserId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUsuario(null);
                  }}
                  className="px-3.5 py-2 shadow-sm border border-slate-305 rounded-xl text-slate-705 font-semibold bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition cursor-pointer shadow-sm"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Exclusão */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-5 flex items-center space-x-3 border-b border-rose-100 bg-rose-50/50">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} />
              </div>
              <h3 className="font-bold text-lg text-slate-800">Confirmar Exclusão</h3>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-slate-600 font-medium">
                Tem certeza que deseja remover o usuário <span className="font-bold text-slate-800">{deleteConfirm.name}</span>?
              </p>
              <p className="text-[11px] text-slate-450 mt-2">Esta ação não pode ser desfeita e removerá o acesso do usuário ao sistema.</p>
            </div>

            <div className="px-6 py-4 flex items-center justify-end space-x-2 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-semibold bg-white hover:bg-slate-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-sm transition cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
