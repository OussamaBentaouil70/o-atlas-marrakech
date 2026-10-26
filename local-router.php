<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . '/dist' . $path;

if ($path !== '/' && is_file($file)) {
    return false;
}

header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/dist/index.html');
