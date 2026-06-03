/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { createServer as createViteServer } from 'vite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- INICIALIZAÇÃO DA BASE DE DADOS EM ARQUIVO (JSON) ---

import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfigParams = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfigParams);
const dbFirestore = getFirestore(firebaseApp, firebaseConfigParams.firestoreDatabaseId);

async function loadDB() {
  try {
    let hasData = false;
    const keys = Object.keys(db);
    for (const key of keys) {
       const snap = await getDoc(doc(dbFirestore, "tables", key));
       if (snap.exists() && snap.data().data) {
          db[key] = JSON.parse(snap.data().data);
          hasData = true;
       }
    }
    if (hasData) {
       console.log("Loaded DB from Firestore!");
       fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
  } catch(e) {
    console.error("Firestore load error:", e);
  }
}

const DB_FILE = path.join(process.cwd(), 'database_osc.json');
const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-secret-key-osc-2026';

// Interface para Banco de Dados Local
interface LocalDB {
  usuarios: any[];
  instituicao: any;
  contas_bancarias: any[];
  receitas: any[];
  despesas: any[];
  estoque: any[];
  fornecedores: any[];
  dirigentes: any[];
  coordenadores: any[];
  estudantes: any[];
  prontuarios: any[];
  cestas_basicas: any[];
  termos_responsabilidade: any[];
  processos_judiciais: any[];
  documentos: any[];
  logs_sistema: any[];
}

// Dados iniciais e mockados para hidratação bonita do sistema
const DADOS_INICIAIS: LocalDB = {
  usuarios: [
    {
      id: "usr-1",
      nome: "Administrador",
      email: "admin@osc.org.br",
      senha_hash: bcrypt.hashSync("admin123", 10),
      nivel_acesso: "Administrador",
      status: "Ativo",
      created_at: "2024-01-01T10:00:00Z"
    },
    {
      id: "usr-2",
      nome: "Maria Financeiro",
      email: "financeiro@osc.org.br",
      senha_hash: bcrypt.hashSync("financeiro123", 10),
      nivel_acesso: "Financeiro",
      status: "Ativo",
      created_at: "2024-01-01T10:00:00Z"
    },
    {
      id: "usr-3",
      nome: "João Coordenador",
      email: "coordenador@osc.org.br",
      senha_hash: bcrypt.hashSync("coordenador123", 10),
      nivel_acesso: "Coordenador",
      status: "Ativo",
      created_at: "2024-01-01T10:00:00Z"
    },
    {
      id: "usr-4",
      nome: "Ana Visualizador",
      email: "viewer@osc.org.br",
      senha_hash: bcrypt.hashSync("viewer123", 10),
      nivel_acesso: "Visualizador",
      status: "Ativo",
      created_at: "2024-01-01T10:00:00Z"
    }
  ],
  instituicao: {
    id: "inst-1",
    razao_social: "ONG Chico Xavier",
    nome_fantasia: "ONG Chico Xavier",
    cnpj: "12.345.678/0001-90",
    inscricao_estadual: "110.220.330.440",
    inscricao_municipal: "987.654.32",
    data_fundacao: "2010-04-12",
    natureza_juridica: "Associação Privada (Sem Fins Lucrativos)",
    cep: "01310-100",
    rua: "Avenida Paulista",
    numero: "1578",
    complemento: "Andar 4",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 3254-8900",
    whatsapp: "(11) 98888-7777",
    email: "contato@chicoxavier.org.br",
    site: "www.chicoxavier.org.br",
    redes_sociais: "Facebook/Instagram: @chicoxavier",
    logoUrl: ""
  },
  contas_bancarias: [
    {
      id: "bank-1",
      banco: "Banco do Brasil S.A.",
      agencia: "1234-5",
      conta: "98765-4",
      tipo_conta: "Corrente",
      pixEscrita: "financeiro@chicoxavier.org.br",
      titular: "ONG Chico Xavier",
      status: "Ativa"
    },
    {
      id: "bank-2",
      banco: "Itaú Unibanco S.A.",
      agencia: "0300",
      conta: "19283-7",
      tipo_conta: "Corrente",
      pixEscrita: "12.345.678/0001-90",
      titular: "ONG Chico Xavier",
      status: "Ativa"
    }
  ],
  receitas: [
    { id: "rec-1", categoria: "Doação financeira", tipo_evento: "", valor: 15400.00, data: "2026-05-10", forma_pagamento: "Pix", observacoes: "Repasse de emenda parlamentar federal" },
    { id: "rec-2", categoria: "Bazar", tipo_evento: "Bazar de Outono 2026", valor: 3200.50, data: "2026-05-15", forma_pagamento: "Dinheiro", observacoes: "Arrecadação total do bazar comunitário de roupas" },
    { id: "rec-3", categoria: "Almoço", tipo_evento: "Feijoada Beneficente", valor: 4890.00, data: "2026-05-20", forma_pagamento: "Pix", observacoes: "Venda de ingressos antecipados" },
    { id: "rec-4", categoria: "Doação financeira", tipo_evento: "", valor: 5500.00, data: "2026-05-25", forma_pagamento: "Transferência", observacoes: "Doação corporativa mensal - TechCorp" }
  ],
  despesas: [
    { id: "des-1", categoria: "Alimentação", valor: 1850.30, data: "2026-05-05", fornecedor_id: "for-1", fornecedor_nome: "Supermercado Atacadão S.A.", forma_pagamento: "Boleto" },
    { id: "des-2", categoria: "Serviços de Terceiros", valor: 750.00, data: "2026-05-12", fornecedor_id: "for-3", fornecedor_nome: "NetTech Telecom", forma_pagamento: "Pix" },
    { id: "des-3", categoria: "Manutenção Predial", valor: 1200.00, data: "2026-05-18", fornecedor_id: "for-4", fornecedor_nome: "Elétrica Silva & Silva", forma_pagamento: "Dinheiro" },
    { id: "des-4", categoria: "Materiais Didáticos", valor: 490.00, data: "2026-05-22", fornecedor_id: "for-2", fornecedor_nome: "Distribuidora de Papéis Arco-Íris", forma_pagamento: "Cartão" }
  ],
  estoque: [
    { id: "estq-1", nome_item: "Cesta Básica Tipo A", nota_fiscal: "NF-9981", quantidade: 45, custo: 85.00, validade: "2026-09-30", local_armazenagem: "Almoxarifado Geral", categoria: "Alimentos", codigo_interno: "CST-01", status: "Disponível" },
    { id: "estq-2", nome_item: "Papel Sulfite A4 (Pacote 500fls)", nota_fiscal: "NF-9800", quantidade: 3, custo: 26.50, validade: "", local_armazenagem: "Sala de Coordenação", categoria: "Papelaria", codigo_interno: "SLF-04", status: "Estoque Baixo" },
    { id: "estq-3", nome_item: "Leite Integral Caixa 1L", nota_fiscal: "NF-9382", quantidade: 12, custo: 4.80, validade: "2026-05-20", local_armazenagem: "Dispensa Cozinha", categoria: "Alimentos", codigo_interno: "LT-10", status: "Vencido" }
  ],
  fornecedores: [
    { id: "for-1", nome: "Supermercado Atacadão S.A.", cnpj: "00.111.222/0001-33", endereco: "Rodovia Anchieta, 3450, São Paulo/SP", telefone: "(11) 4004-9889", email: "compras@atacadao.com", tipo_fornecedor: "Alimentação", dados_bancarios: "Bradesco Ag 0122 CC 409923-2", pix: "financeiro@atacadao.com" },
    { id: "for-2", nome: "Distribuidora de Papéis Arco-Íris", cnpj: "22.333.444/0001-55", endereco: "Rua das Flores, 88 - SP", telefone: "(11) 3221-0022", email: "arcoiris@papelaria.com.br", tipo_fornecedor: "Materiais permanentes" },
    { id: "for-3", nome: "NetTech Telecom", cnpj: "44.555.666/0001-99", endereco: "Avenida Jabaquara, 1000", telefone: "(11) 5055-1122", email: "suporte@nettech.com", tipo_fornecedor: "Informática" },
    { id: "for-4", nome: "Elétrica Silva & Silva", cnpj: "99.888.777/0001-22", endereco: "Rua do Gasômetro, 400", telefone: "(11) 97777-6666", email: "silvaconstrucoes@outlook.com", tipo_fornecedor: "Manutenção predial" }
  ],
  dirigentes: [
    { id: "dir-1", nome_completo: "Dr. Carlos Eduardo Menezes", cpf: "123.456.789-01", rg: "12.345.678-X", cargo: "Presidente", telefone: "(11) 98122-3344", email: "carlos.president@chicoxavier.org", data_inicio_mandato: "2025-01-01", data_fim_mandato: "2027-12-31", status: "Ativo" },
    { id: "dir-2", nome_completo: "Profa. Maria Augusta Souza", cpf: "987.654.321-02", rg: "10.987.654-3", cargo: "Secretária Geral", telefone: "(11) 97000-1122", email: "maria.augusta@chicoxavier.org", data_inicio_mandato: "2025-01-01", data_fim_mandato: "2027-12-31", status: "Ativo" }
  ],
  coordenadores: [
    { id: "coor-1", nome: "Mariana Costa", cpf: "111.222.333-44", cargo: "Coordenadora de Projetos", telefone: "(11) 98222-7788", email: "mariana.projetos@chicoxavier.org", projeto_vinculado: "Acolher com Leitura", status: "Ativo" },
    { id: "coor-2", nome: "Fernando Pinto", cpf: "555.666.777-88", cargo: "Coordenador de Esportes", telefone: "(11) 99333-8822", email: "fernando.esportes@chicoxavier.org", projeto_vinculado: "Futebol do Amanhã", status: "Ativo" }
  ],
  estudantes: [
    {
      id: "est-1",
      nome: "Gabriel dos Santos Lima",
      escola: "E.E. Professor João de Barros",
      diretor: "Dra. Regina Célia",
      professor: "Sra. Marisa Santos",
      endereco_escola: "Rua da República, 120, Centro - SP",
      telefone_escola: "(11) 3302-1200",
      horario_aulas: "Das 07:30 às 12:30",
      notas: { bimestre1: 8.5, bimestre2: 9.0, bimestre3: 7.8, bimestre4: 8.2 },
      feedback_bimestral: "Excelente comportamento, muito participativo nos projetos literários e atividades lúdicas da OSC.",
      observacoes: "Necessita de acompanhamento ocasional de fonoaudiologia.",
      documentos: [
        { nome: "Histórico Escolar 2025.pdf", url: "#", tipo: "pdf" },
        { nome: "Comprovante de Matrícula.pdf", url: "#", tipo: "pdf" }
      ]
    },
    {
      id: "est-2",
      nome: "Letícia de Oliveira Rezende",
      escola: "E.E. Cecília Meireles",
      diretor: "Sr. Geraldo Lacerda",
      professor: "Srta. Elaine Barbosa",
      endereco_escola: "Rua das Palmeiras, 900",
      telefone_escola: "(11) 4003-8821",
      horario_aulas: "Das 13:00 às 18:00",
      notas: { bimestre1: 7.0, bimestre2: 6.5, bimestre3: 8.0, bimestre4: 8.5 },
      feedback_bimestral: "Mostrou grande evolução no terceiro e quarto bimestres após início das aulas de apoio pedagógico na OSC.",
      observacoes: "Seus pais participam ativamente do comitê de assistência comunitária.",
      documentos: []
    }
  ],
  prontuarios: [
    { id: "pront-1", acolhido: "Gabriel dos Santos Lima", tipo_atendimento: "Acompanhamento Psicológico", data: "2026-05-18", hora: "14:30", responsavel: "Dr. Roberto Antunes (Psicólogo)", observacoes: "Gabriel apresentou evolução em relação à fobia social. Participou ativamente das rodas de conversa e relatou estar mais tranquilo nas aulas expositivas na escola regular." },
    { id: "pront-2", acolhido: "Letícia de Oliveira Rezende", tipo_atendimento: "Visita Social de Assistência", data: "2026-05-22", hora: "09:00", responsavel: "Dra. Heloísa Barros (Assistente Social)", observacoes: "Visita domiciliar realizada para averiguar condições de habitação da família de Letícia. Foram entregues donativos e cesta básica. A mãe relatou satisfação total com a infraestrutura pedagógica fornecida pela instituição." }
  ],
  cestas_basicas: [
    { id: "cesta-1", recebedor: "Maria Antônia de Lima (Mãe do Gabriel)", relacao: "Beneficiário", data_entrega: "2026-05-10", quantidade: 1 },
    { id: "cesta-2", recebedor: "Sandra de Oliveira Rezende (Mãe da Letícia)", relacao: "Beneficiário", data_entrega: "2026-05-22", quantidade: 1 }
  ],
  termos_responsabilidade: [
    {
      id: "termo-1",
      responsavel: "Carlos Eduardo de Lima",
      ato: "Acolhimento Institucional e Uso de Imagem",
      descricao: "Autorizo a participação de meu filho Gabriel dos Santos Lima nas atividades externas da OSC e autorizo o uso não comercial de imagens para fins institucionais e relatórios públicos de transparência social.",
      assinatura_digital: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // Mock sign pad base64
      data_criacao: "2026-01-10T14:15:00Z"
    }
  ],
  processos_judiciais: [
    { id: "proc-1", numero_processo: "1002345-78.2025.8.26.0100", situacao: "Ativo", envolvidos: "OSC Ava vs Município (Custeio Creche)", observacoes: "Requerimento subsidiário de verba para manutenção de creche comunitária. Audiência marcada para próximo trimestre." }
  ],
  documentos: [
    { id: "doc-1", categoria: "Estatuto social", nome: "Estatuto Consolidado AVA 2024.pdf", arquivoUrl: "#", validade: "Sem vencimento", data_upload: "2024-05-10" },
    { id: "doc-2", categoria: "CNPJ", nome: "Comprovante de Inscricao Cadastral CNPJ.pdf", arquivoUrl: "#", validade: "Sem vencimento", data_upload: "2026-01-05" },
    { id: "doc-3", categoria: "Ata de eleição", nome: "Ata de Posse de Diretoria Vigente (2025-2027).pdf", arquivoUrl: "#", validade: "2027-12-31", data_upload: "2025-01-10" },
    { id: "doc-4", categoria: "Licenciamentos", nome: "Alvará Sanitário de Funcionamento.pdf", arquivoUrl: "#", validade: "2026-07-15", data_upload: "2025-07-15" } // Vence em breve !
  ],
  logs_sistema: [
    { id: "log-1", usuario_id: "usr-1", usuario_nome: "Admin Principal", acao: "Login bem-sucedido", ip: "189.120.44.20", data_log: "2026-05-28T11:40:00Z" },
    { id: "log-2", usuario_id: "usr-1", usuario_nome: "Admin Principal", acao: "Visualizou dados da instituição", ip: "189.120.44.20", data_log: "2026-05-28T11:41:00Z" }
  ]
};

// Carrega ou inicializa a base de dados em arquivo
let db: LocalDB = { ...DADOS_INICIAIS };
if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    
    // Verifica se precisa criar o Admin padrão da plataforma
    let DB_ALTERADO = false;
    
    if (!db.usuarios.find(u => u.email === "dbmarktdigital@gmail.com")) {
      db.usuarios.push({
        id: "usr-" + Date.now().toString(),
        nome: "Admin System",
        email: "dbmarktdigital@gmail.com",
        senha_hash: bcrypt.hashSync("admin123", 10),
        nivel_acesso: "Administrador",
        status: "Ativo",
        created_at: new Date().toISOString()
      });
      DB_ALTERADO = true;
    }

    if (DB_ALTERADO) {
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error("Erro ao ler base de dados JSON. Usando padrão.", error);
  }
} else {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

// Salva as alterações na base de dados
async function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  try {
     const keys = Object.keys(db);
     for (const key of keys) {
        const str = JSON.stringify(db[key]);
        await setDoc(doc(dbFirestore, "tables", key), { data: str });
     }
  } catch(e) {
     console.error("Firestore save error:", e);
  }
}

// Carrega o servidor Express
async function startServer() {
  const app = express();
  await loadDB();

  const PORT = 3000;

  // Middlewares para JSON e codificação de URL com limites elevados para uploads em base64
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Middleware para desabilitar cache em todas as rotas de API (Corrige "Uso incorreto de cache")
  app.use('/api', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  // Helper para auditoria de ações (Logger)
  const logSystemAction = async (userId: string, userName: string, action: string, req: express.Request) => {
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
    const newLog = {
      id: `log-${Date.now()}`,
      usuario_id: userId,
      usuario_nome: userName,
      acao: action,
      ip: ip,
      data_log: new Date().toISOString()
    };
    db.logs_sistema.unshift(newLog); // Últimos primeiro
    await saveDB();
  };

  // -------------------------------------------------------------
  // --- MIDDLEWARE DE AUTENTICAÇÃO JWT ---
  // -------------------------------------------------------------
  app.use((req, res, next) => {
    // A rota de login é pública, assim como qualquer arquivo que não seja /api
    if (req.path === "/api/login" || (!req.path.startsWith("/api") && req.path !== "/api")) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Acesso negado. Token não fornecido.",
        message: "Acesso negado. Token não fornecido."
      });
    }

    const token = authHeader.split(" ")[1]; // Espera formato "Bearer <token>"
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Acesso negado. Formato de token inválido.",
        message: "Acesso negado. Formato de token inválido."
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; nivel: string; nivel_acesso: string };
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Acesso negado. Token inválido ou expirado.",
        message: "Acesso negado. Token inválido ou expirado."
      });
    }
  });

  // -------------------------------------------------------------
  // --- ENDPOINTS DA API REST ---
  // -------------------------------------------------------------

  // --- /api/login ---
  app.post("/api/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        error: "E-mail e senha são obrigatórios!",
        message: "E-mail e senha são obrigatórios!"
      });
    }

    const userFound = db.usuarios.find(u => u.email.toLowerCase() === (email || "").toLowerCase() && u.status === 'Ativo');

    if (!userFound) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
        message: "Usuário não encontrado"
      });
    }

    // Usar bcrypt compare
    const senhaCorreta = bcrypt.compareSync(senha, userFound.senha_hash);

    if (!senhaCorreta) {
      return res.status(401).json({
        success: false,
        error: "Senha inválida",
        message: "Senha inválida"
      });
    }

    const token = jwt.sign(
      {
        id: userFound.id,
        email: userFound.email,
        nivel: userFound.nivel_acesso,
        nivel_acesso: userFound.nivel_acesso
      },
      JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    await logSystemAction(userFound.id, userFound.nome, `Módulo Autenticação: Login efetuado por ${userFound.nome}`, req);
    
    return res.json({
      success: true,
      message: "Login efetuado com sucesso!",
      token,
      usuario: {
        id: userFound.id,
        nome: userFound.nome,
        email: userFound.email,
        nivel_acesso: userFound.nivel_acesso,
        status: userFound.status
      }
    });
  });

  // --- /api/debug/me ---
  app.get("/api/debug/me", async (req, res) => {
    res.json({
      userHeader: req.headers.authorization,
      reqUser: (req as any).user,
      dbUser: db.usuarios.find(u => u.id === (req as any).user?.id)
    });
  });

  // --- /api/usuarios ---
  app.get("/api/usuarios", async (req, res) => {
    res.json(db.usuarios);
  });

  app.post("/api/usuarios", async (req, res) => {
    const { nome, email, senha, nivel_acesso, status } = req.body;
    if (!nome || !email || !nivel_acesso) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }
    const novo = {
      id: `usr-${Date.now()}`,
      nome,
      email,
      senha_hash: bcrypt.hashSync(senha || "senha123", 10), // Criptografado com bcrypt real
      nivel_acesso,
      status: status || "Ativo",
      created_at: new Date().toISOString()
    };
    db.usuarios.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Gestão Usuários: Criado usuário ${nome}`, req);
    res.json({ success: true, usuario: novo });
  });

  app.put("/api/usuarios/:id/senha", async (req, res) => {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;
    
    // Assegura que o usuário que está alterando seja ele próprio
    if ((req as any).user.id !== id && (req as any).user.nivel_acesso !== "Administrador") {
      return res.status(403).json({ success: false, message: "Não autorizado" });
    }

    const index = db.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      const user = db.usuarios[index];
      const isMatch = bcrypt.compareSync(senhaAtual, user.senha_hash || '');
      if (!isMatch) {
         return res.status(400).json({ success: false, message: "Senha atual incorreta" });
      }
      db.usuarios[index].senha_hash = bcrypt.hashSync(novaSenha, 10);
      await saveDB();
      return res.json({ success: true, message: "Senha alterada" });
    }
    return res.status(404).json({ success: false, message: "Usuário não encontrado" });
  });

  app.put("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    const { nome, email, nivel_acesso, status } = req.body;
    const index = db.usuarios.findIndex(u => u.id === id);
    if (index !== -1) {
      db.usuarios[index] = { ...db.usuarios[index], nome, email, nivel_acesso, status };
      await saveDB();
      await logSystemAction("usr-1", "Admin Principal", `Gestão Usuários: Editado usuário ${nome}`, req);
      return res.json({ success: true, usuario: db.usuarios[index] });
    }
    res.status(404).json({ success: false, message: "Usuário não encontrado" });
  });

  app.delete("/api/usuarios/:id", async (req, res) => {
    const { id } = req.params;
    
    const reqUserId = (req as any).user?.id;
    const reqUser = db.usuarios.find(u => u.id === reqUserId);
    console.log("Delete request for user", id, "by reqUserId:", reqUserId, "reqUser:", reqUser);

    if (!reqUser) {
      console.log("Delete denied: reqUser undefined", reqUserId);
      return res.status(403).json({ success: false, message: "Somente usuários autenticados podem excluir usuários" });
    }

    const userFound = db.usuarios.find(u => u.id === id);
    if (!userFound) {
      console.log("User not found:", id);
      return res.status(404).json({ success: false, message: "Não encontrado" });
    }

    db.usuarios = db.usuarios.filter(u => u.id !== id);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Gestão Usuários: Excluído usuário ${userFound.nome}`, req);
    res.json({ success: true });
  });

  // --- /api/instituicao ---
  app.get("/api/instituicao", async (req, res) => {
    res.json(db.instituicao);
  });

  app.post("/api/instituicao", async (req, res) => {
    db.instituicao = { ...db.instituicao, ...req.body };
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", "Instituição: Atualizou dados institucionais", req);
    res.json({ success: true, dados: db.instituicao });
  });

  // --- /api/financeiro ---
  app.get("/api/financeiro/contas", async (req, res) => {
    res.json(db.contas_bancarias);
  });

  app.post("/api/financeiro/contas", async (req, res) => {
    const { banco, agencia, conta, tipo_conta, pixEscrita, titular, status } = req.body;
    const novo = {
      id: `bank-${Date.now()}`,
      banco, agencia, conta, tipo_conta, pixEscrita, titular, status: status || "Ativa"
    };
    db.contas_bancarias.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Gestão Contas: Adicionada conta bancária ${banco} (${conta})`, req);
    res.json({ success: true, conta: novo });
  });

  app.delete("/api/financeiro/contas/:id", async (req, res) => {
    db.contas_bancarias = db.contas_bancarias.filter(b => b.id !== req.params.id);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Gestão Contas: Excluída conta bancária id ${req.params.id}`, req);
    res.json({ success: true });
  });

  app.get("/api/financeiro/receitas", async (req, res) => {
    res.json(db.receitas);
  });

  app.post("/api/financeiro/receitas", async (req, res) => {
    const { categoria, tipo_evento, valor, data, forma_pagamento, observacoes } = req.body;
    const novo = {
      id: `rec-${Date.now()}`,
      categoria, tipo_evento, valor: parseFloat(valor || 0), data, forma_pagamento, observacoes
    };
    db.receitas.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Financeiro: Cadastrada Receita - ${categoria} de R$ ${valor}`, req);
    res.json({ success: true, receita: novo });
  });

  app.delete("/api/financeiro/receitas/:id", async (req, res) => {
    db.receitas = db.receitas.filter(r => r.id !== req.params.id);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Financeiro: Removida Receita id ${req.params.id}`, req);
    res.json({ success: true });
  });

  app.get("/api/financeiro/despesas", async (req, res) => {
    res.json(db.despesas);
  });

  app.post("/api/financeiro/despesas", async (req, res) => {
    const { categoria, valor, data, fornecedor_id, fornecedor_nome, forma_pagamento, comprovanteUrl } = req.body;
    const novo = {
      id: `des-${Date.now()}`,
      categoria, valor: parseFloat(valor || 0), data, fornecedor_id, fornecedor_nome, forma_pagamento, comprovanteUrl
    };
    db.despesas.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Financeiro: Cadastrada Despesa - ${categoria} de R$ ${valor}`, req);
    res.json({ success: true, despesa: novo });
  });

  app.delete("/api/financeiro/despesas/:id", async (req, res) => {
    db.despesas = db.despesas.filter(d => d.id !== req.params.id);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Financeiro: Removida Despesa id ${req.params.id}`, req);
    res.json({ success: true });
  });

  // --- /api/estoque ---
  app.get("/api/estoque", async (req, res) => {
    res.json(db.estoque);
  });

  app.post("/api/estoque", async (req, res) => {
    const { nome_item, nota_fiscal, quantidade, custo, validade, local_armazenagem, categoria, codigo_interno } = req.body;
    const quantNum = parseInt(quantidade || 0);
    const costNum = parseFloat(custo || 0);
    
    let status: 'Disponível' | 'Esgotado' | 'Vencido' | 'Estoque Baixo' = 'Disponível';
    if (quantNum === 0) status = 'Esgotado';
    else if (quantNum <= 5) status = 'Estoque Baixo';

    if (validade) {
      const parsedValidade = new Date(validade);
      const hoje = new Date();
      if (parsedValidade < hoje) {
        status = 'Vencido';
      }
    }

    const novo = {
      id: `estq-${Date.now()}`,
      nome_item, nota_fiscal, quantidade: quantNum, custo: costNum, validade, local_armazenagem, categoria, codigo_interno, status
    };
    db.estoque.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Estoque: Adicionado item ${nome_item} (${quantNum} un)`, req);
    res.json({ success: true, item: novo });
  });

  app.put("/api/estoque/:id", async (req, res) => {
    const { id } = req.params;
    const { nome_item, nota_fiscal, quantidade, custo, validade, local_armazenagem, categoria, codigo_interno } = req.body;
    const index = db.estoque.findIndex(e => e.id === id);
    if (index !== -1) {
      const quantNum = parseInt(quantidade || 0);
      const costNum = parseFloat(custo || 0);
      
      let status: 'Disponível' | 'Esgotado' | 'Vencido' | 'Estoque Baixo' = 'Disponível';
      if (quantNum === 0) status = 'Esgotado';
      else if (quantNum <= 5) status = 'Estoque Baixo';

      if (validade) {
        const parsedValidade = new Date(validade);
        const hoje = new Date();
        if (parsedValidade < hoje) {
          status = 'Vencido';
        }
      }

      db.estoque[index] = {
        ...db.estoque[index],
        nome_item, nota_fiscal, quantidade: quantNum, custo: costNum, validade, local_armazenagem, categoria, codigo_interno, status
      };
      await saveDB();
      await logSystemAction("usr-1", "Admin Principal", `Estoque: Atualizado item ${nome_item}`, req);
      return res.json({ success: true, item: db.estoque[index] });
    }
    res.status(404).json({ success: false, message: "Não encontrado" });
  });

  app.delete("/api/estoque/:id", async (req, res) => {
    const found = db.estoque.find(e => e.id === req.params.id);
    db.estoque = db.estoque.filter(e => e.id !== req.params.id);
    await saveDB();
    if (found) {
      await logSystemAction("usr-1", "Admin Principal", `Estoque: Excluído item ${found.nome_item}`, req);
    }
    res.json({ success: true });
  });

  // --- /api/fornecedores ---
  app.get("/api/fornecedores", async (req, res) => {
    res.json(db.fornecedores);
  });

  app.post("/api/fornecedores", async (req, res) => {
    const { nome, cnpj, endereco, telefone, email, tipo_fornecedor, dados_bancarios, pix, documentoUrl } = req.body;
    const novo = {
      id: `for-${Date.now()}`,
      nome, cnpj, endereco, telefone, email, tipo_fornecedor, dados_bancarios, pix, documentoUrl
    };
    db.fornecedores.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Fornecedores: Cadastrado fornecedor ${nome}`, req);
    res.json({ success: true, fornecedor: novo });
  });

  app.delete("/api/fornecedores/:id", async (req, res) => {
    const found = db.fornecedores.find(f => f.id === req.params.id);
    db.fornecedores = db.fornecedores.filter(f => f.id !== req.params.id);
    await saveDB();
    if (found) await logSystemAction("usr-1", "Admin Principal", `Fornecedores: Excluído fornecedor ${found.nome}`, req);
    res.json({ success: true });
  });

  // --- /api/dirigentes ---
  app.get("/api/dirigentes", async (req, res) => {
    res.json(db.dirigentes);
  });

  app.post("/api/dirigentes", async (req, res) => {
    const novo = {
      id: `dir-${Date.now()}`,
      ...req.body
    };
    db.dirigentes.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Dirigentes: Adicionado dirigente ${req.body.nome_completo}`, req);
    res.json({ success: true, dirigente: novo });
  });

  app.delete("/api/dirigentes/:id", async (req, res) => {
    db.dirigentes = db.dirigentes.filter(d => d.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  // --- /api/coordenadores ---
  app.get("/api/coordenadores", async (req, res) => {
    res.json(db.coordenadores);
  });

  app.post("/api/coordenadores", async (req, res) => {
    const novo = {
      id: `coor-${Date.now()}`,
      ...req.body
    };
    db.coordenadores.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Coordenadores: Adicionado coordenador ${req.body.nome}`, req);
    res.json({ success: true, coordenador: novo });
  });

  app.delete("/api/coordenadores/:id", async (req, res) => {
    db.coordenadores = db.coordenadores.filter(c => c.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  // --- /api/documentos ---
  app.get("/api/documentos", async (req, res) => {
    res.json(db.documentos);
  });

  app.post("/api/documentos", async (req, res) => {
    const { categoria, nome, arquivoUrl, validade } = req.body;
    const novo = {
      id: `doc-${Date.now()}`,
      categoria,
      nome,
      arquivoUrl: arquivoUrl || "#",
      validade: validade || "Sem vencimento",
      data_upload: new Date().toISOString().split('T')[0]
    };
    db.documentos.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Documentos: Realizado upload de ${nome} (${categoria})`, req);
    res.json({ success: true, documento: novo });
  });

  app.delete("/api/documentos/:id", async (req, res) => {
    const found = db.documentos.find(d => d.id === req.params.id);
    db.documentos = db.documentos.filter(d => d.id !== req.params.id);
    await saveDB();
    if (found) await logSystemAction("usr-1", "Admin Principal", `Documentos: Removido documento seguro ${found.nome}`, req);
    res.json({ success: true });
  });

  // --- /api/pedagogico ---
  app.get("/api/pedagogico", async (req, res) => {
    res.json(db.estudantes);
  });

  app.post("/api/pedagogico", async (req, res) => {
    const { nome, escola, diretor, professor, endereco_escola, telefone_escola, horario_aulas, notas, feedback_bimestral, observacoes, documentos } = req.body;
    const novo = {
      id: `est-${Date.now()}`,
      nome,
      escola,
      diretor,
      professor,
      endereco_escola,
      telefone_escola,
      horario_aulas,
      notas: notas || { bimestre1: 0, bimestre2: 0, bimestre3: 0, bimestre4: 0 },
      feedback_bimestral,
      observacoes,
      documentos: documentos || []
    };
    db.estudantes.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Pedagógico: Adicionado estudante ${nome}`, req);
    res.json({ success: true, estudante: novo });
  });

  app.put("/api/pedagogico/:id", async (req, res) => {
    const { id } = req.params;
    const index = db.estudantes.findIndex(st => st.id === id);
    if (index !== -1) {
      db.estudantes[index] = { ...db.estudantes[index], ...req.body };
      await saveDB();
      await logSystemAction("usr-1", "Admin Principal", `Pedagógico: Atualizado prontuário escolar/notas de ${db.estudantes[index].nome}`, req);
      return res.json({ success: true, estudante: db.estudantes[index] });
    }
    res.status(404).json({ success: false, message: "Não encontrado" });
  });

  app.delete("/api/pedagogico/:id", async (req, res) => {
    const found = db.estudantes.find(st => st.id === req.params.id);
    db.estudantes = db.estudantes.filter(st => st.id !== req.params.id);
    await saveDB();
    if (found) await logSystemAction("usr-1", "Admin Principal", `Pedagógico: Excluído cadastro do aluno ${found.nome}`, req);
    res.json({ success: true });
  });

  // --- /api/assistencia (Processos, Prontuários, Cestas, Termos) ---
  app.get("/api/assistencia/processos", async (req, res) => {
    res.json(db.processos_judiciais);
  });

  app.post("/api/assistencia/processos", async (req, res) => {
    const { numero_processo, situacao, envolvidos, observacoes } = req.body;
    const novo = { id: `proc-${Date.now()}`, numero_processo, situacao, envolvidos, observacoes };
    db.processos_judiciais.push(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Assistência: Cadastrado processo judicial nº ${numero_processo}`, req);
    res.json({ success: true, processo: novo });
  });

  app.delete("/api/assistencia/processos/:id", async (req, res) => {
    db.processos_judiciais = db.processos_judiciais.filter(p => p.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  app.get("/api/assistencia/prontuarios", async (req, res) => {
    res.json(db.prontuarios);
  });

  app.post("/api/assistencia/prontuarios", async (req, res) => {
    const { acolhido, tipo_atendimento, responsavel, observacoes, arquivoUrl } = req.body;
    const novo = {
      id: `pront-${Date.now()}`,
      acolhido,
      tipo_atendimento,
      data: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
      responsavel,
      observacoes,
      arquivoUrl
    };
    db.prontuarios.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Assistência/Psico: Elaborado Prontuário para ${acolhido}`, req);
    res.json({ success: true, prontuario: novo });
  });

  app.delete("/api/assistencia/prontuarios/:id", async (req, res) => {
    db.prontuarios = db.prontuarios.filter(p => p.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  app.get("/api/assistencia/cestas", async (req, res) => {
    res.json(db.cestas_basicas);
  });

  app.post("/api/assistencia/cestas", async (req, res) => {
    const { recebedor, relacao, quantidade } = req.body;
    const novo = {
      id: `cesta-${Date.now()}`,
      recebedor,
      relacao,
      data_entrega: new Date().toISOString().split('T')[0],
      quantidade: parseInt(quantidade || 1)
    };
    db.cestas_basicas.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Assistência: Entregue ${quantidade} cesta básica para ${recebedor}`, req);
    res.json({ success: true, cesta: novo });
  });

  app.delete("/api/assistencia/cestas/:id", async (req, res) => {
    db.cestas_basicas = db.cestas_basicas.filter(c => c.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  app.get("/api/assistencia/termos", async (req, res) => {
    res.json(db.termos_responsabilidade);
  });

  app.post("/api/assistencia/termos", async (req, res) => {
    const { responsavel, ato, descricao, assinatura_digital } = req.body;
    const novo = {
      id: `termo-${Date.now()}`,
      responsavel,
      ato,
      descricao,
      assinatura_digital,
      data_criacao: new Date().toISOString()
    };
    db.termos_responsabilidade.unshift(novo);
    await saveDB();
    await logSystemAction("usr-1", "Admin Principal", `Assistência: Termo de Responsabilidade cadastrado para ${responsavel}`, req);
    res.json({ success: true, termo: novo });
  });

  app.delete("/api/assistencia/termos/:id", async (req, res) => {
    db.termos_responsabilidade = db.termos_responsabilidade.filter(t => t.id !== req.params.id);
    await saveDB();
    res.json({ success: true });
  });

  // --- /api/logs ---
  app.get("/api/logs", async (req, res) => {
    res.json(db.logs_sistema);
  });

  // --- /api/backup (Simulação) ---
  app.get("/api/backup/download", async (req, res) => {
    res.setHeader('Content-disposition', 'attachment; filename=backup_banco_osc.sql');
    res.setHeader('Content-type', 'application/sql');
    
    const dump = `-- --------------------------------------------------
-- SCRIPT DE AUTO-BACKUP DA OSC (SIMULADO INTEGRADO)
-- Gerado em: ${new Date().toISOString()}
-- --------------------------------------------------

CREATE DATABASE IF NOT EXISTS \`viva_o_amanha_osc\`;
USE \`viva_o_amanha_osc\`;

-- --------------------------------------------------
-- TABELA USUARIOS (Pronta para Produção / password_hash)
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS \`usuarios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) UNIQUE NOT NULL,
  \`senha_hash\` VARCHAR(255) NOT NULL,
  \`nivel_acesso\` ENUM('Administrador', 'Financeiro', 'Coordenador', 'Pedagógico', 'Assistência Social', 'Psicólogo', 'Visualizador') NOT NULL,
  \`status\` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------
-- TABELA INSTITUICAO
-- --------------------------------------------------
CREATE TABLE IF NOT EXISTS \`instituicao\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`razao_social\` VARCHAR(200) NOT NULL,
  \`nome_fantasia\` VARCHAR(200) NOT NULL,
  \`cnpj\` VARCHAR(20) UNIQUE NOT NULL,
  \`telefone\` VARCHAR(20),
  \`email\` VARCHAR(100),
  \`endereco\` TEXT,
  \`logo\` LONGTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERINDO DADOS INSTITUCIONAIS MOCKADOS
INSERT INTO \`instituicao\` (\`id\`, \`razao_social\`, \`nome_fantasia\`, \`cnpj\`, \`telefone\`, \`email\`, \`endereco\`) 
VALUES (1, 'ONG Chico Xavier', 'ONG Chico Xavier', '12.345.678/0001-90', '${db.instituicao.telefone}', '${db.instituicao.email}', '${db.instituicao.rua}, ${db.instituicao.numero}, ${db.instituicao.bairro} - ${db.instituicao.cidade}/${db.instituicao.estado}');
`;
    res.send(dump);
  });

  // --- /api/php-mvc/export-manifest ---
  // Retorna os códigos fontes principais do PHP MVC para visualização diretamente nos modais
  app.get("/api/php-mvc/export-manifest", async (req, res) => {
    res.json({
      success: true,
      sqlitePersistenceAlert: "A aplicação local Node.js salva os dados de modo persistente em '/database_osc.json'. O pacote de deploy completo PHP MVC já está gerado na pasta /php-mvc/ em sua raiz no GitHub!",
      schema_db: `-- SQL completo das Tabelas Relacionais do Banco de Dados
CREATE TABLE IF NOT EXISTS \`usuarios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) UNIQUE NOT NULL,
  \`senha\` VARCHAR(255) NOT NULL,
  \`nivel_acesso\` VARCHAR(50) NOT NULL,
  \`status\` VARCHAR(20) DEFAULT 'Ativo',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      php_controller: `<?php
namespace App\\Controllers;

use App\\Models\\Financeiro;

class FinanceiroController extends Controller {
    public function index() {
        $this->requireAuth();
        $receitas = Financeiro::getReceitas();
        $despesas = Financeiro::getDespesas();
        $this->render('financeiro/index', [
            'receitas' => $receitas,
            'despesas' => $despesas
        ]);
    }

    public function cadastrarReceita() {
        $this->requireAuth(['Administrador', 'Financeiro']);
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $dados = [
                'categoria' => filter_input(INPUT_POST, 'categoria', FILTER_SANITIZE_SPECIAL_CHARS),
                'valor' => filter_input(INPUT_POST, 'valor', FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION),
                'data' => $_POST['data']
            ];
            Financeiro::insertReceita($dados);
            $_SESSION['msg'] = "Receita guardada com sucesso!";
            header('Location: /financeiro');
        }
    }
}`
    });
  });

  // -------------------------------------------------------------
  // --- INTEGRAÇÃO COM VITE (DEV OU PRODUÇÃO) ---
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    console.log("Configurando middleware do Vite para modo de desenvolvimento.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log("Configurando caminhos de produção.");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OSC Gestor] Servidor Express rodando na URL: http://0.0.0.0:${PORT}`);
  });
}

startServer();
