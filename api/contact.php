<?php
// Compatible con PHP 5.5+ y PHPMailer 6.x.
// Requiere /vendor/autoload.php y api/mail-config.php configurados en IIS.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply_json($status, $ok, $message) {
    http_response_code($status);
    echo json_encode(array('ok' => $ok, 'message' => $message));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    reply_json(405, false, 'Método no permitido.');
}
if (isset($_SERVER['CONTENT_LENGTH']) && (int) $_SERVER['CONTENT_LENGTH'] > 12000) {
    reply_json(413, false, 'La consulta es demasiado extensa.');
}
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) reply_json(400, false, 'La solicitud no es válida.');

function field($data, $key, $max) {
    $value = isset($data[$key]) && is_string($data[$key]) ? trim($data[$key]) : '';
    if (strlen($value) > $max) reply_json(400, false, 'Uno de los campos supera la longitud permitida.');
    return $value;
}

$website = field($data, 'website', 200);
// Honeypot: responder genéricamente para no informar a los bots.
if ($website !== '') reply_json(200, true, 'Gracias por su consulta.');
$unit = field($data, 'unit', 40);
if ($unit !== 'munitotal') reply_json(400, false, 'Unidad no válida.');
$name = field($data, 'name', 120);
$municipality = field($data, 'municipality', 120);
$email = field($data, 'email', 180);
$phone = field($data, 'phone', 50);
$interest = field($data, 'interest', 100);
$message = field($data, 'message', 4000);
if ($name === '' || $municipality === '' || $email === '' || $message === '') {
    reply_json(422, false, 'Complete los campos obligatorios.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply_json(422, false, 'El correo electrónico no es válido.');
$interests = array('', 'Software GGMM', 'Infraestructura y hardware', 'Soluciones ciudadanas', 'Insumos para municipios', 'Consulta general');
if (!in_array($interest, $interests, true)) reply_json(422, false, 'Seleccione una opción válida.');

$autoloader = dirname(__DIR__) . '/vendor/autoload.php';
$configFile = __DIR__ . '/mail-config.php';
if (!is_file($autoloader) || !is_file($configFile)) {
    error_log('MuniTotal: faltan dependencias o configuración de correo.');
    reply_json(503, false, 'El formulario no está disponible. Escríbanos a munitotal@inft.com.ar.');
}
require_once $autoloader;
$config = require $configFile;

function escape_mail($value) {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->Port = (int) $config['port'];
    $mail->SMTPAuth = true;
    $mail->SMTPSecure = 'tls';
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = '[MuniTotal] Nueva consulta: ' . $municipality;
    $rows = array(
        'Nombre' => $name,
        'Municipio / Organización' => $municipality,
        'Correo' => $email,
        'Teléfono' => $phone,
        'Interés' => $interest === '' ? 'No especificado' : $interest,
        'Mensaje' => $message
    );
    $html = '<h2>Nueva consulta desde MuniTotal</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse">';
    $plain = "Nueva consulta desde MuniTotal\n\n";
    foreach ($rows as $key => $value) {
        $html .= '<tr><th align="left">' . escape_mail($key) . '</th><td>' . nl2br(escape_mail($value)) . '</td></tr>';
        $plain .= $key . ': ' . $value . "\n";
    }
    $html .= '</table>';
    $mail->isHTML(true);
    $mail->Body = $html;
    $mail->AltBody = $plain;
    $mail->send();
    reply_json(200, true, 'Su consulta fue enviada correctamente.');
} catch (Exception $e) {
    error_log('MuniTotal: fallo de SMTP / formulario: ' . $e->getMessage());
    reply_json(502, false, 'No pudimos enviar su consulta. Escríbanos a munitotal@inft.com.ar o por WhatsApp.');
}
