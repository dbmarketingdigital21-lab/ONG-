<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

namespace Controllers;

use Models\User;

class AuthController {
    
    public function login() {
        // Inicializa sessão de forma segura se já não estiver ativa
        if (session_status() == PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            ini_set('session.cookie_secure', 1); // Exige HTTPS em produção
            session_start();
        }

        // Gera token CSRF de integridade se necessário
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Valida Token CSRF para evitar ataques de Cross-Site Request Forgery
            if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
                die("Ataque CSRF suspeitado e bloqueado pelo sistema.");
            }

            // Sanitiza entradas
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $senha = $_POST['senha'] ?? '';

            if (empty($email) || empty($senha)) {
                $error = "E-mail e senha são obrigatórios.";
                // Renderizar view de login com erro
                return $this->renderView('login', ['error' => $error]);
            }

            // Realiza busca segura via Prepared Statement
            $usuario = User::findByEmail($email);

            if ($usuario && password_verify($senha, $usuario['senha'])) {
                if ($usuario['status'] !== 'Ativo') {
                    return $this->renderView('login', ['error' => 'Acesso suspenso temporariamente.']);
                }

                // Proteção de fixação de sessão gerando IDs novos
                session_regenerate_id(true);
                
                $_SESSION['usuario_id'] = $usuario['id'];
                $_SESSION['usuario_nome'] = $usuario['nome'];
                $_SESSION['usuario_nivel'] = $usuario['nivel_acesso'];

                // Redireciona para o painel de controle principal (Dashboard)
                header('Location: /dashboard');
                exit();
            } else {
                return $this->renderView('login', ['error' => 'Usuário ou senha inválidos.']);
            }
        }

        // Renderiza página padrão
        return $this->renderView('login', ['csrf_token' => $_SESSION['csrf_token']]);
    }

    public function logout() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = array();
        
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        header('Location: /login');
        exit();
    }

    private function renderView($view, $data = []) {
        extract($data);
        // Simulação do sistema de templates simples do MVC
        include __DIR__ . "/../views/{$view}.php";
    }
}
