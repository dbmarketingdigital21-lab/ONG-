<?php
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

namespace Config;

use PDO;
use PDOException;

class Database {
    private static $connection = null;

    public static function connect() {
        if (self::$connection === null) {
            // Carrega as variáveis de ambiente simulado ou do sistema (Ex: $_ENV ou getenv)
            $host = getenv('DB_HOST') ?: '127.0.0.1';
            $db   = getenv('DB_NAME') ?: 'viva_o_amanha_osc';
            $user = getenv('DB_USER') ?: 'root';
            $pass = getenv('DB_PASS') ?: '';
            $port = getenv('DB_PORT') ?: '3306';
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$db;port=$port;charset=$charset";
            
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$connection = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                // Impede vazamento de credenciais na stack trace
                throw new PDOException("Erro na conexão com o banco de dados institucional.", (int)$e->getCode());
            }
        }
        return self::$connection;
    }
}
