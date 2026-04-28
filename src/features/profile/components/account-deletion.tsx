"use client";

import {authClient} from "@/lib/auth-client";
import AuthActionButton from "@/features/auth/components/auth-action-button";

const AccountDeletion = () => {
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiated. Please check your email to confirm."
      action={() => authClient.deleteUser({callbackURL: "/"})}
    >
      Delete Account Permanently
    </AuthActionButton>
  );
};

export default AccountDeletion;
