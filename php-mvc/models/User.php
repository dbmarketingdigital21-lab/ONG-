<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

namespace Models;

use Config\Database;
use PDO;

class User {
    private $id;
    private $nome;
    private $email;
    private $nivel_acesso;
    private $status;

    // Construtor ou Métodos Estáticos (Active Record ou Data Mapper style)
    public static function findByEmail($email) {
        $db = Database::connect();
        
        // PDO Prepared Statements prevenindo SQL INJECTION de forma absoluta
        $stmt = $db->prepare("SELECT * FROM usuarios WHERE email = :email LIMIT 1");
        
        // Sanitização dos dados inseridos
        $emailSanitizado = filter_var($email, FILTER_SANITIZE_EMAIL);
        
        $stmt->execute(['email' => $emailSanitizado]);
        return $stmt->fetch();
    }

    public static function insert($nome, $email, $senhaLimpa, $nivel_acesso) {
        $db = Database::connect();
        
        // Criptografia de via única profissional
        $senhaHash = password_hash($senhaLimpa, PASSWORD_BCRYPT);
        
        $stmt = $db->prepare(
            "INSERT INTO usuarios (nome, email, senha, nivel_acesso, status) 
             VALUES (:nome, :email, :senha, :nivel_acesso, 'Ativo')"
        );
        
        return $stmt->execute([
            'nome' => htmlspecialchars(strip_tags($nome)), // Prevenção de XSS
            'email' => filter_var($email, FILTER_SANITIZE_EMAIL),
            'senha' => $senhaHash,
            'nivel_acesso' => $nivel_acesso
        ]);
    }

    public static function getAll() {
        $db = Database::connect();
        $stmt = $db->query("SELECT id, nome, email, nivel_acesso, status, created_at FROM usuarios ORDER BY nome ASC");
        return $stmt->fetchAll();
    }
}
