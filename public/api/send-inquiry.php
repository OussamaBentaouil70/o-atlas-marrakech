<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    json_response(405, ['ok' => false, 'message' => 'Method not allowed.']);
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);
if (!is_array($payload)) {
    $payload = $_POST;
}
if (!is_array($payload)) {
    $payload = [];
}

/* ----------------------------- Honeypot ----------------------------- */

if (trim((string) ($payload['website'] ?? '')) !== '') {
    json_response(200, ['ok' => true]);
}

/* ---------------------------- Validation ---------------------------- */

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

$errors = [];

$name = trim((string) ($payload['name'] ?? ''));
if (text_length($name) < 2 || text_length($name) > 120) {
    $errors['name'] = 'Please enter your full name.';
}

$email = trim((string) ($payload['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || text_length($email) > 190) {
    $errors['email'] = 'Please enter a valid email address.';
}

$phone = trim((string) ($payload['phone'] ?? ''));
if (text_length($phone) > 40) {
    $errors['phone'] = 'Please enter a valid phone number.';
}

$eventType = trim((string) ($payload['eventType'] ?? ''));
if ($eventType === '' || text_length($eventType) > 80) {
    $errors['eventType'] = 'Please choose the type of event.';
}

$eventDate = trim((string) ($payload['eventDate'] ?? ''));
if ($eventDate !== '') {
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $eventDate);
    if (!$date || $date->format('Y-m-d') !== $eventDate) {
        $errors['eventDate'] = 'Please enter a valid event date.';
    } elseif ($eventDate < date('Y-m-d')) {
        $errors['eventDate'] = 'Please choose today or a future date.';
    }
}

$guestCount = filter_var(
    trim((string) ($payload['guestCount'] ?? '')),
    FILTER_VALIDATE_INT,
    ['options' => ['min_range' => 1, 'max_range' => 2000]]
);
if ($guestCount === false) {
    $errors['guestCount'] = 'Enter an estimated guest count between 1 and 2,000.';
}

$message = trim((string) ($payload['message'] ?? ''));
if (text_length($message) > 3000) {
    $errors['message'] = 'Please shorten your message.';
}

if ($errors !== []) {
    json_response(422, [
        'ok' => false,
        'message' => 'Please check the form and try again.',
        'errors' => $errors,
    ]);
}

/* ---------------------------- Mail config --------------------------- */

$fromAddress = env('MAIL_FROM_ADDRESS', env('MAIL_USERNAME'));
$fromName = env('MAIL_FROM_NAME', "O'Atlas Marrakech");
$adminEmail = env('ADMIN_EMAIL');
$adminName = env('ADMIN_NAME', "O'Atlas Marrakech");
$smtpUsername = env('MAIL_USERNAME');
$smtpPassword = env('MAIL_PASSWORD');

if (
    $fromAddress === ''
    || $smtpUsername === ''
    || $smtpPassword === ''
    || !filter_var($adminEmail, FILTER_VALIDATE_EMAIL)
) {
    error_log('[OAtlas inquiry] Mail configuration is incomplete. Check the .env file.');
    json_response(503, [
        'ok' => false,
        'message' => 'The inquiry form is not available right now. Please contact us on WhatsApp.',
    ]);
}

$nameParts = preg_split('/\s+/u', $name) ?: [$name];
$firstName = ($nameParts[0] ?? '') !== '' ? $nameParts[0] : $name;

$siteUrl = rtrim(env('SITE_URL', ''), '/');
$whatsappNumber = preg_replace('/\D+/', '', env('WHATSAPP_NUMBER', '212728585823')) ?: '212728585823';
$whatsappLink = 'https://wa.me/' . $whatsappNumber . '?text=' . rawurlencode(
    "Hello, I would like information about a wedding or event at O'Atlas Marrakech."
);

$templateData = [
    'name' => $name,
    'firstName' => $firstName,
    'email' => $email,
    'phone' => $phone !== '' ? $phone : 'Not provided',
    'eventType' => $eventType,
    'eventDate' => $eventDate !== ''
        ? (new DateTimeImmutable($eventDate))->format('j F Y')
        : 'To be confirmed',
    'guestCount' => (string) $guestCount,
    'message' => $message !== '' ? $message : 'No additional details provided.',
    'submittedAt' => (new DateTimeImmutable('now'))->format('j F Y, H:i'),
    'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'siteUrl' => $siteUrl,
    'whatsappLink' => $whatsappLink,
    'year' => date('Y'),
    'brandName' => "O'Atlas Marrakech",
    'adminEmail' => $adminEmail,
    'adminName' => $adminName,
];

/* ------------------------------ Mailers ----------------------------- */

function make_mailer(string $fromAddress, string $fromName): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = env('MAIL_HOST', 'smtp.hostinger.com');
    $mail->SMTPAuth = env('MAIL_USERNAME') !== '';
    $mail->Username = env('MAIL_USERNAME');
    $mail->Password = env('MAIL_PASSWORD');
    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 20;

    $encryption = strtolower(env('MAIL_ENCRYPTION', 'ssl'));
    if ($encryption === 'tls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $defaultPort = 587;
    } elseif ($encryption === 'none') {
        $mail->SMTPSecure = '';
        $defaultPort = 25;
    } else {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $defaultPort = 465;
    }

    $port = (int) env('MAIL_PORT', (string) $defaultPort);
    $mail->Port = $port > 0 ? $port : $defaultPort;
    $mail->setFrom($fromAddress, $fromName);
    $mail->isHTML(true);

    return $mail;
}

function client_plain_text(array $data): string
{
    return "Thank you, {$data['firstName']}.\n\n"
        . "We have received your inquiry and our team will be in touch within 24-48 hours.\n\n"
        . "Event: {$data['eventType']}\n"
        . "Date: {$data['eventDate']}\n"
        . "Guests: {$data['guestCount']}\n\n"
        . "WhatsApp: {$data['whatsappLink']}\n"
        . ($data['siteUrl'] !== '' ? "Website: {$data['siteUrl']}\n" : '');
}

function admin_plain_text(array $data): string
{
    return "New event inquiry\n\n"
        . "Name: {$data['name']}\n"
        . "Email: {$data['email']}\n"
        . "Phone: {$data['phone']}\n"
        . "Event: {$data['eventType']}\n"
        . "Date: {$data['eventDate']}\n"
        . "Guests: {$data['guestCount']}\n"
        . "Submitted: {$data['submittedAt']}\n\n"
        . "Message:\n{$data['message']}\n";
}

/* -------------------------- Admin notification ---------------------- */

$subjectName = str_replace(["\r", "\n"], ' ', $name);
$subjectType = str_replace(["\r", "\n"], ' ', $eventType);
$safeName = $subjectName;

try {
    $adminMail = make_mailer($fromAddress, $fromName);
    $adminMail->addAddress($adminEmail, $adminName);
    $adminMail->addReplyTo($email, $safeName);
    $adminMail->Subject = "New event inquiry: {$subjectType} - {$subjectName}";
    $adminMail->Body = render_template(__DIR__ . '/templates/admin-notification.php', $templateData);
    $adminMail->AltBody = admin_plain_text($templateData);
    $adminMail->send();
} catch (Throwable $exception) {
    error_log('[OAtlas inquiry] Admin email failed: ' . $exception->getMessage());
    json_response(500, [
        'ok' => false,
        'message' => 'We could not send your inquiry. Please try again or contact us on WhatsApp.',
    ]);
}

/* --------------------------- Client thank-you ----------------------- */

try {
    $clientMail = make_mailer($fromAddress, $fromName);
    $clientMail->addAddress($email, $safeName);
    $clientMail->addReplyTo($adminEmail, $adminName);
    $clientMail->Subject = 'Thank you for your inquiry';
    $clientMail->Body = render_template(__DIR__ . '/templates/client-thank-you.php', $templateData);
    $clientMail->AltBody = client_plain_text($templateData);
    $clientMail->send();
} catch (Throwable $exception) {
    // The admin has the lead; do not block the visitor if the confirmation fails.
    error_log('[OAtlas inquiry] Client email failed: ' . $exception->getMessage());
}

json_response(200, [
    'ok' => true,
    'message' => 'Thank you. Your inquiry has been sent.',
]);
