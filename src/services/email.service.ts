import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function enviarEmailRecuperacion(
  destino: string,
  nombre: string,
  token: string
): Promise<void> {
  const webUrl = process.env.WEB_URL || 'http://localhost:5173';
  const resetUrl = `${webUrl}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0B1120;font-family:Arial,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#111B2E;border-radius:12px;padding:40px;text-align:center;">
        <div style="font-size:32px;font-weight:bold;color:#22C55E;margin-bottom:8px;">VyletGo</div>
        <h1 style="color:#fff;font-size:22px;margin:24px 0 12px;">Recuperar contraseña</h1>
        <p style="color:#9CA3AF;font-size:15px;line-height:1.6;margin-bottom:32px;">
          Hola ${nombre}, recibiste este correo porque solicitaste restablecer tu contraseña en VyletGo.
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;background:#22C55E;color:#0B1120;font-size:16px;font-weight:bold;padding:14px 32px;border-radius:8px;text-decoration:none;">
          Cambiar contraseña
        </a>
        <p style="color:#6B7280;font-size:13px;margin-top:32px;line-height:1.5;">
          Este enlace expira en 30 minutos.<br/>
          Si no solicitaste esto, ignora este correo.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"VyletGo" <${process.env.SMTP_USER}>`,
    to: destino,
    subject: 'Restablece tu contraseña - VyletGo',
    html,
  });
}
