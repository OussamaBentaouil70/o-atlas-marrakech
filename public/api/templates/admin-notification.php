<?php
/** @var string $name */
/** @var string $firstName */
/** @var string $email */
/** @var string $phone */
/** @var string $eventType */
/** @var string $eventDate */
/** @var string $guestCount */
/** @var string $message */
/** @var string $submittedAt */
/** @var string $ipAddress */
/** @var string $siteUrl */
/** @var string $year */
/** @var string $brandName */
$replySubject = rawurlencode('Re: Your O\'Atlas Marrakech inquiry');
$replyLink = 'mailto:' . $email . '?subject=' . $replySubject;
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New event inquiry</title>
  <style>
    @media only screen and (max-width: 620px) {
      .wrapper { width: 100% !important; }
      .px { padding-left: 22px !important; padding-right: 22px !important; }
      .h1 { font-size: 24px !important; }
      .stack { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#eeeeee;font-family:Arial,Helvetica,sans-serif;color:#333333;">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:#eeeeee;font-size:1px;line-height:1px;">
    New inquiry from <?= e($name) ?> — <?= e($eventType) ?> on <?= e($eventDate) ?>.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#eeeeee;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" class="wrapper" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:6px;overflow:hidden;border:1px solid #dddddd;">

          <tr>
            <td style="background-color:#000000;padding:28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="stack" valign="middle">
                    <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.14em;color:#ffffff;text-transform:uppercase;">
                      <?= e($brandName) ?>
                    </div>
                    <div style="margin-top:6px;font-size:10px;letter-spacing:0.26em;color:#bbbbbb;text-transform:uppercase;">
                      New event inquiry
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:34px 42px 6px;">
              <h1 class="h1" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:27px;line-height:1.3;font-weight:normal;color:#292929;">
                New inquiry from <?= e($name) ?>
              </h1>
              <p style="margin:14px 0 0;font-size:14px;line-height:1.7;color:#555555;">
                A new event inquiry has been submitted through the website. Reply directly to
                this email to contact the client.
              </p>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:24px 42px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dddddd;border-radius:4px;">
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;width:34%;">Name</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($name) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Email</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;border-bottom:1px solid #eeeeee;">
                    <a href="mailto:<?= e($email) ?>" style="color:#000000;text-decoration:underline;"><?= e($email) ?></a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Phone</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($phone) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Event type</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($eventType) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Event date</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($eventDate) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Guests</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($guestCount) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;border-bottom:1px solid #eeeeee;">Submitted</td>
                  <td style="padding:11px 16px;font-size:13px;font-weight:bold;color:#333333;border-bottom:1px solid #eeeeee;"><?= e($submittedAt) ?></td>
                </tr>
                <tr>
                  <td style="padding:11px 16px;font-size:12px;color:#777777;">IP address</td>
                  <td style="padding:11px 16px;font-size:13px;color:#555555;"><?= e($ipAddress) ?></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" style="padding:20px 42px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f7f7f7;border-left:3px solid #000000;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;margin-bottom:7px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#777777;">
                      Message from the client
                    </span>
                    <span style="font-size:13px;line-height:1.7;color:#444444;"><?= nl2br(e($message)) ?></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" class="px" style="padding:28px 42px 8px;">
              <a href="<?= e($replyLink) ?>" style="display:inline-block;background-color:#000000;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:4px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">
                Reply to <?= e($firstName) ?>
              </a>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 42px 30px;">
              <div style="border-top:1px solid #dddddd;padding-top:18px;text-align:center;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#999999;">
                  Sent from the <?= e($brandName) ?> website<?php if ($siteUrl !== ''): ?> · <a href="<?= e($siteUrl) ?>" style="color:#777777;text-decoration:underline;"><?= e($siteUrl) ?></a><?php endif; ?>
                  <br />© <?= e($year) ?> <?= e($brandName) ?>
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
