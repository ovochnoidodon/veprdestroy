<?php
header('Content-Type: application/json');

// Подключение к базе данных
$servername = "sql104.byetcluster.com"; // Замените на реальный хост из данных подключения
$username = "if0_38198672";  // Ваше имя пользователя базы данных
$password = "RNIzppbXKzV36";  // Ваш пароль базы данных
$dbname = "if0_38198672_my_database";        // Имя вашей базы данных

$conn = new mysqli($servername, $username, $password, $dbname);

// Проверка соединения
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получение данных из формы
$data = json_decode(file_get_contents('php://input'), true);
$user_id = $data['user_id'];
$message = $data['message'];
$is_bot = $data['is_bot'] ?? false;

// Сохранение сообщения
$stmt = $conn->prepare("INSERT INTO messages (user_id, message, is_bot) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $user_id, $message, $is_bot);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Сообщение сохранено.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при сохранении сообщения.']);
}

$stmt->close();
$conn->close();
?>