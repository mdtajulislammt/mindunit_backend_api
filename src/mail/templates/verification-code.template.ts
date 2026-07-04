export function verificationCodeTemplate(code: string): string {
  return `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #4f46e5; margin-bottom: 20px;">MindUnite Verification Code</h2>
    <p style="font-size: 16px; color: #333;">Hello,</p>
    <p style="font-size: 16px; color: #333;">Your verification OTP code is:</p>
    <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #4f46e5; padding: 15px 0; text-align: center; background-color: #f5f3ff; border-radius: 6px; margin: 20px 0;">
      ${code}
    </div>
    <p style="font-size: 14px; color: #666; margin-top: 20px;">This code is valid for 10 minutes. If you did not request this, you can ignore this email.</p>
    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
    <p style="font-size: 12px; color: #999; text-align: center;">MindUnite Platform &copy; 2026</p>
  </div>
  `;
}
