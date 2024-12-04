<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    $to = "denis.leontev92@yandex.ru";  // замените своим email
    $subject = "Новое сообщение с вашего сайта";
    $body = "Имя: $name\nEmail: $email\nСообщение:\n$message";
    
    if (mail($to, $subject, $body)) {
        echo "Сообщение успешно отправлено.";
    } else {
        echo "Ошибка при отправке сообщения.";
    }
} else {
    echo "Неверный метод отправки.";
}
?>