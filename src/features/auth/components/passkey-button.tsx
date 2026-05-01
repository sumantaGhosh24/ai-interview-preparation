"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import AuthActionButton from "./auth-action-button";

const PasskeyButton = () => {
  const router = useRouter();

  const { refetch } = authClient.useSession();

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch();
          router.push("/dashboard");
        },
      },
    );
  }, [router, refetch]);

  return (
    <AuthActionButton
      variant="outline"
      className="w-full"
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch();
            router.push("/dashboard");
          },
        })
      }
    >
      Use Passkey
    </AuthActionButton>
  );
};

export default PasskeyButton;
