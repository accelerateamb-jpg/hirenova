import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.RESEND_FROM ?? "HireNova <onboarding@resend.dev>";

export async function sendOtpEmail(email: string, otp: string, type: "candidate" | "company") {
  const subject = type === "candidate"
    ? "Your HireNova verification code"
    : "Verify your company email – HireNova";

  const label = type === "candidate" ? "candidate account" : "company account";

  const { data, error } = await resend.emails.send({
    from,
    to: email,
    subject,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f8fafc">
        <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08)">
          <div style="margin-bottom:24px">
            <span style="display:inline-flex;align-items:center;gap:8px;font-size:18px;font-weight:700;color:#1e293b">
              HireNova
            </span>
          </div>
          <h1 style="font-size:20px;font-weight:700;color:#1e293b;margin:0 0 8px">
            Verify your ${label}
          </h1>
          <p style="font-size:14px;color:#64748b;margin:0 0 24px">
            Use the code below to complete your registration. It expires in 10 minutes.
          </p>
          <div style="background:#f1f5f9;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
            <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#4f46e5">${otp}</span>
          </div>
          <p style="font-size:12px;color:#94a3b8;margin:0">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message);
  }

  return data;
}
