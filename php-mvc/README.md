# 🏛️ Guia de Deploy e Configuração — PHP MVC & MySQL 8+

Este repositório contém a estrutura de retaguarda completa em **PHP 8 (Arquitetura MVC com Prepared Statements, XSS Protection e CSRF de Produção)** e a Modelagem de banco de dados **MySQL 8+**, desenhada especificamente para suportar o deploy da plataforma em infraestruturas tradicionais e VPS modernas.

---

## 🚀 OPÇÕES DE DEPLOY

O sistema foi modularizado para máxima compatibilidade, sendo ideal para:
1. **Hospedagem Compartilhada (cPanel, Hostinger, Locaweb, KingHost)**
2. **VPS Linux (DigitalOcean, Linode, AWS EC2, Google Cloud, Oracle Cloud)**
3. **Containers Docker (pronto para empacotamento com Apache/Nginx)**

---

## 💾 1. CONFIGURAÇÃO DO BANCO DE DADOS (MYSQL 8+)

### Procedimento no cPanel / Hostinger:
1. Acesse o painel de controle e encontre **"Assistente de Banco de Dados MySQL"**.
2. Crie um banco com o nome `viva_o_amanha_osc`.
3. Crie um usuário de banco de dados (ex: `admin_osc`) e defina uma senha criptográfica complexa.
4. Conceda **TODOS OS PRIVILÉGIOS** ao usuário sobre o banco criado.
5. Abra o **phpMyAdmin** no seu painel.
6. Selecione o banco `viva_o_amanha_osc` e clique na aba **Importar**.
7. Escolha o arquivo `/php-mvc/database/schema.sql` deste projeto e clique em **Executar**.

---

## 📁 2. SUBIR OS ARQUIVOS E APONTAR A PASTA PÚBLICA (`/public`)

Uma boa prática de segurança em arquiteturas MVC é **impedir o acesso direto aos arquivos de lógica** (`/app`, `/controllers`, `/config`).
Apenas a pasta `/public` (onde ficam `index.php`, `.htaccess`, CSS, JS e imagens) deve estar exposta ao navegador.

### No cPanel / Gerenciador de Arquivos:
1. Faça o upload de todo o diretório para a raiz da sua conta (normalmente na pasta anterior à `public_html`).
2. Mova o conteúdo da nossa pasta `/public` para dentro da pasta `public_html` (ou mude a raiz do domínio para apontar direto para `/public`).
3. Ajuste o arquivo `config/database.php` ou configure as variáveis de ambiente no arquivo `.env`.

### Configuração do Arquivo `.env.example` para `.env`
Renomeie ou crie o arquivo `.env` na raiz do PHP com os seguintes dados:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=viva_o_amanha_osc
DB_USER=o_seu_usuario_mysql
DB_PASS=a_sua_senha_mysql
APP_DEBUG=false
APP_URL=https://seudominio.com.br
```

---

## ⚙️ 3. CONFIGURAÇÃO DO SERVIDOR WEB

### Servidores baseados em Apache (`.htaccess` na raiz / `/public`)
O projeto inclui o `.htaccess` configurado para reescrever as URLs amigáveis:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php?url=$1 [QSA,L]
```

### Servidores baseados em Nginx (`nginx.conf`)
Insira a diretriz abaixo no seu bloco de servidores para correto funcionamento do roteamento amigável do MVC:
```nginx
location / {
    try_files $uri $uri/ /index.php?url=$query_string;
}
```

---

## 🔒 4. DOCUMENTAÇÃO DE SEGURANÇA APLICADA

* **Prevenção de Injeção de SQL**: Nossos Models usam exclusivamente `PDO` com Prepared Statements nativos (`$stmt->prepare()`), inutilizando rotinas de injeção por concatenação de strings.
* **Filtro Anti-XSS**: A camada de exibição executa de modo padrão `htmlspecialchars()` e sanitizações de tags de script em todas as entradas de formulários persistentes.
* **Proteção contra CSRF**: Um Token criptográfico randômico robusto é gerado por sessão e conferido no recebimento de requisições POST críticas.
* **Gerenciamento de Uploads**: Extensões não autorizadas (ex: `.php`, `.phtml`, `.js`) são estritamente rejeitadas no validador de cabeçalho no servidor.
