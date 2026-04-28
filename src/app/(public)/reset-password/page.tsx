import {requireUnauth} from "@/lib/auth-utils";
import ResetPasswordForm from "@/features/auth/components/reset-password-form";

export const metadata = {
  title: "Reset Password",
};

const ResetPasswordPage = async () => {
  await requireUnauth();

  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
