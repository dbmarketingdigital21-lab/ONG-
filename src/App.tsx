/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Lock, 
  Users, 
  Mail, 
  Eye, 
  EyeOff, 
  LogOut, 
  Database,
  Terminal,
  Activity,
  HeartHandshake
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Financeiro from './components/Financeiro';
import Instituicao from './components/Instituicao';
import Estoque from './components/Estoque';
import Fornecedores from './components/Fornecedores';
import Equipe from './components/Equipe';
import Pedagogico from './components/Pedagogico';
import SocialPsicologia from './components/SocialPsicologia';
import Documentos from './components/Documentos';
import AuditoriaConfig from './components/AuditoriaConfig';
import Perfil from './components/Perfil';
import Usuarios from './components/Usuarios';
import ContasBancarias from './components/ContasBancarias';

import { 
  Usuario, 
  Instituicao as InstituicaoType, 
  ContaBancaria, 
  Receita, 
  Despesa, 
  ItemEstoque, 
  Fornecedor, 
  Dirigente, 
  Coordenador, 
  Estudante, 
  Prontuario, 
  CestaBasica, 
  TermoResponsabilidade, 
  ProcessoJudicial, 
  DocumentoInstitucional, 
  LogSistema 
} from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Login inputs properties
  const [email, setEmail] = useState('dbmarktdigital@gmail.com');
  const [senha, setSenha] = useState('senha123'); // Password mock
  const [showSenha, setShowSenha] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // States hydratados pela API
  const [instituicao, setInstituicao] = useState<InstituicaoType | null>(null);
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [estoque, setEstoque] = useState<ItemEstoque[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [dirigentes, setDirigentes] = useState<Dirigente[]>([]);
  const [coordenadores, setCoordenadores] = useState<Coordenador[]>([]);
  const [estudantes, setEstudantes] = useState<Estudante[]>([]);
  const [prontuarios, setProntuarios] = useState<Prontuario[]>([]);
  const [cestas, setCestas] = useState<CestaBasica[]>([]);
  const [termos, setTermos] = useState<TermoResponsabilidade[]>([]);
  const [processos, setProcessos] = useState<ProcessoJudicial[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoInstitucional[]>([]);
  const [logs, setLogs] = useState<LogSistema[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  const [phpSourceCodeManifest, setPhpSourceCodeManifest] = useState({
    sqlitePersistenceAlert: '',
    schema_db: '',
    php_controller: ''
  });

  // REST endpoints calls
  const fetchAllData = async () => {
    try {
      const fetchURL = async (route: string) => {
        const res = await fetch(route);
        return res.ok ? res.json() : [];
      };

      const [
        instData,
        contasData,
        receitasData,
        despesasData,
        estoqueData,
        fornData,
        dirData,
        coorData,
        estData,
        prontData,
        cestasData,
        termosData,
        procData,
        docsData,
        logsData,
        codeData,
        usersData
      ] = await Promise.all([
        fetchURL('/api/instituicao'),
        fetchURL('/api/financeiro/contas'),
        fetchURL('/api/financeiro/receitas'),
        fetchURL('/api/financeiro/despesas'),
        fetchURL('/api/estoque'),
        fetchURL('/api/fornecedores'),
        fetchURL('/api/dirigentes'),
        fetchURL('/api/coordenadores'),
        fetchURL('/api/pedagogico'),
        fetchURL('/api/assistencia/prontuarios'),
        fetchURL('/api/assistencia/cestas'),
        fetchURL('/api/assistencia/termos'),
        fetchURL('/api/assistencia/processos'),
        fetchURL('/api/documentos'),
        fetchURL('/api/logs'),
        fetchURL('/api/php-mvc/export-manifest'),
        fetchURL('/api/usuarios')
      ]);

      if (instData && !instData.length) {
        setInstituicao(instData);
      }
      setContas(contasData || []);
      setReceitas(receitasData || []);
      setDespesas(despesasData || []);
      setEstoque(estoqueData || []);
      setFornecedores(fornData || []);
      setDirigentes(dirData || []);
      setCoordenadores(coorData || []);
      setEstudantes(estData || []);
      setProntuarios(prontData || []);
      setCestas(cestasData || []);
      setTermos(termosData || []);
      setProcessos(procData || []);
      setDocumentos(docsData || []);
      setLogs(logsData || []);
      setUsuarios(usersData || []);
      if (codeData && codeData.success) {
        setPhpSourceCodeManifest(codeData);
      }
    } catch (err) {
      console.error("Erro unificando fetch de dados:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        setCurrentUser(data.usuario);
      } else {
        setLoginError(data.message);
      }
    } catch (err) {
      setLoginError("Erro na conexão com o servidor Express!");
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    setActiveTab('dashboard');
  };

  // Simulating custom role switching for testing
  const handleLevelAcessoChange = (nivel: any) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        nivel_acesso: nivel
      });
    }
  };

  // Mutators:
  // 1. Instituicao
  const handleSaveInstituicao = async (dadosNovos: Partial<InstituicaoType>) => {
    try {
      const res = await fetch('/api/instituicao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosNovos)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Financeiro: Contas
  const handleAddConta = async (conta: Omit<ContaBancaria, 'id'>) => {
    try {
      const res = await fetch('/api/financeiro/contas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conta)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConta = async (id: string) => {
    try {
      const res = await fetch(`/api/financeiro/contas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Usuários do Sistema
  const handleAddUsuario = async (usr: Omit<Usuario, 'id' | 'created_at'>) => {
    try {
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usr)
      });
      if (res.ok) {
        await fetchAllData();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao adicionar usuário');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdateUsuario = async (usr: Usuario) => {
    try {
      const res = await fetch(`/api/usuarios/${usr.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usr)
      });
      if (res.ok) {
        await fetchAllData();
        // Se o usuário atualizado for o logado, atualiza o estado
        if (currentUser && currentUser.id === usr.id) {
          setCurrentUser(usr);
        }
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao editar usuário');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteUsuario = async (id: string) => {
    try {
      const res = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllData();
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Erro ao excluir usuário');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  // Receitas
  const handleAddReceita = async (rec: Omit<Receita, 'id'>) => {
    try {
      const res = await fetch('/api/financeiro/receitas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rec)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReceita = async (id: string) => {
    try {
      const res = await fetch(`/api/financeiro/receitas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // Despesas
  const handleAddDespesa = async (des: Omit<Despesa, 'id'>) => {
    try {
      const res = await fetch('/api/financeiro/despesas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(des)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDespesa = async (id: string) => {
    try {
      const res = await fetch(`/api/financeiro/despesas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Estoque (Almoxarifado)
  const handleAddEstoque = async (item: Omit<ItemEstoque, 'id' | 'status'>) => {
    try {
      const res = await fetch('/api/estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEstoque = async (id: string, item: Omit<ItemEstoque, 'id' | 'status'>) => {
    try {
      const res = await fetch(`/api/estoque/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEstoque = async (id: string) => {
    try {
      const res = await fetch(`/api/estoque/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Fornecedores
  const handleAddFornecedor = async (forn: Omit<Fornecedor, 'id'>) => {
    try {
      const res = await fetch('/api/fornecedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forn)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFornecedor = async (id: string) => {
    try {
      const res = await fetch(`/api/fornecedores/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 5. Equipe: Dirigentes e Coordenadores
  const handleAddDirigente = async (dir: Omit<Dirigente, 'id'>) => {
    try {
      const res = await fetch('/api/dirigentes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dir)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDirigente = async (id: string) => {
    try {
      const res = await fetch(`/api/dirigentes/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCoordenador = async (coor: Omit<Coordenador, 'id'>) => {
    try {
      const res = await fetch('/api/coordenadores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coor)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCoordenador = async (id: string) => {
    try {
      const res = await fetch(`/api/coordenadores/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 6. Pedagogico (Estudantes)
  const handleAddEstudante = async (est: Omit<Estudante, 'id'>) => {
    try {
      const res = await fetch('/api/pedagogico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(est)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEstudante = async (id: string, est: Partial<Estudante>) => {
    try {
      const res = await fetch(`/api/pedagogico/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(est)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEstudante = async (id: string) => {
    try {
      const res = await fetch(`/api/pedagogico/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 7. Assistência Social: Processos, Prontuários, Cestas, Termos
  const handleAddProcesso = async (proc: Omit<ProcessoJudicial, 'id'>) => {
    try {
      const res = await fetch('/api/assistencia/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proc)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProcesso = async (id: string) => {
    try {
      const res = await fetch(`/api/assistencia/processos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProntuario = async (pront: Omit<Prontuario, 'id' | 'data' | 'hora'>) => {
    try {
      const res = await fetch('/api/assistencia/prontuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pront)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProntuario = async (id: string) => {
    try {
      const res = await fetch(`/api/assistencia/prontuarios/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCesta = async (cesta: Omit<CestaBasica, 'id' | 'data_entrega'>) => {
    try {
      const res = await fetch('/api/assistencia/cestas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cesta)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCesta = async (id: string) => {
    try {
      const res = await fetch(`/api/assistencia/cestas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTermo = async (termo: Omit<TermoResponsabilidade, 'id' | 'data_criacao'>) => {
    try {
      const res = await fetch('/api/assistencia/termos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(termo)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTermo = async (id: string) => {
    try {
      const res = await fetch(`/api/assistencia/termos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // 8. Documentos
  const handleAddDocumento = async (doc: Omit<DocumentoInstitucional, 'id' | 'data_upload'>) => {
    try {
      const res = await fetch('/api/documentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc)
      });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDocumento = async (id: string) => {
    try {
      const res = await fetch(`/api/documentos/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  // triggering backup downloading
  const handleTriggerBackup = () => {
    window.open('/api/backup/download', '_blank');
  };

  // Renders login screen if not authenticated
  if (!token || !currentUser) {
    return (
      <div id="login-layout" className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 relative overflow-hidden font-sans select-none antialiased">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Top bar header logo */}
        <div className="w-full flex justify-between items-center z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-slate-900 text-white rounded-xl">
              <Building size={18} />
            </div>
            <div>
              <h1 className="text-xs font-black tracking-widest uppercase text-slate-900 font-sans">Gestor OSC</h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-tight font-medium">Viva o Amanhã - Sistema Consolidado</p>
            </div>
          </div>
          <span className="text-[9px] font-mono tracking-wider text-slate-450 uppercase font-semibold bg-white border border-slate-205 rounded px-2 py-0.5">AVA-V1.0</span>
        </div>

        {/* Form panel block */}
        <div className="flex-1 flex items-center justify-center py-10 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="bg-white border border-slate-200/90 w-full max-w-sm rounded-[20px] p-6.5 shadow-xl flex flex-col space-y-5"
          >
            <div className="space-y-1.5 text-center">
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Acesso Restrito</h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-[260px] mx-auto">Insira as credenciais administrativas cadastradas do estatuto da OSC.</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 text-rose-700 text-xs border border-rose-200 rounded-lg font-medium leading-normal">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1 text-slate-650">
                <label className="text-[11px] font-bold uppercase tracking-wider block font-mono">E-mail Operador</label>
                <div className="flex items-center space-x-2 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50/50 focus-within:border-slate-800 transition">
                  <Mail size={15} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="dbmarktdigital@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1 text-slate-650">
                <label className="text-[11px] font-bold uppercase tracking-wider block font-mono">Senha de Segurança</label>
                <div className="flex items-center space-x-2 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50/50 focus-within:border-slate-800 transition">
                  <Lock size={15} className="text-slate-400" />
                  <input
                    type={showSenha ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSenha(!showSenha)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-slate-900 border border-slate-950 text-white rounded-lg hover:bg-slate-850 font-bold text-xs cursor-pointer transition flex items-center justify-center space-x-1 shadow-sm mt-3"
              >
                <span>{loading ? 'Inicializando...' : 'Entrar no Sistema'}</span>
              </button>
            </form>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-[10px] text-slate-500 font-mono space-y-1.5 leading-relaxed text-center">
              <span className="font-bold text-slate-600 block uppercase tracking-wider text-[9px]">Acesso de Homologação</span>
              <p>O servidor mock está hidratado! Deixamos preenchido as credenciais oficiais padrão da OSC.</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="w-full text-center text-[10px] text-slate-400 font-mono tracking-tight z-10 select-none">
          <span>© {new Date().getFullYear()} Viva o Amanhã. Desenvolvido para conformidade rigorosa com cPanel/VPS.</span>
        </div>
      </div>
    );
  }

  // Se o usuário estiver autenticado:
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans flex text-xs select-none">
      
      {/* 1. Sidebar stick navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        nivelAcesso={currentUser.nivel_acesso} 
      />

      {/* 2. Conteúdo centralizado */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header topo */}
        <Header 
          userLevel={currentUser.nivel_acesso} 
          setUserLevel={handleLevelAcessoChange} 
          usuarioNome={currentUser.nome} 
          onLogout={handleLogout} 
          alertsCount={documentos.filter(d => d.validade !== 'Sem vencimento' && d.validade !== 'Ativo').length}
        />

        {/* Renderizador de Telas com animações de transição suavizadas */}
        <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              {activeTab === 'dashboard' && (
                <Dashboard 
                  receitas={receitas} 
                  despesas={despesas} 
                  estoque={estoque} 
                  estudantes={estudantes} 
                  processos={processos}
                  documentos={documentos}
                />
              )}

              {activeTab === 'financeiro' && (
                <Financeiro 
                  contas={contas} 
                  receitas={receitas} 
                  despesas={despesas} 
                  fornecedores={fornecedores}
                  onAddConta={handleAddConta}
                  onDeleteConta={handleDeleteConta}
                  onAddReceita={handleAddReceita}
                  onDeleteReceita={handleDeleteReceita}
                  onAddDespesa={handleAddDespesa}
                  onDeleteDespesa={handleDeleteDespesa}
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'instituicao' && instituicao && (
                <Instituicao 
                  dados={instituicao} 
                  onSaveDados={handleSaveInstituicao} 
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'estoque' && (
                <Estoque 
                  estoque={estoque} 
                  onAddItem={handleAddEstoque} 
                  onUpdateItem={handleUpdateEstoque} 
                  onDeleteItem={handleDeleteEstoque} 
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'fornecedores' && (
                <Fornecedores 
                  fornecedores={fornecedores} 
                  onAddFornecedor={handleAddFornecedor} 
                  onDeleteFornecedor={handleDeleteFornecedor} 
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'equipe' && (
                <Equipe 
                  dirigentes={dirigentes} 
                  coordenadores={coordenadores} 
                  onAddDirigente={handleAddDirigente}
                  onDeleteDirigente={handleDeleteDirigente}
                  onAddCoordenador={handleAddCoordenador}
                  onDeleteCoordenador={handleDeleteCoordenador}
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'pedagogico' && (
                <Pedagogico 
                  estudantes={estudantes} 
                  onAddEstudante={handleAddEstudante} 
                  onUpdateEstudante={handleUpdateEstudante} 
                  onDeleteEstudante={handleDeleteEstudante} 
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'social-psicologia' && (
                <SocialPsicologia 
                  processos={processos} 
                  prontuarios={prontuarios} 
                  cestas={cestas} 
                  termos={termos} 
                  onAddProcesso={handleAddProcesso}
                  onDeleteProcesso={handleDeleteProcesso}
                  onAddProntuario={handleAddProntuario}
                  onDeleteProntuario={handleDeleteProntuario}
                  onAddCesta={handleAddCesta}
                  onDeleteCesta={handleDeleteCesta}
                  onAddTermo={handleAddTermo}
                  onDeleteTermo={handleDeleteTermo}
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'documentos' && (
                <Documentos 
                  documentos={documentos} 
                  onAddDocumento={handleAddDocumento} 
                  onDeleteDocumento={handleDeleteDocumento} 
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'contas' && (
                <ContasBancarias
                  contas={contas}
                  onAddConta={handleAddConta}
                  onDeleteConta={handleDeleteConta}
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'perfil' && (
                <Perfil
                  usuario={currentUser}
                  onUpdateUsuario={handleUpdateUsuario}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'usuarios' && (
                <Usuarios
                  usuarios={usuarios}
                  onAddUsuario={handleAddUsuario}
                  onUpdateUsuario={handleUpdateUsuario}
                  onDeleteUsuario={handleDeleteUsuario}
                  userRole={currentUser.nivel_acesso}
                />
              )}

              {activeTab === 'auditoria' && (
                <AuditoriaConfig 
                  logs={logs} 
                  onTriggerBackup={handleTriggerBackup} 
                  phpSourceCodeManifest={phpSourceCodeManifest}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
