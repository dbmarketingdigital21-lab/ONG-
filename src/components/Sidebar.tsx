/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  Users, 
  GraduationCap, 
  HeartHandshake, 
  FolderLock, 
  Settings, 
  Activity, 
  CreditCard,
  Building,
  UserCheck,
  MapPin,
  Signature
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  nivelAcesso: string;
}

export default function Sidebar({ activeTab, setActiveTab, nivelAcesso }: SidebarProps) {
  // Lista de itens do menu filtrados ou com indicação de acesso por nível
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['All'] },
    { id: 'instituicao', label: 'Dados da Instituição', icon: Building, roles: ['All'] },
    { id: 'financeiro', label: 'Gestão Financeira', icon: DollarSign, roles: ['Administrador', 'Financeiro', 'Visualizador'] },
    { id: 'contas', label: 'Contas Bancárias', icon: CreditCard, roles: ['Administrador', 'Financeiro'] },
    { id: 'estoque', label: 'Estoque / Notas', icon: Package, roles: ['Administrador', 'Financeiro', 'Coordenador'] },
    { id: 'fornecedores', label: 'Fornecedores', icon: Users, roles: ['Administrador', 'Financeiro'] },
    { id: 'equipe', label: 'Equipe / Dirigentes', icon: UserCheck, roles: ['Administrador', 'Coordenador'] },
    { id: 'pedagogico', label: 'Pedagógico / Alunos', icon: GraduationCap, roles: ['Administrador', 'Coordenador', 'Pedagógico'] },
    { id: 'social-psicologia', label: 'Ação Social & Prontuários', icon: HeartHandshake, roles: ['Administrador', 'Assistência Social', 'Psicólogo'] },
    { id: 'documentos', label: 'Documentos Seguros', icon: FolderLock, roles: ['Administrador', 'Coordenador'] },
    { id: 'auditoria', label: 'Logs & Desenvolvedor', icon: Activity, roles: ['Administrador'] }
  ];

  // Verifica se o usuário tem permissão para visualizar o menu
  const canAccess = (roles: string[]) => {
    if (roles.includes('All')) return true;
    return roles.includes(nivelAcesso) || nivelAcesso === 'Administrador';
  };

  return (
    <aside id="main-sidebar" className="w-64 bg-[#0f172a] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-[#0d1321]">
        <div className="w-8 h-8 bg-[#38bdf8] text-[#0f172a] rounded-lg flex items-center justify-center font-bold text-base shadow-sm">
          G
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white uppercase font-display">Gestão OSC</h1>
          <p className="text-[10px] text-[#38bdf8]/85 font-mono">Viva o Amanhã • v2.4.0</p>
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 font-display">Módulos Corporativos</p>
        {menuItems.map((item) => {
          const isAllowed = canAccess(item.roles);
          const Icon = item.icon;
          if (!isAllowed) return null;

          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#1e293b] text-[#38bdf8] font-semibold'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#38bdf8]' : 'text-slate-500 transition-colors'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer com nível de acesso explicativo */}
      <div className="p-4 border-t border-slate-850 bg-[#0d1321] flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-[#38bdf8] rounded-full animate-pulse" />
          <span className="text-[9px] text-[#38bdf8] font-mono uppercase tracking-wider">Servidor Ativo</span>
        </div>
        <p className="text-[9px] text-slate-500 font-mono">Versão 2.4.0 • Conformidade VPS</p>
      </div>
    </aside>
  );
}
