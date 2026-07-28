const welcomeEmailTemplate = (name) => {
  const safeName = name || "Student";

  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;">
          
          <div style="background:#064e3b;padding:28px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;">
              📚 LibraHub
            </h1>
            <p style="margin:8px 0 0;color:#a7f3d0;">
              Library Management System
            </p>
          </div>

          <div style="padding:32px;">
            <h2 style="margin-top:0;color:#0f172a;">
              Welcome, ${safeName}!
            </h2>

            <p style="color:#475569;line-height:1.7;">
              Your LibraHub account has been created successfully.
            </p>

            <p style="color:#475569;line-height:1.7;">
              You can now sign in, explore available books, manage your borrowed
              books, and access your student dashboard.
            </p>

            <div style="margin:26px 0;padding:18px;background:#ecfdf5;border-radius:12px;color:#065f46;">
              Happy reading and welcome to our library community!
            </div>

            <p style="margin-bottom:0;color:#64748b;">
              Regards,<br />
              <strong>LibraHub Team</strong>
            </p>
          </div>

          <div style="padding:18px;text-align:center;background:#f8fafc;color:#94a3b8;font-size:12px;">
            This is an automated welcome email from LibraHub.
          </div>
        </div>
      </body>
    </html>
  `;
};

export default welcomeEmailTemplate;