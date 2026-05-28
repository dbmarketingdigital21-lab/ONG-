/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  nivel_acesso: 'Administrado' | 'Financeiro' | 'Coordenador' | 'Pedagógico' | 'Assistência Social' | 'Psicólogo' | 'Visualizador';
  status: 'Ativo' | 'Inativo';
  created_at: string;
}

export interface Instituicao {
  id: string;
  razao_social: string;
  nome_fantasia: string;
  cnpj: string;
  inscricao_estadual?: string;
  inscricao_municipal?: string;
  data_fundacao: string;
  natureza_juridica: string;
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  telefone: string;
  whatsapp?: string;
  email: string;
  site?: string;
  redes_sociais?: string;
  logoUrl?: string;
}

export interface ContaBancaria {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: 'Corrente' | 'Poupança' | 'Aplicação';
  pixEscrita?: string;
  titular: string;
  status: 'Ativa' | 'Inativa';
}

export interface Receita {
  id: string;
  categoria: 'Doação financeira' | 'Almoço' | 'Bazar' | 'Eventos' | 'Outros';
  tipo_evento?: string;
  valor: number;
  data: string;
  forma_pagamento: 'Pix' | 'Transferência' | 'Dinheiro' | 'Cartão' | 'Boleto';
  observacoes?: string;
}

export interface Despesa {
  id: string;
  categoria: string;
  valor: number;
  data: string;
  fornecedor_id: string;
  fornecedor_nome: string;
  forma_pagamento: 'Pix' | 'Transferência' | 'Dinheiro' | 'Cartão' | 'Boleto';
  comprovanteUrl?: string;
}

export interface ItemEstoque {
  id: string;
  nome_item: string;
  nota_fiscal?: string;
  quantidade: number;
  custo: number;
  validade?: string;
  local_armazenagem: string;
  categoria: string;
  codigo_interno?: string;
  status: 'Disponível' | 'Esgotado' | 'Vencido' | 'Estoque Baixo';
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  tipo_fornecedor: 'Alimentação' | 'Materiais permanentes' | 'Informática' | 'Manutenção predial' | 'Construção' | 'Outros';
  dados_bancarios?: string;
  pix?: string;
  documentoUrl?: string;
}

export interface Dirigente {
  id: string;
  nome_completo: string;
  cpf: string;
  rg?: string;
  cargo: string;
  telefone: string;
  email: string;
  data_inicio_mandato: string;
  data_fim_mandato: string;
  status: 'Ativo' | 'Inativo';
  documentoUrl?: string;
}

export interface Coordenador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
  telefone: string;
  email: string;
  projeto_vinculado: string;
  status: 'Ativo' | 'Inativo';
}

export interface Estudante {
  id: string;
  nome: string;
  escola: string;
  diretor?: string;
  professor?: string;
  endereco_escola?: string;
  telefone_escola?: string;
  horario_aulas?: string;
  notas: {
    bimestre1?: number;
    bimestre2?: number;
    bimestre3?: number;
    bimestre4?: number;
  };
  feedback_bimestral?: string;
  observacoes?: string;
  documentos: Array<{ nome: string; url: string; tipo: string }>;
}

export interface ProcessoJudicial {
  id: string;
  numero_processo: string;
  situacao: 'Ativo' | 'Arquivado' | 'Em Andamento';
  envolvidos: string;
  observacoes?: string;
}

export interface Prontuario {
  id: string;
  acolhido: string;
  tipo_atendimento: string;
  data: string;
  hora: string;
  responsavel: string;
  observacoes: string;
  arquivoUrl?: string;
}

export interface CestaBasica {
  id: string;
  recebedor: string;
  relacao: 'Beneficiário' | 'Funcionário' | 'Voluntário' | 'Outros';
  data_entrega: string;
  quantidade: number;
}

export interface TermoResponsabilidade {
  id: string;
  responsavel: string;
  ato: string;
  descricao: string;
  assinatura_digital?: string; // Base64 dataURL
  data_criacao: string;
}

export interface DocumentoInstitucional {
  id: string;
  categoria: 'Estatuto social' | 'CNPJ' | 'Certificações' | 'Licenciamentos' | 'Ata de eleição' | 'Certidões' | 'Convênios públicos' | 'Parcerias privadas';
  nome: string;
  arquivoUrl?: string;
  validade?: string;
  data_upload: string;
}

export interface LogSistema {
  id: string;
  usuario_id: string;
  usuario_nome: string;
  acao: string;
  ip: string;
  data_log: string;
}
