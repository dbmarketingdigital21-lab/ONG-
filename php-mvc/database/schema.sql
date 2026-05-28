-- ====================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS RELACIONAL MYSQL 8+
-- SISTEMA DE GESTÃO - ORGANIZAÇÃO DA SOCIEDADE CIVIL (OSC)
-- Prontidão de Produção: Chaves Estrangeiras, Índices e Integridade
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`viva_o_amanha_osc\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`viva_o_amanha_osc\`;

-- -----------------------------------------------------
-- 1. TABELA: usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`usuarios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`email\` VARCHAR(150) UNIQUE NOT NULL,
  \`senha\` VARCHAR(255) NOT NULL, -- password_hash()
  \`nivel_acesso\` ENUM('Administrador', 'Financeiro', 'Coordenador', 'Pedagógico', 'Assistência Social', 'Psicólogo', 'Visualizador') NOT NULL,
  \`status\` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (\`email\`),
  INDEX idx_status (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- 2. TABELA: instituicao
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`instituicao\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`razao_social\` VARCHAR(255) NOT NULL,
  \`nome_fantasia\` VARCHAR(255) NOT NULL,
  \`cnpj\` VARCHAR(20) UNIQUE NOT NULL,
  \`inscricao_estadual\` VARCHAR(30) NULL,
  \`inscricao_municipal\` VARCHAR(30) NULL,
  \`data_fundacao\` DATE NOT NULL,
  \`natureza_juridica\` VARCHAR(200) NOT NULL,
  \`cep\` VARCHAR(10) NOT NULL,
  \`rua\` VARCHAR(200) NOT NULL,
  \`numero\` VARCHAR(15) NOT NULL,
  \`complemento\` VARCHAR(100) NULL,
  \`bairro\` VARCHAR(100) NOT NULL,
  \`cidade\` VARCHAR(100) NOT NULL,
  \`estado\` CHAR(2) NOT NULL,
  \`telefone\` VARCHAR(20) NOT NULL,
  \`whatsapp\` VARCHAR(20) NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`site\` VARCHAR(100) NULL,
  \`redes_sociais\` VARCHAR(255) NULL,
  \`logo\` LONGTEXT NULL, -- Base64 ou Link da logo
  INDEX idx_cnpj (\`cnpj\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 3. TABELA: contas_bancarias
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`contas_bancarias\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`instituicao_id\` INT NOT NULL,
  \`banco\` VARCHAR(100) NOT NULL,
  \`agencia\` VARCHAR(15) NOT NULL,
  \`conta\` VARCHAR(20) NOT NULL,
  \`tipo_conta\` ENUM('Corrente', 'Poupança', 'Aplicação') NOT NULL,
  \`pix\` VARCHAR(100) NULL,
  \`titular\` VARCHAR(200) NOT NULL,
  \`status\` ENUM('Ativa', 'Inativa') DEFAULT 'Ativa',
  FOREIGN KEY (\`instituicao_id\`) REFERENCES \`instituicao\`(\`id\`) ON DELETE CASCADE,
  INDEX idx_contas_status (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 4. TABELA: fornecedores
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`fornecedores\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(200) NOT NULL,
  \`cnpj\` VARCHAR(20) UNIQUE NOT NULL,
  \`endereco\` TEXT NOT NULL,
  \`telefone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`tipo_fornecedor\` ENUM('Alimentação', 'Materiais permanentes', 'Informática', 'Manutenção predial', 'Construção', 'Outros') NOT NULL,
  \`dados_bancarios\` TEXT NULL,
  \`pix\` VARCHAR(100) NULL,
  \`documento\` VARCHAR(255) NULL, -- Caminho do PDF enviado
  INDEX idx_forn_cnpj (\`cnpj\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 5. TABELA: receitas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`receitas\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`categoria\` ENUM('Doação financeira', 'Almoço', 'Bazar', 'Eventos', 'Outros') NOT NULL,
  \`tipo_evento\` VARCHAR(150) NULL,
  \`valor\` DECIMAL(12,2) NOT NULL,
  \`data\` DATE NOT NULL,
  \`forma_pagamento\` ENUM('Pix', 'Transferência', 'Dinheiro', 'Cartão', 'Boleto') NOT NULL,
  \`observacoes\` TEXT NULL,
  INDEX idx_receita_data (\`data\`),
  INDEX idx_receita_categoria (\`categoria\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 6. TABELA: despesas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`despesas\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`categoria\` VARCHAR(100) NOT NULL,
  \`valor\` DECIMAL(12,2) NOT NULL,
  \`data\` DATE NOT NULL,
  \`fornecedor_id\` INT NOT NULL,
  \`forma_pagamento\` ENUM('Pix', 'Transferência', 'Dinheiro', 'Cartão', 'Boleto') NOT NULL,
  \`comprovante\` VARCHAR(255) NULL, -- Caminho do arquivo de comprovante
  FOREIGN KEY (\`fornecedor_id\`) REFERENCES \`fornecedores\`(\`id\`) ON DELETE RESTRICT,
  INDEX idx_despesa_data (\`data\`),
  INDEX idx_despesa_forn (\`fornecedor_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 7. TABELA: estoque
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`estoque\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome_item\` VARCHAR(150) NOT NULL,
  \`nota_fiscal\` VARCHAR(50) NULL,
  \`quantidade\` INT NOT NULL DEFAULT 0,
  \`custo\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`validade\` DATE NULL,
  \`local_armazenagem\` VARCHAR(150) NOT NULL,
  \`categoria\` VARCHAR(100) NOT NULL,
  \`codigo_interno\` VARCHAR(50) UNIQUE NULL,
  \`status\` ENUM('Disponível', 'Esgotado', 'Vencido', 'Estoque Baixo') NOT NULL DEFAULT 'Disponível',
  INDEX idx_estoque_status (\`status\`),
  INDEX idx_estoque_nome (\`nome_item\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 8. TABELA: dirigentes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`dirigentes\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome_completo\` VARCHAR(200) NOT NULL,
  \`cpf\` VARCHAR(14) UNIQUE NOT NULL,
  \`rg\` VARCHAR(20) NULL,
  \`cargo\` VARCHAR(100) NOT NULL,
  \`telefone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`data_inicio_mandato\` DATE NOT NULL,
  \`data_fim_mandato\` DATE NOT NULL,
  \`status\` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  \`documentos\` VARCHAR(255) NULL,
  INDEX idx_dirigente_cpf (\`cpf\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 9. TABELA: coordenadores
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`coordenadores\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`cpf\` VARCHAR(14) UNIQUE NOT NULL,
  \`cargo\` VARCHAR(100) NOT NULL,
  \`telefone\` VARCHAR(20) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`projeto_vinculado\` VARCHAR(150) NOT NULL,
  \`status\` ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
  INDEX idx_coord_cpf (\`cpf\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 10. TABELA: estudantes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`estudantes\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(150) NOT NULL,
  \`escola\` VARCHAR(200) NOT NULL,
  \`diretor\` VARCHAR(150) NULL,
  \`professor\` VARCHAR(150) NULL,
  \`endereco_escola\` TEXT NULL,
  \`telefone_escola\` VARCHAR(20) NULL,
  \`horario_aulas\` VARCHAR(50) NULL,
  \`notas_b1\` DECIMAL(4,2) DEFAULT 0.00,
  \`notas_b2\` DECIMAL(4,2) DEFAULT 0.00,
  \`notas_b3\` DECIMAL(4,2) DEFAULT 0.00,
  \`notas_b4\` DECIMAL(4,2) DEFAULT 0.00,
  \`feedback_bimestral\` TEXT NULL,
  \`observacoes\` TEXT NULL,
  INDEX idx_estudante_nome (\`nome\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 11. TABELA: prontuarios (Assistência / Psicologia)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`prontuarios\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`acolhido\` VARCHAR(150) NOT NULL,
  \`tipo_atendimento\` VARCHAR(100) NOT NULL,
  \`data\` DATE NOT NULL,
  \`hora\` TIME NOT NULL,
  \`responsavel\` VARCHAR(150) NOT NULL,
  \`observacoes\` TEXT NOT NULL,
  \`arquivo\` VARCHAR(255) NULL,
  INDEX idx_prontuario_acolhido (\`acolhido\`),
  INDEX idx_prontuario_data (\`data\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 12. TABELA: cestas_basicas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`cestas_basicas\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`recebedor\` VARCHAR(150) NOT NULL,
  \`relacao\` ENUM('Beneficiário', 'Funcionário', 'Voluntário', 'Outros') NOT NULL,
  \`data_entrega\` DATE NOT NULL,
  \`quantidade\` INT NOT NULL DEFAULT 1,
  INDEX idx_cestas_receb (\`recebedor\`),
  INDEX idx_cestas_data (\`data_entrega\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 13. TABELA: termos_responsabilidade
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`termos_responsabilidade\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`responsavel\` VARCHAR(150) NOT NULL,
  \`ato\` VARCHAR(150) NOT NULL,
  \`descricao\` TEXT NOT NULL,
  \`assinatura_digital\` LONGTEXT NULL, -- Guarantees base64 storage
  \`data_criacao\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 14. TABELA: processos_judiciais
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`processos_judiciais\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`numero_processo\` VARCHAR(50) UNIQUE NOT NULL,
  \`situacao\` ENUM('Ativo', 'Arquivado', 'Em Andamento') NOT NULL DEFAULT 'Ativo',
  \`envolvidos\` TEXT NOT NULL,
  \`observacoes\` TEXT NULL,
  INDEX idx_proc_numero (\`numero_processo\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 15. TABELA: documentos_institucionais
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`documentos_institucionais\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`categoria\` ENUM('Estatuto social', 'CNPJ', 'Certificações', 'Licenciamentos', 'Ata de eleição', 'Certidões', 'Convênios públicos', 'Parcerias privadas') NOT NULL,
  \`nome\` VARCHAR(200) NOT NULL,
  \`arquivo\` VARCHAR(255) NOT NULL,
  \`validade\` VARCHAR(50) DEFAULT 'Sem vencimento',
  \`data_upload\` DATE NOT NULL,
  INDEX idx_doc_cat (\`categoria\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- 16. TABELA: logs_sistema
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS \`logs_sistema\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`usuario_id\` INT NULL,
  \`acao\` TEXT NOT NULL,
  \`ip\` VARCHAR(45) NOT NULL,
  \`data_log\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE SET NULL,
  INDEX idx_logs_data (\`data_log\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- CARGA INICIAL DE TESTES (Seed)
-- -----------------------------------------------------
INSERT INTO \`usuarios\` (\`nome\`, \`email\`, \`senha\`, \`nivel_acesso\`, \`status\`) VALUES 
('Administrador Principal', 'dbmarktdigital@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'Ativo');

INSERT INTO \`instituicao\` (\`razao_social\`, \`nome_fantasia\`, \`cnpj\`, \`data_fundacao\`, \`natureza_juridica\`, \`cep\`, \`rua\`, \`numero\`, \`bairro\`, \`cidade\`, \`estado\`, \`telefone\`, \`email\`) VALUES
('Associação Viva o Amanhã - AVA', 'Viva o Amanhã', '12.345.678/0001-90', '2010-04-12', 'Associação Privada', '01310-100', 'Avenida Paulista', '1578', 'Bela Vista', 'São Paulo', 'SP', '(11) 3254-8900', 'contato@vivaamanha.org.br');

INSERT INTO \`contas_bancarias\` (\`instituicao_id\`, \`banco\`, \`agencia\`, \`conta\`, \`tipo_conta\`, \`pix\`, \`titular\`) VALUES 
(1, 'Banco do Brasil S.A.', '1234-5', '98765-4', 'Corrente', 'financeiro@vivaamanha.org.br', 'Associação Viva o Amanhã');
