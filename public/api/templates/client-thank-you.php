<?php
/** @var string $firstName */
/** @var string $eventType */
/** @var string $eventDate */
/** @var string $guestCount */
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
  <title>Thank you for your inquiry</title>
  <style>
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; }
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .stack { display: block !important; width: 100% !important; }
      .h1 { font-size: 25px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:#eeeeee;font-size:1px;line-height:1px;">
    Thank you for your inquiry — our team will be in touch shortly.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #dddddd;">

          <tr>
            <td style="background-color:#000000;padding:30px 32px;text-align:center;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.16em;color:#ffffff;text-transform:uppercase;">
                <?= e($brandName) ?>
              </div>
              <div style="margin-top:7px;font-size:10px;letter-spacing:0.28em;color:#bbbbbb;text-transform:uppercase;">
                Luxury Weddings &amp; Events
              </div>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:38px 42px 8px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.24em;text-transform:uppercase;color:#777777;">
                Thank you
              </p>
              <h1 class="h1" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:29px;line-height:1.25;font-weight:normal;color:#292929;">
                Thank you, <?= e($firstName) ?>.
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#555555;">
                We have received your inquiry and our team will be in touch within
                <strong style="color:#292929;">24–48 hours</strong> to discuss your celebration.
              </p>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:24px 42px 0;">
              <p style="margin:0 0 12px;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#777777;">
                Your inquiry
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;border-radius:4px;">
                <tr>
                  <td style="padding:11px 16px;font-size:13px;color:#777777;border-bottom:1px solid #eeeeee;width:38%;">Event</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($eventType) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:13px;color:#777777;border-bottom:1px solid #eeeeee;">Date</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($eventDate) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:13px;color:#777777;">Guests</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;"><?= e($guestCount) ?></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:20px 42px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border:1px solid #eeeeee;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#777777;">
                      Your message
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#555555;"><?= nl2br(e($message)) ?></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" class="px" style="padding:30px 42px 10px;">
              <a href="<?= e($whatsappLink) ?>" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Chat with us on WhatsApp
              </a>
              <p style="margin:14px 0 0;font-size:12px;line-height:1.6;color:#777777;">
                Prefer email? Simply reply to this message.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 42px 30px;">
              <div style="border-top:1px solid #dddddd;padding-top:20px;text-align:center;">
                <?php if ($siteUrl !== ''): ?>
                  <p style="margin:0 0 8px;font-size:12px;color:#777777;">
                    <a href="<?= e($siteUrl) ?>" style="color:#000000;text-decoration:underline;"><?= e($siteUrl) ?></a>
                  </p>
                <?php endif; ?>
                <p style="margin:0;font-size:11px;line-height:1.6;color:#999999;">
                  © <?= e($year) ?> <?= e($brandName) ?> · Marrakech, Morocco
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
