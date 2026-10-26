<?php
declare(strict_types=1);

date_default_timezone_set('Africa/Casablanca');

/**
 * Minimal .env loader (no Composer required).
 */
function load_env_file(string $path): void
{
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || substr($line, 0, 1) === '#') {
            continue;
        }

        $separator = strpos($line, '=');
        if ($separator === false) {
            continue;
        }

        $key = trim(substr($line, 0, $separator));
        $value = trim(substr($line, $separator + 1));

        if ($key === '') {
            continue;
        }

        $length = strlen($value);
        if (
            $length >= 2
            && (($value[0] === '"' && $value[$length - 1] === '"')
                || ($value[0] === "'" && $value[$length - 1] === "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

/**
 * Look for .env one level above public_html first (recommended), then inside it.
 */
$envCandidates = [
    dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . '.env',
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
    __DIR__ . DIRECTORY_SEPARATOR . '.env',
];

foreach ($envCandidates as $envFile) {
    if (is_file($envFile)) {
        load_env_file($envFile);
        break;
    }
}

function env(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }

    return (string) $value;
}

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode(
        $payload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE
    );
    exit;
}

function render_template(string $file, array $data): string
{
    if (!is_file($file)) {
        throw new RuntimeException('Email template not found: ' . basename($file));
    }

    extract($data, EXTR_SKIP);
    ob_start();
    require $file;

    return (string) ob_get_clean();
}

require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';
