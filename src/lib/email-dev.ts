export function logPasswordResetLink(email: string, token: string) {
  if (process.env.NODE_ENV === 'development') {
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;
    console.log('\n📧 ===== PASSWORD RESET EMAIL =====');
    console.log(`To: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('==================================\n');
  }
}