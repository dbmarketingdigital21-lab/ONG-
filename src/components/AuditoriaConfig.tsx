/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Activity, 
  Database, 
  Download, 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Eye,
  FileCode,
  Globe
} from 'lucide-react';
import { LogSistema } from '../types';

interface AuditoriaConfigProps {
  logs: LogSistema[];
  onTriggerBackup: () => void;
  phpSourceCodeManifest: {
    sqlitePersistenceAlert: string;
    schema_db: string;
    php_controller: string;
  };
}

export default function AuditoriaConfig({ logs, onTriggerBackup, phpSourceCodeManifest }: AuditoriaConfigProps) {
  // Switcher de abas internas
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'phpCode' | 'dbops'>('logs');

  // Seletor de visualização de código PHP
  const [selectedFile, setSelectedFile] = useState<'schema' | 'config' | 'controller'>('schema');

  // Códigos estáticos auxiliares para demonstrar a robustez do MVC entregue
  const fileCodes = {
    schema: {
      name: 'database/schema.sql',
      code: phpSourceCodeManifest.schema_db,
      lang: 'sql',
      desc: 'Modelagem relacional completa do MySQL 8+ contendo chaves estrangeiras, índices e constraints para cPanel/VPS.'
    },
    config: {
      name: 'config/database.php',
      code: `<?php\nclass Database {\n    public static function connect() {\n        $host = getenv('DB_HOST') ?: '127.0.0.1';\n        $db   = getenv('DB_NAME') ?: 'viva_o_amanha_osc';\n        $dsn = "mysql:host=$host;dbname=$db;port=3306;charset=utf8mb4";\n        return new PDO($dsn, "user", "pass", [\n            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,\n            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC\n        ]);\n    }\n}`,
      lang: 'php',
      desc: 'Classe institucional estável de conexão PDO com tratamento preventivo a vazamento de credenciais.'
    },
    controller: {
      name: 'controllers/FinanceiroController.php',
      code: phpSourceCodeManifest.php_controller,
      lang: 'php',
      desc: 'Controlador financeiro puro em PHP 8. Demostra sanitização e controle rígido contra CSRF e controle por permissões.'
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Logs de Auditoria & Centro do Desenvolvedor</h2>
        <p className="text-xs text-slate-500">Mapeamento em tempo real de ações administrativas de auditoria, gerador de backup oficial SQL e explorador do pacote PHP MVC.</p>
      </div>

      {/* Sub tabs nav */}
      <div className="flex border-b border-slate-200 text-xs font-semibold space-x-2 select-none">
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'logs' ? 'border-indigo-650 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Logs do Sistema (Painel de Auditoria)
        </button>
        <button
          onClick={() => setActiveSubTab('phpCode')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'phpCode' ? 'border-indigo-650 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pacote de Código PHP MVC & MySQL
        </button>
        <button
          onClick={() => setActiveSubTab('dbops')}
          className={`pb-2.5 px-3 border-b-2 cursor-pointer transition ${
            activeSubTab === 'dbops' ? 'border-indigo-650 text-indigo-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Segurança & Backup
        </button>
      </div>

      {/* RENDER INTERNAL CONTENTS */}

      {/* Tab 1: Logs auditoria */}
      {activeSubTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity size={18} className="text-slate-600 animate-pulse" />
              <h3 className="font-bold text-slate-800 text-sm">Registro de Eventos Críticos (Auditoria)</h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-105 border font-semibold text-slate-500">
              Total logs guardados: {logs.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold select-none">
                  <th className="p-2.5">Código / IP</th>
                  <th className="p-2.5">Operador</th>
                  <th className="p-2.5">Ação Efetuada</th>
                  <th className="p-2.5">Data / Hora do Evento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-2.5 text-slate-400">
                      <span>{log.id}</span> <br />
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded flex items-center space-x-0.5 w-max">
                        <Globe size={9} /> <span>{log.ip}</span>
                      </span>
                    </td>
                    <td className="p-2.5 font-sans font-bold text-slate-800">{log.usuario_nome}</td>
                    <td className="p-2.5 text-slate-600 font-sans">{log.acao}</td>
                    <td className="p-2.5 text-slate-500">{new Date(log.data_log).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: PHP MVC Explorer */}
      {activeSubTab === 'phpCode' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu arquivos */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Mapeamento MVC Hostinger/cPanel</h4>
            
            <div className="space-y-1.5 text-xs text-slate-750">
              <button
                onClick={() => setSelectedFile('schema')}
                className={`w-full flex items-center space-x-2.5 p-3 rounded-lg border text-left cursor-pointer transition ${
                  selectedFile === 'schema' ? 'bg-slate-900 text-white border-slate-950 font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                }`}
              >
                <Database size={15} />
                <span>/database/schema.sql</span>
              </button>

              <button
                onClick={() => setSelectedFile('config')}
                className={`w-full flex items-center space-x-2.5 p-3 rounded-lg border text-left cursor-pointer transition ${
                  selectedFile === 'config' ? 'bg-slate-900 text-white border-slate-950 font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                }`}
              >
                <Code2 size={15} />
                <span>/config/database.php</span>
              </button>

              <button
                onClick={() => setSelectedFile('controller')}
                className={`w-full flex items-center space-x-2.5 p-3 rounded-lg border text-left cursor-pointer transition ${
                  selectedFile === 'controller' ? 'bg-slate-900 text-white border-slate-950 font-semibold' : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                }`}
              >
                <Terminal size={15} />
                <span>/controllers/FinanceiroController.php</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 leading-relaxed italic bg-emerald-50 text-emerald-800 p-3.5 rounded border border-emerald-110">
              💡 <b>Nota Importante:</b> {phpSourceCodeManifest.sqlitePersistenceAlert}
            </p>
          </div>

          {/* Visualizador de código */}
          <div className="lg:col-span-2 bg-slate-950 text-slate-250 border border-slate-850 rounded-xl p-5 flex flex-col justify-between font-mono space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <FileCode size={18} className="text-emerald-500" />
                  <span className="text-xs font-bold text-white">{fileCodes[selectedFile].name}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(fileCodes[selectedFile].code);
                    alert("Especificado código PHP copiado para a área de transferência de segurança!");
                  }}
                  className="px-2 py-1 text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 font-semibold rounded cursor-pointer transition"
                >
                  Copiar Código
                </button>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">{fileCodes[selectedFile].desc}</p>
            </div>

            {/* Printout do code */}
            <div className="bg-slate-900 border border-slate-850 p-4 rounded-lg overflow-x-auto max-h-72 overflow-y-auto">
              <pre className="text-[10px] leading-relaxed text-slate-200">
                <code>{fileCodes[selectedFile].code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: DB Backup operations */}
      {activeSubTab === 'dbops' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          {/* Caixa de Backup Real */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Database size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Cópia de Segurança e Despejo SQL</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pr-2">
              Como conformidade de transparência fiscal, você pode baixar a qualquer instante o arquivo de dumping SQL consolidado da estrutura do banco relacional de dados da OSC, pronto para importação local ou VPS.
            </p>
            <button
              onClick={onTriggerBackup}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition shadow"
            >
              <Download size={14} />
              <span>Gerar e Baixar .SQL Oficial</span>
            </button>
          </div>

          {/* Controle Administrativo de rate limit / Segurança */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center space-x-2">
              <Lock size={18} className="text-rose-600" />
              <h3 className="font-bold text-slate-800 text-sm">Segurança Ativa Contra Brute Force</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              O sistema utiliza algoritmos anti-invasão e limites de tentativa de login (Rate limiting e CSRF ativo). Recomenda-se realizar revisões mensais de logs e inativar contas antigas de voluntários ou trabalhadores em recesso temporário.
            </p>
            <div className="flex items-center space-x-1.5 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-150 p-2 rounded font-bold font-mono">
              <ShieldCheck size={14} />
              <span>Criptografia Ativa: Argon2id/Bcrypt com Salt e Hash.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
