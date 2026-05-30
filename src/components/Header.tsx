/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Bell, LogOut, CheckCircle, RefreshCw } from 'lucide-react';

interface HeaderProps {
  userLevel: string;
  usuarioNome: string;
  onLogout: () => void;
  alertsCount?: number;
}

export default function Header({ userLevel, usuarioNome, onLogout, alertsCount }: HeaderProps) {
  return (
    <header id="main-header" className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Esquerda: Nível de acesso explicativo e trocador */}
      <div className="flex items-center space-x-3">
        <Shield size={20} className="text-[#38bdf8]" />
        <div className="flex items-center space-x-1">
          <span className="text-slate-800 font-bold text-sm font-display">{userLevel}</span>
        </div>
      </div>

      {/* Direita: Usuário e Sair */}
      <div className="flex items-center space-x-4">
        {/* Nome do usuário e logout */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-200">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-800">{usuarioNome}</span>
            <span className="text-[10px] text-slate-500">{userLevel}</span>
          </div>
          <button
            id="header-logout-btn"
            onClick={onLogout}
            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition cursor-pointer"
            title="Sair do Sistema"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
