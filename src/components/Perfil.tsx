/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  CheckCircle, 
  Calendar, 
  Clock, 
  LayoutDashboard, 
  Building, 
  CreditCard, 
  Users, 
  FolderLock, 
  Activity,
  FileText
} from 'lucide-react';
import { Usuario } from '../types';

interface PerfilProps {
  usuario: Usuario;
  onUpdateUsuario: (usr: Usuario) => Promise<void>;
  onChangePassword: (oldP: string, newP: string) => Promise<void>;
  setActiveTab: (tab: string) => void;
}

export default function Perfil({ usuario, onUpdateUsuario, onChangePassword, setActiveTab }: PerfilProps) {
  const [nome, setNome] = useState(usuario.nome);
  const [email, setEmail] = useState(usuario.email);
  const [passwordOld, setPasswordOld] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pwdMessage, setPwdMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const updatedUser = {
        ...usuario,
        nome,
        email
      };
      await onUpdateUsuario(updatedUser);
      setMessage({ text: 'Informações pessoais atualizadas com sucesso!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Erro ao atualizar informações pessoais.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMessage(null);
    if (!passwordOld || !passwordNew || !passwordConfirm) {
      return setPwdMessage({ text: 'Por favor, preencha todos os campos de senha.', type: 'error' });
    }
    if (passwordNew !== passwordConfirm) {
      return setPwdMessage({ text: 'A nova senha e a confirmação não conferem.', type: 'error' });
    }
    setPwdLoading(true);
    try {
      await onChangePassword(passwordOld, passwordNew);
      setPwdMessage({ text: 'Senha alterada com sucesso!', type: 'success' });
      setPasswordOld('');
      setPasswordNew('');
      setPasswordConfirm('');
    } catch (err: any) {
      setPwdMessage({ text: err.message || 'Erro ao alterar a senha.', type: 'error' });
    } finally {
      setPwdLoading(false);
    }
  };

  // 8 Módulos de permissão da foto
  const permissoes = [
    { title: 'Dashboard', icon: LayoutDashboard, tab: 'dashboard', emoji: '📊' },
    { title: 'Instituição', icon: Building, tab: 'instituicao', emoji: '🏢' },
    { title: 'Contas', icon: CreditCard, tab: 'contas', emoji: '💰' },
    { title: 'Dirigentes', icon: Users, tab: 'equipe', emoji: '👥' },
    { title: 'Coordenadores', icon: Users, tab: 'equipe', emoji: '👤' },
    { title: 'Documentos', icon: FolderLock, tab: 'documentos', emoji: '📄' },
    { title: 'Usuários', icon: Lock, tab: 'usuarios', emoji: '🔐' },
    { title: 'Logs', icon: Activity, tab: 'auditoria', emoji: '📋' },
  ];

  const firstLetter = usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'A';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">Meu Perfil</h2>
        <p className="text-xs text-slate-500 font-sans">Visualize e edite suas informações pessoais</p>
      </div>

      {/* Card 1: Avatar badge */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-5">
          <div className="w-20 h-20 bg-blue-600 text-white font-extrabold rounded-full flex items-center justify-center text-3xl shadow-sm">
            {firstLetter}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-lg font-bold text-slate-900 font-display">{nome || usuario.nome}</h3>
            <p className="text-xs text-slate-400 font-mono font-medium">{email || usuario.email}</p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#10b981]/5 text-[#10b981] border border-[#10b981]/15">
              {usuario.nivel_acesso}
            </span>
          </div>
        </div>
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition cursor-pointer"
        >
          {loading ? 'Salvando...' : 'Salvar Perfil'}
        </button>
      </div>

      {/* Grid Dados + Detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Informações Pessoais Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-sm font-display">Informações Pessoais</h4>
              <p className="text-[10px] text-slate-450">Seus dados de cadastro no sistema</p>
            </div>
            <User className="text-[#38bdf8]" size={20} />
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg text-xs font-medium border ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-250' : 'bg-rose-50 text-rose-800 border-rose-250'
              }`}>
                {message.text}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">Nome Completo</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-205 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition font-sans"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-600 font-bold mb-1 font-display">E-mail</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-205 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition font-sans"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Detalhes da Conta Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="space-y-0.5">
              <h4 className="font-bold text-slate-900 text-sm font-display">Detalhes da Conta</h4>
              <p className="text-[10px] text-slate-450">Informações sobre sua conta</p>
            </div>
            <Shield className="text-[#38bdf8]" size={20} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">Nível de Acesso</span>
              <span className="font-bold text-slate-800">{usuario.nivel_acesso}</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">Membro desde</span>
              <span className="font-bold text-slate-800">01/01/2024</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col space-y-1">
              <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">Último Acesso</span>
              <span className="font-bold text-slate-700">29/05/2026 09:41</span>
            </div>
            <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col space-y-1 justify-between">
              <span className="text-[9px] text-slate-400 font-mono font-semibold uppercase">Status</span>
              <div>
                <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alterar Senha Row Block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-sm font-display">Alterar Senha</h4>
            <p className="text-[10px] text-slate-450 font-sans">Mantenha sua conta segura</p>
          </div>
          <Lock className="text-rose-500" size={20} />
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          {pwdMessage && (
            <div className={`p-3 rounded-lg text-xs font-semibold border ${
              pwdMessage.type === 'success' ? 'bg-[#10b981]/5 text-[#10b981] border-[#10b981]/15' : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              {pwdMessage.text}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1 font-display">Senha Atual</label>
              <input
                type="password"
                required
                placeholder="********"
                value={passwordOld}
                onChange={(e) => setPasswordOld(e.target.value)}
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1 font-display">Nova Senha</label>
              <input
                type="password"
                required
                placeholder="********"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition font-sans"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-bold mb-1 font-display">Confirmar Nova Senha</label>
              <input
                type="password"
                required
                placeholder="********"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#38bdf8] focus:border-[#38bdf8] transition font-sans"
              />
            </div>
          </div>

          <div className="flex items-center justify-start">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition cursor-pointer flex items-center space-x-1.5"
            >
              <Lock size={12} />
              <span>Alterar Senha</span>
            </button>
          </div>
        </form>
      </div>

      {/* Card 5: Suas Permissões (Dynamic block exactly aligned with Photo 1) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h4 className="font-bold text-slate-900 text-sm font-display">Suas Permissões</h4>
          <p className="text-[10px] text-slate-450">O que você pode fazer no sistema</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {permissoes.map((p, idx) => {
            const IconComponent = p.icon;
            return (
              <div 
                key={idx}
                onClick={() => setActiveTab(p.tab)}
                className="border border-[#10b981]/10 bg-[#10b981]/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2 hover:bg-[#10b981]/10 transition cursor-pointer group"
              >
                <div className="text-2xl mt-1 select-none group-hover:scale-110 transition-transform duration-200">
                  {p.emoji}
                </div>
                <div className="text-xs font-bold text-emerald-800 font-sans tracking-tight">
                  {p.title}
                </div>
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-emerald-500/20 text-emerald-700 uppercase tracking-wider">
                    Acesso
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
