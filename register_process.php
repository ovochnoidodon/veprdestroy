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
$email = $data['email'];
$pass = $data['password'];

// Хэширование пароля
$hashed_pass = password_hash($pass, PASSWORD_DEFAULT);

// Проверка уникальности имени пользователя и email
$stmt = $conn->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $user, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя или email уже заняты.']);
    exit;
}

// Добавление нового пользователя
$stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $user, $email, $hashed_pass);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Регистрация успешна!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при регистрации.']);
}

$stmt->close();
$conn->close();
?>