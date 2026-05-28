/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Building, Save, Globe, Phone, MapPin, Share2, Upload } from 'lucide-react';
import { type Instituicao as InstituicaoType } from '../types';

interface InstituicaoProps {
  dados: InstituicaoType;
  onSaveDados: (dados: Partial<InstituicaoType>) => void;
  userRole: string;
}

export default function Instituicao({ dados, onSaveDados, userRole }: InstituicaoProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Form states
  const [razaoSocial, setRazaoSocial] = useState(dados.razao_social);
  const [nomeFantasia, setNomeFantasia] = useState(dados.nome_fantasia);
  const [cnpj, setCnpj] = useState(dados.cnpj);
  const [ie, setIe] = useState(dados.inscricao_estadual || '');
  const [im, setIm] = useState(dados.inscricao_municipal || '');
  const [fundacao, setFundacao] = useState(dados.data_fundacao);
  const [natureza, setNatureza] = useState(dados.natureza_juridica);
  const [cep, setCep] = useState(dados.cep);
  const [rua, setRua] = useState(dados.rua);
  const [numero, setNumero] = useState(dados.numero);
  const [complemento, setComplemento] = useState(dados.complemento || '');
  const [bairro, setBairro] = useState(dados.bairro);
  const [cidade, setCidade] = useState(dados.cidade);
  const [estado, setEstado] = useState(dados.estado);
  const [telefone, setTelefone] = useState(dados.telefone);
  const [ws, setWs] = useState(dados.whatsapp || '');
  const [email, setEmail] = useState(dados.email);
  const [site, setSite] = useState(dados.site || '');
  const [redes, setRedes] = useState(dados.redes_sociais || '');

  const canEdit = userRole === 'Administrador' || userRole === 'Coordenador';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDados({
      razao_social: razaoSocial,
      nome_fantasia: nomeFantasia,
      cnpj: cnpj,
      inscricao_estadual: ie || undefined,
      inscricao_municipal: im || undefined,
      data_fundacao: fundacao,
      natureza_juridica: natureza,
      cep: cep,
      rua: rua,
      numero: numero,
      complemento: complemento || undefined,
      bairro: bairro,
      cidade: cidade,
      estado: estado,
      telefone: telefone,
      whatsapp: ws || undefined,
      email: email,
      site: site || undefined,
      redes_sociais: redes || undefined,
      logoUrl: logoPreview || undefined
    });
    setShowEdit(false);
    alert("Dados institucionais da OSC atualizados com integridade!");
  };

  // Simulação de upload do logotipo institucional
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-4 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-3 text-slate-800">
          <div className="p-3 bg-slate-900 text-white rounded-xl">
            <Building size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">{dados.razao_social}</h2>
            <p className="text-xs text-slate-500 font-mono">CNPJ oficial de transparência: {dados.cnpj}</p>
          </div>
        </div>
        {canEdit && !showEdit && (
          <button
            id="instituicao-edit-btn"
            onClick={() => setShowEdit(true)}
            className="px-4 py-2 border border-slate-350 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg flex items-center space-x-1 transition cursor-pointer"
          >
            <span>Editar Informações</span>
          </button>
        )}
      </div>

      {showEdit ? (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs text-slate-700">
          {/* Logo Sim */}
          <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 space-y-3">
            <span className="block font-semibold">Simular Envio de Logotipo da OSC</span>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white border border-slate-300 rounded-lg flex items-center justify-center overflow-hidden shrink-0 relative">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="object-contain w-full h-full" referrerPolicy="no-referrer" />
                ) : (
                  <Building size={30} className="text-slate-300" />
                )}
              </div>
              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-input"
                />
                <label
                  htmlFor="logo-input"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded font-semibold cursor-pointer hover:bg-slate-800 text-[11px] block text-center"
                >
                  Selecionar Foto Logomarca
                </label>
                <span className="text-[10px] text-slate-400 block font-mono">Formatos recomendados: PNG ou SVG (Resolução Quadrada)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Razão Social Oficial</label>
              <input
                type="text"
                required
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Nome Fantasia Comercial</label>
              <input
                type="text"
                required
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">C.N.P.J.</label>
              <input
                type="text"
                required
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Inscrição Estadual (IE)</label>
              <input
                type="text"
                value={ie}
                onChange={(e) => setIe(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Inscrição Municipal (IM)</label>
              <input
                type="text"
                value={im}
                onChange={(e) => setIm(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Fundada em</label>
                <input
                  type="date"
                  required
                  value={fundacao}
                  onChange={(e) => setFundacao(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Natureza Jurídica</label>
                <input
                  type="text"
                  required
                  value={natureza}
                  onChange={(e) => setNatureza(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
            </div>

            {/* Endereco */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">C.E.P.</label>
              <input
                type="text"
                required
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1 font-semibold">Logradouro / Rua / Travessa</label>
              <input
                type="text"
                required
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-slate-600 font-medium mb-1">Número</label>
                <input
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-slate-600 font-medium mb-1">Complemento</label>
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Bairro</label>
              <input
                type="text"
                required
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Cidade</label>
              <input
                type="text"
                required
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Estado (UF)</label>
              <input
                type="text"
                required
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
              />
            </div>

            {/* Contat */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">Telefone Fixo</label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">WhatsApp Celular</label>
              <input
                type="text"
                value={ws}
                onChange={(e) => setWs(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">E-mail Institucional</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1 font-semibold">Endereço Web / Site</label>
              <input
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                placeholder="www.seudominio.org.br"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-600 font-medium mb-1">Mídias Sociais Integradas / Redes</label>
              <input
                type="text"
                value={redes}
                onChange={(e) => setRedes(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                placeholder="Instagram: @vivaamanha - Facebook: /vivaamanha"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="px-4 py-2 border border-slate-300 text-slate-705 bg-slate-50 font-semibold rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-white font-semibold rounded-lg flex items-center space-x-1.5 cursor-pointer"
            >
              <Save size={14} />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      ) : (
        /* Visualização Simples (Bento style) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 leading-relaxed">
          {/* Logo preview */}
          <div className="md:col-span-1 border border-slate-100 bg-slate-50 rounded-xl p-5 flex flex-col items-center justify-center space-y-4">
            <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {dados.logoUrl ? (
                <img src={dados.logoUrl} alt="OSC Logo" className="object-contain w-full h-full" referrerPolicy="no-referrer" />
              ) : (
                <Building size={45} className="text-slate-300" />
              )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-850 text-sm">Logomarca Oficial</h3>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold font-mono">Associação Viva o Amanhã</p>
            </div>
          </div>

          {/* Dados Legais */}
          <div className="md:col-span-2 border border-slate-100/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-slate-800 font-bold border-b border-slate-100 pb-2">
              <Building size={14} />
              <span>Dados Legais e Cadastro Fiscal</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-slate-600">
              <p>Razão Social: <b className="text-slate-800 font-sans text-xs">{dados.razao_social}</b></p>
              <p>Nome Fantasia: <b className="text-slate-800">{dados.nome_fantasia}</b></p>
              <p>CNPJ Transparência: <b className="text-slate-800 font-mono font-medium">{dados.cnpj}</b></p>
              <p>Inscrição Estadual: <b className="text-slate-800 font-mono font-medium">{dados.inscricao_estadual || 'Isento'}</b></p>
              <p>Inscrição Municipal: <b className="text-slate-800 font-mono font-medium">{dados.inscricao_municipal || 'Isento'}</b></p>
              <p>Data Fundação: <b className="text-slate-850 font-mono">{dados.data_fundacao}</b></p>
              <p className="sm:col-span-2">Natureza Jurídica: <b className="text-slate-800">{dados.natureza_juridica}</b></p>
            </div>
          </div>

          {/* Contato canal */}
          <div className="md:col-span-2 border border-slate-150/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-slate-800 font-bold border-b border-slate-100 pb-2">
              <Globe size={14} />
              <span>Contatos Institucionais & Redes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-slate-600">
              <p>E-mail: <b className="text-slate-800">{dados.email}</b></p>
              <p>Telefone: <b className="text-slate-800">{dados.telefone}</b></p>
              {dados.whatsapp && <p>WhatsApp: <b className="text-emerald-700">{dados.whatsapp}</b></p>}
              {dados.site && <p>Website: <b className="text-slate-800 font-mono">{dados.site}</b></p>}
              {dados.redes_sociais && <p className="sm:col-span-2">Redes Integradas: <b className="text-slate-800">{dados.redes_sociais}</b></p>}
            </div>
          </div>

          {/* Endereço */}
          <div className="md:col-span-1 border border-slate-150/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center space-x-1.5 text-slate-800 font-bold border-b border-slate-100 pb-2">
              <MapPin size={14} />
              <span>Endereço e Sede Física</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600">
              <p>Sede: <b className="text-slate-800">{dados.rua}, {dados.numero}</b></p>
              {dados.complemento && <p>Complemento: <b className="text-slate-800">{dados.complemento}</b></p>}
              <p>Bairro: <b className="text-slate-850">{dados.bairro}</b></p>
              <p>Cidade / Estado: <b className="text-slate-850">{dados.cidade} - {dados.estado}</b></p>
              <p>C.E.P: <b className="text-slate-850 font-mono">{dados.cep}</b></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
