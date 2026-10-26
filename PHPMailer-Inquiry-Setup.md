# PHPMailer Inquiry Form — Complete Setup & Testing Guide

A reusable, no-framework PHP setup for sending **two emails** from a website contact form:

1. **Admin notification** — the lead details, reply-to set to the visitor.
2. **Client thank-you** — confirms receipt and includes the visitor's summary.

It works on shared hosting (Hostinger, cPanel, etc.) and locally. No database required.

---

## 1. How it works

```
Browser form
   │  POST JSON
   ▼
/api/send-inquiry.php
   │  validate + honeypot
   ├──► PHPMailer ──► SMTP ──► ADMIN_EMAIL
   └──► PHPMailer ──► SMTP ──► visitor email
   │
   ▼
{ "ok": true }  →  frontend redirects to /thank-you
```

The admin email is sent **first**. If it fails, the request fails with `500` so the visitor
can retry. If the client thank-you fails, the error is logged but the request still succeeds
because the lead has already reached the admin.

---

## 2. Requirements

- PHP **8.0+** (8.2/8.3/8.4 recommended)
- PHP extensions: `openssl` (required for SMTP TLS/SSL), `mbstring` (recommended)
- An SMTP mailbox (Hostinger, Gmail, Zoho, Mailtrap, etc.)
- HTTPS in production
- Composer **optional** — you can vendor PHPMailer manually

Check your PHP:

```bash
php -v
php -m | findstr /i "openssl mbstring"   # Windows
php -m | grep -Ei "openssl|mbstring"     # Linux/macOS
```

If `openssl` is missing, PHPMailer fails with:

```
Extension missing: openssl
```

Enable it in `php.ini`:

```ini
extension_dir = "ext"
extension=openssl
extension=mbstring
```

Restart PHP/Apache after changing `php.ini`.

---

## 3. Folder layout

```
project/
├── .env                     ← secrets, never committed
├── .env.example
└── public/
    ├── .htaccess            ← security + optional SPA fallback
    └── api/
        ├── bootstrap.php    ← env loader + helpers + PHPMailer includes
        ├── send-inquiry.php ← the endpoint
        ├── templates/
        │   ├── admin-notification.php
        │   └── client-thank-you.php
        └── lib/
            └── PHPMailer/
                ├── PHPMailer.php
                ├── SMTP.php
                └── Exception.php
```

Keep `lib/` and `templates/` blocked from browsers with `.htaccess`.

---

## 4. Install PHPMailer

### Option A — Composer (recommended if Composer is available)

```bash
composer require phpmailer/phpmailer
```

Then in `bootstrap.php` use:

```php
require_once __DIR__ . '/../vendor/autoload.php';
```

Adjust the path to your `vendor/` directory.

### Option B — Manual (shared hosting, no Composer)

1. Download the latest release: <https://github.com/PHPMailer/PHPMailer/releases>
2. Copy these files into `public/api/lib/PHPMailer/`:
   - `src/PHPMailer.php`
   - `src/SMTP.php`
   - `src/Exception.php`
3. Require them manually (shown in `bootstrap.php` below).

No `vendor/` folder or `composer install` is needed with this option.

---

## 5. Create `.env`

Create `.env` at the project root (not inside `public/` if possible).

```env
# SMTP
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_ENCRYPTION=ssl
MAIL_USERNAME=no-reply@yourdomain.com
MAIL_PASSWORD=your-smtp-password
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME="Your Website"

# Admin notification
ADMIN_EMAIL=you@yourdomain.com
ADMIN_NAME="Your Website"

# Public site
SITE_URL=https://yourdomain.com
WHATSAPP_NUMBER=212600000000
```

### Common SMTP settings

| Provider | Host | Port | Encryption |
|---|---|---|---|
| Hostinger | `smtp.hostinger.com` | `465` | `ssl` |
| Gmail | `smtp.gmail.com` | `587` | `tls` |
| Gmail | `smtp.gmail.com` | `465` | `ssl` |
| Zoho | `smtp.zoho.com` | `465` | `ssl` |
| Mailtrap (testing) | `sandbox.smtp.mailtrap.io` | `2525` | `tls` |

For Gmail, `MAIL_FROM_ADDRESS` **must** be the same Gmail address (or a verified alias),
otherwise Gmail rewrites/rejects the sender.

Never commit `.env`. Add it to `.gitignore`:

```gitignore
.env
```

---

## 6. `bootstrap.php`

```php
<?php
declare(strict_types=1);

date_default_timezone_set('Africa/Casablanca');

/**
 * Minimal .env loader. No Composer required.
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
        if ($line === '' || str_starts_with($line, '#')) {
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

// 1) one level above public_html (recommended)
// 2) public_html/.env
// 3) public/api/.env
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

/* Manual PHPMailer install */
require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';
```

> Composer users: replace the three `require_once` lines with the `vendor/autoload.php` line.

---

## 7. `send-inquiry.php`

Adapt the field names to your form. This version includes validation, a honeypot, and
separate admin/client error handling.

```php
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
    // Pretend success so bots do not learn the trap.
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

$subjectLine = trim((string) ($payload['subject'] ?? ''));
if ($subjectLine === '' || text_length($subjectLine) > 120) {
    $errors['subject'] = 'Please choose a subject.';
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
$fromName = env('MAIL_FROM_NAME', 'Website');
$adminEmail = env('ADMIN_EMAIL');
$adminName = env('ADMIN_NAME', $fromName);
$smtpUsername = env('MAIL_USERNAME');
$smtpPassword = env('MAIL_PASSWORD');

if (
    $fromAddress === ''
    || $smtpUsername === ''
    || $smtpPassword === ''
    || !filter_var($adminEmail, FILTER_VALIDATE_EMAIL)
) {
    error_log('[inquiry] Mail configuration is incomplete.');
    json_response(503, [
        'ok' => false,
        'message' => 'The form is not available right now. Please contact us directly.',
    ]);
}

/* ------------------------------ Data -------------------------------- */

$nameParts = preg_split('/\s+/u', $name) ?: [$name];
$firstName = ($nameParts[0] ?? '') !== '' ? $nameParts[0] : $name;

$siteUrl = rtrim(env('SITE_URL', ''), '/');
$whatsappNumber = preg_replace('/\D+/', '', env('WHATSAPP_NUMBER', '')) ?: '';
$whatsappLink = $whatsappNumber !== ''
    ? 'https://wa.me/' . $whatsappNumber
    : '';

$templateData = [
    'name' => $name,
    'firstName' => $firstName,
    'email' => $email,
    'phone' => $phone !== '' ? $phone : 'Not provided',
    'subjectLine' => $subjectLine,
    'message' => $message !== '' ? $message : 'No additional details provided.',
    'submittedAt' => (new DateTimeImmutable('now'))->format('j F Y, H:i'),
    'ipAddress' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
    'siteUrl' => $siteUrl,
    'whatsappLink' => $whatsappLink,
    'year' => date('Y'),
    'brandName' => $fromName,
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
        . "We have received your message and will reply within 24-48 hours.\n\n"
        . "Subject: {$data['subjectLine']}\n"
        . ($data['whatsappLink'] !== '' ? "WhatsApp: {$data['whatsappLink']}\n" : '')
        . ($data['siteUrl'] !== '' ? "Website: {$data['siteUrl']}\n" : '');
}

function admin_plain_text(array $data): string
{
    return "New inquiry\n\n"
        . "Name: {$data['name']}\n"
        . "Email: {$data['email']}\n"
        . "Phone: {$data['phone']}\n"
        . "Subject: {$data['subjectLine']}\n"
        . "Submitted: {$data['submittedAt']}\n\n"
        . "Message:\n{$data['message']}\n";
}

$subjectName = str_replace(["\r", "\n"], ' ', $name);
$subjectType = str_replace(["\r", "\n"], ' ', $subjectLine);

/* -------------------------- Admin notification ---------------------- */

try {
    $adminMail = make_mailer($fromAddress, $fromName);
    $adminMail->addAddress($adminEmail, $adminName);
    $adminMail->addReplyTo($email, $subjectName);
    $adminMail->Subject = "New inquiry: {$subjectType} - {$subjectName}";
    $adminMail->Body = render_template(
        __DIR__ . '/templates/admin-notification.php',
        $templateData
    );
    $adminMail->AltBody = admin_plain_text($templateData);
    $adminMail->send();
} catch (Throwable $exception) {
    error_log('[inquiry] Admin email failed: ' . $exception->getMessage());
    json_response(500, [
        'ok' => false,
        'message' => 'We could not send your message. Please try again or contact us directly.',
    ]);
}

/* --------------------------- Client thank-you ----------------------- */

try {
    $clientMail = make_mailer($fromAddress, $fromName);
    $clientMail->addAddress($email, $subjectName);
    $clientMail->addReplyTo($adminEmail, $adminName);
    $clientMail->Subject = 'Thank you for your message';
    $clientMail->Body = render_template(
        __DIR__ . '/templates/client-thank-you.php',
        $templateData
    );
    $clientMail->AltBody = client_plain_text($templateData);
    $clientMail->send();
} catch (Throwable $exception) {
    // The admin already has the lead; do not block the visitor.
    error_log('[inquiry] Client email failed: ' . $exception->getMessage());
}

json_response(200, [
    'ok' => true,
    'message' => 'Thank you. Your message has been sent.',
]);
```

---

## 8. Email templates

Use **table-based HTML with inline CSS**. Email clients ignore most external CSS and many
modern layout features.

### `templates/client-thank-you.php`

```php
<?php
/** @var string $firstName */
/** @var string $subjectLine */
/** @var string $message */
/** @var string $whatsappLink */
/** @var string $siteUrl */
/** @var string $year */
/** @var string $brandName */
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thank you</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">

          <tr>
            <td style="background-color:#000000;padding:28px 32px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;letter-spacing:0.14em;color:#ffffff;text-transform:uppercase;">
                <?= e($brandName) ?>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:34px 40px 8px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.22em;text-transform:uppercase;color:#777777;">
                Thank you
              </p>
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;font-weight:normal;color:#292929;">
                Thank you, <?= e($firstName) ?>.
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#555555;">
                We have received your message and our team will reply within
                <strong style="color:#292929;">24–48 hours</strong>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid #000000;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#777777;">
                      Your message
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">
                      <?= nl2br(e($message)) ?>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <?php if ($whatsappLink !== ''): ?>
            <tr>
              <td align="center" style="padding:28px 40px 8px;">
                <a href="<?= e($whatsappLink) ?>" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                  Chat on WhatsApp
                </a>
              </td>
            </tr>
          <?php endif; ?>

          <tr>
            <td style="padding:24px 40px 28px;">
              <div style="border-top:1px solid #dddddd;padding-top:18px;text-align:center;">
                <?php if ($siteUrl !== ''): ?>
                  <p style="margin:0 0 8px;font-size:12px;">
                    <a href="<?= e($siteUrl) ?>" style="color:#000000;text-decoration:underline;">
                      <?= e($siteUrl) ?>
                    </a>
                  </p>
                <?php endif; ?>
                <p style="margin:0;font-size:11px;color:#999999;">
                  © <?= e($year) ?> <?= e($brandName) ?>
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### `templates/admin-notification.php`

```php
<?php
/** @var string $name */
/** @var string $firstName */
/** @var string $email */
/** @var string $phone */
/** @var string $subjectLine */
/** @var string $message */
/** @var string $submittedAt */
/** @var string $ipAddress */
/** @var string $siteUrl */
/** @var string $year */
/** @var string $brandName */
$replySubject = rawurlencode('Re: Your inquiry');
$replyLink = 'mailto:' . $email . '?subject=' . $replySubject;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New inquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border:1px solid #dddddd;border-radius:6px;overflow:hidden;">

          <tr>
            <td style="background-color:#000000;padding:26px 32px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.14em;color:#ffffff;text-transform:uppercase;">
                <?= e($brandName) ?>
              </div>
              <div style="margin-top:6px;font-size:10px;letter-spacing:0.24em;color:#bbbbbb;text-transform:uppercase;">
                New inquiry
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:30px 40px 6px;">
              <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:normal;color:#292929;">
                New inquiry from <?= e($name) ?>
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;">
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;width:32%;">Name</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:bold;border-bottom:1px solid #eeeeee;"><?= e($name) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Email</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;">
                    <a href="mailto:<?= e($email) ?>" style="color:#000000;"><?= e($email) ?></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Phone</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;"><?= e($phone) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Subject</td>
                  <td style="padding:10px 14px;font-size:13px;font-weight:bold;border-bottom:1px solid #eeeeee;"><?= e($subjectLine) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Submitted</td>
                  <td style="padding:10px 14px;font-size:13px;border-bottom:1px solid #eeeeee;"><?= e($submittedAt) ?></td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;font-size:12px;color:#777777;">IP</td>
                  <td style="padding:10px 14px;font-size:13px;"><?= e($ipAddress) ?></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 40px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid #000000;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:#777777;">
                      Message
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;">
                      <?= nl2br(e($message)) ?>
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:26px 40px 8px;">
              <a href="<?= e($replyLink) ?>" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Reply to <?= e($firstName) ?>
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 40px 26px;">
              <div style="border-top:1px solid #dddddd;padding-top:16px;text-align:center;">
                <p style="margin:0;font-size:11px;color:#999999;">
                  Sent from <?= e($brandName) ?><?php if ($siteUrl !== ''): ?> · <?= e($siteUrl) ?><?php endif; ?>
                </p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

Escape **every** user value with `e()`. Never interpolate raw input into HTML.

---

## 9. Frontend integration

### React example

```tsx
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

async function submitInquiry(form: Record<string, string>) {
  setSubmitting(true);
  setError(null);

  try {
    const response = await fetch("/api/send-inquiry.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      setError(data?.message ?? "We could not send your message. Please try again.");
      return;
    }

    window.location.href = "/thank-you";
  } catch {
    setError("Connection problem. Please try again.");
  } finally {
    setSubmitting(false);
  }
}
```

Include the honeypot in the form state and submit it. Hide it off-screen, not with
`display:none` only:

```tsx
<div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
  <label htmlFor="website">Leave this field empty</label>
  <input
    id="website"
    name="website"
    type="text"
    tabIndex={-1}
    autoComplete="off"
    value={form.website}
    onChange={(event) => setForm({ ...form, website: event.target.value })}
  />
</div>
```

### Plain HTML/JavaScript example

```html
<form id="inquiry-form">
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="phone" />
  <input name="subject" required />
  <textarea name="message"></textarea>

  <div style="position:absolute;left:-9999px;" aria-hidden="true">
    <input name="website" tabindex="-1" autocomplete="off" />
  </div>

  <button type="submit">Send</button>
  <p id="form-error" role="alert"></p>
</form>

<script>
  const form = document.getElementById("inquiry-form");
  const errorBox = document.getElementById("form-error");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.textContent = "";

    const payload = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/send-inquiry.php", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.ok) {
      errorBox.textContent = data?.message || "Could not send. Please try again.";
      return;
    }

    window.location.href = "/thank-you";
  });
</script>
```

---

## 10. `.htaccess` security

`public/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On

  # Optional SPA fallback (React/Vue). Remove for a plain PHP site.
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

<FilesMatch "^\.env">
  Require all denied
</FilesMatch>
```

`public/api/.htaccess`:

```apache
Options -Indexes

<Files "bootstrap.php">
  Require all denied
</Files>

<FilesMatch "\.(env|json|lock|md|txt|log)$">
  Require all denied
</FilesMatch>
```

`public/api/lib/.htaccess` and `public/api/templates/.htaccess`:

```apache
Require all denied
```

---

## 11. Local testing with Gmail (App Password)

### 11.1 Create a Gmail App Password

1. Google Account → **Security**.
2. Enable **2-Step Verification**.
3. Security → **App passwords**.
4. Create one for “Mail” (name it “Local website test”).
5. Copy the 16-character password and **remove the spaces**.

Regular Gmail passwords do not work for SMTP when 2FA is enabled.

### 11.2 Test `.env`

```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_ENCRYPTION=tls
MAIL_USERNAME=you@gmail.com
MAIL_PASSWORD=your16charapppassword
MAIL_FROM_ADDRESS=you@gmail.com
MAIL_FROM_NAME="Your Website"

ADMIN_EMAIL=you@gmail.com
ADMIN_NAME="Your Website"

SITE_URL=http://127.0.0.1:8080
WHATSAPP_NUMBER=212600000000
```

Use the Gmail address for `MAIL_FROM_ADDRESS`. Gmail will reject or rewrite a random
`no-reply@yourdomain.com` unless it is a verified alias.

### 11.3 Enable `openssl`

```bash
php -m | findstr /i openssl
```

If missing, edit `php.ini`:

```ini
extension_dir = "ext"
extension=openssl
```

Then restart PHP.

### 11.4 Serve the site

Plain PHP site:

```bash
php -S 127.0.0.1:8080 -t public
```

SPA build (React/Vue) with a router so `/thank-you` works:

`local-router.php`:

```php
<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$file = __DIR__ . '/dist' . $path;

if ($path !== '/' && is_file($file)) {
    return false; // let PHP serve real files, including /api/*.php
}

header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/dist/index.html');
```

Run:

```bash
php -S 127.0.0.1:8080 -t dist local-router.php
```

> Vite’s `npm run dev` server does **not** execute PHP. Build first and serve `dist/` with
> PHP, or proxy `/api` to a PHP server.

### 11.5 Send a test request

Create `test.json`:

```json
{
  "name": "Test User",
  "email": "you@gmail.com",
  "phone": "+212 600 000 000",
  "subject": "Wedding inquiry",
  "message": "This is a local test.",
  "website": ""
}
```

Windows PowerShell:

```powershell
curl.exe -i -X POST -H "Content-Type: application/json" --data-binary "@test.json" http://127.0.0.1:8080/api/send-inquiry.php
```

Linux/macOS:

```bash
curl -i -X POST \
  -H "Content-Type: application/json" \
  --data-binary @test.json \
  http://127.0.0.1:8080/api/send-inquiry.php
```

Expected:

```json
{"ok":true,"message":"Thank you. Your message has been sent."}
```

You should receive **two emails**: the admin notification and the client thank-you.

### 11.6 Test the failure paths

| Test | Expected |
|---|---|
| `GET /api/send-inquiry.php` | `405 Method not allowed` |
| Missing name / bad email | `422` with `errors` |
| `"website": "spam"` | `200 {ok:true}`, **no email sent** |
| Empty SMTP password | `503` configuration message |
| Wrong SMTP password | `500` admin email failed (check PHP log) |

### 11.7 Faster alternative: Mailtrap / MailHog

If you do not want to use a real inbox while developing:

- **Mailtrap** — hosted sandbox, gives SMTP host/port/username/password.
- **MailHog** — local SMTP + web UI on port 8025.

Use their SMTP values in `.env` and set `MAIL_ENCRYPTION=tls` (or `none` for MailHog).

---

## 12. Production deployment (Hostinger example)

1. Run your frontend build (`npm run build` for Vite).
2. Upload the **contents** of `dist/` to `public_html/`:
   - `index.html`
   - `.htaccess`
   - `images/`
   - `api/`
3. Upload `.env`:
   - Preferred: one level **above** `public_html/`
   - Or `public_html/.env` (blocked by `.htaccess`)
   - Or `public_html/api/.env`
4. Set permissions: `.env` → `600`; folders → `755`; files → `644`.
5. In hPanel, create the mailbox and use its SMTP credentials.
6. Enable **SPF** and **DKIM** for the domain.
7. Send a real test inquiry and confirm both emails arrive.
8. Check spam/junk the first time and mark “not spam”.

Do **not** upload `node_modules/`, `.git/`, or source files.

---

## 13. Troubleshooting

| Error / symptom | Cause | Fix |
|---|---|---|
| `Extension missing: openssl` | PHP has no OpenSSL | Enable `extension=openssl`, restart PHP |
| `503` configuration message | `.env` not loaded or required values empty | Check `.env` location and `MAIL_USERNAME`, `MAIL_PASSWORD`, `ADMIN_EMAIL` |
| `500` admin email failed | SMTP auth/host/port wrong | Read the PHP error log; check app password |
| Gmail: `Username and Password not accepted` | Using normal password | Create an App Password, remove spaces |
| Gmail: sender rewritten/rejected | `MAIL_FROM_ADDRESS` ≠ authenticated account | Use the Gmail address or a verified alias |
| `Connection refused` / timeout | Wrong port or firewall | Try `465` + `ssl` or `587` + `tls` |
| Emails go to spam | No SPF/DKIM, new domain | Add DNS records, warm up the domain, check content |
| Client email missing but admin arrives | Client address invalid or mail rejected | Check PHP log; admin still has the lead |
| `405` | Endpoint opened in browser | It only accepts `POST` |
| `422` | Validation failed | Read the `errors` object |
| PHP server 404 on `/thank-you` | No SPA fallback locally | Use `local-router.php` |

---

## 14. Security checklist

- [ ] `.env` is outside the web root or blocked by `.htaccess`
- [ ] `.env` is in `.gitignore`
- [ ] `lib/` and `templates/` are denied by `.htaccess`
- [ ] Every user value is escaped with `e()` in HTML emails
- [ ] Validation is repeated on the server
- [ ] Honeypot field is present
- [ ] Admin email is sent before the client email
- [ ] SMTP password is an app password, not the main account password
- [ ] HTTPS is enabled
- [ ] Consider rate limiting (e.g. one submission per IP per minute)
- [ ] Rotate the SMTP password if it was ever exposed

---

## 15. Optional: internal reference code

If you want a short `OAT-XXXXXX` code in the **admin email only** for tracking, add this.
It is not shown on the website or sent to the visitor.

```php
function make_reference(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $reference = '';
    $max = strlen($alphabet) - 1;

    for ($i = 0; $i < 6; $i++) {
        $reference .= $alphabet[random_int(0, $max)];
    }

    return 'OAT-' . $reference;
}

$reference = make_reference();
```

Add `$reference` to the admin subject/body. If you do not need it, skip this section.
