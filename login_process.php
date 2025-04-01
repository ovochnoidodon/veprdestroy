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
$user = $data['username'];
$pass = $data['password'];

// Поиск пользователя и проверка пароля
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
$stmt->bind_param("s", $user);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 1) {
    $row = $result->fetch_assoc();
    if (password_verify($pass, $row['password'])) {
        echo json_encode(['success' => true, 'message' => 'Вы успешно вошли!', 'user_id' => $row['id']]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Неверный пароль.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Пользователь не найден.']);
}

$stmt->close();
$conn->close();
?>