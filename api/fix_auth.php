<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host", $user, $pass);

    $pdo->exec("ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''");

    echo "<h1>Готово!</h1><p>Метод авторизації змінено. Тепер спробуй зайти в Adminer.</p>";
} catch (PDOException $e) {
    echo "<h1>Помилка:</h1><pre>" . $e->getMessage() . "</pre>";
}