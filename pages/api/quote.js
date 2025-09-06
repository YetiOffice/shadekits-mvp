import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, zip, slug, cfg } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // configure your SMTP transporter (e.g., Gmail, SendGrid)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const message = {
      from: `"ShadeKits" <${process.env.SMTP_FROM}>`,
      to: process.env.QUOTES_TO_EMAIL,
      subject: `[Quote Request] ${name}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone || "(none)"}
ZIP: ${zip || "(none)"}
Kit slug: ${slug || "(custom)"}
Config: ${JSON.stringify(cfg, null, 2)}
`,
    };

    await transporter.sendMail(message);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("quote error", err);
    return res.status(500).json({ error: "Failed to send quote" });
  }
}
