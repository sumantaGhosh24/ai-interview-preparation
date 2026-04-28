import {requireUnauth} from "@/lib/auth-utils";
import LoginForm from "@/features/auth/components/login-form";

export const metadata = {
  title: "Login",
};

const LoginPage = async () => {
  await requireUnauth();

  return <LoginForm />;
};

export default LoginPage;
